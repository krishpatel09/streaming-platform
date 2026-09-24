import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogService } from './audit-log.service';
import { AUDIT_ACTION_KEY } from './decorators/audit-action.decorator';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const action = this.reflector.get<string>(AUDIT_ACTION_KEY, context.getHandler());

    if (!action) {
      return next.handle();
    }

    const ipAddress = request.ip || request.connection?.remoteAddress || null;
    const userAgent = request.headers['user-agent'] || null;

    return next.handle().pipe(
      tap({
        next: async (data) => {
          // Success Path: Determine userId from either token context or returned response payload
          const userId = request.user?.id || data?.user?.id || data?.id || null;
          const sanitizedPayload = this.sanitizePayload(request.body);

          // Fire-and-forget logging asynchronously with safety catch
          this.auditLogService.log({
            userId,
            action,
            ipAddress,
            userAgent,
            details: {
              status: 'SUCCESS',
              payload: sanitizedPayload,
            },
          }).catch(err => {
            // Safety logging to console if the internal log method fails
            console.error(`[AuditLog] Background success log creation failed for action ${action}:`, err);
          });
        },
        error: async (error) => {
          // Failure Path: Capture errors thrown by controllers
          const userId = request.user?.id || null;
          const sanitizedPayload = this.sanitizePayload(request.body);
          const errorMessage = error instanceof Error ? error.message : String(error);

          this.auditLogService.log({
            userId,
            action,
            ipAddress,
            userAgent,
            details: {
              status: 'FAILURE',
              error: errorMessage,
              payload: sanitizedPayload,
            },
          }).catch(err => {
            // Safety logging to console if the internal log method fails
            console.error(`[AuditLog] Background failure log creation failed for action ${action}:`, err);
          });
        },
      }),
    );
  }

  private sanitizePayload(body: any): any {
    if (!body) return undefined;
    if (typeof body !== 'object') return body;

    const sanitized = { ...body };
    const sensitiveKeys = ['password', 'token', 'refreshToken', 'code', 'otp'];

    for (const key of sensitiveKeys) {
      if (key in sanitized) {
        sanitized[key] = '********';
      }
    }

    return sanitized;
  }
}

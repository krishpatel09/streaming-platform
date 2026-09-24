# Project Customizations and Rules

## Asynchronous Background Strategies
- **Safe Fire-and-Forget**: When implementing features that run asynchronously in the background (such as Audit Logs, notifications, or mailers), always handle the returned promise's lifecycle explicitly.
- **Always Catch Background Exceptions**: Never leave background promises unhandled (floating promises). Append a `.catch()` block to log background database or third-party write failures to the console/logger, ensuring that background failures do not cause unhandled promise rejections or crash the application thread.
- **Non-blocking Execution**: Ensure that background tasks (like audit logs) do not block the critical path of the HTTP request-response cycle, maintaining fast API responses.

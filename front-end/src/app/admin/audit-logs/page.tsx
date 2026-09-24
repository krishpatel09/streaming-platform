'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { auditLogService, AuditLogEntry, PaginatedAuditLogs } from '../../../services/audit-log.service';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [meta, setMeta] = useState<PaginatedAuditLogs['meta']>({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [page, setPage] = useState(1);
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchUserId, setSearchUserId] = useState('');

  // Modal states for log details
  const [activeLog, setActiveLog] = useState<AuditLogEntry | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await auditLogService.getAuditLogs({
        page,
        limit: 15,
        action: selectedAction || undefined,
        status: selectedStatus || undefined,
        userId: searchUserId.trim() || undefined,
      });
      setLogs(data.data);
      setMeta(data.meta);
    } catch (err: any) {
      setError(err.message || 'Failed to load audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, selectedAction, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const clearFilters = () => {
    setSelectedAction('');
    setSelectedStatus('');
    setSearchUserId('');
    setPage(1);
  };

  // Helper to parse simple user-agent string for readable device/OS
  const formatUserAgent = (ua: string | null) => {
    if (!ua) return 'Unknown';
    if (ua.includes('Windows')) return 'Windows PC';
    if (ua.includes('Macintosh')) return 'macOS device';
    if (ua.includes('iPhone')) return 'iPhone';
    if (ua.includes('iPad')) return 'iPad';
    if (ua.includes('Android')) return 'Android device';
    if (ua.includes('Linux')) return 'Linux desktop';
    return 'Web Browser';
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString();
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-rose-600 selection:text-white">
      {/* Top Navigation / Dashboard Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/40 backdrop-blur-xl sticky top-0 z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <span className="text-xl font-black tracking-tighter text-rose-600">STREAMING</span>
            </Link>
            <span className="text-zinc-600 font-medium">/</span>
            <span className="text-sm font-semibold tracking-wider uppercase text-zinc-400">Admin Portal</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-zinc-400">
              Logged in as <span className="text-white font-bold">Admin</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Track user behavior, security status, and system operations in real-time.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 backdrop-blur-md">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Search User ID
              </label>
              <input
                type="text"
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
                placeholder="UUID format..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-700 outline-none focus:border-rose-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Action Type
              </label>
              <select
                value={selectedAction}
                onChange={(e) => {
                  setSelectedAction(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white outline-none focus:border-rose-600 appearance-none"
              >
                <option value="">All Actions</option>
                <option value="USER_SIGNUP">USER_SIGNUP</option>
                <option value="USER_LOGIN">USER_LOGIN</option>
                <option value="OTP_VERIFY">OTP_VERIFY</option>
                <option value="OTP_RESEND">OTP_RESEND</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white outline-none focus:border-rose-600"
              >
                <option value="">All Statuses</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="FAILURE">FAILURE</option>
              </select>
            </div>

            <div className="flex gap-2.5">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-500 active:scale-[0.98]"
              >
                Search
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-400">
            {error}
          </div>
        )}

        {/* Logs Table */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 overflow-hidden shadow-xl backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-900/50 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">IP Address</th>
                  <th className="px-6 py-4">Device</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4 text-right">Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-28" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-36" /></td>
                      <td className="px-6 py-4"><div className="h-5 bg-zinc-800 rounded-full w-16" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-24" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-20" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-32" /></td>
                      <td className="px-6 py-4 text-right"><div className="h-4 bg-zinc-800 rounded w-12 ml-auto" /></td>
                    </tr>
                  ))
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 font-medium">
                      No audit log entries matching your criteria were found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const isSuccess = log.details?.status === 'SUCCESS';
                    return (
                      <tr key={log.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="px-6 py-4 font-mono font-semibold text-rose-500">
                          {log.action}
                        </td>
                        <td className="px-6 py-4">
                          {log.user ? (
                            <div className="flex flex-col">
                              <span className="font-semibold text-zinc-200">{log.user.username}</span>
                              <span className="text-xs text-zinc-500">{log.user.email}</span>
                            </div>
                          ) : log.userId ? (
                            <span className="font-mono text-xs text-zinc-400">{log.userId}</span>
                          ) : (
                            <span className="text-zinc-500 italic">Unauthenticated</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wider ${
                            isSuccess
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {log.details?.status || 'UNKNOWN'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-zinc-300">
                          {log.ipAddress || '—'}
                        </td>
                        <td className="px-6 py-4 text-zinc-300">
                          {formatUserAgent(log.userAgent)}
                        </td>
                        <td className="px-6 py-4 text-zinc-400">
                          {formatTime(log.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setActiveLog(log)}
                            className="font-medium text-rose-500 hover:text-rose-400 transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Panel */}
        {!loading && meta.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-zinc-400">
              Showing page <span className="font-semibold text-white">{meta.page}</span> of{' '}
              <span className="font-semibold text-white">{meta.totalPages}</span> ({meta.total} total logs)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-30"
              >
                Previous
              </button>
              <button
                disabled={page >= meta.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {/* JSON Viewer Detail Modal */}
      {activeLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-sm transition-all duration-300">
          <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-rose-500 font-mono">{activeLog.action}</span> Details
                </h3>
                <span className="text-xs text-zinc-500 font-mono mt-1 block">ID: {activeLog.id}</span>
              </div>
              <button
                onClick={() => setActiveLog(null)}
                className="rounded-lg p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4 border border-zinc-800 rounded-xl bg-zinc-950/60 p-4 text-xs font-mono text-zinc-400">
                <div>
                  <span className="text-zinc-500 block uppercase font-bold text-[10px] tracking-wide">Client IP:</span>
                  <span className="text-zinc-200">{activeLog.ipAddress || '—'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase font-bold text-[10px] tracking-wide">Timestamp:</span>
                  <span className="text-zinc-200">{formatTime(activeLog.createdAt)}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-zinc-500 block uppercase font-bold text-[10px] tracking-wide">User Agent:</span>
                  <span className="text-zinc-200 text-[11px] whitespace-normal break-all leading-relaxed">
                    {activeLog.userAgent || '—'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Audit Log Data JSON:
                </h4>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 overflow-x-auto">
                  <pre className="text-xs text-rose-400/90 font-mono leading-relaxed whitespace-pre-wrap">
                    {JSON.stringify(activeLog.details, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveLog(null)}
                className="rounded-xl bg-rose-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

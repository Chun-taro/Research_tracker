import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import {
    LifeBuoy, Zap, Clock, ShieldCheck, Mail, MessageSquare,
    BookOpen, ExternalLink, CheckCircle, AlertTriangle, GitCommit, Tag
} from 'lucide-react';

const TYPE_CONFIG = {
    Feature:     { color: 'bg-blue-500',    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    Fix:         { color: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
    Security:    { color: 'bg-red-500',     badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
    Docs:        { color: 'bg-purple-500',  badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
    Maintenance: { color: 'bg-gray-400',    badge: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
    Update:      { color: 'bg-amber-500',   badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
};

export default function Updates({ system_version, update_status = {}, changelog = [] }) {
    // Pull the global system_version from Inertia props as well (whichever is more accurate)
    const { system_version: globalVersion } = usePage().props;
    const version = system_version || globalVersion || 'v1.0.0';

    const updateAvailable = update_status?.update_available ?? false;

    return (
        <AuthenticatedLayout>
            <Head title="System Updates" />

            <PageHeader
                title="System Updates"
                subtitle={
                    <span className="flex items-center gap-2 text-sm text-gray-500">
                        <Tag size={14} />
                        Current Version: <span className="font-bold text-gray-800 dark:text-white">{version}</span>
                        {updateAvailable ? (
                            <span className="flex items-center gap-1 text-amber-600 font-semibold ml-2">
                                <AlertTriangle size={14} className="animate-pulse" />
                                Update available
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-emerald-600 font-semibold ml-2">
                                <CheckCircle size={14} />
                                Up to date
                            </span>
                        )}
                    </span>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Support + System Health */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Version card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center gap-2 text-indigo-200 mb-4">
                            <Tag size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">Installed Version</span>
                        </div>
                        <h4 className="text-3xl font-extrabold tracking-tight mb-1">{version}</h4>
                        <p className="text-sm text-indigo-200">
                            {updateAvailable
                                ? `A newer version is available on GitHub.`
                                : `You are running the latest version.`}
                        </p>
                        {updateAvailable && (
                            <div className="mt-4 p-3 rounded-xl bg-white/10 border border-white/20 text-xs text-indigo-100">
                                <span className="font-semibold">Latest commit: </span>
                                <code className="font-mono">{update_status?.latest_hash}</code>
                            </div>
                        )}
                    </div>

                    {/* Support Channels */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <LifeBuoy className="text-blue-500" size={20} /> Help & Support
                        </h3>

                        <div className="space-y-3">
                            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                        <Mail size={16} />
                                    </div>
                                    <span className="font-semibold text-blue-900 dark:text-blue-300">Technical Support</span>
                                </div>
                                <p className="text-xs text-blue-700 dark:text-blue-400 mb-2">Response time: &lt; 24 hours</p>
                                <a href="mailto:support@researchtracker.edu" className="text-sm font-bold text-blue-600 hover:underline">
                                    support@researchtracker.edu
                                </a>
                            </div>

                            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                                        <MessageSquare size={16} />
                                    </div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Live Chat</span>
                                </div>
                                <ExternalLink size={14} className="text-gray-400 group-hover:text-gray-600" />
                            </button>

                            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                                        <BookOpen size={16} />
                                    </div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Documentation</span>
                                </div>
                                <ExternalLink size={14} className="text-gray-400 group-hover:text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* System Health */}
                    <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center gap-2 text-blue-400 mb-4">
                            <ShieldCheck size={20} />
                            <span className="text-xs font-bold uppercase tracking-widest">System Health</span>
                        </div>
                        <h4 className="text-xl font-bold mb-1">All Systems Operational</h4>
                        <p className="text-sm text-gray-400 mb-6">Last checked: Just now</p>
                        <div className="space-y-2">
                            {['API Gateway', 'Database Hub', 'Email Service', 'File Storage'].map(s => (
                                <div key={s} className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                                    <span className="text-gray-300">{s}</span>
                                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span> ONLINE
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Changelog Timeline */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Zap className="text-amber-500" size={20} /> Commit History & Changelog
                            </h3>
                            <a
                                href="https://github.com/Chun-taro/Research_tracker/commits/main"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors"
                            >
                                View on GitHub <ExternalLink size={12} />
                            </a>
                        </div>

                        <div className="p-6">
                            {changelog.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <GitCommit size={40} className="mx-auto mb-3 opacity-30" />
                                    <p className="text-sm">No changelog data available.</p>
                                </div>
                            ) : (
                                <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                                    {changelog.map((item, i) => {
                                        const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.Update;
                                        return (
                                            <div key={i} className="relative flex items-start gap-5 group">
                                                <div className={`mt-0.5 flex-shrink-0 h-10 w-10 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center text-white z-10 shadow-sm transition-transform group-hover:scale-110 ${cfg.color}`}>
                                                    <GitCommit size={16} />
                                                </div>
                                                <div className="flex-1 min-w-0 pt-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${cfg.badge}`}>{item.type}</span>
                                                        <a
                                                            href={item.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-mono text-xs text-gray-400 hover:text-blue-500 transition-colors"
                                                        >
                                                            {item.sha}
                                                        </a>
                                                        {item.is_current && (
                                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
                                                                ✓ Current
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-gray-400 ml-auto">{item.date}</span>
                                                    </div>
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug truncate">
                                                        {item.title}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

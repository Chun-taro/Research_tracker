import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { LifeBuoy, Zap, Clock, ShieldCheck, Mail, MessageSquare, BookOpen, ExternalLink } from 'lucide-react';

export default function Updates({ system_version = 'v1.4.2', changelog = [] }) {
    // Mock changelog if empty
    const displayChangelog = changelog.length > 0 ? changelog : [
        { version: 'v1.4.2', date: '2026-04-06', type: 'Security', title: 'SSO Identity Hub Expansion', description: 'Implemented SHA-256 anonymization for tenant-level user profiles.' },
        { version: 'v1.4.1', date: '2026-04-01', type: 'Feature', title: 'Multi-Tenant Billing Core', description: 'Launched the central subscription management system for department onboarding.' },
        { version: 'v1.4.0', date: '2026-03-25', type: 'Fix', title: 'Research Cycle Deadlines', description: 'Resolved timezone discrepancies in automated submission locking.' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Support & System Updates" />
            
            <PageHeader 
                title="Support & System Updates" 
                subtitle={`Current System Version: ${system_version}`}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Support Channels */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <LifeBuoy className="text-blue-500" size={20} /> Help & Support
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                        <Mail size={16} />
                                    </div>
                                    <span className="font-semibold text-blue-900 dark:text-blue-300">Technical Support</span>
                                </div>
                                <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">Response time: &lt; 24 hours</p>
                                <a href="mailto:support@researchtracker.edu" className="text-sm font-bold text-blue-600 hover:underline">support@researchtracker.edu</a>
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

                    <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center gap-2 text-blue-400 mb-4">
                            <ShieldCheck size={20} />
                            <span className="text-xs font-bold uppercase tracking-widest">System Health</span>
                        </div>
                        <h4 className="text-xl font-bold mb-2">All Systems Operational</h4>
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

                {/* Right Column: Changelog / Updates */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Zap className="text-amber-500" size={20} /> Release Notes & Changelog
                            </h3>
                            <span className="text-xs font-medium text-gray-400 italic">Latest: April 2026</span>
                        </div>
                        
                        <div className="p-6">
                            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                                {displayChangelog.map((item, i) => (
                                    <div key={i} className="relative flex items-start gap-6 group">
                                        <div className={`mt-1 flex-shrink-0 h-10 w-10 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center text-white z-10 shadow-sm transition-transform group-hover:scale-110 ${
                                            item.type === 'Security' ? 'bg-red-500' : 
                                            item.type === 'Feature' ? 'bg-blue-500' : 'bg-gray-500'
                                        }`}>
                                            <Clock size={16} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{item.version}</span>
                                                <span className="text-xs text-gray-400">{item.date}</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                    item.type === 'Security' ? 'bg-red-100 text-red-700' : 
                                                    item.type === 'Feature' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {item.type}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">{item.title}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-10 p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-2xl flex gap-4">
                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center animate-bounce">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <h5 className="font-bold text-amber-900 dark:text-amber-400 mb-1">Upcoming Feature: Real-time Peer Review</h5>
                                    <p className="text-xs text-amber-800/80 dark:text-amber-400/80 leading-relaxed">
                                        We are currently testing a new module that allows research groups to invite external reviewers for blind peer review processes. Stay tuned for v1.5.0!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

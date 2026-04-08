import LandlordLayout from '@/Layouts/LandlordLayout';
import { Head } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { GitBranch, Calendar, User, ExternalLink, ShieldCheck, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SystemHistory({ updateStatus, fullHistory }) {
    // Group history by date (YYYY-MM-DD)
    const groupedHistory = (fullHistory || []).reduce((groups, commit) => {
        const date = new Date(commit.date).toLocaleDateString(undefined, { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });
        if (!groups[date]) groups[date] = [];
        groups[date].push(commit);
        return groups;
    }, {});

    return (
        <LandlordLayout>
            <Head title="System History" />
            
            <div className="max-w-5xl mx-auto">
                <PageHeader 
                    title="System Update Logs" 
                    subtitle="Complete audit trail of code changes and performance updates" 
                />

                {/* Top Banner: Current Version Info */}
                <div className="bg-slate-900 rounded-2xl p-6 mb-8 text-white border border-white/5 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <GitBranch size={120} />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold tracking-tight">Active System Core</h3>
                                <p className="text-slate-400 text-sm font-medium">Currently deployed environment</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center">
                                <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-0.5">Build ID</p>
                                <p className="font-mono text-sm text-indigo-400 font-bold">{updateStatus?.current_hash}</p>
                            </div>
                            <a 
                                href={updateStatus?.repo_url} 
                                target="_blank"
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                            >
                                <ExternalLink size={16} /> Repository
                            </a>
                        </div>
                    </div>
                </div>

                {/* Timeline History */}
                <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                    {Object.entries(groupedHistory).map(([date, commits], groupIndex) => (
                        <div key={date} className="relative flex items-center justify-between md:justify-normal">
                            {/* Date Marker */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 bg-white shadow-sm z-10 md:order-1 md:left-0">
                                <Calendar size={18} className="text-slate-500" />
                            </div>

                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-slate-50 border border-slate-200 ml-4 md:ml-0 md:order-2">
                                <div className="p-1 px-3 bg-white border border-slate-200 rounded-full w-fit mb-6">
                                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest line-none">{date}</span>
                                </div>

                                <div className="space-y-6">
                                    {commits.map((commit) => (
                                        <div key={commit.sha} className={cn(
                                            "relative group p-4 rounded-xl border transition-all",
                                            commit.is_current 
                                                ? "bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500/10" 
                                                : "bg-white border-white hover:border-slate-300 hover:shadow-md"
                                        )}>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs text-indigo-600 font-bold bg-indigo-100/50 px-2 py-0.5 rounded border border-indigo-200">
                                                        {commit.sha}
                                                    </span>
                                                    {commit.is_current && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-600 text-[10px] font-black text-white rounded-full uppercase tracking-tighter">
                                                            <Tag size={10} /> Active Build
                                                        </span>
                                                    )}
                                                </div>
                                                <a 
                                                    href={commit.url} 
                                                    target="_blank" 
                                                    className="text-slate-400 hover:text-indigo-600 transition-colors"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>

                                            <h4 className="text-sm font-bold text-slate-900 leading-snug mb-3">
                                                {commit.message}
                                            </h4>

                                            <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                                <div className="flex items-center gap-1.5">
                                                    <User size={12} className="text-slate-400" />
                                                    {commit.author}
                                                </div>
                                                <div className="flex items-center gap-1.5 ml-auto">
                                                    {new Date(commit.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* End of History Label */}
                <div className="mt-16 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.4em]">End of Log</p>
                </div>
            </div>
        </LandlordLayout>
    );
}

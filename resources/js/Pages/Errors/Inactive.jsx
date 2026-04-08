import { Head, Link } from '@inertiajs/react';
import { ShieldAlert, Mail, ArrowLeft, Lock, CalendarClock, Globe } from 'lucide-react';

export default function Inactive({ message, type = 'tenant' }) {
    // Determine icon and color based on type
    const isTenant = type === 'tenant';
    
    return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
            <Head title="Access Restricted" />
            
            {/* Animated background blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

            <div className="w-full max-w-xl relative">
                {/* Main Card */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="p-8 md:p-12 text-center">
                        {/* Status Icon with Ring */}
                        <div className="relative mx-auto w-24 h-24 mb-8">
                            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping opacity-25"></div>
                            <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-full text-red-500">
                                {isTenant ? <Lock size={44} /> : <ShieldAlert size={44} />}
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                            {isTenant ? 'Portal Suspended' : 'Access Revoked'}
                        </h1>

                        {/* Description */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">
                            <p className="text-slate-300 text-lg leading-relaxed">
                                {message || "This research portal is currently offline. This typically occurs when a subscription plan expires or institutional access has been proactively restricted by the system administrator."}
                            </p>
                        </div>

                        {/* Quick Stats/Context Icons */}
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="flex flex-col items-center p-4 rounded-xl bg-slate-800/40 border border-white/5">
                                <CalendarClock className="text-indigo-400 mb-2" size={20} />
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Status</span>
                                <span className="text-sm font-semibold text-white mt-1">Inactive</span>
                            </div>
                            <div className="flex flex-col items-center p-4 rounded-xl bg-slate-800/40 border border-white/5">
                                <Globe className="text-blue-400 mb-2" size={20} />
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Security</span>
                                <span className="text-sm font-semibold text-white mt-1">Locked</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a 
                                href="mailto:support@researchtracker.saas" 
                                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 group"
                            >
                                <Mail size={20} /> Contact Institution
                            </a>
                            
                            <Link 
                                href="/" 
                                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-2xl font-bold transition-all"
                            >
                                <ArrowLeft size={20} /> Return Home
                            </Link>
                        </div>
                    </div>

                    {/* Footer / Branding */}
                    <div className="px-8 py-6 bg-slate-950/50 border-t border-white/5 flex flex-col items-center">
                        <span className="text-[10px] font-black tracking-[0.3em] text-slate-600 uppercase mb-2">Authenticated By</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-xl font-black text-white tracking-tighter">
                                Research<span className="text-indigo-500">Tracker</span>.
                            </span>
                        </div>
                    </div>
                </div>

                {/* Decorative Bottom Text */}
                <div className="mt-8 flex flex-col items-center gap-2 opacity-50">
                    <p className="text-slate-500 text-sm font-medium">
                        &copy; 2026 Reserch Management Systems &middot; Enterprise Grade Security
                    </p>
                    <div className="flex gap-4">
                        <span className="h-1 w-8 bg-slate-800 rounded-full"></span>
                        <span className="h-1 w-8 bg-slate-800 rounded-full"></span>
                        <span className="h-1 w-8 bg-slate-800 rounded-full"></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

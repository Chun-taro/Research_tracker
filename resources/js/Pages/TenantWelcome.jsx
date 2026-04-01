import { Head, Link } from '@inertiajs/react';
import { BookOpen, GraduationCap, Calendar, FileText, ArrowRight, Layers, Users } from 'lucide-react';

export default function TenantWelcome({ auth, tenant }) {
    const themeColor = tenant?.theme_color ?? '#3B82F6';

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900 font-sans">
            <Head title={`Welcome | ${tenant?.name}`} />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center gap-3">
                            {tenant?.logo_path ? (
                                <img src={`/storage/${tenant.logo_path}`} alt={tenant.name} className="h-10 w-10 rounded-xl object-cover shadow-sm" />
                            ) : (
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: themeColor }}>
                                    <GraduationCap size={22} />
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">{tenant?.name}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Research Management Portal</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-xl hover:translate-y-[-1px] transition-all"
                                    style={{ backgroundColor: themeColor, boxShadow: `0 10px 15px -3px ${themeColor}33` }}
                                >
                                    My Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors px-4">
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-xl hover:translate-y-[-1px] transition-all"
                                        style={{ backgroundColor: themeColor, boxShadow: `0 10px 15px -3px ${themeColor}33` }}
                                    >
                                        Student Signup
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-24 lg:pt-56 lg:pb-40 relative">
                 <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6" style={{ backgroundColor: `${themeColor}15`, color: themeColor }}>
                                <Layers size={14} /> Department Core
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]">
                                Accelerate Your <br/>
                                <span style={{ color: themeColor }}>Departmental</span> Research.
                            </h1>
                            <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium max-w-xl">
                                Welcome to the official research management platform for the <strong>{tenant?.name}</strong>. Submit proposals, track cycles, and coordinate with advisers in one unified space.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Link
                                    href={route('login')}
                                    className="w-full sm:w-auto px-8 py-4 rounded-2xl text-lg font-bold text-white shadow-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
                                    style={{ backgroundColor: themeColor, boxShadow: `0 20px 25px -5px ${themeColor}44` }}
                                >
                                    Get Started <ArrowRight size={20} />
                                </Link>
                                <button className="w-full sm:w-auto px-8 py-4 rounded-2xl text-lg font-bold text-slate-600 border border-slate-200 hover:bg-white transition-all">
                                    View Repository
                                </button>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-0 rounded-[2rem] blur-3xl opacity-10 transition-opacity group-hover:opacity-20" style={{ backgroundColor: themeColor }}></div>
                            <div className="relative bg-white p-8 rounded-[2rem] border border-slate-200 shadow-2xl space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-lg text-slate-900">Academic Overview</h3>
                                        <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Active System</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                                                <Users size={20} />
                                            </div>
                                            <span className="block text-2xl font-black text-slate-900 leading-none">24+</span>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase mt-2 block tracking-widest">Research Groups</span>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                            <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                                                <Calendar size={20} />
                                            </div>
                                            <span className="block text-2xl font-black text-slate-900 leading-none">3</span>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase mt-2 block tracking-widest">Active Cycles</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                            <FileText size={24} className="text-indigo-300" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm leading-none">New Submission</p>
                                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Open for Capstone 1</p>
                                        </div>
                                    </div>
                                    <Link href={route('login')} className="h-10 w-10 rounded-full bg-indigo-500 text-white flex items-center justify-center hover:scale-110 transition-transform">
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
            </section>

            {/* Steps Section */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
                    <h2 className="text-3xl font-black text-slate-900 mb-16">The Research Journey Starts Here</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Account Creation', icon: Users, desc: 'Register as a student group or join an existing one.' },
                            { step: '02', title: 'Proposal Phase', icon: FileText, desc: 'Submit your initial research intent for adviser review.' },
                            { step: '03', title: 'Active Cycle', icon: Calendar, desc: 'Complete milestones and submit through research cycles.' },
                            { step: '04', title: 'Final Defense', icon: GraduationCap, desc: 'Coordinate with panelists for your final evaluation.' },
                        ].map((item, i) => (
                            <div key={i} className="text-left relative group">
                                <div className="text-4xl font-black mb-6 opacity-10 group-hover:opacity-20 transition-opacity" style={{ color: themeColor }}>{item.step}</div>
                                <h4 className="font-bold text-slate-900 mb-3">{item.title}</h4>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: themeColor }}>
                            <GraduationCap size={18} />
                        </div>
                        <span className="font-bold text-slate-900 tracking-tight">{tenant?.name}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© {new Date().getFullYear()} Global Research Tracker Network</p>
                </div>
            </footer>
        </div>
    );
}

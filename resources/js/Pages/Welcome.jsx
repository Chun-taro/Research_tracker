import { Head, Link } from '@inertiajs/react';
import { BookOpen, Shield, BarChart2, Users, FileText, CheckCircle, ArrowRight, Building2, Globe, Database } from 'lucide-react';

export default function Welcome({ auth }) {
    const themeColor = '#4F46E5'; // Indigo-600 for corporate feel

    return (
        <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900 font-sans">
            <Head title="System Central" />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded shadow-indigo-100 shadow-lg flex items-center justify-center text-white" style={{ backgroundColor: themeColor }}>
                                <Shield size={24} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-xl tracking-tighter text-gray-900 leading-none">RESEARCH TRACKER</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Institutional Console</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link href="#solutions" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">Solutions</Link>
                            <Link href="#features" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">Platform</Link>
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-5 py-2.5 rounded text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-500/20 hover:translate-y-[-1px] transition-all"
                                    style={{ backgroundColor: themeColor }}
                                >
                                    Access Console
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="px-5 py-2.5 rounded text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-500/20 hover:translate-y-[-1px] transition-all"
                                    style={{ backgroundColor: themeColor }}
                                >
                                    Admin Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 lg:pt-56 lg:pb-32 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-bold uppercase tracking-widest mb-8">
                            <Globe size={14} /> The Multi-Tenant Standard for Higher Ed
                        </div>
                        <h1 className="text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-[0.95]">
                            Manage Research Across Your <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-slate-900">Entire Institution.</span>
                        </h1>
                        <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                            A centralized command center for universities and colleges to provision department portals, track institutional KPIs, and automate research governance.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href={route('login')}
                                className="w-full sm:w-auto px-10 py-5 rounded text-lg font-black uppercase tracking-widest text-white shadow-2xl shadow-indigo-500/30 bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group"
                            >
                                Launch Platform <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                            <button className="w-full sm:w-auto px-10 py-5 rounded text-lg font-bold text-slate-600 border border-slate-200 hover:bg-white transition-all text-center">
                                Request Demo
                            </button>
                        </div>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            </section>

            {/* Solutions Section */}
            <section id="solutions" className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                        <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">Built for Institutional <br/>Scale & Security</h2>
                        <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium">
                            Empower individual departments with isolated databases and custom branding while maintaining global oversight and standards from a central dashboard.
                        </p>
                        <ul className="space-y-6">
                            {[
                                { title: 'Isolated Multi-Tenancy', icon: Database, desc: 'Every department gets its own secure database instance.' },
                                { title: 'Global Reporting', icon: BarChart2, desc: 'Aggregated analytics across all departmental research activities.' },
                                { title: 'Centralized Billing', icon: Building2, desc: 'Manage subscriptions and quotas for your entire campus.' },
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4">
                                    <div className="h-12 w-12 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg leading-none mb-2">{item.title}</h4>
                                        <p className="text-slate-500 text-sm">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center border border-slate-200">
                                <Building2 size={120} className="text-indigo-200" />
                            </div>
                            <div className="absolute -bottom-10 -right-10 bg-indigo-600 p-8 rounded-2xl shadow-2xl text-white max-w-[240px]">
                                <span className="block text-4xl font-black mb-2">99.9%</span>
                                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Institutional uptime ensured by global architecture.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 py-20 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex items-center gap-3 opacity-50">
                            <Shield size={32} />
                            <span className="font-black text-2xl tracking-tighter uppercase">Research Tracker</span>
                        </div>
                        <div className="text-center md:text-right text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">
                            © {new Date().getFullYear()} Central Institutional Management Platform. <br/>All Rights Reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

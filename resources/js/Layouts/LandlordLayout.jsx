import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Globe, CreditCard, Settings, Bell, 
    ChevronLeft, ChevronRight, LogOut, Shield, Menu, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandlordLayout({ children }) {
    const { auth, context } = usePage().props;
    const user = auth?.user;
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        { label: 'Central Dashboard', href: '/landlord/dashboard', icon: LayoutDashboard },
        { label: 'Departments', href: '/landlord/tenants', icon: Globe },
        { label: 'Subscriptions', href: '/landlord/subscriptions', icon: CreditCard },
    ];

    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <div className={cn("min-h-screen bg-slate-50 flex transition-colors duration-500 font-sans", context === 'landlord' && 'theme-landlord')}>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={cn(
                'fixed inset-y-0 left-0 z-40 flex flex-col bg-slate-950 text-slate-400 border-r border-slate-800 transition-all duration-300 shadow-2xl',
                collapsed ? 'w-16' : 'w-64',
                mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            )}>
                <div className="flex h-16 items-center px-4 border-b border-slate-800 gap-3 bg-slate-900/50">
                    <div className="h-9 w-9 rounded flex items-center justify-center bg-indigo-600 text-white shadow-[0_0_15px_-3px_rgba(79,70,229,0.4)] flex-shrink-0">
                        <Shield size={20} />
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="font-bold text-white tracking-tighter text-lg leading-none">SYSTEM</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none mt-1">Central Console</span>
                        </div>
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = currentUrl.startsWith(item.href);
                        return (
                            <Link key={item.href} href={item.href} className={cn(
                                'flex items-center gap-3 rounded px-3 py-2.5 text-sm font-semibold transition-all duration-200 border-l-2',
                                active 
                                    ? 'bg-slate-900 text-white border-indigo-500 shadow-sm' 
                                    : 'border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                            )}>
                                <Icon size={18} className={cn(active ? "text-indigo-400" : "text-slate-500")} />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-slate-800 p-2">
                    <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex w-full items-center justify-center rounded-lg p-2 hover:bg-slate-800 transition-colors">
                        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className={cn('flex-1 flex flex-col min-w-0 transition-all duration-300', collapsed ? 'lg:ml-16' : 'lg:ml-64')}>
                <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shadow-sm">
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-md hover:bg-slate-100 text-slate-500">
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-950 text-white rounded text-[10px] font-black tracking-widest ring-1 ring-white/10 uppercase">
                            <Shield size={10} className="text-indigo-400" />
                            Superadmin Access
                        </div>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900 leading-none">{user?.name}</p>
                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter mt-1">Global Management</p>
                            </div>
                            <Link href={route('logout')} method="post" as="button" className="p-2.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
                                <LogOut size={18} />
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

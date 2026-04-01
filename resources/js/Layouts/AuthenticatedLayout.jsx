import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Users, BookOpen, FileText, Upload, Archive,
    Calendar, BarChart2, Settings, Bell, ChevronLeft, ChevronRight,
    LogOut, User, Menu, X, GraduationCap, FileCheck, Database, CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const roleNavItems = {
    admin: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Users', href: '/admin/users', icon: Users },
        { label: 'Research Cycles', href: '/admin/cycles', icon: BookOpen },
        { label: 'Research Groups', href: '/admin/groups', icon: GraduationCap },
        { label: 'Submissions', href: '/admin/submissions', icon: FileText },
        { label: 'Templates', href: '/admin/templates', icon: Upload },
        { label: 'Schedules', href: '/admin/schedules', icon: Calendar },
        { label: 'Repository', href: '/admin/repository', icon: Database },
        { label: 'Reports', href: '/admin/reports', icon: BarChart2 },
        { label: 'Settings', href: '/admin/settings', icon: Settings },
        { label: 'Billing & Plan', href: '/admin/billing', icon: CreditCard },
    ],
    adviser: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'My Groups', href: '/adviser/groups', icon: GraduationCap },
        { label: 'Submissions', href: '/adviser/submissions', icon: FileCheck },
        { label: 'Schedules', href: '/adviser/schedules', icon: Calendar },
        { label: 'Templates', href: '/adviser/templates', icon: Upload },
        { label: 'Repository', href: '/adviser/repository', icon: Database },
    ],
    panelist: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Assignments', href: '/panelist/assignments', icon: GraduationCap },
        { label: 'Schedules', href: '/panelist/schedules', icon: Calendar },
    ],
    student: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'My Group', href: '/student/group', icon: GraduationCap },
        { label: 'Submissions', href: '/student/submissions', icon: FileText },
        { label: 'Templates', href: '/student/templates', icon: Upload },
        { label: 'Repository', href: '/student/repository', icon: Database },
        { label: 'Schedules', href: '/student/schedules', icon: Calendar },
    ],
};

export default function AuthenticatedLayout({ children }) {
    const { auth, tenant, context } = usePage().props;
    const user = auth?.user;
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navItems = roleNavItems[user?.role] ?? roleNavItems.student;
    const themeColor = tenant?.theme_color ?? '#3B82F6';

    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-500", context === 'department' && 'theme-department')}>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 transition-all duration-500 ease-in-out shadow-xl shadow-gray-200/20',
                    collapsed ? 'w-20' : 'w-72',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                {/* Logo area */}
                <div className="flex h-16 items-center px-6 border-b border-gray-200/50 dark:border-gray-800/50 gap-3 bg-white/50 dark:bg-gray-900/50">
                    {tenant?.logo_path ? (
                        <img src={`/storage/${tenant.logo_path}`} alt={tenant.name} className="h-9 w-9 rounded-xl object-cover flex-shrink-0 shadow-sm" />
                    ) : (
                        <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg" style={{ backgroundColor: themeColor }}>
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                    )}
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate tracking-tight">{tenant?.name ?? 'Research Tracker'}</p>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{user?.role}</p>
                        </div>
                    )}
                </div>

                {/* Nav items */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = currentUrl.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300',
                                    active
                                        ? 'text-white shadow-lg shadow-gray-200/50 dark:shadow-none'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                                )}
                                style={active ? { 
                                    background: `linear-gradient(135deg, ${themeColor}, ${themeColor}CC)`,
                                    boxShadow: `0 10px 15px -3px ${themeColor}33`
                                } : {}}
                            >
                                <Icon className={cn("h-5 w-5 flex-shrink-0 transition-transform duration-300", active && "scale-110")} size={20} />
                                {!collapsed && <span className="truncate">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Collapse toggle */}
                <div className="border-t border-gray-200/50 dark:border-gray-800/50 p-4">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex w-full items-center justify-center rounded-xl p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
            </aside>

            {/* Main content area */}
            <div className={cn('flex-1 flex flex-col min-w-0 transition-all duration-500', collapsed ? 'lg:ml-20' : 'lg:ml-72')}>
                {/* Top navbar */}
                <header className="sticky top-0 z-20 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6">
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="flex-1 lg:flex-none">
                        {/* Page title placeholder, overridden by children */}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
                        </button>

                        {/* User dropdown */}
                        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: themeColor }}>
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">{user?.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                            </div>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="ml-1 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={16} />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

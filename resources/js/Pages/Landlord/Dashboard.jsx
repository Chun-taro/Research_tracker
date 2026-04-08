import LandlordLayout from '@/Layouts/LandlordLayout';
import { Head, useForm } from '@inertiajs/react';
import { StatsCard } from '@/Components/StatsCard';
import { PageHeader } from '@/Components/PageHeader';
import { StatusBadge } from '@/Components/StatusBadge';
import { Globe, Users, CreditCard, ShoppingBag, TrendingUp } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export default function LandlordDashboard({ stats, recentTenants, tierDistribution, updateStatus }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;
        const load = async () => {
            const { Chart, registerables } = await import('chart.js');
            Chart.register(...registerables);
            if (chartInstance.current) chartInstance.current.destroy();

            const labels = Object.keys(tierDistribution ?? {});
            const values = Object.values(tierDistribution ?? {});
            
            const colors = {
                basic: '#10b981',    // Emerald-500
                standard: '#6366f1', // Indigo-500
                premium: '#f59e0b',  // Amber-500
            };
            
            chartInstance.current = new Chart(chartRef.current, {
                type: 'pie',
                data: {
                    labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
                    datasets: [{
                        data: values,
                        backgroundColor: labels.map(l => colors[l] || '#6B7280'),
                        borderWidth: 0
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } },
                },
            });
        };
        load();
        return () => chartInstance.current?.destroy();
    }, [tierDistribution]);

    return (
        <LandlordLayout>
            <Head title="System Dashboard" />
            <PageHeader title="System Central Dashboard" subtitle="Overview of all tenants and performance" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatsCard label="Total Tenants" value={stats?.total_tenants} icon={Globe} color="indigo" />
                <StatsCard label="Total Platform Users" value={stats?.total_users} icon={Users} color="blue" />
                <StatsCard label="Active Subscriptions" value={stats?.active_subscriptions} icon={CreditCard} color="green" />
                <StatsCard label="Total Revenue" value={`₱${stats?.total_revenue?.toLocaleString()}`} icon={ShoppingBag} color="pink" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-4">Recent Tenants</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-left">
                                    <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Tenant & Institution</th>
                                    <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Tier</th>
                                    <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                    <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Created At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentTenants?.map(t => (
                                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-900 border-l-4 border-indigo-500 pl-3">
                                            <div className="flex flex-col">
                                                <span>{t.name}</span>
                                                <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{t.institution_name || 'Individual Tenant'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={t.subscription_tier} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', t.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600')}>
                                                {t.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">{new Date(t.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col">
                    <h3 className="font-semibold text-slate-900 mb-4">Subscription Tiers</h3>
                    <div className="flex-1 min-h-[200px]">
                        <canvas ref={chartRef}></canvas>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100 flex-1 overflow-hidden">
                         <div className={cn("p-4 rounded-xl border transition-all duration-300 h-full flex flex-col", 
                            updateStatus?.update_available 
                                ? "bg-amber-50 border-amber-200 shadow-sm shadow-amber-500/10" 
                                : "bg-slate-50 border-slate-100"
                         )}>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">System Update History</h4>
                                {updateStatus?.update_available && (
                                    <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-cog"></span>
                                )}
                            </div>
                            
                            {/* Current Status Highlights */}
                            <div className="mb-4 pb-4 border-b border-slate-200">
                                {updateStatus?.update_available ? (
                                    <div>
                                        <p className="text-sm font-bold text-amber-900 leading-tight">Update Available</p>
                                        <p className="text-[11px] text-amber-700 mt-1 line-clamp-2 italic font-medium">"{updateStatus.latest_message}"</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-sm font-bold text-slate-700 leading-tight">System Up to Date</p>
                                        <p className="text-[11px] text-slate-400 mt-1">Current: <span className="font-mono">{updateStatus?.current_hash}</span></p>
                                    </div>
                                )}
                            </div>

                            {/* Commit History List */}
                            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                                {updateStatus?.history?.map((commit) => (
                                    <a 
                                        key={commit.sha} 
                                        href={commit.url} 
                                        target="_blank" 
                                        className={cn(
                                            "block p-2 rounded-lg border transition-all group",
                                            commit.is_current 
                                                ? "bg-white border-blue-200 ring-2 ring-blue-500/10" 
                                                : "bg-white/50 border-transparent hover:border-slate-200"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={cn(
                                                "text-[9px] font-mono px-1.5 py-0.5 rounded",
                                                commit.is_current ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                                            )}>
                                                {commit.sha}
                                            </span>
                                            {commit.is_current && (
                                                <span className="text-[8px] font-bold text-blue-600 uppercase tracking-tighter">Current</span>
                                            )}
                                        </div>
                                        <p className="text-[11px] font-medium text-slate-700 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {commit.message}
                                        </p>
                                        <div className="mt-1 flex justify-between items-center text-[9px] text-slate-400 font-medium">
                                            <span>{commit.author}</span>
                                            <span>{new Date(commit.date).toLocaleDateString()}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            <a href={updateStatus?.repo_url} target="_blank" className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                                Full GitHub History <TrendingUp size={10} />
                            </a>
                         </div>
                    </div>
                </div>
            </div>
        </LandlordLayout>
    );
}

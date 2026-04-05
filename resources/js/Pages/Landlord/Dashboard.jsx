import LandlordLayout from '@/Layouts/LandlordLayout';
import { Head, useForm } from '@inertiajs/react';
import { StatsCard } from '@/Components/StatsCard';
import { PageHeader } from '@/Components/PageHeader';
import { StatusBadge } from '@/Components/StatusBadge';
import { Globe, Users, CreditCard, ShoppingBag, TrendingUp } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export default function LandlordDashboard({ stats, recentTenants, tierDistribution, version, updateLogs }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const { post, processing } = useForm();

    const handleUpdate = () => {
        if (confirm(`Are you sure you want to run global migrations for all ${stats.total_tenants} departments? This will synchronize all database schemas to the current version.`)) {
            post(route('landlord.updates.run-migrations'));
        }
    };

    const handleRollback = () => {
        if (confirm(`CRITICAL ACTION: Are you sure you want to ROLLBACK the last database update for all ${stats.total_tenants} departments? This may result in data loss for newly added features.`)) {
            post(route('landlord.updates.rollback-migrations'));
        }
    };

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
            <PageHeader title="System Central Dashboard" subtitle="Overview of all departments and performance" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatsCard label="Total Departments" value={stats?.total_tenants} icon={Globe} color="indigo" />
                <StatsCard label="Total Platform Users" value={stats?.total_users} icon={Users} color="blue" />
                <StatsCard label="Active Subscriptions" value={stats?.active_subscriptions} icon={CreditCard} color="green" />
                <StatsCard label="Total Revenue" value={`₱${stats?.total_revenue?.toLocaleString()}`} icon={ShoppingBag} color="pink" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-4">Recent Departments</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-left">
                                    <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Name</th>
                                    <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Tier</th>
                                    <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                    <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Created At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentTenants?.map(t => (
                                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-900">{t.name}</td>
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

                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="text-sm font-semibold text-slate-900">System Version</h4>
                                <p className="text-xs text-slate-500">Core Engine: {version}</p>
                            </div>
                            <div className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-bold">
                                Stable
                            </div>
                        </div>
                        <button
                            onClick={handleUpdate}
                            disabled={processing}
                            className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                            {processing ? 'Synchronizing...' : 'Run Global Migrations'}
                        </button>
                        
                        <button
                            onClick={handleRollback}
                            disabled={processing || !updateLogs?.length}
                            className="w-full mt-2 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                            Revert Last Update
                        </button>

                        <p className="mt-2 text-[10px] text-center text-slate-400">
                            Syncs or rolls back all {stats.total_tenants} department databases
                        </p>
                    </div>

                    {updateLogs?.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <h4 className="text-sm font-semibold text-slate-900 mb-3">Recent Activity</h4>
                            <div className="space-y-3">
                                {updateLogs.map(log => (
                                    <div key={log.id} className="text-xs border-l-2 border-slate-100 pl-3 py-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-medium text-slate-700 capitalize">{log.status.replace('_', ' ')}</span>
                                            <span className="text-slate-400">{new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-500">
                                            <span>v{log.version}</span>
                                            <span>{log.tenant_count} depts</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </LandlordLayout>
    );
}

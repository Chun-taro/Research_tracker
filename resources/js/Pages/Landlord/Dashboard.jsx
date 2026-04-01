import LandlordLayout from '@/Layouts/LandlordLayout';
import { Head } from '@inertiajs/react';
import { StatsCard } from '@/Components/StatsCard';
import { PageHeader } from '@/Components/PageHeader';
import { Globe, Users, CreditCard, ShoppingBag, TrendingUp } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export default function LandlordDashboard({ stats, recentTenants, tierDistribution }) {
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
            
            chartInstance.current = new Chart(chartRef.current, {
                type: 'pie',
                data: {
                    labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
                    datasets: [{
                        data: values,
                        backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899'],
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
                <StatsCard label="Total Revenue" value={`\u20b1${stats?.total_revenue?.toLocaleString()}`} icon={ShoppingBag} color="pink" />
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
                                        <td className="px-4 py-3 capitalize">{t.subscription_tier}</td>
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
                    <div className="flex-1 min-h-[250px]">
                        <canvas ref={chartRef}></canvas>
                    </div>
                </div>
            </div>
        </LandlordLayout>
    );
}

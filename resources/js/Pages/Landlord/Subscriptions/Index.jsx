import LandlordLayout from '@/Layouts/LandlordLayout';
import { Head } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { CreditCard, History, CreditCard as CardIcon, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SubscriptionIndex({ subscriptions, payments, revenue_total }) {
    return (
        <LandlordLayout>
            <Head title="Subscriptions & Payments" />
            <PageHeader title="Platform Revenue & Subscriptions" subtitle="Monitor active plans and track incoming payments" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
                    <p className="text-indigo-100 text-sm font-medium mb-1">Total Lifetime Revenue</p>
                    <h2 className="text-3xl font-bold mb-4">\u20b1{revenue_total?.toLocaleString()}</h2>
                    <div className="flex items-center gap-2 text-xs bg-white/10 w-fit px-2 py-1 rounded-md">
                        <ArrowUpRight size={14} /> <span>12% from last month</span>
                    </div>
                </div>
                
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                     {[
                        { label: 'Active Plans', value: subscriptions?.total, icon: CardIcon, color: 'blue' },
                        { label: 'Pending Payments', value: '0', icon: History, color: 'amber' },
                        { label: 'Monthly Growth', value: '+4', icon: ArrowUpRight, color: 'emerald' },
                     ].map((stat, i) => (
                        <div key={i} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                             <div className={`h-12 w-12 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
                                 <stat.icon size={24} />
                             </div>
                             <div>
                                 <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                 <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                             </div>
                        </div>
                     ))}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Active Subscriptions List */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <CreditCard size={18} className="text-slate-400" /> Active Departmental Plans
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50/50 text-left">
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Department</th>
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Tier</th>
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Expires At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {subscriptions?.data?.map(sub => (
                                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-slate-900">{sub.tenant?.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase">{sub.tier}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{new Date(sub.expires_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Payments List */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <History size={18} className="text-slate-400" /> Transaction History
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50/50 text-left">
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Ref #</th>
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Dept</th>
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {payments?.map(pay => (
                                    <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-slate-400 font-mono text-[10px]">{pay.reference_number || 'INV-'+pay.id}</td>
                                        <td className="px-6 py-4 font-medium text-slate-700">{pay.tenant?.name}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900">\u20b1{pay.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-slate-500">
                                             <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-[10px] font-bold uppercase">{pay.status}</span>
                                        </td>
                                    </tr>
                                ))}
                                {payments?.length === 0 && (
                                    <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400 italic">No transactions found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </LandlordLayout>
    );
}

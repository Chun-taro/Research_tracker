import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { CreditCard, CheckCircle2, AlertCircle, Shield, Zap, Building2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function Billing({ tenant, subscription, payments, plans }) {
    const [submitting, setSubmitting] = useState(false);

    const handleCheckout = (tier) => {
        setSubmitting(tier);
        router.post(route('admin.billing.checkout'), { tier }, {
            onFinish: () => setSubmitting(false),
        });
    };

    const isExpired = new Date(tenant.subscription_expires_at) < new Date();
    const daysRemaining = Math.ceil((new Date(tenant.subscription_expires_at) - new Date()) / (1000 * 60 * 60 * 24));

    return (
        <AuthenticatedLayout>
            <Head title="Billing & Subscription" />
            <PageHeader title="Billing & Subscription" subtitle="Manage your department's platform access and billing" />

            {/* Current Plan Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-10">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center text-white shadow-lg",
                            tenant.subscription_tier === 'premium' ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-200' :
                            tenant.subscription_tier === 'standard' ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-indigo-200' :
                            'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-emerald-200'
                        )}>
                            <Building2 size={32} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl font-bold text-slate-900 capitalize">{tenant.subscription_tier} Plan</h2>
                                {isExpired ? (
                                    <span className="px-2.5 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-widest rounded flex items-center gap-1">
                                        <AlertCircle size={12} /> Expired
                                    </span>
                                ) : (
                                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded flex items-center gap-1">
                                        <CheckCircle2 size={12} /> Active
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-500 text-sm">
                                {isExpired ? (
                                    <>Your subscription expired on <strong className="text-slate-700">{new Date(tenant.subscription_expires_at).toLocaleDateString()}</strong>.</>
                                ) : (
                                    <>Your current cycle ends on <strong className="text-slate-700">{new Date(tenant.subscription_expires_at).toLocaleDateString()}</strong> ({daysRemaining} days remaining).</>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Tiers */}
            <div className="mb-12">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <h3 className="text-3xl font-black text-slate-900 mb-3">Upgrade Your Plan</h3>
                    <p className="text-slate-500 font-medium">Select a plan that fits your department's research volume and feature requirements. Subscriptions are billed annually.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Basic Plan */}
                    <div className={cn("bg-white rounded-3xl border-2 p-8 transition-all relative overflow-hidden", tenant.subscription_tier === 'basic' ? 'border-emerald-600 shadow-xl shadow-emerald-200/50' : 'border-slate-100 shadow-sm hover:border-emerald-300')}>
                        {tenant.subscription_tier === 'basic' && <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl">Current Plan</div>}
                        <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6"><Shield size={24} /></div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2">Basic</h4>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-black text-slate-900">₱{(plans.basic.price).toLocaleString()}</span>
                            <span className="text-slate-500 text-sm font-medium">/ year</span>
                        </div>
                        <ul className="space-y-4 mb-8 text-sm text-slate-600">
                            <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-green-500 shrink-0" /> Up to 5 Active Research Groups</li>
                            <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-green-500 shrink-0" /> Standard Thesis Workflows</li>
                            <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-green-500 shrink-0" /> 5GB Document Storage</li>
                        </ul>
                        <button 
                            onClick={() => handleCheckout('basic')} 
                            disabled={submitting === 'basic'}
                            className={cn("w-full py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50", 
                                tenant.subscription_tier === 'basic' ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            )}
                        >
                            {submitting === 'basic' ? 'Processing...' : (tenant.subscription_tier === 'basic' ? 'Renew Basic Plan' : 'Downgrade to Basic')}
                        </button>
                    </div>

                    {/* Standard Plan */}
                    <div className={cn("bg-white rounded-3xl border-2 p-8 transition-all relative overflow-hidden", tenant.subscription_tier === 'standard' ? 'border-indigo-600 shadow-xl shadow-indigo-200/50' : 'border-slate-100 shadow-sm hover:border-indigo-300')}>
                        {tenant.subscription_tier === 'standard' && <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl">Current Plan</div>}
                        <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6"><Zap size={24} /></div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2">Standard</h4>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-black text-slate-900">₱{(plans.standard.price).toLocaleString()}</span>
                            <span className="text-slate-500 text-sm font-medium">/ year</span>
                        </div>
                        <ul className="space-y-4 mb-8 text-sm text-slate-600">
                            <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-indigo-500 shrink-0" /> Up to 20 Active Research Groups</li>
                            <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-blue-500 shrink-0" /> Advanced Scheduling Tools</li>
                            <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-blue-500 shrink-0" /> 20GB Document Storage</li>
                            <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-blue-500 shrink-0" /> Priority Email Support</li>
                        </ul>
                        <button 
                            onClick={() => handleCheckout('standard')} 
                            disabled={submitting === 'standard'}
                            className={cn("w-full py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50", 
                                tenant.subscription_tier === 'standard' ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                            )}
                        >
                            {submitting === 'standard' ? 'Processing...' : (tenant.subscription_tier === 'standard' ? 'Renew Standard Plan' : 'Select Standard')}
                        </button>
                    </div>

                    {/* Premium Plan */}
                    <div className={cn("bg-slate-900 rounded-3xl border-2 p-8 transition-all relative overflow-hidden text-white", tenant.subscription_tier === 'premium' ? 'border-amber-500 shadow-2xl shadow-amber-500/30' : 'border-slate-800 hover:border-amber-400')}>
                        {tenant.subscription_tier === 'premium' && <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl">Current Plan</div>}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="h-12 w-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center mb-6 border border-amber-500/20"><CreditCard size={24} /></div>
                            <h4 className="text-xl font-bold text-white mb-2">Premium <span className="ml-2 text-[10px] bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full uppercase tracking-wider">Most Popular</span></h4>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black text-white">₱{(plans.premium.price).toLocaleString()}</span>
                                <span className="text-slate-400 text-sm font-medium">/ year</span>
                            </div>
                            <ul className="space-y-4 mb-8 text-sm text-slate-300">
                                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-amber-400 shrink-0" /> Unlimited Research Groups</li>
                                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-amber-400 shrink-0" /> Full API Access & Integrations</li>
                                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-amber-400 shrink-0" /> 100GB Document Storage</li>
                                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-amber-400 shrink-0" /> 24/7 Dedicated Support</li>
                            </ul>
                            <button 
                                onClick={() => handleCheckout('premium')} 
                                disabled={submitting === 'premium'}
                                className="w-full py-3.5 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-lg shadow-amber-500/30 disabled:opacity-50"
                            >
                                {submitting === 'premium' ? 'Processing...' : (tenant.subscription_tier === 'premium' ? 'Renew Premium Plan' : 'Upgrade to Premium')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

             {/* Recent Transactions (Dummy for now, can implement later) */}
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                    <Download size={18} className="text-slate-400" /> Recent Invoices
                </h3>
                
                {payments && payments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50 rounded-lg">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Reference</th>
                                    <th className="px-4 py-3">Tier</th>
                                    <th className="px-4 py-3 text-right">Amount</th>
                                    <th className="px-4 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 font-medium text-slate-900">
                                            {new Date(payment.paid_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4 font-mono text-xs">
                                            {payment.reference_number}
                                        </td>
                                        <td className="px-4 py-4 capitalize">
                                            {payment.subscription?.tier || 'Upgrade'}
                                        </td>
                                        <td className="px-4 py-4 text-right font-bold text-slate-900">
                                            ₱{(parseFloat(payment.amount)).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded">
                                                Paid
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <CreditCard size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-medium">Invoices will appear here after your first payment.</p>
                    </div>
                )}
            </div>

        </AuthenticatedLayout>
    );
}

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
            <PageHeader title="Billing & Subscription" subtitle="Manage your portal's platform access and billing" />

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
                    <p className="text-slate-500 font-medium">Select a plan that fits your portal's research volume and feature requirements. Subscriptions are billed annually.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan, index) => {
                        const isCurrent = tenant.subscription_tier === plan.slug;
                        const isPopular = plan.slug === 'premium' || index === plans.length - 1;

                        return (
                            <div key={plan.id} className={cn(
                                "rounded-3xl border-2 p-8 transition-all relative overflow-hidden flex flex-col justify-between",
                                isPopular ? "bg-slate-950 text-white border-amber-500 shadow-2xl shadow-amber-500/20" : "bg-white text-slate-900 border-slate-100 hover:border-indigo-300 shadow-sm",
                                isCurrent && (isPopular ? "ring-4 ring-amber-500/30" : "ring-4 ring-indigo-500/30 border-indigo-500")
                            )}>
                                {isCurrent && (
                                    <div className={cn("absolute top-0 right-0 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow-sm z-20", 
                                        isPopular ? "bg-amber-500 text-white" : "bg-indigo-600 text-white"
                                    )}>
                                        Active Plan
                                    </div>
                                )}
                                
                                <div className="relative z-10">
                                    <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center mb-6", 
                                        isPopular ? "bg-amber-500/20 text-amber-400 border border-amber-500/20" : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                                    )}>
                                        {index === 0 ? <Shield size={24} /> : index === 1 ? <Zap size={24} /> : <CreditCard size={24} />}
                                    </div>

                                    <h4 className={cn("text-xl font-black mb-2 flex items-center gap-2", isPopular ? "text-white" : "text-slate-900")}>
                                        {plan.name}
                                        {isPopular && <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md uppercase tracking-wider font-bold border border-amber-500/20">Pro</span>}
                                    </h4>

                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className={cn("text-4xl font-black", isPopular ? "text-white" : "text-slate-900")}>
                                            ₱{parseFloat(plan.price).toLocaleString()}
                                        </span>
                                        <span className={cn("text-xs font-bold uppercase tracking-widest", isPopular ? "text-slate-400" : "text-slate-400")}>
                                            / {plan.billing_cycle}
                                        </span>
                                    </div>

                                    <ul className="space-y-4 mb-10">
                                        {plan.features?.map((feature, fIndex) => (
                                            <li key={fIndex} className="flex items-start gap-3 text-sm font-medium">
                                                <div className={cn("mt-0.5 shrink-0", isPopular ? "text-amber-400" : "text-indigo-500")}>
                                                    <CheckCircle2 size={16} />
                                                </div>
                                                <span className={isPopular ? "text-slate-300" : "text-slate-600"}>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button 
                                    onClick={() => handleCheckout(plan.slug)} 
                                    disabled={submitting === plan.slug}
                                    className={cn(
                                        "relative z-10 w-full py-4 rounded-xl font-bold text-sm transition-all transform active:scale-[0.98] disabled:opacity-50",
                                        isCurrent 
                                            ? (isPopular ? "bg-white/10 text-white border border-white/20 hover:bg-white/20" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100")
                                            : (isPopular ? "bg-amber-500 text-white hover:bg-amber-600 shadow-xl shadow-amber-500/30" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-500/20")
                                    )}
                                >
                                    {submitting === plan.slug ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </span>
                                    ) : (
                                        isCurrent ? `Renew ${plan.name}` : `Upgrade to ${plan.name}`
                                    )}
                                </button>
                            </div>
                        );
                    })}
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

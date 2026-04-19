import LandlordLayout from '@/Layouts/LandlordLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { Plus, CreditCard, Trash2, Edit2, X, Check, Info } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const PREDEFINED_FEATURES = [
    'Custom Branding',
    'Advanced Analytics',
    'Priority Support',
    'Unlimited Research Groups',
    'Bulk Submission Exports',
    'Panelist Scheduling Engine',
    'Email Notifications',
    'Audit Trails (Version Control)',
    'Custom Domain Support',
    'API Access',
    'Multi-Campus Support',
    'Dedicated Account Manager'
];

function PlanModal({ plan, onClose }) {
    const { data, setData, post, patch, processing, errors } = useForm({
        name: plan?.name ?? '',
        slug: plan?.slug ?? '',
        price: plan?.price ?? 0,
        billing_cycle: plan?.billing_cycle ?? 'monthly',
        features: plan?.features ?? [],
        limits: plan?.limits ?? { students: 100, advisers: 10, panelists: 20, cycles: 1 },
        is_active: plan?.is_active ?? true,
    });

    const [newFeature, setNewFeature] = useState('');

    const toggleFeature = (feature) => {
        if (data.features.includes(feature)) {
            setData('features', data.features.filter(f => f !== feature));
        } else {
            setData('features', [...data.features, feature]);
        }
    };

    const addCustomFeature = () => {
        if (!newFeature.trim() || data.features.includes(newFeature.trim())) return;
        setData('features', [...data.features, newFeature.trim()]);
        setNewFeature('');
    };

    const randomizeFeatures = () => {
        const shuffled = [...PREDEFINED_FEATURES].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4 + Math.floor(Math.random() * 4));
        setData('features', selected);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (plan) {
            patch(route('landlord.plans.update', plan.id), { onSuccess: () => onClose() });
        } else {
            post(route('landlord.plans.store'), { onSuccess: () => onClose() });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">{plan ? 'Edit Subscription Plan' : 'Create New Plan'}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Plan Name</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                             {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Slug (Internal ID)</label>
                            <input type="text" value={data.slug} onChange={e => setData('slug', e.target.value)} disabled={!!plan}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-50" required />
                             {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Price (PHP)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₱</span>
                                <input type="number" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Billing Cycle</label>
                            <select value={data.billing_cycle} onChange={e => setData('billing_cycle', e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Platform Features</label>
                            <button type="button" onClick={randomizeFeatures} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-tight bg-indigo-50 px-2 py-1 rounded-md transition-colors">
                                Randomize Features
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            {PREDEFINED_FEATURES.map(f => (
                                <label key={f} className={cn(
                                    "flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer group",
                                    data.features.includes(f) 
                                        ? "bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500/5" 
                                        : "bg-white border-slate-100 hover:border-slate-200"
                                )}>
                                    <input type="checkbox" checked={data.features.includes(f)} onChange={() => toggleFeature(f)} className="hidden" />
                                    <div className={cn(
                                        "h-4 w-4 rounded-md border flex items-center justify-center transition-all",
                                        data.features.includes(f) ? "bg-indigo-600 border-indigo-600" : "bg-white border-slate-300 group-hover:border-slate-400"
                                    )}>
                                        {data.features.includes(f) && <Check size={10} className="text-white" strokeWidth={4} />}
                                    </div>
                                    <span className={cn("text-xs font-medium", data.features.includes(f) ? "text-indigo-900" : "text-slate-600")}>{f}</span>
                                </label>
                            ))}
                        </div>

                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Additional Custom Features</label>
                        <div className="flex gap-2 mb-3">
                            <input type="text" value={newFeature} onChange={e => setNewFeature(e.target.value)} placeholder="e.g. 24/7 Phone Support"
                                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                            <button type="button" onClick={addCustomFeature} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">Add</button>
                        </div>
                        
                        {/* Summary of manual/custom features not in the predefined list */}
                        <div className="flex flex-wrap gap-2">
                             {data.features.filter(f => !PREDEFINED_FEATURES.includes(f)).map((f, i) => (
                                <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold border border-slate-200 group">
                                    {f}
                                    <button type="button" onClick={() => toggleFeature(f)} className="hover:text-red-500"><X size={12} /></button>
                                </span>
                            ))}
                            {data.features.length === 0 && <p className="text-xs text-slate-400 italic">No features selected yet.</p>}
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                         <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                             <Info size={14} /> System Quotas & Limits
                         </label>
                         <div className="grid grid-cols-2 gap-4">
                             {Object.entries(data.limits).map(([key, value]) => (
                                 <div key={key}>
                                     <label className="block text-[10px] font-bold text-slate-500 capitalize mb-1">{key.replace('_', ' ')} Limit</label>
                                     <input type="number" value={value} onChange={e => setData('limits', { ...data.limits, [key]: parseInt(e.target.value) })}
                                         className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none" />
                                     <p className="text-[10px] text-slate-400 mt-0.5">Set to -1 for unlimited.</p>
                                 </div>
                             ))}
                         </div>
                    </div>
                </form>

                <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                    <button type="submit" disabled={processing} onClick={handleSubmit}
                        className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50">
                        {processing ? 'Saving...' : (plan ? 'Update Plan' : 'Create Plan')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Plans({ plans }) {
    const [modal, setModal] = useState(null);

    return (
        <LandlordLayout>
            <Head title="Subscription Plans" />
            <PageHeader title="Subscription Plans" subtitle="Customize pricing and feature tiers for all tenants"
                actions={
                    <button onClick={() => setModal('create')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
                        <Plus size={16} /> New Plan
                    </button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <div key={plan.id} className={cn("bg-white rounded-2xl border transition-all hover:shadow-xl group", plan.is_active ? "border-slate-100" : "border-slate-200 opacity-60")}>
                        <div className="p-6 border-b border-slate-50 flex justify-between items-start">
                            <div>
                                <h3 className="font-black text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">{plan.name}</h3>
                                <p className="text-xs font-bold text-slate-400 tracking-widest rounded-lg bg-slate-50 inline-block px-2 py-1 mt-2 uppercase">{plan.slug}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setModal(plan)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit2 size={18} /></button>
                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-slate-900">₱{parseFloat(plan.price).toLocaleString()}</span>
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">/ {plan.billing_cycle}</span>
                            </div>

                            <ul className="space-y-3">
                                {plan.features?.map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                        <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                            <Check size={12} />
                                        </div>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-4 border-t border-slate-50 grid grid-cols-2 gap-y-3">
                                {Object.entries(plan.limits || {}).map(([key, val]) => (
                                    <div key={key} className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{key}</span>
                                        <span className="text-xs font-bold text-slate-700">{val === -1 ? 'Unlimited' : val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {modal === 'create' && <PlanModal onClose={() => setModal(null)} />}
            {modal && typeof modal === 'object' && <PlanModal plan={modal} onClose={() => setModal(null)} />}
        </LandlordLayout>
    );
}

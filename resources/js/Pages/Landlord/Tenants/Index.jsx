import LandlordLayout from '@/Layouts/LandlordLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { Plus, Search, Edit2, Trash2, X, Globe, ExternalLink, Settings, Zap } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

function TenantModal({ tenant, onClose }) {
    const { data, setData, post, patch, processing, errors } = useForm({
        name: tenant?.name ?? '',
        slug: tenant?.slug ?? '',
        domain: tenant?.domain ?? '',
        subscription_tier: tenant?.subscription_tier ?? 'basic',
        is_active: tenant?.is_active ?? true,
        admin_name: '',
        admin_email: '',
        admin_password: 'password',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (tenant) {
            router.patch(`/landlord/tenants/${tenant.id}`, data, { onSuccess: onClose });
        } else {
            router.post('/landlord/tenants', data, { onSuccess: onClose });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900">{tenant ? 'Edit Department' : 'Configure New Department'}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Department Name</label>
                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                            placeholder="e.g. BS Information Technology"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-slate-50 outline-none" required />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Subdomain Slug</label>
                             <input type="text" value={data.slug} onChange={e => {
                                    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                    setData(d => ({ ...d, slug, admin_email: `admin@${slug}.localhost` }));
                                }}
                                placeholder="e.g. bsit"
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-slate-50 outline-none" required />
                             {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Subscription Tier</label>
                            <select value={data.subscription_tier} onChange={e => setData('subscription_tier', e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-slate-50 outline-none">
                                <option value="basic">Basic Plan</option>
                                <option value="standard">Standard Plan</option>
                                <option value="premium">Premium Plan</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Custom Domain (Optional)</label>
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                            <span className="px-3 text-slate-400 text-sm">https://</span>
                            <input type="text" value={data.domain} onChange={e => setData('domain', e.target.value)}
                                placeholder="bsit.yourdomain.edu"
                                className="flex-1 px-3 py-2 text-sm bg-transparent outline-none" />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">If blank, defaults to [slug].localhost</p>
                    </div>

                    {!tenant && (
                        <div className="pt-4 border-t border-slate-100 mt-4 space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 border-l-4 border-indigo-500 pl-3">Initial Admin Account</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Admin Name</label>
                                <input type="text" value={data.admin_name} onChange={e => setData('admin_name', e.target.value)}
                                    placeholder="e.g. Dr. John Smith"
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-indigo-50/30 outline-none" required />
                                {errors.admin_name && <p className="text-xs text-red-500 mt-1">{errors.admin_name}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Admin Email</label>
                                    <input type="email" value={data.admin_email} onChange={e => setData('admin_email', e.target.value)}
                                        placeholder="admin@dept.edu.ph"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-indigo-50/30 outline-none" required />
                                    {errors.admin_email && <p className="text-xs text-red-500 mt-1">{errors.admin_email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Admin Password</label>
                                    <input type="password" value={data.admin_password} onChange={e => setData('admin_password', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-indigo-50/30 outline-none" required />
                                    {errors.admin_password && <p className="text-xs text-red-500 mt-1">{errors.admin_password}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {tenant && (
                        <div className="flex items-center gap-2 pt-2">
                             <input type="checkbox" id="active-check" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)}
                                className="rounded text-indigo-600 focus:ring-indigo-500" />
                             <label htmlFor="active-check" className="text-sm text-slate-700">Account status active</label>
                        </div>
                    )}
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 disabled:opacity-50">
                            {processing ? 'Processing...' : (tenant ? 'Update Account' : 'Initialize Department')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function TenantIndex({ tenants, filters }) {
    const [modal, setModal] = useState(null);
    const [search, setSearch] = useState(filters?.search ?? '');

    const applySearch = () => {
        router.get('/landlord/tenants', { search }, { preserveState: true });
    };

    return (
        <LandlordLayout>
            <Head title="Department Management" />
            <PageHeader title="Department Management" subtitle="Create and monitor research department accounts"
                actions={
                    <button onClick={() => setModal('create')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
                        <Plus size={16} /> New Department
                    </button>
                }
            />

            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 mb-6 shadow-sm">
                <Search size={18} className="text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && applySearch()}
                    placeholder="Search by department name or subdomain slug..."
                    className="flex-1 text-sm bg-transparent outline-none text-slate-900 placeholder:text-slate-400" />
                <button onClick={applySearch} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-600 transition-colors">Apply</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {tenants?.data?.map(tenant => (
                    <div key={tenant.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                        <div className="h-2 bg-indigo-500" style={{ backgroundColor: tenant.theme_color || '#6366f1' }} />
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:scale-110 transition-transform">
                                    <Globe size={20} />
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center bg-amber-50/50 rounded-lg px-1 py-0.5 border border-amber-100 shadow-sm mr-1">
                                        <button 
                                            onClick={() => router.post(`/landlord/tenants/${tenant.id}/mock-subscription`, { tier: 'basic' })} 
                                            title="Mock Basic (₱1,000)"
                                            className="w-6 h-6 flex items-center justify-center text-[10px] font-black text-amber-600 hover:bg-amber-500 hover:text-white rounded-md transition-all"
                                        >B</button>
                                        <button 
                                            onClick={() => router.post(`/landlord/tenants/${tenant.id}/mock-subscription`, { tier: 'standard' })} 
                                            title="Mock Standard (₱2,500)"
                                            className="w-6 h-6 flex items-center justify-center text-[10px] font-black text-amber-600 hover:bg-amber-500 hover:text-white rounded-md transition-all"
                                        >S</button>
                                        <button 
                                            onClick={() => router.post(`/landlord/tenants/${tenant.id}/mock-subscription`, { tier: 'premium' })} 
                                            title="Mock Premium (₱4,000)"
                                            className="w-6 h-6 flex items-center justify-center text-[10px] font-black text-amber-600 hover:bg-amber-500 hover:text-white rounded-md transition-all"
                                        >P</button>
                                    </div>
                                    <button onClick={() => setModal(tenant)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-all"><Edit2 size={16} /></button>
                                    <button onClick={() => router.delete(`/landlord/tenants/${tenant.id}`)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{tenant.name}</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider', 
                                    tenant.subscription_tier === 'premium' ? 'bg-amber-100 text-amber-700' : 
                                    tenant.subscription_tier === 'standard' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700')}>
                                    {tenant.subscription_tier}
                                </span>
                                <span className={cn('h-1.5 w-1.5 rounded-full', tenant.is_active ? 'bg-green-500' : 'bg-slate-300')} />
                                <span className="text-xs text-slate-400">{tenant.is_active ? 'Online' : 'Hibernated'}</span>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Globe size={14} /> <span>{tenant.slug}.localhost</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Settings size={14} /> <span>{tenant.subscriptions_count || 0} Subscriptions</span>
                                </div>
                            </div>

                            <a href={`http://${tenant.domain || tenant.slug + '.localhost:8000'}`} target="_blank" rel="noreferrer"
                                className="w-full py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-semibold text-slate-600 flex items-center justify-center gap-2 transition-colors">
                                Access Dashboard <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {modal && <TenantModal tenant={modal === 'create' ? null : modal} onClose={() => setModal(null)} />}
        </LandlordLayout>
    );
}

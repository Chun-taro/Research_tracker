import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { StatusBadge } from '@/Components/StatusBadge';
import { useState } from 'react';

export default function SettingsIndex({ tenant }) {
    const [data, setData] = useState({
        name: tenant?.name ?? '',
        institution_name: tenant?.institution_name ?? '',
        theme_color: tenant?.theme_color ?? '#3B82F6',
        contact_email: tenant?.contact_email ?? '',
        contact_phone: tenant?.contact_phone ?? '',
    });
    const [processing, setProcessing] = useState(false);
    const [logo, setLogo] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        const formData = new FormData();
        formData.append('_method', 'PATCH'); // Laravel requires this for multipart/form-data PATCH
        Object.entries(data).forEach(([k, v]) => formData.append(k, v));
        if (logo) formData.append('logo', logo);
        
        router.post('/admin/settings', formData, {
            onFinish: () => setProcessing(false),
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Settings" />
            <PageHeader title="Tenant Settings" subtitle="Customize your tenant profile" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Settings Form */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-5">General Settings</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tenant Name (e.g. BSIT)</label>
                            <input type="text" value={data.name} onChange={e => setData(p => ({ ...p, name: e.target.value }))} required
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Institution / School (e.g. University of the East)</label>
                            <input type="text" value={data.institution_name} onChange={e => setData(p => ({ ...p, institution_name: e.target.value }))}
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme Color</label>
                            <div className="flex items-center gap-3">
                                <input type="color" value={data.theme_color} onChange={e => setData(p => ({ ...p, theme_color: e.target.value }))}
                                    className="h-10 w-16 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer" />
                                <input type="text" value={data.theme_color} onChange={e => setData(p => ({ ...p, theme_color: e.target.value }))}
                                    className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Email</label>
                                <input type="email" value={data.contact_email} onChange={e => setData(p => ({ ...p, contact_email: e.target.value }))}
                                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Phone</label>
                                <input type="text" value={data.contact_phone} onChange={e => setData(p => ({ ...p, contact_phone: e.target.value }))}
                                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tenant Logo</label>
                            <input type="file" onChange={e => setLogo(e.target.files[0])} accept="image/*"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-colors cursor-pointer" />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" disabled={processing} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Subscription Info */}
                <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Subscription Plan</h3>
                        <StatusBadge status={tenant?.subscription_tier} className="mb-3" />
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            {tenant?.features?.length > 0 ? (
                                tenant.features.map((feature, i) => (
                                    <p key={i}>• {feature}</p>
                                ))
                            ) : (
                                <p className="italic opacity-50">No feature details available.</p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${data.theme_color}20, ${data.theme_color}40)`, border: `1px solid ${data.theme_color}40` }}>
                        <div className="p-5">
                            <p className="text-xs text-gray-500 mb-2">Theme Preview</p>
                            <div className="h-8 rounded-lg" style={{ backgroundColor: data.theme_color }} />
                            <p className="text-sm font-medium text-gray-900 dark:text-white mt-3 truncate">{data.name}</p>
                            {data.institution_name && <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate opacity-70">@ {data.institution_name}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

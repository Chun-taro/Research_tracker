import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { StatusBadge } from '@/Components/StatusBadge';
import { useState } from 'react';

export default function SettingsIndex({ tenant }) {
    const [data, setData] = useState({
        name: tenant?.name ?? '',
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
        Object.entries(data).forEach(([k, v]) => formData.append(k, v));
        if (logo) formData.append('logo', logo);
        router.post('/admin/settings', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Settings" />
            <PageHeader title="Department Settings" subtitle="Customize your department profile" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Settings Form */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-5">General Settings</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department Name</label>
                            <input type="text" value={data.name} onChange={e => setData(p => ({ ...p, name: e.target.value }))} required
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department Logo</label>
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
                            {tenant?.subscription_tier === 'basic' && (
                                <>
                                    <p>• 1 Research Cycle</p>
                                    <p>• Up to 100 Students</p>
                                    <p>• Up to 10 Advisers</p>
                                    <p>• Up to 30 Panelists</p>
                                </>
                            )}
                            {tenant?.subscription_tier === 'standard' && (
                                <>
                                    <p>• 1 Research Cycle</p>
                                    <p>• Up to 150 Students</p>
                                    <p>• Repository search</p>
                                    <p>• CSV exports</p>
                                    <p>• Email notifications</p>
                                </>
                            )}
                            {tenant?.subscription_tier === 'premium' && (
                                <>
                                    <p>• Up to 3 Active Research Cycles</p>
                                    <p>• Up to 300 Students</p>
                                    <p>• Unlimited Advisers & Panelists</p>
                                    <p>• All features included</p>
                                    <p>• Priority support</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${data.theme_color}20, ${data.theme_color}40)`, border: `1px solid ${data.theme_color}40` }}>
                        <div className="p-5">
                            <p className="text-xs text-gray-500 mb-2">Theme Preview</p>
                            <div className="h-8 rounded-lg" style={{ backgroundColor: data.theme_color }} />
                            <p className="text-sm font-medium text-gray-900 dark:text-white mt-3">{data.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

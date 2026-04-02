import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { StatusBadge } from '@/Components/StatusBadge';
import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Calendar } from 'lucide-react';

const Field = ({ label, type = 'text', name, data, setData, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input 
            type={type} 
            value={data[name] || ''} 
            onChange={e => setData(prev => ({ ...prev, [name]: e.target.value }))}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
            {...props} 
        />
    </div>
);

function CycleModal({ cycle, onClose }) {
    const [data, setData] = useState({
        name: cycle?.name ?? '',
        academic_year: cycle?.academic_year ?? '',
        semester: cycle?.semester ?? '1st Semester',
        start_date: cycle?.start_date ?? '',
        end_date: cycle?.end_date ?? '',
        proposal_deadline: cycle?.proposal_deadline ?? '',
        chapter_deadline: cycle?.chapter_deadline ?? '',
        final_deadline: cycle?.final_deadline ?? '',
        defense_deadline: cycle?.defense_deadline ?? '',
        status: cycle?.status ?? 'active',
    });
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        if (cycle) {
            router.patch(`/admin/cycles/${cycle.id}`, data, { onFinish: () => { setProcessing(false); onClose(); } });
        } else {
            router.post('/admin/cycles', data, { onFinish: () => { setProcessing(false); onClose(); } });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{cycle ? 'Edit Cycle' : 'New Research Cycle'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <Field label="Cycle Name" name="name" data={data} setData={setData} required />
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Academic Year" name="academic_year" placeholder="2025-2026" data={data} setData={setData} required />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Semester</label>
                            <select value={data.semester} onChange={e => setData(prev => ({ ...prev, semester: e.target.value }))}
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                                <option>1st Semester</option>
                                <option>2nd Semester</option>
                                <option>Summer</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Start Date" type="date" name="start_date" data={data} setData={setData} required />
                        <Field label="End Date" type="date" name="end_date" data={data} setData={setData} required />
                    </div>
                    <hr className="border-gray-100 dark:border-gray-800" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Deadlines</p>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Proposal Deadline" type="date" name="proposal_deadline" data={data} setData={setData} />
                        <Field label="Chapter Deadline" type="date" name="chapter_deadline" data={data} setData={setData} />
                        <Field label="Final Manuscript Deadline" type="date" name="final_deadline" data={data} setData={setData} />
                        <Field label="Defense Deadline" type="date" name="defense_deadline" data={data} setData={setData} />
                    </div>
                    {cycle && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                            <select value={data.status} onChange={e => setData(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="active">Active</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    )}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors">Cancel</button>
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
                            {processing ? 'Saving...' : (cycle ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function CyclesIndex({ cycles }) {
    const [modal, setModal] = useState(null);

    return (
        <AuthenticatedLayout>
            <Head title="Research Cycles" />
            <PageHeader
                title="Research Cycles"
                subtitle="Manage academic research periods and deadlines"
                actions={
                    <button onClick={() => setModal('create')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        <Plus size={16} /> New Cycle
                    </button>
                }
            />

            <div className="space-y-4">
                {cycles?.data?.length > 0 ? cycles.data.map(cycle => (
                    <div key={cycle.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                                    <Calendar size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{cycle.name}</h3>
                                        <StatusBadge status={cycle.status} />
                                    </div>
                                    <p className="text-sm text-gray-500">{cycle.academic_year} · {cycle.semester} · {cycle.research_groups_count ?? 0} groups</p>
                                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                                        {[
                                            { label: 'Proposal', date: cycle.proposal_deadline },
                                            { label: 'Chapter', date: cycle.chapter_deadline },
                                            { label: 'Final', date: cycle.final_deadline },
                                            { label: 'Defense', date: cycle.defense_deadline },
                                        ].filter(d => d.date).map(d => (
                                            <span key={d.label} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                                                <Calendar size={11} />
                                                <b>{d.label}:</b> {new Date(d.date).toLocaleDateString()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button onClick={() => setModal(cycle)} className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Edit2 size={15} /></button>
                                <button onClick={() => { if (confirm('Archive this cycle?')) router.delete(`/admin/cycles/${cycle.id}`); }} className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={15} /></button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-12 text-center shadow-sm">
                        <Calendar size={40} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No research cycles yet. Create one to get started.</p>
                    </div>
                )}
            </div>

            {modal && <CycleModal cycle={modal === 'create' ? null : modal} onClose={() => setModal(null)} />}
        </AuthenticatedLayout>
    );
}

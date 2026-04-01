import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { StatusBadge } from '@/Components/StatusBadge';
import { useState } from 'react';
import { Search, Plus, Eye, UserCheck, Users, X } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function GroupsIndex({ groups, advisers, panelists, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [status, setStatus] = useState(filters?.status ?? '');
    const [assignModal, setAssignModal] = useState(null);
    const [assignType, setAssignType] = useState('adviser');
    const [selectedUser, setSelectedUser] = useState('');

    const applyFilters = (newStatus) => {
        router.get('/admin/groups', { search, status: newStatus ?? status }, { preserveState: true });
    };

    const handleAssign = (e) => {
        e.preventDefault();
        if (assignType === 'adviser') {
            router.post(`/admin/groups/${assignModal.id}/assign-adviser`, { adviser_id: selectedUser }, {
                onSuccess: () => { setAssignModal(null); setSelectedUser(''); }
            });
        } else {
            router.post(`/admin/groups/${assignModal.id}/assign-panelist`, { user_id: selectedUser }, {
                onSuccess: () => { setAssignModal(null); setSelectedUser(''); }
            });
        }
    };

    const statuses = ['', 'draft', 'submitted', 'under_review', 'revision_required', 'approved', 'rejected', 'completed'];

    return (
        <AuthenticatedLayout>
            <Head title="Research Groups" />
            <PageHeader
                title="Research Groups"
                subtitle={`${groups?.total ?? 0} total groups`}
            />

            {/* Status Filter Tabs */}
            <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
                {statuses.map(s => (
                    <button key={s} onClick={() => { setStatus(s); applyFilters(s); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${status === s ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50'}`}>
                        {s ? s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'All Groups'}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 mb-5">
                <Search size={16} className="text-gray-400 flex-shrink-0" />
                <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    placeholder="Search research titles..." className="flex-1 text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none" />
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 text-left">
                                {['Title', 'Adviser', 'Students', 'Cycle', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {groups?.data?.length > 0 ? groups.data.map(group => (
                                <tr key={group.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white max-w-xs">
                                        <p className="truncate">{group.title}</p>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400">{group.adviser?.name ?? <span className="text-gray-300 dark:text-gray-600">—</span>}</td>
                                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400">{group.students?.length ?? 0}</td>
                                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400">{group.cycle?.name ?? '—'}</td>
                                    <td className="px-5 py-3.5"><StatusBadge status={group.status} /></td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/groups/${group.id}`} className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="View"><Eye size={15} /></Link>
                                            <button onClick={() => { setAssignModal(group); setAssignType('adviser'); }} className="p-1.5 rounded-md text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors" title="Assign Adviser">
                                                <UserCheck size={15} />
                                            </button>
                                            <button onClick={() => { setAssignModal(group); setAssignType('panelist'); }} className="p-1.5 rounded-md text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors" title="Assign Panelist">
                                                <Users size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No research groups found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {groups?.last_page > 1 && (
                    <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm text-gray-500">
                        <span>Showing {groups?.from}–{groups?.to} of {groups?.total}</span>
                        <div className="flex gap-1">
                            {groups.links?.map((link, i) => (
                                <button key={i} onClick={() => link.url && router.get(link.url)} disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 rounded-md text-xs ${link.active ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40'}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Assign Modal */}
            {assignModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Assign {assignType === 'adviser' ? 'Adviser' : 'Panelist'}
                            </h2>
                            <button onClick={() => setAssignModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAssign} className="p-6 space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Group: <span className="font-medium">{assignModal.title}</span></p>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Select {assignType === 'adviser' ? 'Adviser' : 'Panelist'}
                                </label>
                                <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required
                                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="">Select...</option>
                                    {(assignType === 'adviser' ? advisers : panelists)?.map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setAssignModal(null)} className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Assign</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

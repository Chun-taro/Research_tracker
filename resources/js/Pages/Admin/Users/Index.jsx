import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { StatusBadge } from '@/Components/StatusBadge';
import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';

function UserModal({ user, onClose, onSubmit }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        role: user?.role ?? 'student',
        phone: user?.phone ?? '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (user) {
            router.patch(`/admin/users/${user.id}`, data, { onSuccess: onClose });
        } else {
            router.post('/admin/users', data, { onSuccess: onClose });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{user ? 'Edit User' : 'Add New User'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                        <select value={data.role} onChange={e => setData('role', e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                            <option value="student">Student</option>
                            <option value="adviser">Adviser</option>
                            <option value="panelist">Panelist</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                        <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    </div>
                    {!user && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                                <input type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                                <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                            </div>
                        </>
                    )}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
                            {processing ? 'Saving...' : (user ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function UsersIndex({ users, filters }) {
    const [modal, setModal] = useState(null); // null | 'create' | user_object
    const [search, setSearch] = useState(filters?.search ?? '');
    const [role, setRole] = useState(filters?.role ?? '');

    const applyFilters = () => {
        router.get('/admin/users', { search, role }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="User Management" />
            <PageHeader
                title="User Management"
                subtitle={`${users?.total ?? 0} users in this department`}
                actions={
                    <button onClick={() => setModal('create')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        <Plus size={16} /> Add User
                    </button>
                }
            />

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5">
                <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
                    <Search size={16} className="text-gray-400 flex-shrink-0" />
                    <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && applyFilters()}
                        placeholder="Search users..."
                        className="flex-1 text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none" />
                </div>
                <select value={role} onChange={e => { setRole(e.target.value); setTimeout(() => router.get('/admin/users', { search, role: e.target.value }, { preserveState: true }), 0); }}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Roles</option>
                    <option value="student">Students</option>
                    <option value="adviser">Advisers</option>
                    <option value="panelist">Panelists</option>
                    <option value="admin">Admins</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 text-left">
                                {['Name', 'Email', 'Role', 'Phone', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {users?.data?.length > 0 ? users.data.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                                {user.name?.charAt(0)}
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400">{user.email}</td>
                                    <td className="px-5 py-3.5">
                                        <StatusBadge status={user.role} />
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400">{user.phone ?? '—'}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setModal(user)} className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Edit">
                                                <Edit2 size={15} />
                                            </button>
                                            <button onClick={() => router.patch(`/admin/users/${user.id}/toggle-status`)} className="p-1.5 rounded-md text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" title="Toggle Status">
                                                {user.is_active ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                                            </button>
                                            <button onClick={() => { if (confirm('Archive this user?')) router.delete(`/admin/users/${user.id}`); }} className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Archive">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No users found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {users?.last_page > 1 && (
                    <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm text-gray-500">
                        <span>Showing {users?.from}–{users?.to} of {users?.total}</span>
                        <div className="flex gap-1">
                            {users.links?.map((link, i) => (
                                <button key={i} onClick={() => link.url && router.get(link.url)} disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 rounded-md text-xs ${link.active ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40'}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {modal && <UserModal user={modal === 'create' ? null : modal} onClose={() => setModal(null)} />}
        </AuthenticatedLayout>
    );
}

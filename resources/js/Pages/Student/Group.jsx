import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { StatusBadge } from '@/Components/StatusBadge';
import { Users, UserPlus, FilePlus, Code, Calendar, User, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function StudentGroup({ group, memberRole, availableCycles }) {
    const [action, setAction] = useState(null);

    const createForm = useForm({
        title: '',
        research_cycle_id: availableCycles?.[0]?.id ?? '',
    });

    const joinForm = useForm({
        group_code: '',
    });

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('student.group.create'), {
            onSuccess: () => setAction(null),
        });
    };

    const handleJoin = (e) => {
        e.preventDefault();
        joinForm.post(route('student.group.join'), {
            onSuccess: () => setAction(null),
        });
    };

    if (!group) {
        return (
            <AuthenticatedLayout user={null}>
                <Head title="My Research Group" />
                <PageHeader title="Research Group" subtitle="You are not currently part of a research group." />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl pt-8">
                    {/* Create Group Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm hover:shadow-xl transition-all group">
                        <div className="h-14 w-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <FilePlus size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Create New Group</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm leading-relaxed">
                            Start a new research project and become the group leader. You'll be able to invite other students to join you.
                        </p>
                        
                        {action === 'create' ? (
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Research Title</label>
                                    <input type="text" value={createForm.data.title} onChange={e => createForm.setData('title', e.target.value)}
                                        placeholder="Enter your proposed title..." required
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Academic Cycle</label>
                                    {availableCycles && availableCycles.length > 0 ? (
                                        <>
                                            <select 
                                                value={createForm.data.research_cycle_id} 
                                                onChange={e => createForm.setData('research_cycle_id', e.target.value)} 
                                                required
                                                className={cn(
                                                    "w-full bg-gray-50 dark:bg-gray-800 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all",
                                                    createForm.errors.research_cycle_id ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                                                )}
                                            >
                                                <option value="" disabled>Select an academic cycle...</option>
                                                {availableCycles.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name} ({c.academic_year})</option>
                                                ))}
                                            </select>
                                            {createForm.errors.research_cycle_id && (
                                                <p className="mt-1.5 text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{createForm.errors.research_cycle_id}</p>
                                            )}
                                        </>
                                    ) : (
                                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl">
                                            <p className="text-xs text-amber-700 dark:text-amber-400 font-bold">No active research cycles found. Please contact the department administrator.</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button type="submit" disabled={createForm.processing} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all">Initialize Group</button>
                                    <button type="button" onClick={() => setAction(null)} className="px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-bold transition-all">Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <button onClick={() => setAction('create')} className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-bold hover:opacity-90 transition-all">Get Started</button>
                        )}
                    </div>

                    {/* Join Group Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm hover:shadow-xl transition-all group">
                        <div className="h-14 w-14 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <UserPlus size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Join Existing Group</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm leading-relaxed">
                            Have a group code? Enter it below to become a member of an already created research group.
                        </p>

                        {action === 'join' ? (
                            <form onSubmit={handleJoin} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Group ID / Code</label>
                                    <div className="flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 transition-all">
                                        <div className="px-4 text-gray-400"><Code size={18} /></div>
                                        <input type="text" value={joinForm.data.group_code} onChange={e => joinForm.setData('group_code', e.target.value)}
                                            placeholder="G-XXXX-XXXX" required
                                            className="flex-1 py-3 text-sm bg-transparent outline-none text-gray-900 dark:text-white" />
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button type="submit" disabled={joinForm.processing} className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-200 dark:shadow-none transition-all">Join Group</button>
                                    <button type="button" onClick={() => setAction(null)} className="px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-bold transition-all">Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <button onClick={() => setAction('join')} className="w-full py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">Enter Code</button>
                        )}
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout user={null}>
            <Head title="My Research Group" />
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side: Group Info */}
                <div className="flex-1 space-y-8">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <StatusBadge status={group.status} />
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Calendar size={14} /> {group.cycle?.name}
                            </div>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{group.title}</h1>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8 italic">
                            {group.abstract || "No abstract provided yet. Please update your research group details in the settings or consult your adviser."}
                        </p>
                        
                        <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-50 dark:border-gray-800">
                             <div className="flex items-center gap-2.5 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                                    <ShieldCheck size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Your Role</p>
                                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 capitalize">{memberRole}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-2.5 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="h-8 w-8 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center">
                                    <User size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Group Adviser</p>
                                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{group.adviser?.name ?? 'Not Assigned'}</p>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Member List */}
                    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                        <div className="px-8 py-5 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <Users size={16} /> Group Members
                            </h3>
                            {memberRole === 'leader' && (
                                <div className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase">
                                    Group ID: {group.id}
                                </div>
                            )}
                        </div>
                        <div className="divide-y divide-gray-50 dark:divide-gray-800">
                            {group.students?.map((student) => (
                                <div key={student.id} className="px-8 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 font-bold border-2 border-white dark:border-gray-900 shadow-sm">
                                            {student.name ? student.name.charAt(0) : '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{student.name}</p>
                                            <p className="text-xs text-gray-500">{student.email}</p>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                        student.pivot?.role === 'leader' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                                    )}>
                                        {student.pivot?.role || 'Member'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Panelists & Deadlines */}
                <div className="w-full lg:w-80 space-y-8">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-6 pb-2 border-b border-gray-100 dark:border-gray-800">Review Panel</h3>
                        {group.panelists?.length > 0 ? (
                            <div className="space-y-4">
                                {group.panelists.map((p) => (
                                    <div key={p.id} className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
                                            <ShieldCheck size={16} />
                                        </div>
                                        <div className="truncate">
                                            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{p.panelist?.name}</p>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Panel Member</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-400 font-medium italic">Pending panel assignment</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 dark:shadow-none">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-4 opacity-80">Next Milestone</h3>
                        <p className="text-xl font-bold mb-2">Proposal Defense</p>
                        <p className="text-sm opacity-90 mb-6">Deadline: {group.cycle?.proposal_deadline ? new Date(group.cycle.proposal_deadline).toLocaleDateString() : 'TBA'}</p>
                        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white w-1/3 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

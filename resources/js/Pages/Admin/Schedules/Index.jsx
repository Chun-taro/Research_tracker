import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

function ScheduleModal({ groups, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        research_group_id: '',
        type: 'proposal_defense',
        scheduled_at: '',
        venue: '',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.schedules.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">New Schedule</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Research Group</label>
                        <select 
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={data.research_group_id}
                            onChange={e => setData('research_group_id', e.target.value)}
                            required
                        >
                            <option value="">Select a group...</option>
                            {groups.map(group => (
                                <option key={group.id} value={group.id}>{group.title}</option>
                            ))}
                        </select>
                        {errors.research_group_id && <p className="text-xs text-red-500 mt-1">{errors.research_group_id}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Type</label>
                        <select 
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={data.type}
                            onChange={e => setData('type', e.target.value)}
                            required
                        >
                            <option value="proposal_defense">Proposal Defense</option>
                            <option value="final_defense">Final Defense</option>
                            <option value="consultation">Consultation</option>
                        </select>
                        {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Scheduled At</label>
                            <input 
                                type="datetime-local" 
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={data.scheduled_at}
                                onChange={e => setData('scheduled_at', e.target.value)}
                                required
                            />
                            {errors.scheduled_at && <p className="text-xs text-red-500 mt-1">{errors.scheduled_at}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Venue</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="e.g. Room 402 or Online (Zoom)"
                            value={data.venue}
                            onChange={e => setData('venue', e.target.value)}
                        />
                        {errors.venue && <p className="text-xs text-red-500 mt-1">{errors.venue}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Notes</label>
                        <textarea 
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                            placeholder="Add any additional instructions..."
                            rows="2"
                            value={data.notes}
                            onChange={e => setData('notes', e.target.value)}
                        ></textarea>
                        {errors.notes && <p className="text-xs text-red-500 mt-1">{errors.notes}</p>}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Create Schedule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function SchedulesIndex({ schedules, groups }) {
    const { auth } = usePage().props;
    const [showModal, setShowModal] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="Defense Schedules" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <PageHeader 
                    title="Defense Schedules" 
                    subtitle="Manage and view upcoming thesis defense and consultation schedules." 
                />
                {auth.user.role === 'admin' && (
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-sm hover:bg-blue-700 transition"
                    >
                        <Plus size={16} /> New Schedule
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Research Group</th>
                                <th className="px-6 py-4">Defense Type</th>
                                <th className="px-6 py-4">Venue</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {schedules.data.length > 0 ? schedules.data.map((schedule) => (
                                <tr key={schedule.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-900 font-bold">
                                            <Calendar size={14} className="text-blue-500" />
                                            {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(schedule.scheduled_at))}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                                            <Clock size={12} />
                                            {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(schedule.scheduled_at))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-900">{schedule.group?.title}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                            <Users size={12} /> {schedule.group?.adviser?.name || 'No Adviser'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-semibold text-xs capitalize">
                                            {schedule.type.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium flex items-center gap-1">
                                        <MapPin size={14} className="text-slate-400" /> {schedule.venue || 'TBA'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider", 
                                            schedule.status === 'scheduled' ? 'bg-amber-100 text-amber-700' : 
                                            schedule.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        )}>
                                            {schedule.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-1.5 text-slate-400 hover:text-blue-600 transition"><Edit size={16} /></button>
                                            <button className="p-1.5 text-slate-400 hover:text-red-600 transition"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        <Calendar size={32} className="mx-auto text-slate-300 mb-3" />
                                        <p className="font-semibold text-slate-700">No schedules found</p>
                                        <p className="text-xs mt-1">There are no upcoming defenses or consultations.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && <ScheduleModal groups={groups} onClose={() => setShowModal(false)} />}
        </AuthenticatedLayout>
    );
}

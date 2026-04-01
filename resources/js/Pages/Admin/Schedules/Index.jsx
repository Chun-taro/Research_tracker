import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { Calendar, Clock, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SchedulesIndex({ schedules, groups }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title="Defense Schedules" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <PageHeader 
                    title="Defense Schedules" 
                    subtitle="Manage and view upcoming thesis defense and consultation schedules." 
                />
                <button className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-sm hover:bg-blue-700 transition">
                    + New Schedule
                </button>
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

            {/* Pagination placeholder if needed */}
        </AuthenticatedLayout>
    );
}

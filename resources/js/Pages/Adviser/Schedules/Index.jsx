import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { Calendar, Clock, MapPin, Users, ChevronRight, AlertCircle, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdviserSchedules({ schedules }) {
    return (
        <AuthenticatedLayout>
            <Head title="Defense Schedules" />
            <PageHeader title="Group Schedules" subtitle="View and manage upcoming defense sessions and consultations." />

            <div className="grid grid-cols-1 gap-6 mt-8">
                {schedules && schedules.length > 0 ? schedules.map((schedule) => (
                    <div key={schedule.id} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-center gap-8">
                            <div className="h-20 w-20 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex flex-col items-center justify-center shrink-0 border-2 border-white dark:border-gray-800 shadow-md transform group-hover:scale-105 transition-transform">
                                <span className="text-xs font-black uppercase tracking-widest opacity-60">
                                    {new Date(schedule.scheduled_at).toLocaleString('en-US', { month: 'short' })}
                                </span>
                                <span className="text-3xl font-black">
                                    {new Date(schedule.scheduled_at).getDate()}
                                </span>
                            </div>
                            
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-0.5 bg-gray-950 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                        {schedule.type.replace('_', ' ')}
                                    </span>
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider", 
                                        schedule.status === 'scheduled' ? 'bg-amber-100 text-amber-700' : 
                                        schedule.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    )}>
                                        {schedule.status}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                                    {schedule.group?.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 font-medium">
                                    <span className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg"><Clock size={14} className="text-blue-500" /> {new Date(schedule.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                    <span className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg"><MapPin size={14} className="text-purple-500" /> {schedule.venue || 'TBA'}</span>
                                    <span className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg"><Users size={14} className="text-amber-500" /> {schedule.group?.students?.length ?? 0} Students</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href={`/admin/groups/${schedule.group?.id}`} className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-gray-950 dark:text-white rounded-xl font-bold text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all border border-gray-100 dark:border-gray-800 flex items-center gap-2">
                                <Users size={18} /> View Group
                            </Link>
                            <div className="h-12 w-12 bg-gray-950 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center hover:opacity-90 transition-all shadow-lg active:scale-95 cursor-pointer">
                                <ChevronRight size={24} />
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-24 text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 relative overflow-hidden group">
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20"></div>
                         <CalendarIcon size={64} className="mx-auto text-gray-100 dark:text-gray-800 mb-6 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6" />
                         <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Scheduled Events</h4>
                         <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto text-sm leading-relaxed">
                            You don't have any upcoming defense sessions or consultations scheduled for your监督 groups.
                         </p>
                         <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold ring-1 ring-blue-100 dark:ring-blue-900/30">
                             Contact Department Admin for scheduling
                         </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

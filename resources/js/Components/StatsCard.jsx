import { cn } from '@/lib/utils';

export function StatsCard({ label, value, icon: Icon, color = 'blue', trend, className }) {
    const colorMap = {
        blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'text-blue-600 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-800' },
        green: { bg: 'bg-green-50 dark:bg-green-900/20', icon: 'text-green-600 dark:text-green-400', border: 'border-green-100 dark:border-green-800' },
        yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', icon: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-100 dark:border-yellow-800' },
        red: { bg: 'bg-red-50 dark:bg-red-900/20', icon: 'text-red-600 dark:text-red-400', border: 'border-red-100 dark:border-red-800' },
        purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-800' },
        indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', icon: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-800' },
    };
    const c = colorMap[color] ?? colorMap.blue;

    return (
        <div className={cn('bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow', className)}>
            <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0', c.bg, `border ${c.border}`)}>
                <Icon size={22} className={c.icon} />
            </div>
            <div className="min-w-0">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value?.toLocaleString() ?? '—'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{label}</p>
            </div>
        </div>
    );
}

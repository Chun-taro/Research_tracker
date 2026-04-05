import { cn } from '@/lib/utils';

const colorMap = {
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
};

const statusConfig = {
    draft: { label: 'Draft', color: 'gray' },
    submitted: { label: 'Submitted', color: 'blue' },
    under_review: { label: 'Under Review', color: 'yellow' },
    revision_required: { label: 'Revision Required', color: 'orange' },
    approved: { label: 'Approved', color: 'green' },
    rejected: { label: 'Rejected', color: 'red' },
    completed: { label: 'Completed', color: 'purple' },
    active: { label: 'Active', color: 'green' },
    archived: { label: 'Archived', color: 'gray' },
    scheduled: { label: 'Scheduled', color: 'blue' },
    done: { label: 'Done', color: 'green' },
    cancelled: { label: 'Cancelled', color: 'red' },
    basic: { label: 'Basic', color: 'green' },
    standard: { label: 'Standard', color: 'indigo' },
    premium: { label: 'Premium', color: 'orange' },
};

export function StatusBadge({ status, className }) {
    const config = statusConfig[status] ?? { label: status, color: 'gray' };
    return (
        <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            colorMap[config.color],
            className
        )}>
            {config.label}
        </span>
    );
}

export function ColorBadge({ label, color = 'gray', className }) {
    return (
        <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            colorMap[color],
            className
        )}>
            {label}
        </span>
    );
}

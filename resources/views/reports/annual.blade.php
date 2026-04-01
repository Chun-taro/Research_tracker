<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Annual Research Report - {{ $tenant->name }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #1f2937; padding: 30px; }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #3b82f6; margin-bottom: 24px; }
        .header h1 { font-size: 20px; color: #1e3a8a; margin-bottom: 4px; }
        .header p { color: #6b7280; font-size: 10px; }
        .stats-grid { display: table; width: 100%; margin-bottom: 24px; }
        .stat-box { display: table-cell; width: 33%; text-align: center; background: #eff6ff; padding: 14px; }
        .stat-box .value { font-size: 24px; font-weight: bold; color: #1d4ed8; }
        .stat-box .label { font-size: 9px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th { background: #1e3a8a; color: white; padding: 8px 10px; text-align: left; font-size: 9px; text-transform: uppercase; }
        td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; font-size: 10px; }
        tr:nth-child(even) { background: #f9fafb; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 8px; font-weight: 600; }
        .badge-green { background: #dcfce7; color: #166534; }
        .badge-blue { background: #dbeafe; color: #1e40af; }
        .badge-gray { background: #f3f4f6; color: #374151; }
        .badge-purple { background: #f3e8ff; color: #7e22ce; }
        .footer { margin-top: 30px; text-align: center; color: #9ca3af; font-size: 9px; border-top: 1px solid #e5e7eb; padding-top: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Annual Research Report</h1>
        <p>{{ $tenant->name }} &nbsp;|&nbsp; Generated on {{ $generated_at }}</p>
    </div>

    <div class="stats-grid">
        <div class="stat-box"><div class="value">{{ $stats['students'] }}</div><div class="label">Students</div></div>
        <div class="stat-box"><div class="value">{{ $stats['advisers'] }}</div><div class="label">Advisers</div></div>
        <div class="stat-box"><div class="value">{{ $stats['completed'] }}</div><div class="label">Completed Research</div></div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Title</th>
                <th>Adviser</th>
                <th>Students</th>
                <th>Cycle</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($groups as $group)
            <tr>
                <td>{{ $group->title }}</td>
                <td>{{ $group->adviser?->name ?? '—' }}</td>
                <td>{{ $group->students->pluck('name')->join(', ') }}</td>
                <td>{{ $group->cycle?->academic_year }}</td>
                <td>
                    <span class="badge {{ in_array($group->status, ['approved', 'completed']) ? 'badge-green' : (in_array($group->status, ['submitted','under_review']) ? 'badge-blue' : ($group->status === 'rejected' ? 'badge-gray' : 'badge-purple')) }}">
                        {{ str_replace('_', ' ', ucfirst($group->status)) }}
                    </span>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Department-Level Research Tracker &nbsp;|&nbsp; {{ $tenant->name }} &nbsp;|&nbsp; {{ $generated_at }}
    </div>
</body>
</html>

# Submission Versioning & Downgrade Implementation Guide

This document contains the complete technical specification and code snippets required to implement the "Revert" (Downgrade) feature for research submissions.

## 1. Backend Implementation

### Update `App\Http\Controllers\Admin\SubmissionController`

Add the following `revert` method to handle the logic of creating a new version based on a previous one.

```php
/**
 * Revert a submission to a previous version.
 * This creates a NEW version entry that points to the old version's file.
 */
public function revert(Request $request, Submission $submission, SubmissionVersion $version)
{
    // 1. Permission Check
    // Ensure the version belongs to the submission
    if ($version->submission_id !== $submission->id) {
        abort(403, 'Invalid version for this submission.');
    }

    // 2. Authorization (Example: Check if student is in the group or is admin/adviser)
    $user = $request->user();
    // Add your specific authorization logic here...

    // 3. Get the latest version number to increment
    $latestVersionNumber = $submission->versions()->max('version');

    // 4. Create the new "Reverted" version
    SubmissionVersion::create([
        'tenant_id' => $submission->tenant_id,
        'submission_id' => $submission->id,
        'uploaded_by' => $user->id,
        'file_path' => $version->file_path, // Reuse the same file path
        'file_name' => $version->file_name,
        'file_type' => $version->file_type,
        'file_size' => $version->file_size,
        'version' => $latestVersionNumber + 1,
        'change_notes' => "Reverted to Version " . $version->version . " (originally uploaded on " . $version->created_at->toFormattedDateString() . ")",
    ]);

    // 5. Update submission status if needed
    $submission->update(['status' => 'submitted']);

    return back()->with('success', 'Successfully reverted to Version ' . $version->version);
}
```

### Route Registration (`routes/web.php`)

```php
Route::post('/admin/submissions/{submission}/revert/{version}', [SubmissionController::class, 'revert'])
    ->name('admin.submissions.revert');
```

---

## 2. Frontend Implementation

### Add Revert Button to `resources/js/Pages/Student/Submissions/Index.jsx`

Locate the version history loop and add the following logic:

```jsx
import { router } from '@inertiajs/react';

// ... inside the version history table/list ...

{submission.versions.map((ver) => (
    <div key={ver.id} className="flex items-center justify-between p-3 border-b">
        <div className="flex flex-col">
            <span className="font-bold text-sm">Version {ver.version}</span>
            <span className="text-xs text-slate-500">{new Date(ver.created_at).toLocaleString()}</span>
        </div>
        
        {/* Only show Revert button for older versions */}
        {ver.version !== submission.latest_version.version && (
            <button
                onClick={() => {
                    if (confirm(`Are you sure you want to revert to Version ${ver.version}? This will create a new Version ${submission.latest_version.version + 1}.`)) {
                        router.post(`/admin/submissions/${submission.id}/revert/${ver.id}`);
                    }
                }}
                className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-xs font-bold hover:bg-amber-500 hover:text-white transition-all"
            >
                Revert to this
            </button>
        )}
    </div>
))}
```

---

## 3. Storage Consideration

> [!TIP]
> When deleting old versions in the future, ensure you use a **reference counting** check or a **manual scan** to see if any other `SubmissionVersion` records are still pointing to the same `file_path`. Since we are reusing the path, deleting one "reverted" version should not delete the physical file if it's still being used by the original version it was copied from.

---

## 4. Why "Copy-Forward"?

1. **Audit Trail**: You never lose the history of what version was "newest" at any given point in time.
2. **Safety**: It's much harder to accidentally delete valid data.
3. **Transparency**: The `change_notes` clearly state when a reversion happened and who did it.

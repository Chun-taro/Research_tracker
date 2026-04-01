<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\SubmissionVersion;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SubmissionController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $query = Submission::where('tenant_id', $tenantId)->with('group', 'latestVersion', 'reviewer');

        if ($request->filled('status')) { $query->where('status', $request->status); }
        if ($request->filled('type')) { $query->where('type', $request->type); }

        $submissions = $query->latest()->paginate(15)->withQueryString();
        return Inertia::render('Admin/Submissions/Index', ['submissions' => $submissions, 'filters' => $request->only(['status', 'type'])]);
    }

    public function show(Submission $submission)
    {
        $submission->load(['group.students', 'versions.uploader', 'comments.user', 'reviewer']);
        return Inertia::render('Shared/Submissions/Show', compact('submission'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'research_group_id' => 'required|exists:research_groups,id',
            'type' => 'required|in:title_proposal,chapter,final_manuscript,defense_requirements',
            'file' => 'required|file|mimes:pdf,docx,doc,xlsx,zip|max:51200',
            'change_notes' => 'nullable|string',
        ]);

        $tenantId = $request->user()->tenant_id;

        $submission = Submission::firstOrCreate([
            'tenant_id' => $tenantId,
            'research_group_id' => $data['research_group_id'],
            'type' => $data['type'],
        ], ['status' => 'draft']);

        $file = $request->file('file');
        $path = $file->store("submissions/{$tenantId}/{$submission->id}", 'local');

        $version = SubmissionVersion::where('submission_id', $submission->id)->max('version') ?? 0;

        SubmissionVersion::create([
            'tenant_id' => $tenantId,
            'submission_id' => $submission->id,
            'uploaded_by' => $request->user()->id,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'version' => $version + 1,
            'change_notes' => $data['change_notes'] ?? null,
        ]);

        $submission->update(['status' => 'submitted']);

        return back()->with('success', 'Document submitted successfully.');
    }

    public function approve(Request $request, Submission $submission)
    {
        $submission->update(['status' => 'approved', 'reviewed_by' => $request->user()->id, 'reviewed_at' => now(), 'remarks' => $request->remarks]);
        return back()->with('success', 'Submission approved.');
    }

    public function reject(Request $request, Submission $submission)
    {
        $request->validate(['remarks' => 'required|string']);
        $submission->update(['status' => 'rejected', 'reviewed_by' => $request->user()->id, 'reviewed_at' => now(), 'remarks' => $request->remarks]);
        return back()->with('success', 'Submission rejected.');
    }

    public function requestRevision(Request $request, Submission $submission)
    {
        $request->validate(['remarks' => 'required|string']);
        $submission->update(['status' => 'revision_required', 'reviewed_by' => $request->user()->id, 'reviewed_at' => now(), 'remarks' => $request->remarks]);
        return back()->with('success', 'Revision request sent.');
    }

    public function addComment(Request $request, Submission $submission)
    {
        $request->validate(['body' => 'required|string']);
        Comment::create([
            'tenant_id' => $request->user()->tenant_id,
            'commentable_type' => Submission::class,
            'commentable_id' => $submission->id,
            'user_id' => $request->user()->id,
            'body' => $request->body,
        ]);
        return back()->with('success', 'Comment added.');
    }

    public function adviserIndex(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $submissions = Submission::where('tenant_id', $tenantId)
            ->whereHas('group', fn ($q) => $q->where('adviser_id', $request->user()->id))
            ->with('group', 'latestVersion')
            ->latest()->paginate(15);
        return Inertia::render('Adviser/Submissions/Index', compact('submissions'));
    }

    public function studentIndex(Request $request)
    {
        $user = $request->user();
        $group = $user->groupMemberships()->first()?->group;

        $submissions = $group
            ? Submission::where('tenant_id', $user->tenant_id)->where('research_group_id', $group->id)->with('latestVersion', 'versions', 'comments.user')->get()
            : collect();

        return Inertia::render('Student/Submissions/Index', compact('submissions', 'group'));
    }
}

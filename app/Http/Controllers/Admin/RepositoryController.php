<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Repository;
use App\Models\ResearchGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RepositoryController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $query = Repository::where('tenant_id', $tenantId)
            ->with(['group.adviser', 'group.students']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(fn ($q) => $q->where('title', 'like', "%{$search}%")->orWhere('keywords', 'like', "%{$search}%"));
        }
        if ($request->filled('year')) {
            $query->where('academic_year', $request->year);
        }

        $items = $query->orderByDesc('created_at')->paginate(12)->withQueryString();

        return Inertia::render('Shared/Repository/Index', [
            'items' => $items,
            'filters' => $request->only(['search', 'year']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'research_group_id' => 'required|exists:research_groups,id',
            'title' => 'required|string|max:255',
            'abstract' => 'required|string',
            'keywords' => 'nullable|string',
            'academic_year' => 'required|string|max:20',
            'file' => 'required|file|mimes:pdf|max:51200',
        ]);

        $tenantId = $request->user()->tenant_id;
        $file = $request->file('file');
        $path = $file->store("repository/{$tenantId}", 'local');

        Repository::create([
            'tenant_id' => $tenantId,
            'research_group_id' => $data['research_group_id'],
            'title' => $data['title'],
            'abstract' => $data['abstract'],
            'keywords' => $data['keywords'] ?? null,
            'academic_year' => $data['academic_year'],
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
        ]);

        // Mark the group as completed
        ResearchGroup::find($data['research_group_id'])?->update(['status' => 'completed']);

        return back()->with('success', 'Research added to repository.');
    }

    public function download(Repository $repository)
    {
        return Storage::download($repository->file_path, $repository->file_name);
    }
}

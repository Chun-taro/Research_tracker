<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;

class TemplateController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $templates = Template::where('tenant_id', $tenantId)
            ->with('uploader')
            ->when($request->category, fn ($q) => $q->where('category', $request->category))
            ->orderBy('name')
            ->get();

        return Inertia::render('Shared/Templates/Index', compact('templates'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:title_proposal,chapter_format,defense_form,manuscript_format,other',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,docx,doc,xlsx|max:20480',
        ]);

        $tenantId = $request->user()->tenant_id;
        $file = $request->file('file');
        $path = $file->store("templates/{$tenantId}", 'local');

        Template::create([
            'tenant_id' => $tenantId,
            'name' => $data['name'],
            'category' => $data['category'],
            'description' => $data['description'] ?? null,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'uploaded_by' => $request->user()->id,
        ]);

        return back()->with('success', 'Template uploaded.');
    }

    public function destroy(Template $template)
    {
        Storage::delete($template->file_path);
        $template->delete();
        return back()->with('success', 'Template deleted.');
    }

    public function download(Template $template): StreamedResponse
    {
        return Storage::download($template->file_path, $template->file_name);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\ModuleRequest;
use App\Models\Module;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    public function index()
    {
        return response('THIS MODULE INDEX', 200);
    }

    public function create()
    {
        return response()->noContent();
    }

    public function store(ModuleRequest $request)
    {
        Module::create($request->validated());

        return redirect()->route('admin.modules.index');
    }

    public function show(Module $module)
    {
        return response()->json($module);
    }

    public function edit(Module $module)
    {
        return response()->noContent();
    }

    public function update(ModuleRequest $request, Module $module)
    {
        $module->update($request->validated());

        return redirect()->route('admin.modules.index');
    }

    public function destroy(Module $module)
    {
        $module->delete();

        return redirect()->route('admin.modules.index');
    }
}

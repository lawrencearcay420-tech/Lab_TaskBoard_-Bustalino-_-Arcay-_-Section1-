<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $projects = $request->user()->projects()
            ->withCount('tasks')
            ->latest()
            ->get();

        return ProjectResource::collection($projects);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
        ]);

        $project = $request->user()->projects()->create($data);

        return (new ProjectResource($project))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, Project $project)
    {
        $this->authorizeOwner($request, $project);

        return new ProjectResource($project->load(['user', 'tasks']));
    }

    public function update(Request $request, Project $project)
    {
        $this->authorizeOwner($request, $project);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'description' => 'nullable|string',
        ]);

        $project->update($data);

        return new ProjectResource($project);
    }

    public function destroy(Request $request, Project $project)
    {
        $this->authorizeOwner($request, $project);
        $project->delete();

        return response()->noContent();
    }

    private function authorizeOwner(Request $request, Project $project): void
    {
        abort_unless($project->user()->is($request->user()), 403);
    }
}

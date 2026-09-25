<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request, Project $project)
    {
        $this->authorizeOwner($request, $project);

        return TaskResource::collection($project->tasks()->latest()->get());
    }

    public function store(Request $request, Project $project)
    {
        $this->authorizeOwner($request, $project);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'is_done' => 'sometimes|boolean',
            'due_date' => 'nullable|date',
        ]);

        return (new TaskResource($project->tasks()->create($data)))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, Task $task)
    {
        $this->authorizeOwner($request, $task->project);

        return new TaskResource($task->load('project'));
    }

    public function update(Request $request, Task $task)
    {
        $this->authorizeOwner($request, $task->project);

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'is_done' => 'sometimes|boolean',
            'due_date' => 'nullable|date',
        ]);

        $task->update($data);

        return new TaskResource($task->load('project'));
    }

    public function destroy(Request $request, Task $task)
    {
        $this->authorizeOwner($request, $task->project);
        $task->delete();

        return response()->noContent();
    }

    private function authorizeOwner(Request $request, Project $project): void
    {
        abort_unless($project->user()->is($request->user()), 403);
    }
}

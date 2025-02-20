import { tasks } from "../route";

const AUTH_TOKEN = process.env.AUTH_TOKEN;

// Middleware for authentication
function authenticate(request) {
    const authHeader = request.headers.get("authorization");

    // if (!authHeader || authHeader !== `Bearer ${AUTH_TOKEN}`) {
    //     return new Response(JSON.stringify({ error: "Unauthorized" }), {
    //         status: 401,
    //         headers: { "Content-Type": "application/json" },
    //     });
    // }
}

// GET request - Fetch a task by ID
export async function GET(request) {
    const authResponse = authenticate(request);
    if (authResponse) return authResponse;

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id || isNaN(id)) {
        return new Response(JSON.stringify({ error: "ID is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const task = tasks.find((task) => task.id === parseInt(id));

    if (!task) {
        return new Response(JSON.stringify({ error: "Task not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(task), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

// PUT request - Update a task by ID
export async function PUT(request) {
    const authResponse = authenticate(request);
    if (authResponse) return authResponse;

    try {
        const url = new URL(request.url);
        const id = url.pathname.split("/").pop();

        if (!id || isNaN(id)) {
            return new Response(JSON.stringify({ error: "Invalid ID" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));

        if (taskIndex === -1) {
            return new Response(JSON.stringify({ error: "Task not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const updatedData = await request.json();
        tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData };

        return new Response(JSON.stringify(tasks[taskIndex]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid request body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
}

// DELETE request - Delete a task by ID
export async function DELETE(request) {
    const authResponse = authenticate(request);
    if (authResponse) return authResponse;

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id || isNaN(id)) {
        return new Response(JSON.stringify({ error: "Invalid ID" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));

    if (taskIndex === -1) {
        return new Response(JSON.stringify({ error: "Task not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    const deletedTask = tasks.splice(taskIndex, 1);

    return new Response(JSON.stringify({ message: "Task deleted", task: deletedTask[0] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

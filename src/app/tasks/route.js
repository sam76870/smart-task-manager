export const tasks = [
    {
        id: 1,
        title: "Finish Report",
        description: "Complete the monthly financial report for the board meeting.",
        dueDate: "2025-02-10",
        priorityLevel: "High"
    },
    {
        id: 2,
        title: "Prepare Presentation",
        description: "Create a presentation for the upcoming team meeting.",
        dueDate: "2025-02-12",
        priorityLevel: "Medium",
        location:"Gurgaon"
    },
    {
        id: 3,
        title: "Update Website",
        description: "Make necessary updates to the company website based on the latest feedback.",
        dueDate: "2025-02-15",
        priorityLevel: "Low"
    },
    {
        id: 4,
        title: "Client Meeting",
        description: "Prepare for and attend the client meeting to discuss project requirements.",
        dueDate: "2025-02-07",
        priorityLevel: "High"
    }
];
const AUTH_TOKEN = process.env.AUTH_TOKEN;

export async function GET(request) {
    const authHeader = request.headers.get("Authorization");

    // if (!authHeader || authHeader !== `Bearer ${AUTH_TOKEN}`) {
    //     return new Response(JSON.stringify({ error: "Unauthorized" }), {
    //         status: 401,
    //         headers: { "Content-Type": "application/json" },
    //     });
    // }

    return new Response(JSON.stringify(tasks), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function POST(request) {
    const authHeader = request.headers.get("Authorization");

    // if (!authHeader || authHeader !== `Bearer ${AUTH_TOKEN}`) {
    //     return new Response(JSON.stringify({ error: "Unauthorized" }), {
    //         status: 401,
    //         headers: { "Content-Type": "application/json" },
    //     });
    // }

    const task = await request.json();
    const newTask = {
        id: tasks.length + 1,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priorityLevel: task.priorityLevel,
        location: task.location
    };
    tasks.push(newTask);

    return new Response(JSON.stringify(newTask), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
}
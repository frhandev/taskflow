import TaskApiDto from "@/types/Tasks/TaskApiDto";


export async function getTasks() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, { cache: "no-store" });
        const data : TaskApiDto[] = await response.json();
        return data.map((task) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            dueDate: new Date(task.dueDate),
        }));
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
    }
}

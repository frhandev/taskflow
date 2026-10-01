import Priority from "./priority";

type UpdateTaskRequest = {
    title: string;
    description: string;
    priority: Priority;
    dueDate: string;
}

export default UpdateTaskRequest;
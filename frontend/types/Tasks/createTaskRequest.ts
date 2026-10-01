import Priority from "./priority";

type createTaskRequest = {
    title: string;
    description: string;
    priority: Priority;
    dueDate: string;
}

export default createTaskRequest;
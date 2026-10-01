import Priority from "./priority";

type CreateTaskRequest = {
    title: string;
    description: string;
    priority: Priority;
    dueDate: string;
}

export default CreateTaskRequest;
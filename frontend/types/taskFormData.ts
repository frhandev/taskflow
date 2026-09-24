import Priority from "./priority";

type TaskFormData = {
    title: string;
    description: string;
    priority: Priority;
    dueDate: string;
}

export default TaskFormData;
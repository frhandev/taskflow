type Task = {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate: Date;
    createdAt: Date;
}

export default Task;
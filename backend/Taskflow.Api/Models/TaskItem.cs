using TaskFlow.Api.Models.Enums;

using TaskItemStatus = TaskFlow.Api.Models.Enums.TaskStatus;

namespace TaskFlow.Api.Models;

public class TaskItem
{
    public Guid Id {get; set; }
    public string Title {get; set;} = String.Empty;
    public string Description {get; set;} = String.Empty;
    public TaskItemStatus Status {get; set;} = TaskItemStatus.Pending;
    public TaskPriority Priority {get; set;} = TaskPriority.Medium;
    public DateTime DueDate {get; set;}
    public DateTime CreatedAt {get; set;} = DateTime.UtcNow;
}
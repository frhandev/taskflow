namespace TaskFlow.Api.DTOs.Tasks;

using TaskFlow.Api.Models.Enums;
using TaskStatus = TaskFlow.Api.Models.Enums.TaskStatus;

public class TaskDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public TaskStatus Status { get; set; }

    public TaskPriority Priority { get; set; }

    public DateTime DueDate { get; set; }

    public DateTime CreatedAt { get; set; }
}

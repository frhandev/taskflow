
using TaskFlow.Api.Models.Enums;

namespace TaskFlow.Api.DTOs.Tasks;

public class TaskDto
{
    public Guid Id {get; set;}

    public string Title {get; set;} = string.Empty;

    public string Description {get; set;} = string.Empty;

    public Models.Enums.TaskStatus Status {get; set;}

    public TaskPriority Priority {get; set;}
    
    public DateTime DueDate { get; set; }

    public DateTime CreatedAt {get; set;}
}

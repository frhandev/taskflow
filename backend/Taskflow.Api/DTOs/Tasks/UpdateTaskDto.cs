
using System.ComponentModel.DataAnnotations;
using TaskFlow.Api.Models.Enums;

namespace TaskFlow.Api.DTOs.Tasks;

public class UpdateTaskDto
{
    [Required]
    [MinLength(3)]
    [MaxLength(150)]
    public string Title {get; set;} = string.Empty;

    [MaxLength(1000)]
    public string Description {get; set;} = string.Empty;
    public TaskPriority Priority {get; set;}
    
    public DateTime DueDate { get; set; }
}

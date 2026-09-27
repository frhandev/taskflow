
using System.ComponentModel.DataAnnotations;
using TaskFlow.Api.Models.Enums;

namespace TaskFlow.Api.DTOs.Tasks;

public class CreateTaskDto : IValidatableObject
{
    [Required]
    [MinLength(3)]
    [MaxLength(150)]
    public string Title {get; set;} = string.Empty;

    [MaxLength(1000)]
    public string Description {get; set;} = string.Empty;
    public TaskPriority Priority {get; set;}
    public DateTime DueDate { get; set; }

    public IEnumerable<ValidationResult> Validate(
        ValidationContext validationContext)
    {
        if (DueDate.Date < DateTime.UtcNow.Date)
        {
            yield return new ValidationResult(
                "Due date cannot be in the past.",
                new[] { nameof(DueDate) }
            );
        }
    }
}

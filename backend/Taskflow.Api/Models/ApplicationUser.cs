

using Microsoft.AspNetCore.Identity;


namespace TaskFlow.Api.Models;

public class ApplicationUser : IdentityUser
{
    public ICollection<TaskItem> Tasks {get; set;} = new List<TaskItem>();
}
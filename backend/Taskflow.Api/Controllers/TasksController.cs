using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Api.Data;
using TaskFlow.Api.DTOs.Tasks;
using TaskFlow.Api.Models;

namespace TaskFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TasksController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTasks()
    {
        var tasks = await _context.Tasks.ToListAsync();

        return Ok(tasks);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetTaskById(Guid id)
    {
        var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
        {
            return NotFound();
        }

        return Ok(task);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto createTaskDto)
    {
        var NewTaskItem = new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = createTaskDto.Title.Trim(),
            Description = createTaskDto.Description,
            Priority = createTaskDto.Priority,
            DueDate = createTaskDto.DueDate,
            Status = Models.Enums.TaskStatus.Pending,
            CreatedAt = DateTime.UtcNow,
        };

        _context.Tasks.Add(NewTaskItem);

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTaskById), new { id = NewTaskItem.Id }, NewTaskItem);
    }
}
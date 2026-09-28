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

    //Get All Tasks 
    [HttpGet]
    public async Task<IActionResult> GetTasks()
    {
        var tasks = await _context.Tasks.ToListAsync();

        return Ok(tasks);
    }


    //Get One Task By Id
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetTaskById(Guid id)
    {
        var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
        {
            return NotFound();
        }

        return Ok(task.ToDto());
    }

    //Create a Task
    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto createTaskDto)
    {
        var NewTaskItem = new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = createTaskDto.Title.Trim(),
            Description = createTaskDto.Description.Trim(),
            Priority = createTaskDto.Priority,
            DueDate = createTaskDto.DueDate,
            Status = Models.Enums.TaskStatus.Pending,
            CreatedAt = DateTime.UtcNow,
        };

        _context.Tasks.Add(NewTaskItem);

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTaskById), new { id = NewTaskItem.Id }, NewTaskItem.ToDto());
    }

    //Update a Task
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateTask([FromBody] UpdateTaskDto updateTaskDto, Guid id)
    {
        var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
        {
            return NotFound();
        }

        task.Title = updateTaskDto.Title.Trim();
        task.Description = updateTaskDto.Description.Trim();
        task.DueDate = updateTaskDto.DueDate;
        task.Priority = updateTaskDto.Priority;

        await _context.SaveChangesAsync();

        return Ok(task.ToDto());
    }

    //Mark Completed Endpoint
    [HttpPatch("{id:guid}/complete")]
    public async Task<IActionResult> CompleteTask(Guid id)
    {
        var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
        {
            return NotFound();
        }

        task.Status = Models.Enums.TaskStatus.Completed;

        await _context.SaveChangesAsync();
        
        return Ok(task.ToDto());
    }

    //Delete Task
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTask(Guid id)
    {
        var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
        {
            return NotFound();
        }

        _context.Tasks.Remove(task);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Api.Data;
using TaskFlow.Api.DTOs.Tasks;
using TaskFlow.Api.Mappings;
using TaskFlow.Api.Models;

namespace TaskFlow.Api.Controllers;

using TaskStatus = TaskFlow.Api.Models.Enums.TaskStatus;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public TasksController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    //Get All Tasks 
    [HttpGet]
    public async Task<IActionResult> GetTasks()
    {
        var userId = _userManager.GetUserId(User);

        if (userId == null)
        {
            return Unauthorized();
        }

        var tasks = await _context.Tasks
            .AsNoTracking()
            .Where(task => task.UserId == userId)
            .ToListAsync();

        return Ok(tasks.Select(task => task.ToDto()));
    }


    //Get One Task By Id
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetTaskById(Guid id)
    {
        var userId = _userManager.GetUserId(User);

        if (userId == null)
        {
            return Unauthorized();
        }


        var task = await _context.Tasks
            .AsNoTracking()
            .FirstOrDefaultAsync(task => task.Id == id && task.UserId == userId);

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
        var userId = _userManager.GetUserId(User);

        if (userId == null)
        {
            return Unauthorized();
        }

        var newTaskItem = new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = createTaskDto.Title.Trim(),
            Description = createTaskDto.Description.Trim(),
            Priority = createTaskDto.Priority,
            DueDate = createTaskDto.DueDate,
            Status = TaskStatus.Pending,
            CreatedAt = DateTime.UtcNow,

            UserId = userId
        };

        _context.Tasks.Add(newTaskItem);

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTaskById), new { id = newTaskItem.Id }, newTaskItem.ToDto());
    }

    //Update a Task
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateTask([FromBody] UpdateTaskDto updateTaskDto, Guid id)
    {
        var userId = _userManager.GetUserId(User);

        if (userId == null)
        {
            return Unauthorized();
        }

        var task = await _context.Tasks.FirstOrDefaultAsync(task => task.Id == id && task.UserId == userId);

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
        var userId = _userManager.GetUserId(User);

        if (userId == null)
        {
            return Unauthorized();
        }

        var task = await _context.Tasks.FirstOrDefaultAsync(task => task.Id == id && task.UserId == userId);


        if (task == null)
        {
            return NotFound();
        }

        task.Status = TaskStatus.Completed;

        await _context.SaveChangesAsync();

        return Ok(task.ToDto());
    }

    //Delete Task
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTask(Guid id)
    {
        var userId = _userManager.GetUserId(User);

        if (userId == null)
        {
            return Unauthorized();
        }

        var task = await _context.Tasks.FirstOrDefaultAsync(task => task.Id == id && task.UserId == userId);

        if (task == null)
        {
            return NotFound();
        }

        _context.Tasks.Remove(task);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
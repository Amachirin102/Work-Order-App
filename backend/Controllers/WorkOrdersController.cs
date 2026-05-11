using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkOrdersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<WorkOrdersController> _logger;

    public WorkOrdersController(AppDbContext context, ILogger<WorkOrdersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WorkOrder>>> GetAll(
        [FromQuery] string? status,
        [FromQuery] string? priority,
        [FromQuery] string? search)
    {
        var query = _context.WorkOrders.AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(w => w.Status == status);

        if (!string.IsNullOrWhiteSpace(priority))
            query = query.Where(w => w.Priority == priority);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(w =>
                w.Title.Contains(term) ||
                w.CustomerName.Contains(term) ||
                w.WorkOrderNumber.Contains(term) ||
                (w.TechnicianName != null && w.TechnicianName.Contains(term)));
        }

        return Ok(await query.OrderByDescending(w => w.CreatedAt).ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkOrder>> GetById(int id)
    {
        var wo = await _context.WorkOrders.FindAsync(id);
        return wo == null ? NotFound() : Ok(wo);
    }

    [HttpGet("stats")]
    public async Task<ActionResult<object>> GetStats()
    {
        var stats = new
        {
            Total = await _context.WorkOrders.CountAsync(),
            New = await _context.WorkOrders.CountAsync(w => w.Status == "New"),
            InProgress = await _context.WorkOrders.CountAsync(w => w.Status == "In Progress"),
            Completed = await _context.WorkOrders.CountAsync(w => w.Status == "Completed"),
            HighPriority = await _context.WorkOrders.CountAsync(w => w.Priority == "High")
        };
        return Ok(stats);
    }

    [HttpPost]
    public async Task<ActionResult<WorkOrder>> Create(WorkOrder workOrder)
    {
        workOrder.Id = 0;
        workOrder.WorkOrderNumber = $"WO-{DateTime.Now:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}";
        workOrder.CreatedAt = DateTime.UtcNow;
        workOrder.UpdatedAt = DateTime.UtcNow;
        _context.WorkOrders.Add(workOrder);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Created work order {Id} ({Number})", workOrder.Id, workOrder.WorkOrderNumber);
        return CreatedAtAction(nameof(GetById), new { id = workOrder.Id }, workOrder);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, WorkOrder workOrder)
    {
        if (id != workOrder.Id) return BadRequest("URL id and body id do not match.");

        var existing = await _context.WorkOrders.FindAsync(id);
        if (existing == null) return NotFound();

        // Only update mutable fields — preserve CreatedAt and WorkOrderNumber.
        existing.Title = workOrder.Title;
        existing.Description = workOrder.Description;
        existing.Priority = workOrder.Priority;
        existing.Status = workOrder.Status;
        existing.CustomerName = workOrder.CustomerName;
        existing.TechnicianName = workOrder.TechnicianName;
        existing.EstimatedCost = workOrder.EstimatedCost;
        existing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        _logger.LogInformation("Updated work order {Id}", id);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var wo = await _context.WorkOrders.FindAsync(id);
        if (wo == null) return NotFound();
        _context.WorkOrders.Remove(wo);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Deleted work order {Id}", id);
        return NoContent();
    }
}

using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<backend.Data.AppDbContext>(options =>
    options.UseSqlite("Data Source=workorders.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Ensure database is created and seeded — log any failure clearly instead of crashing silently.
using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<backend.Data.AppDbContext>();
        db.Database.EnsureCreated();

        if (!db.WorkOrders.Any())
        {
            db.WorkOrders.AddRange(
                new backend.Models.WorkOrder { WorkOrderNumber = "WO-001", Title = "Fix HVAC System", Description = "AC unit not cooling properly", Priority = "High", Status = "In Progress", CustomerName = "Acme Building", TechnicianName = "John Smith", EstimatedCost = 500 },
                new backend.Models.WorkOrder { WorkOrderNumber = "WO-002", Title = "Replace Light Fixtures", Description = "Lobby lighting needs replacement", Priority = "Medium", Status = "New", CustomerName = "Westfield Plaza", EstimatedCost = 200 },
                new backend.Models.WorkOrder { WorkOrderNumber = "WO-003", Title = "Plumbing Repair", Description = "Leak in basement bathroom", Priority = "High", Status = "New", CustomerName = "Tech Park Center", TechnicianName = "Maria Garcia", EstimatedCost = 350 }
            );
            db.SaveChanges();
            logger.LogInformation("Seeded {Count} initial work orders.", 3);
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Database initialization failed. The API will start but data endpoints may error.");
    }
}

app.UseCors("AllowAngular");

// Simple health-check endpoint — handy for verifying the API is running.
app.MapGet("/health", () => Results.Ok(new { status = "ok", timestamp = DateTime.UtcNow }));

app.MapControllers();

app.Logger.LogInformation("WorkOrders API ready. CORS allows http://localhost:4200. Health: /health");

app.Run();

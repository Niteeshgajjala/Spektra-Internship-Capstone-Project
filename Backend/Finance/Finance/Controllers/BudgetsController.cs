using Finance.DTOs;
using Finance.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Finance.Controllers
{
  [Authorize]
  [ApiController]
  [Route("api/[controller]")]
  [Authorize(Roles = "User")]
  public class BudgetsController : ControllerBase
  {
    private readonly FinanceDbContext _context;

    public BudgetsController(FinanceDbContext context)
    {
      _context = context;
    }

    // GET: api/Budgets/{userId}
    [HttpGet("{userId}")]
    public async Task<ActionResult<IEnumerable<BudgetDTO>>> GetBudgetsByUser(int userId)
    {
      var budgets = await _context.Budgets
          .Where(b => b.UserId == userId)
          .Select(b => new BudgetDTO
          {
            BudgetId = b.BudgetId,
            Amount = b.Amount,
            UserId = b.UserId,
            StartDate = b.StartDate,
            EndDate = b.EndDate
          }).ToListAsync();

      return Ok(budgets);
    }

    // GET: api/Budgets/remaining/{userId}
    [HttpGet("remaining/{userId}")]
    public async Task<ActionResult<RemainingBudgetDto>> GetRemainingBudget(int userId)
    {
      var today = DateTime.Today;

      var remainingBudget = await _context
          .RemainingBudgetDtos
          .FromSqlRaw("EXEC sp_GetRemainingBudget @UserId = {0}, @Today = {1}", userId, today)
          .AsNoTracking()
          .FirstOrDefaultAsync();

      if (remainingBudget == null)
        return NotFound();

      return Ok(remainingBudget);
    }

    // POST: api/Budgets
    [HttpPost]
    public async Task<ActionResult<BudgetDTO>> CreateBudget(BudgetDTO budgetDto)
    {
      var userIdClaim = User.FindFirst("UserId");
      if (userIdClaim == null)
        return Unauthorized("UserId not found in token.");

      int userId = int.Parse(userIdClaim.Value);

      var budget = new Budget
      {
        Amount = budgetDto.Amount,
        UserId = userId, // ⬅ Set from JWT
        StartDate = budgetDto.StartDate,
        EndDate = budgetDto.EndDate
      };

      _context.Budgets.Add(budget);
      await _context.SaveChangesAsync();

      budgetDto.BudgetId = budget.BudgetId;
      budgetDto.UserId = userId;

      return CreatedAtAction(nameof(GetBudgets), new { }, budgetDto);
    }


    // PUT: api/Budgets/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBudget(int id, BudgetDTO budgetDto)
    {
      if (id != budgetDto.BudgetId)
        return BadRequest();

      var budget = await _context.Budgets.FindAsync(id);
      if (budget == null)
        return NotFound();

      budget.Amount = budgetDto.Amount;
      budget.StartDate = budgetDto.StartDate;
      budget.EndDate = budgetDto.EndDate;

      await _context.SaveChangesAsync();

      return NoContent();
    }

    // DELETE: api/Budgets/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBudget(int id)
    {
      var budget = await _context.Budgets.FindAsync(id);
      if (budget == null)
        return NotFound();

      _context.Budgets.Remove(budget);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    // GET: api/Budgets/{userId}
    // GET: api/Budgets
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BudgetDTO>>> GetBudgets()
    {
      var userIdClaim = User.FindFirst("UserId");
      if (userIdClaim == null)
        return Unauthorized("UserId not found in token.");

      int userId = int.Parse(userIdClaim.Value);

      var budgets = await _context.Budgets
          .Where(b => b.UserId == userId)
          .Select(b => new BudgetDTO
          {
            BudgetId = b.BudgetId,
            Amount = b.Amount,
            UserId = b.UserId,
            StartDate = b.StartDate,
            EndDate = b.EndDate
          })
          .ToListAsync();

      return Ok(budgets);
    }
    [HttpGet("user/{userId}/remaining")]
    public async Task<ActionResult<RemainingBudgetDTO>> GetRemainingBudgetQueryParam(int userId, [FromQuery] DateTime today)
    {
      var userIdParam = new SqlParameter("@UserId", userId);
      var todayParam = new SqlParameter("@Today", today);

      var result = await _context.Set<RemainingBudgetDTO>()
          .FromSqlRaw("EXEC sp_GetRemainingBudget @UserId, @Today", userIdParam, todayParam)
          .FirstOrDefaultAsync();

      if (result == null)
        return NotFound("No budget found.");

      return Ok(result);
    }



  }
}

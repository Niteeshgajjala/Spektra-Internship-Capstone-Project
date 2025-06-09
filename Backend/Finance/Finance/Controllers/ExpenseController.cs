using Finance.DTOs;
using Finance.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Finance.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ExpenseController : ControllerBase
    {
        private readonly FinanceDbContext _context;

        public ExpenseController(FinanceDbContext context)
        {
            _context = context;
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<ExpenseDTO>>> GetExpensesByUser(int userId)
        {
            return await _context.Expenses
                .Where(e => e.UserId == userId)
                .Select(e => new ExpenseDTO
                {
                    ExpenseId = e.ExpenseId,
                    PoolId = e.PoolId,
                    UserId = e.UserId,
                    CategoryId = e.CategoryId,
                    Amount = e.Amount,
                    Description = e.Description,
                    Date = e.Date
                }).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<ExpenseDTO>> CreateExpense(ExpenseDTO dto)
        {
            var expense = new Expense
            {
                PoolId = dto.PoolId,
                UserId = dto.UserId,
                CategoryId = dto.CategoryId,
                Amount = dto.Amount,
                Description = dto.Description,
                Date = dto.Date
            };

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            dto.ExpenseId = expense.ExpenseId;
            return CreatedAtAction(nameof(GetExpensesByUser), new { userId = dto.UserId }, dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, ExpenseDTO dto)
        {
            if (id != dto.ExpenseId)
                return BadRequest();

            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
                return NotFound();

            expense.PoolId = dto.PoolId;
            expense.UserId = dto.UserId;
            expense.CategoryId = dto.CategoryId;
            expense.Amount = dto.Amount;
            expense.Description = dto.Description;
            expense.Date = dto.Date;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
                return NotFound();

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("total/{userId}")]
        public async Task<ActionResult<decimal>> GetTotalExpenses(int userId, DateTime startDate, DateTime endDate)
        {
            var userIdParam = new SqlParameter("@UserId", userId);
            var startParam = new SqlParameter("@StartDate", startDate);
            var endParam = new SqlParameter("@EndDate", endDate);

            var result = await _context.Set<TotalExpenseDTO>()
                .FromSqlRaw("EXEC sp_GetTotalUserExpenses @UserId, @StartDate, @EndDate",
                    userIdParam, startParam, endParam)
                .ToListAsync();

            return Ok(result.FirstOrDefault()?.TotalExpenses ?? 0);
        }

        [HttpGet("categorywise/{userId}")]
        public async Task<ActionResult<IEnumerable<CategoryExpenseDTO>>> GetCategoryWiseExpenses(int userId)
        {
            var userIdParam = new SqlParameter("@UserId", userId);

            var result = await _context.CategoryExpenseDTO
                .FromSqlRaw("EXEC sp_GetCategoryWiseExpenses @UserId", userIdParam)
                .ToListAsync();

            return Ok(result);
        }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExpenseDTO>>> GetAllExpenses()
    {
      var expenses = await _context.Expenses
          .Select(e => new ExpenseDTO
          {
            ExpenseId = e.ExpenseId,
            PoolId = e.PoolId,
            UserId = e.UserId,
            CategoryId = e.CategoryId,
            Amount = e.Amount,
            Description = e.Description,         
            Date = e.Date
          }).ToListAsync();

      return Ok(expenses);
    }


  }
}

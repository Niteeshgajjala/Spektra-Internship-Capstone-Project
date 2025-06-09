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
  public class ContributionController : ControllerBase
  {
    private readonly FinanceDbContext _context;

    public ContributionController(FinanceDbContext context)
    {
      _context = context;
    }

    // POST: api/contribution
    // Admin: Add a contribution
    [HttpPost]
    public async Task<IActionResult> AddContribution([FromBody] ContributionDTO dto)
    {
      var contribution = new Contribution
      {
        PoolId = dto.PoolId,
        UserId = dto.UserId,
        Amount = dto.Amount,
        Date = dto.Date
      };

      _context.Contributions.Add(contribution);
      await _context.SaveChangesAsync();

      return Ok(new { message = "Contribution added successfully." });
    }


    [HttpGet("user/{userId}/pool/{poolId}")]
    public async Task<IActionResult> GetContributionAndUsage(int userId, int poolId)
    {
      var userIdParam = new SqlParameter("@UserId", userId);
      var poolIdParam = new SqlParameter("@PoolId", poolId);

      var result = await _context.Database
          .SqlQueryRaw<ContributionUsageDTO>(
              "EXEC sp_GetUserPoolContributionAndUsage @UserId, @PoolId",
              userIdParam, poolIdParam)
          .ToListAsync();

      return Ok(result.FirstOrDefault());
    }

    // GET: api/contribution
    // Fetch all contributions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContributionDTO>>> GetAllContributions()
    {
      var contributions = await _context.Contributions
          .Select(c => new ContributionDTO
          {
            ContributionId = c.ContributionId,
            PoolId = c.PoolId,
            UserId = c.UserId,
            Amount = c.Amount,
            Date = c.Date
          })
          .ToListAsync();

      return Ok(contributions);
    }
    // GET: api/contribution/summary
    [HttpGet("summary")]
    public async Task<ActionResult<IEnumerable<PoolContributionSummaryDTO>>> GetContributionSummary()
    {
      var summary = await _context.Contributions
          .GroupBy(c => c.PoolId)
          .Select(g => new PoolContributionSummaryDTO
          {
            PoolId = g.Key,
            PoolName = _context.BudgetPools
                  .Where(bp => bp.PoolId == g.Key)
                  .Select(bp => bp.Name)
                  .FirstOrDefault(),
            TotalContributions = g.Sum(c => c.Amount)
          })
          .ToListAsync();

      return Ok(summary);
    }

  }
}

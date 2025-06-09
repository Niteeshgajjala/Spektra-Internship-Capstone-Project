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
  public class BudgetPoolController : ControllerBase
  {
    private readonly FinanceDbContext _context;

    public BudgetPoolController(FinanceDbContext context)
    {
      _context = context;
    }

    // POST: Create budget pool
    [HttpPost]
    public async Task<IActionResult> CreateBudgetPool([FromBody] BudgetPoolDTO dto)
    {
      var parameters = new[]
      {
                new SqlParameter("@Name", dto.Name),
                new SqlParameter("@Description", string.IsNullOrEmpty(dto.Description) ? DBNull.Value : dto.Description),
                new SqlParameter("@TotalAmount", dto.TotalAmount)
            };

      await _context.Database.ExecuteSqlRawAsync("EXEC CreateBudgetPool @Name, @Description, @TotalAmount", parameters);
      return Ok(new { message = "Budget pool created successfully." });

    }

    // GET: Get budget pool by ID
    [HttpGet("{id}")]
    public async Task<ActionResult<BudgetPoolDTO>> GetBudgetPoolById(int id)
    {
      var param = new SqlParameter("@PoolId", id);

      var rawResult = await _context.BudgetPools
          .FromSqlRaw("EXEC GetBudgetPoolById @PoolId", param)
          .AsNoTracking()
          .ToListAsync(); // Materialize first

      var result = rawResult
          .Select(bp => new BudgetPoolDTO
          {
            PoolId = bp.PoolId,
            Name = bp.Name,
            Description = bp.Description,
            TotalAmount = bp.TotalAmount
          })
          .FirstOrDefault(); // Now safely apply .FirstOrDefault

      if (result == null)
        return NotFound("Pool not found");

      return Ok(result);
    }


    // GET: Get pool balance info
    [HttpGet("balance/{id}")]
    public async Task<ActionResult<BudgetPoolBalanceDTO>> GetPoolBalance(int id)
    {
      var conn = _context.Database.GetDbConnection();
      await conn.OpenAsync();

      using var cmd = conn.CreateCommand();
      cmd.CommandText = "GetPoolCurrentBalance";
      cmd.CommandType = System.Data.CommandType.StoredProcedure;

      var param = cmd.CreateParameter();
      param.ParameterName = "@PoolId";
      param.Value = id;
      cmd.Parameters.Add(param);

      using var reader = await cmd.ExecuteReaderAsync();
      if (await reader.ReadAsync())
      {
        var dto = new BudgetPoolBalanceDTO
        {
          PoolId = reader.GetInt32(0),
          TotalAmount = reader.GetDecimal(1),
          TotalContributions = reader.GetDecimal(2),
          TotalExpenses = reader.GetDecimal(3),
          CurrentBalance = reader.GetDecimal(4)
        };

        return Ok(dto);
      }

      return NotFound("Balance not found");
    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BudgetPoolDTO>>> GetAllPools()
    {
      var result = await _context.BudgetPools
          .Select(bp => new BudgetPoolDTO
          {
            PoolId = bp.PoolId,
            Name = bp.Name,
            Description = bp.Description,
            TotalAmount = bp.TotalAmount
          })
          .ToListAsync();

      return Ok(result);
    }

  }
}

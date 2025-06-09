using Finance.DTOs;
using Finance.Models;
using Finance.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Finance.Controllers
{
  [Authorize]
  [ApiController]
  [Route("api/[controller]")]
  public class UserController : ControllerBase
  {
    private readonly FinanceDbContext _context;
    private readonly UserJWTToken _jwtService;

    public UserController(FinanceDbContext context, UserJWTToken jwtService)
    {
      _context = context;
      _jwtService = jwtService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
      return await _context.Users.Select(u => new UserDto
      {
        Id = u.Id,
        Name = u.Name,
        Email = u.Email,
        Role = u.Role
      }).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser(UserDto dto)
    {
      var user = new User
      {
        Name = dto.Name,
        Email = dto.Email,
        Role = dto.Role,
        PasswordHash = "hashedpassword" 
      };

      _context.Users.Add(user);
      await _context.SaveChangesAsync();

      dto.Id = user.Id;
      return CreatedAtAction(nameof(GetUsers), new { id = dto.Id }, dto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, UserDto dto)
    {
      var user = await _context.Users.FindAsync(id);
      if (user == null) return NotFound();

      user.Name = dto.Name;
      user.Email = dto.Email;
      user.Role = dto.Role;

      await _context.SaveChangesAsync();
      return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
      var user = await _context.Users.FindAsync(id);
      if (user == null) return NotFound();

      _context.Users.Remove(user);
      await _context.SaveChangesAsync();
      return NoContent();
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDTO>> Login(AuthRequestDTO req)
    {
      var result = await _jwtService.Authenticate(req);
      if (result == null)
      {
        return Unauthorized();
      }
      return result;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
    {
      if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
        return BadRequest("Email and password are required.");

      var exists = await _context.Users.AnyAsync(u => u.Email == dto.Email);
      if (exists)
        return BadRequest("Email already registered.");

      var hasher = new PasswordHasher<User>();
      var user = new User
      {
        Name = dto.Name,
        Email = dto.Email,
        Role = dto.Role
      };

      user.PasswordHash = hasher.HashPassword(user, dto.Password);

      _context.Users.Add(user);
      await _context.SaveChangesAsync();

      return Ok(new { message = "User registered successfully." });
    }
  }
}

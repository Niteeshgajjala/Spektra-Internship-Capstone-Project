  using Finance.DTOs;
  using Finance.Models;
  using Microsoft.AspNetCore.Identity.Data;
  using Microsoft.EntityFrameworkCore;
  using Microsoft.IdentityModel.Tokens;
  using System;
  using System.IdentityModel.Tokens.Jwt;
  using System.Security.Claims;
  using System.Text;

  namespace Finance.Services
  {
      public class UserJWTToken
      {
          public readonly FinanceDbContext cs;
          public readonly IConfiguration ic;
          public UserJWTToken(FinanceDbContext cs, IConfiguration ic)
          {
              this.cs = cs;
              this.ic = ic;
          }
      public async Task<AuthResponseDTO> Authenticate(AuthRequestDTO req)
      {
        if (string.IsNullOrWhiteSpace(req.email) || string.IsNullOrWhiteSpace(req.password))
          return null;

        var userinfo = await cs.Users
            .FirstOrDefaultAsync(s => s.Email.ToLower() == req.email.ToLower());

        if (userinfo == null || userinfo.PasswordHash != req.password)
          return null;

      var claims = new[]
{
    new Claim(JwtRegisteredClaimNames.Sub, userinfo.Email),
    new Claim("UserId", userinfo.Id.ToString()),
    new Claim("Name", userinfo.Name),
    new Claim("Email", userinfo.Email),
    new Claim(ClaimTypes.Role, userinfo.Role) // ✅ This is what enables [Authorize(Roles=...)]
};


      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(ic["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: ic["Jwt:Issuer"],
            audience: ic["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(120),
            signingCredentials: creds);

        return new AuthResponseDTO
        {
          Token = new JwtSecurityTokenHandler().WriteToken(token),
          Role = userinfo.Role
        };
      }

    }
  }

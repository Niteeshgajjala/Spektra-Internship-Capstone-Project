using System.ComponentModel.DataAnnotations;

namespace Finance.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required]
        public string PasswordHash { get; set; }
        [Required]
        public string Role { get; set; } // "User " or "Admin"
        public ICollection<Budget> Budgets { get; set; }
        public ICollection<BudgetPool> BudgetPools { get; set; }
        public ICollection<Contribution> Contributions { get; set; }
        public ICollection<Expense> Expenses { get; set; }
        public ICollection<FraudAlert> FraudAlerts { get; set; }
        public ICollection<Notification> Notifications { get; set; }
        public ICollection<AIInsight> AiInsights { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace Finance.Models
{
    public class FraudAlert
    {
        [Key] 
        public int FraudAlertId { get; set; }
        [Required] 
        public int UserId { get; set; }
        public User User { get; set; }
        [Required] public string AlertMessage { get; set; }
        public bool IsRead { get; set; } = false;
        [Required] public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; }
        [Required] public int ExpenseId { get; set; }
        public Expense Expense { get; set; }
    }
}

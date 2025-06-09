using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Finance.Models
{
    public class Expense
    {
        [Key]
        public int ExpenseId { get; set; }
        [Required]
        [Precision(20,2)]
        public decimal Amount { get; set; }
        public int? PoolId { get; set; }
        public BudgetPool Pool { get; set; }
        [Required]
        public int UserId { get; set; }
        public User User { get; set; }
        [Required]
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public string Description { get; set; }
        [Required]
        public DateTime Date { get; set; }

        
    }
}

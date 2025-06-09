using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Finance.Models
{
    public class Budget
    {
        [Key]
        public int BudgetId { get; set; }
        [Required]

        [Precision(20,2)]
        public decimal Amount { get; set; }
        [Required]
        public int UserId { get; set; }
        public User User { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
    }
}

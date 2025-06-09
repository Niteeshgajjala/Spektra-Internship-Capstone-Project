using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Finance.Models
{
    public class Contribution
    {
        [Key]
        public int ContributionId { get; set; }
        [Required]
        public int PoolId { get; set; }
        public BudgetPool Pool { get; set; }
        [Required]
        public int UserId { get; set; }
        public User User { get; set; }
        [Required]

        [Precision(20,2)]
        public decimal Amount { get; set; }
        [Required]
        public DateTime Date { get; set; }
    }
}

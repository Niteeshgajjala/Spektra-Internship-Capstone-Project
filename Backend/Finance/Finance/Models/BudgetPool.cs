using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Finance.Models
{
    public class BudgetPool
    {
        [Key]
        public int PoolId { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }

        [Required]
        [Precision(20,2)]
        public decimal TotalAmount { get; set; }

    [Required]
        public int UserId { get; set; }

    public ICollection<Contribution> Contributions { get; set; }
        public ICollection<Expense> Expenses { get; set; }

        public ICollection<User> Users { get; set; }

    }
}

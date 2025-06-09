using System.ComponentModel.DataAnnotations;

namespace Finance.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }
        [Required]
        public string CategoryName { get; set; }
        public string Description { get; set; }
        public ICollection<Expense> Expenses { get; set; }
    }
}

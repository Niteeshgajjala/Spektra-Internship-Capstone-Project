using System.ComponentModel.DataAnnotations;

namespace Finance.Models
{
    public class AIInsight
    {
        [Key] 
        public int InsightId { get; set; }
        [Required] 
        public int UserId { get; set; }
        public User User { get; set; }
        [Required] 
        public string InsightMessage { get; set; }
        [Required] 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActionable { get; set; } = false;
        public string CreatedBy { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace Finance.Models
{
    public class Notification
    {
        [Key] public int NotificationId { get; set; }
        [Required] public string Title { get; set; }
        [Required] public string Message { get; set; }
        public bool IsRead { get; set; } = false;
        [Required] public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [Required] public int UserId { get; set; }
        public User User { get; set; }
    }
}

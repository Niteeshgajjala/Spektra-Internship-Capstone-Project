namespace Finance.DTOs
{
    public class ContributionDTO
    {
        public int ContributionId { get; set; }
        public int PoolId { get; set; }
        public int UserId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
    }
}

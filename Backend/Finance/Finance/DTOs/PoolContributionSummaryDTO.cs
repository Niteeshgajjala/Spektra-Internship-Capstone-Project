namespace Finance.DTOs
{
  public class PoolContributionSummaryDTO
  {
    public int PoolId { get; set; }
    public string PoolName { get; set; } = string.Empty;
    public decimal TotalContributions { get; set; }
  }
}

namespace Finance.DTOs
{
    public class BudgetDTO
    {
        public int BudgetId { get; set; }
        public decimal Amount { get; set; }
        public int UserId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

    }
    public class RemainingBudgetDto
    {
        public decimal RemainingBudget { get; set; }
    }
}

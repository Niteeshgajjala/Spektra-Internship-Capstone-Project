namespace Finance.DTOs
{
    public class BudgetPoolDTO
    {
        public int PoolId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal TotalAmount { get; set; }
    }
    public class BudgetPoolBalanceDTO
    {
        public int PoolId { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal TotalContributions { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal CurrentBalance { get; set; }
    }
}

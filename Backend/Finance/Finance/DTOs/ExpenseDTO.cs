namespace Finance.DTOs
{
    public class ExpenseDTO
    {
        public int ExpenseId { get; set; }
        public int? PoolId { get; set; }

        public int UserId { get; set; }
        public int CategoryId { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
    }
}

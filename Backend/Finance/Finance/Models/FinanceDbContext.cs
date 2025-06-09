using Finance.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Finance.Models
{
    public class FinanceDbContext : DbContext
    {
        public FinanceDbContext(DbContextOptions<FinanceDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Budget> Budgets { get; set; }
        public DbSet<BudgetPool> BudgetPools { get; set; }
        public DbSet<Contribution> Contributions { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<FraudAlert> FraudAlerts { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<AIInsight> AiInsights { get; set; }

        public DbSet<RemainingBudgetDto> RemainingBudgetDtos { get; set; }

        public DbSet<CategoryExpenseDTO> CategoryExpenseDTO { get; set; } // add this



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Remove AIInsight configuration
            modelBuilder.Ignore<AIInsight>();

            // User - Budget (1-many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Budgets)
                .WithOne(b => b.User)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User - Expense (1-many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Expenses)
                .WithOne(e => e.User)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User - Contribution (1-many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Contributions)
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User - Notification (1-many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Notifications)
                .WithOne(n => n.User)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User - FraudAlert (1-many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.FraudAlerts)
                .WithOne(fa => fa.User)
                .HasForeignKey(fa => fa.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Many-to-Many User - BudgetPool (Users in Pools)
            modelBuilder.Entity<User>()
                .HasMany(u => u.BudgetPools)
                .WithMany(bp => bp.Users)
                .UsingEntity(j => j.ToTable("UserBudgetPools"));

            // BudgetPool - Contribution (1-many)
            modelBuilder.Entity<BudgetPool>()
                .HasMany(bp => bp.Contributions)
                .WithOne(c => c.Pool)
                .HasForeignKey(c => c.PoolId)
                .OnDelete(DeleteBehavior.Cascade);

            // BudgetPool - Expense (1-many)
            modelBuilder.Entity<BudgetPool>()
                .HasMany(bp => bp.Expenses)
                .WithOne(e => e.Pool)
                .HasForeignKey(e => e.PoolId)
                .OnDelete(DeleteBehavior.SetNull);

            // Expense - Category (many-1)
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Expenses)
                .WithOne(e => e.Category)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // FraudAlert - Expense (many-1)
            modelBuilder.Entity<FraudAlert>()
                .HasOne(fa => fa.Expense)
                .WithMany()
                .HasForeignKey(fa => fa.ExpenseId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure precision for decimal columns
            modelBuilder.Entity<Expense>()
                .Property(e => e.Amount)
                .HasPrecision(20, 2);

            modelBuilder.Entity<Contribution>()
                .Property(c => c.Amount)
                .HasPrecision(20, 2);

            modelBuilder.Entity<Budget>()
                .Property(b => b.Amount)
                .HasPrecision(20, 2);

            modelBuilder.Entity<BudgetPool>()
                .Property(bp => bp.TotalAmount)
                .HasPrecision(20, 2);

            modelBuilder.Entity<RemainingBudgetDto>().HasNoKey();

            modelBuilder.Entity<CategoryExpenseDTO>().HasNoKey();
        }

    }
}

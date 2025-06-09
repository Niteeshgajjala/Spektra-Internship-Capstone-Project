CREATE PROCEDURE sp_GetTotalUserExpenses
    @UserId INT,
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SELECT SUM(Amount) AS TotalExpenses
    FROM Expenses
    WHERE UserId = @UserId AND Date BETWEEN @StartDate AND @EndDate;
END

select * from Users;

CREATE PROCEDURE sp_GetRemainingBudget
    @UserId INT,
    @Today DATE
AS
BEGIN
    SELECT 
        b.Amount - ISNULL(SUM(e.Amount), 0) AS RemainingBudget
    FROM Budgets b
    LEFT JOIN Expenses e ON b.UserId = e.UserId AND e.Date BETWEEN b.StartDate AND b.EndDate
    WHERE b.UserId = @UserId AND @Today BETWEEN b.StartDate AND b.EndDate
    GROUP BY b.Amount;
END

CREATE PROCEDURE sp_GetUserPoolContributionAndUsage
    @UserId INT,
    @PoolId INT
AS
BEGIN
    SELECT 
        ISNULL((SELECT SUM(Amount) FROM Contributions WHERE UserId = @UserId AND PoolId = @PoolId), 0) AS Contribution,
        ISNULL((SELECT SUM(Amount) FROM Expenses WHERE UserId = @UserId AND PoolId = @PoolId), 0) AS Usage
END

CREATE PROCEDURE sp_GetPoolBalance
    @PoolId INT
AS
BEGIN
    SELECT 
        (SELECT ISNULL(SUM(Amount), 0) FROM Contributions WHERE PoolId = @PoolId) -
        (SELECT ISNULL(SUM(Amount), 0) FROM Expenses WHERE PoolId = @PoolId) AS RemainingBalance
END

CREATE PROCEDURE sp_GetCategoryWiseExpenses
    @UserId INT
AS
BEGIN
    SELECT 
        c.CategoryName,
        SUM(e.Amount) AS TotalAmount
    FROM Expenses e
    INNER JOIN Categories c ON e.CategoryId = c.CategoryId
    WHERE e.UserId = @UserId
    GROUP BY c.CategoryName;
END



CREATE PROCEDURE sp_GetHighSpendingUsers
    @Threshold DECIMAL(20,2)
AS
BEGIN
    SELECT UserId, SUM(Amount) AS TotalSpent
    FROM Expenses
    GROUP BY UserId
    HAVING SUM(Amount) > @Threshold;
END

select * from Expenses;

INSERT INTO Expenses (Amount, PoolId, UserId, CategoryId, Description, Date)
VALUES (1500.75, NULL, 1, 1, 'Office supplies', GETUTCDATE());

INSERT INTO Expenses (Amount, PoolId, UserId, CategoryId, Description, Date)
VALUES (150.75, NULL, 1, 1, 'Office supplies', GETUTCDATE());




INSERT INTO Categories (CategoryName, Description)
VALUES ('Office', 'Office related expenses');

SELECT * FROM Categories;

INSERT INTO dbo.BudgetPools (PoolId,Name, Description, TotalAmount, UserId)
VALUES (1,'Travel Fund', 'Shared expenses for team travel', 5000.00, 1);

INSERT INTO dbo.Contributions (PoolId, UserId, Amount, Date)
VALUES 
(1, 1, 200.00, '2025-05-24T10:00:00.0000000');




CREATE PROCEDURE GetPoolCurrentBalance
    @PoolId INT
AS
BEGIN
    SELECT 
        bp.PoolId,
        bp.TotalAmount,
        ISNULL(SUM(c.Amount), 0) AS TotalContributions,
        ISNULL(SUM(e.Amount), 0) AS TotalExpenses,
        (ISNULL(SUM(c.Amount), 0) - ISNULL(SUM(e.Amount), 0)) AS CurrentBalance
    FROM BudgetPools bp
    LEFT JOIN Contributions c ON c.PoolId = bp.PoolId
    LEFT JOIN Expenses e ON e.PoolId = bp.PoolId
    WHERE bp.PoolId = @PoolId
    GROUP BY bp.PoolId, bp.TotalAmount;
END

CREATE PROCEDURE CreateBudgetPool
    @Name NVARCHAR(100),
    @Description NVARCHAR(MAX),
    @TotalAmount DECIMAL(20,2)
AS
BEGIN
    INSERT INTO BudgetPools (Name, Description, TotalAmount)
    VALUES (@Name, @Description, @TotalAmount);
END

CREATE PROCEDURE GetBudgetPoolById
    @PoolId INT
AS
BEGIN
    SELECT PoolId, Name, Description, TotalAmount
    FROM BudgetPools
    WHERE PoolId = @PoolId;
END

select * from Expenses;

select * from Users;

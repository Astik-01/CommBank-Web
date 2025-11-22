using Commbank.Server.Controllers;
using Commbank.Server.Models;
using Commbank.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

public class GoalControllerTests
{
    [Fact]
    public async Task GetGoalsForUser_ReturnsGoals_ForCorrectUser()
    {
        // Arrange
        var userId = "test-user-123";

        var goals = new List<Goal>
        {
            new Goal
            {
                Id = "1",
                Name = "Holiday",
                TargetAmount = 2000,
                CurrentAmount = 500,
                UserId = userId,
                Icon = "🔥"
            },
            new Goal
            {
                Id = "2",
                Name = "Car",
                TargetAmount = 15000,
                CurrentAmount = 3000,
                UserId = userId,
                Icon = "🚗"
            }
        };

        var mockService = new Mock<IGoalService>();
        mockService.Setup(s => s.GetGoalsForUserAsync(userId))
                   .ReturnsAsync(goals);

        var controller = new GoalController(mockService.Object);

        // Act
        var result = await controller.GetGoalsForUser(userId);
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedGoals = Assert.IsType<List<Goal>>(okResult.Value);

        // Assert
        Assert.Equal(2, returnedGoals.Count);
        Assert.All(returnedGoals, g => Assert.Equal(userId, g.UserId));
        Assert.Contains(returnedGoals, g => g.Icon == "🔥");
        Assert.Contains(returnedGoals, g => g.Icon == "🚗");
    }
}

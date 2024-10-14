$(document).ready(function () {
    // Sample player data
    const players = [
        { name: "Aiesh", skill: 4.5 },
        { name: "Zaid", skill: 3.0 },
        { name: "Shoaib", skill: 3.5 },
        { name: "Aman", skill: 5 },
        { name: "Abdullah", skill: 3.5 },
        { name: "Jayant", skill: 5 },
        { name: "Osman", skill: 4.5 },
        { name: "Wisam", skill: 3 },
        { name: "Rohail", skill: 3.5 },
        { name: "Affan", skill: 4 },
        { name: "Hammad", skill: 3 },
        { name: "Imam", skill: 2.5 },
        { name: "Hassan", skill: 3 },
        { name: "Moin", skill: 2 },
        { name: "Saad", skill: 3.5 },
        { name: "Salim", skill: 3.5 },
        { name: "Waeel", skill: 2 },
        { name: "Basil", skill: 2 },
        { name: "Turab", skill: 4 },
        { name: "Anees", skill: 4 },
        { name: "Hussain", skill: 2.5 },
        { name: "Roshan", skill: 4 },
        { name: "Majd", skill: 2 },
        { name: "Yahya", skill: 2 },
        { name: "Mohammed", skill: 2 }

    ];

    // Function to display the players sorted by skill (highest to lowest)
    function renderPlayerList() {
        $('#playerList tbody').empty();
        players.sort((a, b) => b.skill - a.skill); // Sort by skill descending

        players.forEach(player => {
            if ($(".team-players").find("[data-name='" + player.name + "']").length === 0) { // Check if player is not already in a team
                $('#playerList tbody').append(`
                    <tr class="draggable" data-name="${player.name}" data-skill="${player.skill}">
                        <td>${player.name}</td>
                        <td>${player.skill}</td>
                        <td>
                            <button class="add-to-team" data-team="1">Team 1</button>
                            <button class="add-to-team" data-team="2">Team 2</button>
                            <button class="add-to-team" data-team="3">Team 3</button>
                        </td>
                    </tr>
                `);
            }
        });
    }

    // Initial render of the player list
    renderPlayerList();

    // Handle button click to assign players to teams
    $(document).on('click', '.add-to-team', function () {
        let playerRow = $(this).closest('tr');
        let playerName = playerRow.data('name');
        let playerSkill = playerRow.data('skill');
        let teamNum = $(this).data('team');
        let selectedTeam = $("#team" + teamNum + " .team-players");

        // Check if the player is already in a team
        if ($(".team-players").find("[data-name='" + playerName + "']").length) {
            alert(playerName + " is already assigned to a team.");
            return;
        }

        // Add the player to the selected team
        selectedTeam.append(`
            <div class="player" data-name="${playerName}" data-skill="${playerSkill}">
                ${playerName} (${playerSkill})
                <button class="remove-player">Remove</button>
            </div>
        `);

        // Remove the player from the available list
        playerRow.remove();

        // Recalculate the team averages
        updateAverageSkill();
    });

    // Function to remove players from teams
    $(document).on("click", ".remove-player", function () {
        let playerDiv = $(this).closest(".player");
        let playerName = playerDiv.data("name");
        let playerSkill = playerDiv.data("skill");

        // Remove the player from the team
        playerDiv.remove();

        // Return the player to the available list and re-sort it
        renderPlayerList();

        // Recalculate the team averages
        updateAverageSkill();
    });

    // Function to update team average skill
    function updateAverageSkill() {
        for (let i = 1; i <= 3; i++) {
            let teamPlayers = $("#team" + i + " .team-players .player");
            let totalSkill = 0;

            teamPlayers.each(function () {
                totalSkill += parseInt($(this).data("skill"));
            });

            let avgSkill = (teamPlayers.length > 0) ? (totalSkill / teamPlayers.length).toFixed(2) : "0.00";
            $("#team" + i + " .avg-skill").text(avgSkill);
        }

        // Check for skill differences between teams
        checkSkillDifference();
    }

    // Function to check if the average skill difference is too large
    function checkSkillDifference() {
        let team1Avg = parseFloat($("#team1 .avg-skill").text());
        let team2Avg = parseFloat($("#team2 .avg-skill").text());
        let team3Avg = parseFloat($("#team3 .avg-skill").text());

        let skillDifference12 = Math.abs(team1Avg - team2Avg);
        let skillDifference13 = Math.abs(team1Avg - team3Avg);
        let skillDifference23 = Math.abs(team2Avg - team3Avg);

        if (skillDifference12 > 0.3 || skillDifference13 > 0.3 || skillDifference23 > 0.3) {
            $("#warning").removeClass("hidden");
        } else {
            $("#warning").addClass("hidden");
        }
    }

    // Clear all teams and reset the player list
    $("#clearAll").click(function () {
        $(".team-players").empty(); // Clear all teams
        renderPlayerList(); // Reset and re-sort the player list
        updateAverageSkill(); // Update team averages
    });
});

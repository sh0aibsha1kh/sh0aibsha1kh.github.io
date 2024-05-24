$(document).ready(function () {
    let attackingTroops = 1;
    let defendingTroops = 1;

    $('.attack-btn').click(function () {
        attackingTroops = $(this).data('troops');
        $('.attack-btn').removeClass('selected');
        $(this).addClass('selected');
    });

    $('.defend-btn').click(function () {
        defendingTroops = $(this).data('troops');
        $('.defend-btn').removeClass('selected');
        $(this).addClass('selected');
    });

    $('#roll-dice').click(function () {
        const attackerRolls = rollDice(attackingTroops);
        const defenderRolls = rollDice(defendingTroops);

        const modifier = $('input[name="modifier"]:checked').val();
        const fortification = $('#fortification').is(':checked');

        const modifiedDefenderRolls = applyModifiers(defenderRolls, modifier, fortification);

        displayDice('#attacker-dice', attackerRolls, 'attacker-dice');
        displayModifiedDice('#defender-dice', modifiedDefenderRolls, defenderRolls, 'defender-dice');

        const result = compareRolls(attackerRolls, modifiedDefenderRolls);
        $('#outcome').html(result);
    });

    $('#reset').click(function () {
        $('.troop-btn').removeClass('selected');
        $('input[name="modifier"]').prop('checked', false);
        $('#fortification').prop('checked', false);
        $('#attacker-dice').empty();
        $('#defender-dice').empty();
        $('#outcome').empty();
        attackingTroops = 1;
        defendingTroops = 1;
    });

    function rollDice(troops) {
        const rolls = [];
        for (let i = 0; i < troops; i++) {
            rolls.push(Math.floor(Math.random() * 6) + 1);
        }
        return rolls.sort((a, b) => b - a);
    }

    function displayDice(element, rolls, cssClass) {
        $(element).empty();
        rolls.forEach((roll) => {
            $(element).append(`<div class="dice ${cssClass}">${roll}</div>`);
        });
    }

    function displayModifiedDice(element, modifiedRolls, originalRolls, cssClass) {
        $(element).empty();
        modifiedRolls.forEach((roll, index) => {
            let modifierText = '';
            if (modifiedRolls[index] !== originalRolls[index]) {
                modifierText = originalRolls[index];
            }
            $(element).append(`<div class="dice ${cssClass} ${modifierText ? 'modified-dice' : ''}" data-modifier="${modifierText}">${roll}</div>`);
        });
    }

    function applyModifiers(defenderRolls, modifier, fortification) {
        const modifiedRolls = [...defenderRolls];

        if (modifier === 'ammo-shortage' && fortification) {
            // Net effect is 0 for the highest dice
            modifiedRolls[0] = Math.max(1, defenderRolls[0]);
        } else if (modifier === 'ammo-shortage') {
            modifiedRolls[0] = Math.max(1, defenderRolls[0] - 1);
        } else if (modifier === 'bunker' && fortification) {
            // Bunker and Fortification combined
            modifiedRolls[0] = Math.min(6, defenderRolls[0] + 2);
        } else if (modifier === 'bunker') {
            modifiedRolls[0] = Math.min(6, defenderRolls[0] + 1);
        }

        if (fortification) {
            for (let i = 0; i < Math.min(2, modifiedRolls.length); i++) {
                if (!(modifier === 'ammo-shortage' && i === 0)) {
                    if (modifier === 'bunker' && i === 0) {
                        // Skip adding +1 since +2 has already been applied for bunker + fortification
                        continue;
                    }
                    modifiedRolls[i] = Math.min(6, defenderRolls[i] + 1);
                }
            }
        }

        return modifiedRolls;
    }

    function compareRolls(attacker, defender) {
        let result = "";
        for (let i = 0; i < Math.min(attacker.length, defender.length); i++) {
            if (attacker[i] > defender[i]) {
                result += "Attacker wins<br>";
            } else {
                result += "Defender wins<br>";
            }
        }
        return result;
    }
});

const fs = require('fs');  // File system module for reading files
const readline = require('readline'); // Module for reading user input

// Interface to read user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//User input variables
let fitnessGoal, fitnessLevel, MedicalHistory;

rl.question('Select your Fitness Goal:\n1. Weight Loss\n2. Muscle Building\n3. Improve Flexibility\n4. Improve Cardiovascular Health\n5. Stress Relief\n', (answer1) => {
    fitnessGoal = getFitnessGoal(parseInt(answer1));

    rl.question('Select your Current Fitness Level:\n1. Beginner\n2. Intermediate\n3. Advanced\n', (answer2) => {
        fitnessLevel = getFitnessLevel(parseInt(answer2));

        rl.question('Do you have any medical conditions or surgeries?\n1. Yes\n2. No\n', (answer3) => {
            MedicalHistory = CheckMedicalHistory(parseInt(answer3));

            // Read the workout categories from the JSON file
            fs.readFile('WorkoutCategories.json', 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading file:', err);
                    return;
                }

                const workoutCategories = JSON.parse(data);
                let suitableWorkout = findSuitableWorkout(workoutCategories, fitnessGoal, fitnessLevel, MedicalHistory);

                console.log('Your suitable workout:');
                console.log(suitableWorkout);

                rl.close();
            });
        });
    });
});

function getFitnessGoal(choice) {
    switch (choice) {
        case 1:
            return 'Weight Loss';
        case 2:
            return 'Muscle Building';
        case 3:
            return 'Improve Flexibility';
        case 4:
            return 'Improve Cardiovascular Health';
        case 5:
            return 'Stress Relief';
        default:
            return 'Unknown';
    }
}

function getFitnessLevel(choice) {
    switch (choice) {
        case 1:
            return 'Beginner';
        case 2:
            return 'Intermediate';
        case 3:
            return 'Advanced';
        default:
            return 'Unknown';
    }
}

function CheckMedicalHistory (choice){
    
}

function findSuitableWorkout(workoutCategories, goal, level, MedicalHistory) {
    // Iterate through each workout category in the workoutCategories object
    for (let category in workoutCategories) {
        // Check if the current workout category matches the user's fitness goal, fitness level, and medical condition
        if (
            workoutCategories[category].goal === goal &&
            // Check if the fitness level is the same or higher
            ((workoutCategories[category].level === level) ||
            (workoutCategories[category].level === 'Beginner' && (level === 'Intermediate' || level === 'Advanced')) ||
            (workoutCategories[category].level === 'Intermediate' && level === 'Advanced') ||
            (workoutCategories[category].level === 'Advanced' && level === 'Advanced')) &&

            (!MedicalHistory || MedicalHistory === 2)
        ) {
            const workoutDetails = workoutCategories[category];
            return `
                Category: ${category}
                Goal: ${workoutDetails.goal}
                Duration: ${workoutDetails.duration}
                Level: ${workoutDetails.level}
            `;
        }
    }
    return 'No suitable workout found.';
}
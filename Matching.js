const fs = require('fs'); // File system module for reading files
const readline = require('readline'); // Module for reading user input

// Interface to read user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//User input variables
let fitnessGoal, fitnessLevel, MedicalHistory;

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

function getMedicalCondition(choice) {
    switch (choice) {
        case 1:
            return 'Heart Disease';
        case 2:
            return 'Asthma';
        case 3:
            return 'Diabetes';
        default:
            return 'Unknown';
    }
}

function getSurgery(choice) {
    switch (choice) {
        case 1:
            return 'Knee Surgery';
        case 2:
            return 'Appendectomy';
        case 3:
            return 'Cataract Surgery';
        default:
            return 'Unknown';
    }
}

function CheckMedicalHistory(choice) {
    return new Promise((resolve, reject) => {
        if (choice === 1) {
            let medicalHistory = { conditions: [], surgeries: [] };

            function askForConditionOrSurgery() {
                rl.question('Do you want to add a medical condition or a surgery?\n1. Medical Condition\n2. Surgery\n3. Done\n', (answer) => {
                    const selection = parseInt(answer);
                    if (selection === 1) {
                        // Prompt user to select a medical condition
                        rl.question('Select a medical condition:\n1. Heart Disease\n2. Asthma\n3. Diabetes\n', (conditionAnswer) => {
                            medicalHistory.conditions.push(getMedicalCondition(parseInt(conditionAnswer)));
                            askForConditionOrSurgery(); // Ask for more conditions or surgeries
                        });
                    } else if (selection === 2) {
                        // Prompt user to select a surgery
                        rl.question('Select a surgery:\n1. Knee Surgery\n2. Appendectomy\n3. Cataract Surgery\n', (surgeryAnswer) => {
                            medicalHistory.surgeries.push(getSurgery(parseInt(surgeryAnswer)));
                            askForConditionOrSurgery(); // Ask for more conditions or surgeries
                        });
                    } else if (selection === 3) {
                        // User is done adding conditions/surgeries, resolve with medical history
                        resolve(medicalHistory);
                    } else {
                        // Invalid choice, prompt user to choose again
                        console.log('Invalid choice. Please select 1 for Medical Condition, 2 for Surgery, or 3 for Done.');
                        askForConditionOrSurgery();
                    }
                });
            }

            // Initiate the process of adding conditions or surgeries
            askForConditionOrSurgery();
        } else {
            // User has no medical history, resolve with null
            resolve(null);
        }
    });
}

function findSuitableWorkout(workoutCategories, goal, level, MedicalHistory) {
    // Iterate through each workout category in the workoutCategories object
    for (let category in workoutCategories) {
        // Check if the current workout category matches the user's fitness goal, fitness level
        if (
            workoutCategories[category].goal === goal &&
            // Check if the fitness level is the same or higher
            ((workoutCategories[category].level === level) ||
            (workoutCategories[category].level === 'Beginner' && (level === 'Intermediate' || level === 'Advanced')) ||
            (workoutCategories[category].level === 'Intermediate' && level === 'Advanced') ||
            (workoutCategories[category].level === 'Advanced' && level === 'Advanced')
            //(!MedicalHistory || MedicalHistory.surgery === 2)
            )
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

rl.question('Select your Fitness Goal:\n1. Weight Loss\n2. Muscle Building\n3. Improve Flexibility\n4. Improve Cardiovascular Health\n5. Stress Relief\n', (answer1) => {
    fitnessGoal = getFitnessGoal(parseInt(answer1));

    rl.question('Select your Current Fitness Level:\n1. Beginner\n2. Intermediate\n3. Advanced\n', (answer2) => {
        fitnessLevel = getFitnessLevel(parseInt(answer2));

        rl.question('Do you have any medical conditions or surgeries?\n1. Yes\n2. No\n', (answer3) => {
            CheckMedicalHistory(parseInt(answer3)).then((medicalHistory) => {
                MedicalHistory = medicalHistory;
                console.log('Your medical history:');
                console.log(MedicalHistory);


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
});
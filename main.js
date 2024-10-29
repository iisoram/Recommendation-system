// Importing functions from other files
const readlineSync = require('readline-sync');
const { fitnessPlans, calculateExerciseTime } = require('./fitnessFunctions');

// User input
const fitnessGoals = ['Weight Loss', 'Muscle Building', 'Improve Flexibility', 'Improve Cardiovascular Health', 'Stress Relief'];
const fitnessLevels = ['Beginner', 'Intermediate', 'Advanced'];

const fitnessGoalIndex = readlineSync.keyInSelect(fitnessGoals, 'Select your fitness goal:');
const currentFitnessLevelIndex = readlineSync.keyInSelect(fitnessLevels, 'Select your current fitness level:');

const fitnessGoal = fitnessGoals[fitnessGoalIndex];
const currentFitnessLevel = currentFitnessLevelIndex.toString();

// Recommended fitness plans based on user input
const recommendedPlans = Object.keys(fitnessPlans).filter(plan => fitnessPlans[plan].healthGoal === fitnessGoal);

// Calculate required weekly exercise time for each recommended plan
const requiredExerciseTime = recommendedPlans.map(plan => {
    return {
        plan: plan,
        totalDuration: fitnessPlans[plan].duration + calculateExerciseTime(currentFitnessLevel)
    };
});


// Display the suggested fitness plans and required weekly exercise time
console.log('\nSuggested Fitness Plans:');
recommendedPlans.forEach(plan => {
    console.log(`- ${plan} (${fitnessPlans[plan].healthGoal})`);
});

console.log('\nRequired Weekly Exercise Time:');
requiredExerciseTime.forEach(item => {
    console.log(`- ${item.plan}: ${item.totalDuration} minutes`);
});

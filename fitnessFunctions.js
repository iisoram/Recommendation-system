// Fitness plan categories
const fitnessPlans = {
    cardio: {
        duration: 150,
        healthGoal: 'Weight Loss'
    },
    strengthTraining: {
        duration: 120,
        healthGoal: 'Muscle Building'
    },
    flexibility: {
        duration: 90,
        healthGoal: 'Improve Flexibility'
    },
    hiit: {
        duration: 90,
        healthGoal: 'Improve Cardiovascular Health'
    },
    yoga: {
        duration: 120,
        healthGoal: 'Stress Relief'
    }
};

// Calculate required exercise time based on fitness level
function calculateExerciseTime(currentFitnessLevel) {
    let additionalTime = 0;

    switch (currentFitnessLevel) {
        case '0':
            additionalTime = 30; // Beginner
            break;
        case '1':
            additionalTime = 20; // Intermediate
            break;
        case '2':
            additionalTime = 10; // Advanced
            break;
        default:
            additionalTime = 0;
    }

    return additionalTime;
}

module.exports = { fitnessPlans, calculateExerciseTime };
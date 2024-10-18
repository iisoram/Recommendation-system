const fs = require('fs');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const MAX_ATTEMPTS = 10;
let attempts = 0;

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function checkUser(username, password) {
    try {
        const usersData = JSON.parse(fs.readFileSync('users.json', 'utf8'));
        const hashedPassword = hashPassword(password);

        const user = usersData.find(user => user.username === username && user.password === hashedPassword);
        return user;
    } catch (error) {
        console.error('Error reading user data or user not found.');
        return null;
    }
}

function signIn() {
    rl.question('Enter your username: ', (username) => {
        rl.question('Enter your password: ', (password) => {
            const user = checkUser(username, password);

            if (user) {
                console.log('Sign in successful!');
            } else {
                attempts++;
                if (attempts < MAX_ATTEMPTS) {
                    console.log('Invalid username or password. Please try again.');
                    signIn(); // Retry sign-in
                } else {
                    console.log('Exceeded maximum login attempts. Please try again later.');
                    rl.close();
                }
            }
        });
    });
}

// sign-in
signIn();
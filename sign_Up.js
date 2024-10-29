const fs = require('fs');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const MAX_ATTEMPTS = 10;
const BLOCK_DURATION = 60; // 60 seconds

let attempts = 0;
let blocked = false;
let nextUserId = 1000; // user Id

if (fs.existsSync('userId.txt')) {
    const data = fs.readFileSync('userId.txt', 'utf8');
    nextUserId = parseInt(data, 10);
}

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function validateUsername(username) {
    return /^[a-zA-Z0-9]{3,20}$/.test(username);
}

function validatePassword(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password);
}

function retrySignUp() {
    attempts = 0;
    signUp();
}

function signUp() {
    if (blocked) {
        console.log(`Too many unsuccessful attempts. Please try again after ${BLOCK_DURATION} seconds.`);
        rl.close();
        return;
    }

    rl.question('Enter your username: ', (username) => {
        if (!validateUsername(username)) {
            console.error('Invalid username format. Please make sure your username meets the requirements.');
            attempts++;
            if (attempts >= MAX_ATTEMPTS) {
                console.log('Exceeded maximum attempts. Please try again later.');
                rl.close();
                return;
            }
            retrySignUp();
            return;
        }

        rl.question('Enter your password: ', (password) => {
            if (!validatePassword(password)) {
                console.error('Invalid password format. Please make sure your password meets the requirements.');
                attempts++;
                if (attempts >= MAX_ATTEMPTS) {
                    console.log('Exceeded maximum attempts. Please try again later.');
                    rl.close();
                    return;
                }
                retrySignUp();
                return;
            }

            let usersData = [];

            try {
                usersData = JSON.parse(fs.readFileSync('users.json', 'utf8'));
            } catch (error) {
                // If the file doesn't exist or is empty, usersData will remain an empty array
            }

            const hashedPassword = hashPassword(password);

            if (usersData.find(user => user.username === username)) {
                console.error('Username already exists. Please choose a different one.');
                rl.close();
                return;
            }

            const userId = nextUserId++;

            usersData.push({ id: userId, username, password: hashedPassword });
            fs.writeFileSync('userId.txt', nextUserId.toString(), 'utf8') 
            
            fs.writeFileSync('users.json', JSON.stringify(usersData, null, 2), 'utf8');

            console.log('Sign-up successful! User data saved.');
            rl.close();
        });
    });
}

rl.on('close', () => {
    if (!rl.closed) {
        if (attempts >= MAX_ATTEMPTS) {
            blocked = true;
            setTimeout(() => {
                blocked = false;
                console.log('You can now attempt to sign up again.');
                retrySignUp();
            }, BLOCK_DURATION * 1000);
        } else {
            signUp();
        }
    }
});

// sign-up
signUp();
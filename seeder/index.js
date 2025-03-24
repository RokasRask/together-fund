import { users } from './users.js';
import { ideas } from './ideas.js';
import { donations } from './donations.js';
import mysql from 'mysql';
import { faker } from '@faker-js/faker';
import md5 from 'md5';

// Atsitiktinio skaičiaus generavimo funkcija
function rand(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

// Papildome vartotojus papildomais duomenimis
users.forEach(user => {
    user.password = md5('123'); // Nustatome slaptažodį (užkoduotas "123")
    user.email = faker.internet.email(); // Sugeneruojame atsitiktinį el. paštą
});

// Prisijungimas prie MySQL duomenų bazės
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Įveskite savo MySQL slaptažodį
    database: 'together_fund' // Duomenų bazės pavadinimas
});

con.connect(err => {
    if (err) throw err;
    console.log('Prisijungta prie duomenų bazės!');

    // Ištriname esamas lenteles, jei jos yra
    const dropTables = [
        'DROP TABLE IF EXISTS donations;',
        'DROP TABLE IF EXISTS sessions;',
        'DROP TABLE IF EXISTS ideas;',
        'DROP TABLE IF EXISTS users;'
    ];

    dropTables.forEach((query, index) => {
        con.query(query, (err) => {
            if (err) throw err;
            console.log(`Lentelė ${index + 1} ištrinta!`);
        });
    });

    // Sukuriame lenteles viena po kitos
    const createTables = [
        `
        CREATE TABLE users (
            id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            password CHAR(32) NOT NULL,
            role ENUM('user', 'admin') NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        `,
        `
        CREATE TABLE ideas (
            id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            image VARCHAR(255) NOT NULL,
            goal DECIMAL(10, 2) NOT NULL,
            raised DECIMAL(10, 2) NOT NULL DEFAULT 0,
            createdBy INT(10) UNSIGNED NOT NULL,
            status ENUM('active', 'inactive', 'completed') NOT NULL DEFAULT 'active',
            FOREIGN KEY (createdBy) REFERENCES users(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        `,
        `
        CREATE TABLE donations (
            id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            idea_id INT(10) UNSIGNED NOT NULL,
            donor_name VARCHAR(100) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            FOREIGN KEY (idea_id) REFERENCES ideas(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        `,
        `
        CREATE TABLE sessions (
            id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            user_id INT(10) UNSIGNED NOT NULL,
            token CHAR(32) NOT NULL,
            expires DATETIME NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        `
    ];

    // Vykdome kiekvieną CREATE TABLE užklausą atskirai
    createTables.forEach((query, index) => {
        con.query(query, (err) => {
            if (err) throw err;
            console.log(`Lentelė ${index + 1} sukurta!`);
        });
    });

    // Įterpiame vartotojų duomenis
    const insertUsers = `
        INSERT INTO users (id, name, email, password, role)
        VALUES ?`;
    const userValues = users.map(user => [user.id, user.name, user.email, user.password, user.role]);

    con.query(insertUsers, [userValues], (err) => {
        if (err) throw err;
        console.log('Vartotojai įterpti!');

        // Įterpiame idėjų duomenis
        const insertIdeas = `
            INSERT INTO ideas (id, title, description, image, goal, raised, createdBy, status)
            VALUES ?`;
        const ideaValues = ideas.map(idea => [
            idea.id,
            idea.title,
            idea.description,
            idea.image,
            idea.goal,
            idea.raised,
            idea.createdBy,
            idea.status
        ]);

        con.query(insertIdeas, [ideaValues], (err) => {
            if (err) throw err;
            console.log('Idėjos įterptos!');

            // Įterpiame aukų duomenis
            const insertDonations = `
                INSERT INTO donations (id, idea_id, donor_name, amount)
                VALUES ?`;
            const donationValues = donations.map(donation => [
                donation.id,
                donation.idea_id,
                donation.donor_name,
                donation.amount
            ]);

            con.query(insertDonations, [donationValues], (err) => {
                if (err) throw err;
                console.log('Aukos įterptos!');

                // Atnaujiname "raised" reikšmes pagal aukų sumas
                const updateRaisedQuery = `
                    UPDATE ideas AS i
                    SET i.raised = (
                        SELECT COALESCE(SUM(d.amount), 0)
                        FROM donations AS d
                        WHERE d.idea_id = i.id
                    )
                `;
                con.query(updateRaisedQuery, (err) => {
                    if (err) throw err;
                    console.log('"Raised" reikšmės atnaujintos pagal aukų sumas!');

                    // Atsijungiame nuo duomenų bazės
                    con.end(err => {
                        if (err) throw err;
                        console.log('Atsijungta nuo duomenų bazės!');
                    });
                });
            });
        });
    });
});
import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import cors from 'cors';
import md5 from 'md5';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, '../public')));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'together_fund'
});

con.connect(err => {
    if (err) throw err;
    console.log('Prisijungta prie duomenų bazės!');
});

const url = '/api/v1/';

app.get(url + 'auth', (req, res) => {
    setTimeout(() => {
        const token = req.cookies.token || 'no-token';

        const sql = `
            SELECT u.id, u.name, u.email, u.role
            FROM users AS u
            INNER JOIN sessions AS s
            ON u.id = s.user_id
            WHERE s.token = ?
            AND s.expires > NOW()
        `;

        con.query(sql, [token], (err, result) => {
            if (err) {
                console.error('Klaida gaunant vartotoją:', err);
                return res.status(500).json({ error: 'Klaida gaunant vartotoją' });
            }

            if (result.length === 0) {
                return res.status(200).json({
                    id: 0,
                    name: 'Guest',
                    email: '',
                    role: 'guest'
                });
            }

            res.json(result[0]);
        });
    }, 2000);
});

app.post(url + 'login', (req, res) => {
    const { name, password } = req.body;

    const sql = `
        SELECT id, name, email, role
        FROM users
        WHERE name = ?
        AND password = ?
    `;

    con.query(sql, [name, md5(password)], (err, result) => {
        if (err) {
            console.error('Klaida prisijungiant:', err);
            return res.status(500).json({ error: 'Klaida prisijungiant' });
        }

        if (result.length === 0) {
            const checkUserQuery = 'SELECT * FROM users WHERE name = ?';
            con.query(checkUserQuery, [name], (err, userResult) => {
                if (err) {
                    console.error('Klaida tikrinant vartotoją:', err);
                    return res.status(500).json({ error: 'Klaida tikrinant vartotoją' });
                }

                if (userResult.length === 0) {
                    return res.status(404).json({ error: 'Vartotojas nerastas' });
                } else {
                    return res.status(401).json({ error: 'Neteisingas slaptažodis' });
                }
            });
        } else {
            const user = result[0];

            const token = md5(uuidv4());
            res.cookie('token', token, { httpOnly: true });

            const insertSessionQuery = `
                INSERT INTO sessions (token, user_id, expires)
                VALUES (?, ?, ?)
            `;
            const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // Sesija galioja 24 valandas
            con.query(insertSessionQuery, [token, user.id, expires], (err) => {
                if (err) {
                    console.error('Klaida įrašant sesiją:', err);
                    return res.status(500).json({ error: 'Klaida įrašant sesiją' });
                }

                res.json({
                    success: true,
                    user: user
                });
            });
        }
    });
});

app.post(url + 'logout', (req, res) => {

    setTimeout(_ => {

        const token = req.cookies.token || 'no-token';

        const sql = `
        DELETE FROM sessions
        WHERE token = ?
    `;

        con.query(sql, [token], (err) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: err.message });
                return;
            }

            res.clearCookie('token');
            res.json({
                name: 'Guest',
                role: 'guest',
                id: 0,
                email: ''
            });
        });

    }, 2000);

});

app.get(url + 'ideas', (req, res) => {
    setTimeout(() => {
        const query = `
            SELECT i.id, i.title, i.description, i.image, i.goal, i.raised, i.createdBy, i.status, u.name AS creatorName
            FROM ideas AS i
            INNER JOIN users AS u
            ON i.createdBy = u.id
            WHERE i.status IN ('active', 'completed')
        `;
        con.query(query, (err, results) => {
            if (err) {
                console.error('Klaida gaunant idėjas:', err);
                return res.status(500).json({ error: 'Klaida gaunant idėjas' });
            }
            res.json(results);
        });
    }, 2000);
});

app.get(url + 'donations/:ideaId', (req, res) => {
    const ideaId = req.params.ideaId;
    const query = 'SELECT * FROM donations WHERE idea_id = ?';
    con.query(query, [ideaId], (err, results) => {
        if (err) {
            console.error('Klaida gaunant aukas:', err);
            return res.status(500).json({ error: 'Klaida gaunant aukas' });
        }
        res.json(results);
    });
});

app.get(url + 'ideas/:id', (req, res) => {
    const ideaId = req.params.id;
    const query = `
        SELECT i.id, i.title, i.description, i.image, i.goal, i.raised, i.createdBy, i.status, u.name AS creatorName
        FROM ideas AS i
        INNER JOIN users AS u
        ON i.createdBy = u.id
        WHERE i.id = ?
    `;
    con.query(query, [ideaId], (err, results) => {
        if (err) {
            console.error('Klaida gaunant idėją:', err);
            return res.status(500).json({ error: 'Klaida gaunant idėją' });
        }

        const idea = results[0];

        const donationsQuery = 'SELECT SUM(amount) AS totalDonations FROM donations WHERE idea_id = ?';
        con.query(donationsQuery, [ideaId], (err, donationsResults) => {
            if (err) {
                console.error('Klaida gaunant aukas:', err);
                return res.status(500).json({ error: 'Klaida gaunant aukas' });
            }

            const totalDonations = donationsResults[0].totalDonations || 0;
            idea.raised = totalDonations;

            res.json(idea);
        });
    });
});

app.post(url + 'register', (req, res) => {
    const { name, email, password } = req.body;

    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    con.query(checkUserQuery, [email], (err, result) => {
        if (err) {
            console.error('Klaida tikrinant vartotoją:', err);
            return res.status(500).json({ error: 'Klaida tikrinant vartotoją' });
        }

        if (result.length > 0) {
            return res.status(400).json({ error: 'Vartotojas su tokiu el. paštu jau egzistuoja' });
        }

        const insertUserQuery = `
            INSERT INTO users (name, email, password, role)
            VALUES (?, ?, ?, 'user')
        `;
        const hashedPassword = md5(password); // Užkodavame slaptažodį
        con.query(insertUserQuery, [name, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Klaida registruojant vartotoją:', err);
                return res.status(500).json({ error: 'Klaida registruojant vartotoją' });
            }

            res.json({ success: true });
        });
    });
});

app.post(url + 'ideas', (req, res) => {
    const { title, description, image, goal, createdBy } = req.body;

    if (!title || !description || !goal || !createdBy) {
        return res.status(400).json({ error: 'Prašome užpildyti visus laukelius' });
    }

    let imageUrl = '';
    if (image) {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const imageName = `idea_${Date.now()}.png`;
        const imagePath = path.join(__dirname, '../public/UserImages', imageName);

        fs.writeFile(imagePath, base64Data, 'base64', (err) => {
            if (err) {
                console.error('Klaida išsaugant nuotrauką:', err);
                return res.status(500).json({ error: 'Klaida išsaugant nuotrauką' });
            }
        });

        imageUrl = `/UserImages/${imageName}`;
    }

    const insertIdeaQuery = `
        INSERT INTO ideas (title, description, image, goal, createdBy, status)
        VALUES (?, ?, ?, ?, ?, 'inactive')
    `;
    con.query(insertIdeaQuery, [title, description, imageUrl, goal, createdBy], (err, result) => {
        if (err) {
            console.error('Klaida įrašant idėją:', err);
            return res.status(500).json({ error: 'Klaida įrašant idėją' });
        }

        res.json({
            success: true,
            message: 'Idėja sėkmingai sukurta'
        });
    });
});

app.get(url + 'unapproved_ideas', (req, res) => {
    setTimeout(() => {
        const query = `
            SELECT i.id, i.title, i.description, i.image, i.goal, i.raised, i.createdBy, i.status, u.name AS creatorName
            FROM ideas AS i
            INNER JOIN users AS u
            ON i.createdBy = u.id
            WHERE i.status = 'inactive' -- Tik nepatvirtintos idėjos
        `;
        con.query(query, (err, results) => {
            if (err) {
                console.error('Klaida gaunant nepatvirtintas idėjas:', err);
                return res.status(500).json({ error: 'Klaida gaunant nepatvirtintas idėjas' });
            }
            res.json(results);
        });
    }, 2000);
});

app.put(url + 'ideas/:id/approve', (req, res) => {
    const ideaId = req.params.id;

    const updateQuery = `
        UPDATE ideas
        SET status = 'active'
        WHERE id = ?
    `;

    con.query(updateQuery, [ideaId], (err, result) => {
        if (err) {
            console.error('Klaida atnaujinant idėją:', err);
            return res.status(500).json({ error: 'Klaida atnaujinant idėją' });
        }

        res.json({
            success: true,
            message: 'Idėja sėkmingai patvirtinta'
        });
    });
});

app.post(url + 'donations', (req, res) => {
    const { idea_id, donor_name, amount } = req.body;

    if (!idea_id || !donor_name || !amount) {
        return res.status(400).json({ error: 'Prašome užpildyti visus laukelius' });
    }

    const insertDonationQuery = `
        INSERT INTO donations (idea_id, donor_name, amount)
        VALUES (?, ?, ?)
    `;
    con.query(insertDonationQuery, [idea_id, donor_name, amount], (err, result) => {
        if (err) {
            console.error('Klaida įrašant auką:', err);
            return res.status(500).json({ error: 'Klaida įrašant auką' });
        }

        const updateRaisedQuery = `
            UPDATE ideas
            SET raised = raised + ?
            WHERE id = ?
        `;
        con.query(updateRaisedQuery, [amount, idea_id], (err) => {
            if (err) {
                console.error('Klaida atnaujinant raised reikšmę:', err);
                return res.status(500).json({ error: 'Klaida atnaujinant raised reikšmę' });
            }

            const checkGoalQuery = `
                SELECT raised, goal
                FROM ideas
                WHERE id = ?
            `;
            con.query(checkGoalQuery, [idea_id], (err, results) => {
                if (err) {
                    console.error('Klaida tikrinant tikslą:', err);
                    return res.status(500).json({ error: 'Klaida tikrinant tikslą' });
                }

                const { raised, goal } = results[0];

                if (raised >= goal) {
                    
                    const updateStatusQuery = `
                        UPDATE ideas
                        SET status = 'completed'
                        WHERE id = ?
                    `;
                    con.query(updateStatusQuery, [idea_id], (err) => {
                        if (err) {
                            console.error('Klaida atnaujinant statusą:', err);
                            return res.status(500).json({ error: 'Klaida atnaujinant statusą' });
                        }

                        res.json({
                            success: true,
                            message: 'Auka sėkmingai pridėta. Tikslas pasiektas!'
                        });
                    });
                } else {
                    res.json({
                        success: true,
                        message: 'Auka sėkmingai pridėta'
                    });
                }
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Serveris veikia http://localhost:${port}`);
});
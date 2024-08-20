const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
var jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');
const json = require('body-parser/lib/types/json');
const JWT_SECRET = '12323#$%@$@$(adsda)ffrfhfgfghghg(4554)';
const app = express();
const PORT = 3001;


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'message_website'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');

});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.post('/submit', (req, res) => {
    let sender_email = "";
    const token = req.headers.authorization?.split(' ')[1];

    connection.query('SELECT email FROM users WHERE token = ?', [token], (error, results) => {
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        if (results && results.length > 0) {
            sender_email = results[0].email;
            const { first_name, last_name, receiver_email, message_body } = req.body;

            
            connection.query('SELECT email FROM users WHERE email = ?', [receiver_email], (error, receiverResults) => {
                if (error) {
                    return res.status(400).json({ message: error.message });
                }

                if (receiverResults && receiverResults.length > 0) {
                    
                    const query = 'INSERT INTO message (first_name, last_name, sender_email, receiver_email, message_body) VALUES (?, ?, ?, ?, ?)';

                    connection.query(query, [first_name, last_name, sender_email, receiver_email, message_body], (err, result) => {
                        if (err) {
                            return res.status(500).json({ message: err.message });
                        }
                        res.status(200).json({ success: true });
                    });
                } else {
                    res.status(400).json({ message: 'Failed to send the message' });
                }
            });
        } else {
            res.status(400).json({ message: 'Failed to send the message' });
        }
    });
});


app.post('/submit', (req, res) => {
    let sender_email = "";
    const token = req.headers.authorization?.split(' ')[1];
console.log(token);

    connection.query('SELECT email FROM users WHERE token = ?', [token], async (error, results) => {
        console.log(results);
        
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        if (results && results.length > 0) {
            sender_email = results[0].email;

            const { first_name, last_name, receiver_email, message_body } = req.body;
            const query = 'INSERT INTO message (first_name, last_name, sender_email, receiver_email, message_body) VALUES (?, ?, ?, ?, ?)';

            connection.query(query, [first_name, last_name, sender_email, receiver_email, message_body], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }
                res.redirect('/view');
            });
        } else {
            res.status(404).json({ message: "User not found or invalid token" });
        }
    });
});

app.get('/', async (req, res) => {
   
        res.sendFile(path.join(__dirname, "public", 'index.html'))
   
})

app.get('/register', async (req, res) => {
    res.status(201),sendFile(path.join(__dirname,'public','signup.html'))
})
app.post('/register', async (req, res) => {
    const { first_name, last_name, email, password, phone_number } = req.body;

    if (!first_name || !last_name || !email || !password || !phone_number) {
        return res.status(400).send('All fields are required');
    }

    const query = 'SELECT email FROM users WHERE email = ?';
    connection.query(query, [email], async (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({message:'Server error'});
        }

        if (results.length > 0) {
            return res.status(400).json({message:'Email already in use'});
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const insertQuery = `
                INSERT INTO users (first_name, last_name, email, password, phone_number)
                VALUES (?, ?, ?, ?, ?)
            `;
            connection.query(insertQuery, [first_name, last_name, email, hashedPassword, phone_number], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({message:'Server error'})
                }

                
                const token = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: '1h' });

                connection.query('UPDATE users SET token = ? WHERE email = ?', [token,email])
                res.status(201).json({ message: 'User registered successfully', token: token });

            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({message:'Server error'})
        }
    });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT email, password FROM users WHERE email = ?';
    connection.query(query, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({message:'Server error'});
        }

        if (results.length === 0) {
            return res.status(401).json({message:'Email Not Found, please try again'});
        }

        const user = results[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({message:'password not correct, please try again'});
        }

    
        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        connection.query('UPDATE users SET token = ? WHERE email = ?', [token,email])

        res.status(201).json({ message: 'Login successfully', token: token });
        
    });
});

app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'view_message.html'));
});

app.get('/Profile', (req, res) => {

    res.sendFile(path.join(__dirname, 'public', 'account.html'));
})


app.get('/api/users', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from 'Bearer <token>'
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const query = 'SELECT * FROM users WHERE token = ?';

    connection.query(query, [token], (err, results) => {
        if (err) throw err;
        res.json(results[0]); // Assuming you only want the first result
    });
});

app.get('/api/messages', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const userQuery = 'SELECT email FROM users WHERE token = ?';
        
        connection.query(userQuery, [token], (err, results) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const Email = results[0].email;
            connection.query('SELECT * FROM message WHERE sender_email = ? or receiver_email=?', [Email,Email], (err, messageResults) => {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }
console.log(messageResults);

                res.status(200).json({ messages: messageResults });
            });
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});









app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

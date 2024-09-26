const express = require('express');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const upload = require('./views/upload'); // Import multer configuration
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const app = express();


const port = 3000;
dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// MySQL connection
const connection  = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Vill@4171#',
    database: 'ServiceHub'
});

connection.connect(err => {
    if(err){
        console.log('Error connecting to database', err);
        return;    
    }
    console.log('Connection successful, Database connected');
});
const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    )
`;

connection.query(createUsersTable, (err) => {
    if (err) throw err;
    console.log('Database table for servicehub2 users successfully!');
});

// Serve static files
app.use(express.static('public'));
app.use(express.static('views'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));


// Route to serve the upload form
app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'upload.html'));
});

// Route to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    const description = req.body.description;
    const price = req.body.price;
    const folder = req.body.folder || 'events'; // Default to 'events'
    const filePath = `${folder}/${req.file.filename}`; // Save relative path
    const location = req.body.location || '';

    // Updated query to include the folder field
    const query = 'INSERT INTO uploads(filePath, description, price, folder, location) VALUES(?,?,?,?,?)';
    connection.query(query, [filePath, description, price, folder, location], (err, results) => {
        if (err) {
            console.log('Error saving data to database:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        // Render the uploaded file details
        res.render('display', {
            filePath: '/' + filePath,
            description: description,
            price: price,
            location: location
          
        });
    });
});


// Route to display all uploads
app.get('/uploads', (req, res) => {
    const query = 'SELECT * FROM uploads ORDER BY uploaded_at DESC';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching uploads', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.render('event-planners', { uploads: results });
    });
});

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('public', path.join(__dirname, 'public'));


// Route to display event uploads
app.get('/event-planners', (req, res) => {
    const location = req.query.location || ''; // Get location from query parameters or default to empty string
    let query = 'SELECT * FROM uploads WHERE folder = "events"';
    
    // Add location filter if location is provided
    if (location) {
        query += ' location = ?';
    }
    
    query += ' ORDER BY uploaded_at DESC';
    
    const queryParams = location ? [location] : [];

    connection.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error fetching event-planners uploads:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.render('event-planners', { uploads: results });
    });
});

// Route to display venue uploads
app.get('/venue-setup', (req, res) => {
    const query = 'SELECT * FROM uploads WHERE folder = "venue" ORDER BY uploaded_at DESC';
    connection.query(query, ['venue'], (err, results) => {
        if (err) {
            console.error('Error fetching venue uploads:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.render('venue-setup', { uploads: results });
    });
});

// Route to display cailnary uploads
app.get('/culinary', (req, res) => {
    const query = 'SELECT * FROM uploads WHERE folder = "culinary" ORDER BY uploaded_at DESC';
    connection.query(query, ['culinary'], (err, results) => {
        if (err) {
            console.error('Error fetching culinary uploads:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.render('culinary', { uploads: results });
    });
});

app.get('/entertainers', (req, res) => {
    const query = 'SELECT * FROM uploads WHERE folder = "entertainers" ORDER BY uploaded_at DESC';
    connection.query(query, ['entertainers'], (err, results) => {
        if (err) {
            console.error('Error fetching entertainers uploads:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.render('entertainers', { uploads: results });
    });
});


// Serve static HTML files
app.get('/landing', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'landing.html'));
});
app.get('/event-planners', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'event-planners.ejs'));
});

app.get('/venue-setup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'venue-setup.ejs'));
});

app.get('/culinary', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'culinary.ejs'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/entertainers', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'entertainers.ejs'));
});

app.get('/fun-activities', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'fun-activities.html'));
});

app.get('/beauty', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'beauty.html'));
});

app.get('/special-effects', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'special-effects.html'));
});

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'upload.html'));
});





// User registration route
app.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Check if all required fields are provided
        if (!email || !username || !password) {
            return res.status(400).json({ message: 'Please provide email, username, and password.' });
        }

        const userQuery = 'SELECT * FROM users WHERE email = ?';
        connection.query(userQuery, [email], (err, data) => {
            if (err) {
                console.error('Database error during user lookup:', err);
                return res.status(500).json({ message: 'Database error' });
            }

            if (data.length) {
                return res.status(409).json({ message: 'User already exists!' });
            }

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            const newUserQuery = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
           connection.query(newUserQuery, [email, username, hashedPassword], (err) => {
                if (err) {
                    console.error('Database error during user creation:', err);
                    return res.status(500).json({ message: 'User cannot be created! Try again later.' });
                }
                res.status(200).json({ message: 'User created successfully!' });
            });
        });
    } catch (err) {
        console.error('Unexpected error in /register route:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});




// User login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt with email:', email); // Log the email being checked
        
        const userQuery = 'SELECT * FROM users WHERE email = ?';
        connection.query(userQuery, [email], (err, data) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Database error' });
            }

            if (data.length === 0) {
                console.log('User not found for email:', email); // Log if the user is not found
                return res.status(404).json({ message: 'User not found!' });
            }

            const user = data[0];
            console.log('User found:', user); // Log user details

            const isPasswordValid = bcrypt.compareSync(password, user.password);
            console.log('Password comparison result:', isPasswordValid); // Log the result of the password comparison

            if (!isPasswordValid) {
                console.log('Invalid password for user:', email); // Log if the password is invalid
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            res.status(200).json({
                message: 'Login successful',
                user_id: user.id,
                user: {
                    email: user.email,
                    username: user.username
                }
            });

            console.log('Logged in user ID:', user.id, user.email);
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

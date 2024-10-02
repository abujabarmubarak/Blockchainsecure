const express = require('express');
const path = require('path');
const db = require('./db');
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for the dashboards page
app.get('/dashboards', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboards.html'));
});

// Add routes for other pages
app.get('/transaction_log', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'transaction_log.html'));
});

app.get('/threat_detail', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'threat_detail.html'));
});

app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

app.get('/user_management', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user_management.html'));
});

// Route for creating a new transaction
app.post('/transactions', (req, res) => {
    const transaction = {
        sender: req.body.sender,
        receiver: req.body.receiver,
        amount: req.body.amount
    };

    // Insert the new transaction into the database
    db.query('INSERT INTO transactions SET ?', transaction, (err, results) => {
        if (err) {
            console.error('error running query:', err);
            res.status(500).send({ message: 'Error creating transaction' });
            return;
        }
        res.send({ message: 'Transaction created successfully' });
    });
});

// Route for retrieving all transactions
app.get('/transactions', (req, res) => {
    // Retrieve all transactions from the database
    db.query('SELECT * FROM transactions', (err, results) => {
        if (err) {
            console.error('error running query:', err);
            res.status(500).send({ message: 'Error retrieving transactions' });
            return;
        }
        res.send(results);
    });
});

// Route for retrieving a single transaction by ID
app.get('/transactions/:id', (req, res) => {
    const id = req.params.id;

    // Retrieve the transaction from the database
    db.query('SELECT * FROM transactions WHERE id = ?', id, (err, results) => {
        if (err) {
            console.error('error running query:', err);
            res.status(500).send({ message: 'Error retrieving transaction' });
            return;
        }
        res.send(results[0]);
    });
});

// Route for updating a transaction
app.put('/transactions/:id', (req, res) => {
    const id = req.params.id;
    const transaction = {
        sender: req.body.sender,
        receiver: req.body.receiver,
        amount: req.body.amount
    };

    // Update the transaction in the database
    db.query('UPDATE transactions SET ? WHERE id = ?', [transaction, id], (err, results) => {
        if (err) {
            console.error('error running query:', err);
            res.status(500).send({ message: 'Error updating transaction' });
            return;
        }
        res.send({ message: 'Transaction updated successfully' });
    });
});

// Route for deleting a transaction
app.delete('/transactions/:id', (req, res) => {
    const id = req.params.id;

    // Delete the transaction from the database
    db.query('DELETE FROM transactions WHERE id = ?', id, (err, results) => {
        if (err) {
            console.error('error running query:', err);
            res.status(500).send({ message: 'Error deleting transaction' });
            return;
        }
        res.send({ message: 'Transaction deleted successfully' });
    });
});

// Start the server
app.listen(3000, () => {
    console.log('App listening on port 3000');
});

// Close the database connection when the server is closed
process.on('exit', () => {
    db.end((err) => {
        if (err) {
            console.error('error closing connection:', err);
            return;
        }
        console.log('connection closed');
    });
});
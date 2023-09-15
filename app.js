// Import necessary modules
const bodyParser = require('body-parser'); // Middleware for parsing request bodies
const express = require('express'); // Express.js web application framework
const app = express(); // Create an Express application instance
const port = 3000; // Define the port number for the server
const fs = require('fs'); // File system module for working with files

// Set EJS as the view engine for rendering templates
app.set('view engine', 'ejs');

// Configure body-parser middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: false }));

// Read contacts data from a JSON file and parse it into an array
const contacts = JSON.parse(fs.readFileSync("./contact.json", "utf-8"))

// Define a route to render the "index" view, passing the contacts data
app.get('/', (req, res) => {
    res.render('index', { contacts });
})

// Define a route to render the "add" view, passing the contacts data
app.get('/add', (req, res) => {
    res.render('add', { contacts });
})

// Define a route to handle adding a new contact, updating data, and redirecting
app.post('/add', (req, res) => {
    const data = req.body;
    contacts.push(data); // Add the new contact to the contacts array
    fs.writeFileSync('./contact.json', JSON.stringify(contacts)); // Write updated data to the JSON file
    res.redirect('/'); // Redirect back to the home page
});

// Define a route to render the "edit" view for a specific contact
app.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    const contact = contacts[id]; // Get the specific contact
    res.render('edit', { id, contact });
});

// Define a route to handle editing a contact, updating data, and redirecting
app.post('/edit/:id', (req, res) => {
    let id = req.params.id;
    contacts[id] = req.body; // Update the contact with new data
    fs.writeFileSync('./contact.json', JSON.stringify(contacts)); // Write updated data to the JSON file
    res.redirect('/'); // Redirect back to the home page
})

// Define a route to render the "view" view for a specific contact
app.get('/view/:id', (req, res) => {
    let id = req.params.id
    const contact = contacts[id]; // Get the specific contact
    res.render('view', { contact });
})

// Define a route to handle deleting a contact, updating data, and redirecting
app.get('/delete/:id', (req, res) => {
    const id = req.params.id
    contacts.splice(id, 1); // Remove the contact at the specified index
    fs.writeFileSync('./contact.json', JSON.stringify(contacts)); // Write updated data to the JSON file
    res.redirect('/'); // Redirect back to the home page
})

// Start the Express application and listen on the specified port
app.listen(port);

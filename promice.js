// Import necessary modules
const express = require('express'); // Express.js for creating a web server
const bodyParser = require('body-parser'); // Middleware for parsing request body
const fs = require('fs').promises; // File system module with Promises API
const zlib = require('zlib'); // Zlib module for file compression

// Create an Express application
const app = express();

// Set the port for the server to listen on
const port = 3000;

// Set the view engine for rendering templates (EJS in this case)
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('./public'));

// Parse incoming request bodies as URL-encoded data
app.use(bodyParser.urlencoded({ extended: false }));

// Function to read contacts from a JSON file
async function readContactsFile() {
  const data = await fs.readFile('./contact.json', 'utf8');
  return JSON.parse(data);
}

// Function to write contacts to a JSON file
async function writeContactsFile(contacts) {
  await fs.writeFile('./contact.json', JSON.stringify(contacts));
}

// Define routes and their functionality

// Route for the homepage
app.get('/', async (req, res) => {
  try {
    const contacts = await readContactsFile();
    res.render('index', { contacts }); // Render the 'index' template with contact data
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for adding a new contact (GET request)
app.get('/add', (req, res) => {
  res.render('add'); // Render the 'add' template for adding a new contact
});

// Route for adding a new contact (POST request)
app.post('/add', async (req, res) => {
  try {
    const newContact = req.body;
    const contacts = await readContactsFile();
    contacts.push(newContact);
    await writeContactsFile(contacts);
    res.redirect('/'); // Redirect back to the homepage after adding a contact
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Similar route patterns for editing, viewing, and deleting contacts

// Start the Express server on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// File compression functionality

// Input and output file paths
const inputFile = 'input.txt';
const outputFile = 'output.gz';

// Function to compress a file
const compressFile = (inputFile, outputFile) => {
  const readStream = fs.createReadStream(inputFile); // Read input file
  const writeStream = fs.createWriteStream(outputFile); // Write to output file
  const gzip = zlib.createGzip(); // Create a Gzip compression stream

  // Pipe the input through the Gzip stream to the output
  readStream.pipe(gzip).pipe(writeStream);

  // Handle the 'finish' event when compression is complete
  writeStream.on('finish', () => {
    console.log(`File ${inputFile} compressed to ${outputFile}.`);
  });
};

// Call the file compression function
compressFile(inputFile, outputFile);

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');

// Create the App
const app = express();

// Enable CORS for all routes
app.use(cors());

// Serve static files from the 'uploads' directory
app.use('/image', express.static('uploads'));

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '11/DT/02094cj.',
  database: 'postdatabase',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Check if the database is connected
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database!');
    connection.release();
  }
});

// Parse JSON bodies
app.use(bodyParser.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/', // Set the destination directory for storing uploaded files
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// Define a route
app.post('/add', upload.single('picture'), (req, res) => {
  const mediaType = req.body.mediaType;
  const dimension = req.body.dimension;
  const imageArea = req.body.imageArea;
  const material = req.body.material;
  const finishing = req.body.finishing;
  const trafficSpeed = req.body.trafficSpeed;
  const trafficCount = req.body.trafficCount;
  const franchise = req.body.franchise;
  const visibility = req.body.visibility;
  const approach = req.body.approach;
  const illumination = req.body.illumination;
  const availability = req.body.availability;
  const annualRate = req.body.annualRate;
  const geoTags = req.body.geoTags;
  const picture = req.file; // Access the uploaded picture file via req.file

  const query =
    'INSERT INTO data (mediaType, dimension, imageArea, material, finishing, trafficSpeed, trafficCount, franchise, visibility, approach, illumination, availability, annualRate, geoTags, picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [
    mediaType,
    dimension,
    imageArea,
    material,
    finishing,
    trafficSpeed,
    trafficCount,
    franchise,
    visibility,
    approach,
    illumination,
    availability,
    annualRate,
    geoTags,
    picture ? picture.filename : null, // Store the filename in the database
  ];

  pool.query(query, values, (error, results) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred while inserting data.');
    } else {
      console.log('Data inserted successfully.');
      console.log(values); // Log the inserted values
      res.send('Hello, World!');
    }
  });
});


// Define a route to handle the fetch request
app.get('/data', (req, res) => {
    // Assuming you have established a MySQL connection and have a 'connection' object
  
    // Run the SELECT query to fetch data from the database
    pool.query('SELECT * FROM data', (error, results) => {
      if (error) {
        console.error('Error fetching data from the database:', error);
        res.status(500).send('Error fetching data from the database');
      } else {
        // Assuming the query successfully returns an array of data
        const data = results;
  
        // Map through the data array and modify the picture property to include the image URL
        const modifiedData = data.map(item => {
          return {
            ...item,
            picture: `http://localhost:3000/image/${item.picture}`, // Assuming 'picture' is the filename in the database
          };
        });
  
        // Send the modified data as a response
        console.log(modifiedData);
        res.json(modifiedData);
      }
    });
  });
  

// Define a route to handle updating a post 
app.get('/:postId', (req, res) => {
  const postId = req.params.postId;

  // Run the SELECT query to fetch data with the postId from the database
  pool.query('SELECT * FROM data WHERE id = ?', [postId], (error, results) => {
    if (error) {
      console.error('Error fetching data from the database:', error);
      res.status(500).send('Error fetching data from the database');
    } else {
      const data = results;
      res.json(data);
    }
  });
});


// Define a route to handle updating a post
app.put('/edit/:postId', (req, res) => {
    const postId = req.params.postId;
    const updatedData = req.body; // Updated post data
  
    // Implement the logic to update the post in the database based on postId and updatedData
  
    res.send('Post updated successfully');
  });

  
  // Define a route to handle deleting a post
  app.delete('/delete/:postId', (req, res) => {
    const postId = req.params.postId;
  
    // Assuming you have established a MySQL connection and have a 'connection' object
  
    // Run the DELETE query to delete the post from the database
    pool.query('DELETE FROM data WHERE id = ?', [postId], (error, results) => {
      if (error) {
        console.error('Error deleting post from the database:', error);
    
        res.status(500).send('Error deleting post from the database');
      } else {
        console.log('Post deleted successfully.');
        res.send('Post deleted successfully');
      }
    });
  });
  
  

// Start listening on port 3000
app.listen(3000, 'localhost', () => {
  console.log('App is running on http://localhost:3000');
});

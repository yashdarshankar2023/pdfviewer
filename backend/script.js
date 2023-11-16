const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3005;

app.use(cors());
app.use(bodyParser.json());

const uri = 'mongodb+srv://yashdarshankar:Yash%401001@cluster0.gto09ok.mongodb.net/mernstack?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useUnifiedTopology: true });
const db = client.db('mydatabase');
const Col = db.collection('pdfviewer');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToMongoDB();



app.post('/api/save-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const { originalname, buffer } = req.file;
    const result = await Col.insertOne({ name: originalname, data: buffer });

    console.log("PDF saved to MongoDB",result);
    res.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error saving PDF to MongoDB:', error);
    res.status(500).json({ error: 'Error saving data' });
  }
});



app.get('/api/get-pdfs', async (req, res) => {
  try {
    
    const pdfs = await Col.find().toArray();
    res.json({ success: true, pdfs });
  } catch (error) {
    console.error('Error retrieving PDFs from MongoDB:', error);
    res.status(500).json({ error: 'Error retrieving data' });
  }
});

app.use(express.static(path.join(__dirname, '../build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

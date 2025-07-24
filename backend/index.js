const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMO_TABLE;

// POST feedback
app.post('/api/feedback', async (req, res) => {
  const { name, email, category, rating, message } = req.body;

  const params = {
    TableName: TABLE_NAME,
    Item: {
      id: uuidv4(),
      name,
      email,
      category,
      rating,
      message,
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDb.put(params).promise();
    res.status(200).json({ success: true, message: 'Feedback saved' });
  } catch (err) {
    console.error('DynamoDB Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET feedback
app.get('/api/feedback', async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const data = await dynamoDb.scan(params).promise();
    res.status(200).json(data.Items);
  } catch (err) {
    console.error('DynamoDB Error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

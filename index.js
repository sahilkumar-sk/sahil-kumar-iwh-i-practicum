require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;
const OBJECT_TYPE = '2-61720239';

// Homepage route
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS_TOKEN}`,
        },
        params: {
          properties: 'name,species,description',
        },
      }
    );

    res.render('homepage', {
      title: 'Homepage | Integrating With HubSpot I Practicum',
      data: response.data.results,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send('Error fetching custom object data');
  }
});

// Form page route
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
  });
});

// Form submit route
app.post('/update-cobj', async (req, res) => {
  try {
    const { name, species, description } = req.body;

    await axios.post(
      `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`,
      {
        properties: {
          name,
          species,
          description,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.redirect('/');
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send('Error creating custom object record');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
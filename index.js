const express = require('express');
const connectToMongo = require('./db');

connectToMongo();

const app = express();
const port = 5000;

app.use(express.json()); // we need to use this middleware if we want to use req.body

// Availabel Routes

app.get('/', (req, res) => {
  res.send('Hello Jimmy!')
});


app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

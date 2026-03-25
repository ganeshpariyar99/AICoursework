const express = require('express');
const app = express();
// const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const PaymentRouter = require('./Routes/PaymentRouter');
const OrderRouter = require('./Routes/OrderRouter');
const UserRouter = require('./Routes/UserRouter');

require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 3000;

// app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use('/auth', AuthRouter);
app.use('/payment', PaymentRouter);
app.use('/orders', OrderRouter);
app.use('/users', UserRouter);

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
});

app.get('/', (req, res) => {
  res.send('Backend is working ');
});

import express from 'express';
import mysql2 from 'mysql2'; // import for mysql
import dotenv from 'dotenv';

// Load the variables from the .env file
dotenv.config();

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();


//create an instance of an express application
const app = express();

// Enable static file serving
app.use(express.static('public'));

//Define the port number where our server will listen 
const PORT = 3001;


const orders=[];

// for ejs
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true}));

//Define a root to test the DataBase
app.get('/db-test', async(req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders');
        res.send(orders);
    } catch(err) {
        console.error('Database error:', err);
    }
});




//Define a default "route" ('/')
//req: contains information about the incoming request
//res: allows us to send back a response to the client
app.get('/', (req, res) => {
    //res.send('Welcome to ice cream!');
    //res.sendFile(`${import.meta.dirname}/views/home.html`);
    res.render('home');
})

//Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})

app.get('/home', (req, res) => {
    res.render('home', {orders});

});
app.get('/admin', async(req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders ORDER BY timestamp DESC');
        res.render('admin', { orders });
    } catch(err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading orders: ' + err.message);
    }
});

app.post('/submit-order', async (req, res) => {
    try {
        const order = req.body;
        console.log('New order submitted:', order);

        order.toppings = Array.isArray(order.toppings) ? order.toppings.join(", ") : "";

        const sql = `INSERT INTO orders(customer, email, flavor, cone, toppings) 
        VALUES (?, ?, ?, ?, ?);`;

        const params = [
            order.fname,
            order.email,
            order.Flavor,
            order.method,
            order.toppings
        ];

        const [result] = await pool.execute(sql, params);
        console.log('Order saved with ID:', result.insertId);

        res.render('confirmation', { order });
    } catch (err) {
        console.error('Error saving order:', err);
        res.status(500).send('Sorry, there was an error processing your order. Please try again.');
    }
});
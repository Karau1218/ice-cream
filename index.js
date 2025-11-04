import express from 'express';

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
app.use(express.static('views'));

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

app.post('/submit-order', (req, res) => {
  const order = {
    fname: req.body.fname,
    email: req.body.email,
    Flavor: req.body.Flavor,
    method: req.body.method,
    toppings: req.body.toppings,
    comment: req.body.comment
  };
  res.render('confirmation', { order });
});


app.get('/home', (req, res) => {
    res.render('home', {orders});

});
app.get('/admin', (req, res) => {
    res.render('admin', {orders});

});
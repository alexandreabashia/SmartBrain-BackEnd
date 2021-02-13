const express = require('express');
const bcrypt = require('bcrypt-nodejs');
var cors = require('cors');
const knex = require('knex')({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
    }
});

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


// knex.select('*').from('users').then(data => {console.log(data)});

const app = express();

//body-parser ES6
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

//homepage
app.get('/', (req, res) => { 
    res.send("it's working!");
})


app.post('/signin', (req, res) => { signin.handleSignIn(req, res, knex, bcrypt) })
app.post('/register', (req, res) => { register.handleRegister(req, res, knex, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, knex) })
app.put('/image', (req, res) => { image.handleImage(req, res, knex) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Smart Brain API Server is running on port ${ PORT }`)
})
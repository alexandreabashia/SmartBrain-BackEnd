const express = require('express');
const bcrypt = require('bcrypt-nodejs');
var cors = require('cors');

const app = express();

//  DB users, array with objects
const database = {
    users: [
        {
            id: '123',
            name: 'Alex',
            email: 'alexandre@gmail.com',
            password: '123456',
            entries: 0, //this means how many times John has submitted photos for clarifai
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'banana',
            entries: 0, //this means how many times John has submitted photos for clarifai
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

//body-parser ES6
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

//homepage
app.get('/', (req, res) => {
    res.send(database.users)
})

//signin
app.post('/signin', (req, res) => {
    
    if(req.body.email === database.users[0].email & 
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
        } else {
            res.status(400).json('error logging in');
        }
})

//register
app.post('/register', (req, res) => {
    const { email, name, password } = req.body; //destructuring from client
    database.users.push({ //push user to DB
            id: '125',
            name: name,
            email: email,
            // password: password,
            entries: 0,
            joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
})

//profile/id
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('user not found')
    }
})

//increase entries
app.post('/image/', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('user not found')
    }
})   


// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });


//listen Port
app.listen(3001, () => {
    console.log('App is running on port 3001');
})

/*
what do we do kind of, might change later:
1. / --> res = return "this is working"
2. /signin --> POST = return "success" or "fail"
3. /register --> POST = return "user" object
4. /profile/:userId --> GET = return "user"
5. /image --> PUT = return updated score or whatever

-Once we done everything in BACK-END and tested succesfully with nodemon 
then i can plug it in on FRONT-END 

*/
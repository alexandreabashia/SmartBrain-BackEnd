const express = require('express');
const bcrypt = require('bcrypt-nodejs');
var cors = require('cors');
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: '123456',
        database: 'smartbrain'
    }
});


// knex.select('*').from('users').then(data => {console.log(data)});

const app = express();

//  DB users, array with objects
const database = {
    users: [
        {
            id: '123',
            name: 'Alex',
            email: 'a',
            password: 'a',
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
    knex.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {
                return knex.select('*').from('users').where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0]);
                    })
            } else {
                res.status(400).send('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'));

    // //Old no DB code
    // if (req.body.email === database.users[0].email &
    //     req.body.password === database.users[0].password) {
    //     res.json(database.users[0]);
    // } else {
    //     res.status(400).json('error logging in');
    // }
})





//register
app.post('/register', (req, res) => {
    const { email, name, password } = req.body; //destructuring from client
    const hash = bcrypt.hashSync(password);
    knex.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email,
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users').returning('*').insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('Unable to Register'));

    // // old code, no DB
    // database.users.push({ //push user to DB
    //         id: '125',
    //         name: name,
    //         email: email,
    //         // password: password,
    //         entries: 0,
    //         joined: new Date()
    // })
})

//profile/id
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    knex.select('*').from('users').where({ id: id }).then(user => {
        if (user.length) {
            res.json(user[0]);
        } else {
            res.status(400).send('user ID not found');
        }
    });

    // // old code, no DB
    // let found = false;
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         return res.json(user);
    //     }
    // })
    // if (!found) {
    //     res.status(400).json('user not found')
    // }
})

//Increase entries
app.put('/image/', (req, res) => {
    const { id } = req.body;
    knex('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0])
        })
        .catch(err => res.status(400).send('unable to get entries'))
})



// // old code, no DB
// let found = false;  
// database.users.forEach(user => {
//     if (user.id === id) {
//         found = true;
//         user.entries++;
//         return res.json(user.entries);
//     }
// })
// if (!found) {
//     res.status(400).json('user not found')
// }


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
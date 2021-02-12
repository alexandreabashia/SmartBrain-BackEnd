

const handleSignIn = (req, res, knex, bcrypt) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('please fully fill sign form');
    }

    knex.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return knex.select('*').from('users').where('email', '=', email)
                    .then(user => {
                        res.json(user[0]);
                    })
            } else {
                res.status(400).send('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'));
}

module.exports = {
    handleSignIn: handleSignIn
}
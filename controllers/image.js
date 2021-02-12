const Clarifai = require ('clarifai');
const { json } = require('express');

const app = new Clarifai.App({
    apiKey: 'e576cc39a0c8426fae682a3e7c095ccc'
  });

  const handleApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data)
    })
  }


const handleImage = (req, res, knex) => {
    const { id } = req.body;
    knex('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0])
        })
        .catch(err => res.status(400).send('unable to get entries'))
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}
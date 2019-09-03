// implement your API here
const express = require('express')
const Users = require('./data/db.js')

const server = express();

server.use(express.json());


server.get('/', (req, res) => {
    res.send('Hello World!')
})

server.post('/users', (req, res) => {
    const userInformation = req.body

    if(userInformation.name && userInformation.bio) {
        Users.insert(userInformation)
        .then(response => {
            res.status(201).json(userInformation)
        })
        .catch(error => {
            res.status(500).json({ error: 'There was an error while saving the user to the database'})
        })
    }
    else {
        res.status(400).json({ error: 'Please provide name and bio for the user'})
    }
})

server.get('/users', (req, res) => {
    Users.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(error => {
        res.status(500).json({error: 'The users information could not be retrieved.'})
    })
})

server.get('/users/:id', (req, res) => {
    const userId = req.params.id
    Users.findById(userId)
    .then(user => {
        if(user) {
            res.status(200).json(user)
        }
        else {
            res.status(404).json({error: 'The user with the specified ID does not exist.'})
        }
    })
    .catch(error => {
        res.status(500).json({error: 'The user information could not be retrieved.'})
    })
})

server.delete('/users/:id', (req, res) => {
    const userId = req.params.id
    Users.remove(userId)
    .then(user => {
        if(user) {
            res.status(200).json({message: 'User removed'})
        }
        else {
            res.status(404).json({error: 'The user with the specified ID does not exist.'})
        }
    })
    .catch(error => {
        res.status(500).json({error: 'The user could not be removed'})
    })
})

server.put('/users/:id', (req,res) => {
    const userId = req.params.id
    const userInformation = req.body

    if(userInformation.name && userInformation.bio) {
        Users.update(userId, userInformation)
        .then(user => {
            if(user) {
                res.status(200).json(userInformation)
            }
            else {
                res.status(404).json({error: 'The user with the specified ID does not exist.'})
            }
        })
        .catch(error => {
            res.status(500).json({error: 'The user information could not be modified.'})
        })
    } else {
        res.status(400).json({ error: 'Please provide name and bio for the user.'})
    }

})

const port = 8000;
server.listen(port, () => console.log(`Server listening on ${port}`))
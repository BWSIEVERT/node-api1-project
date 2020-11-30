//Node Program
console.log('STARTING SERVER')

const e = require('express')
// Web Server
const express = require('express')
const shortid = require('shortid')

const server = express()
server.use(express.json())

// User table db
let users = [
    {
        id: shortid.generate(),
        name: 'Example Name',
        bio: 'Example Bio'
    }
]

// Helper Functions
const User = {
    getAll() {
        return users
    },
    createNew(user) {
        // Create user object
        const newUser = { id: shortid.generate(), ...user}
        // Add to users array
        users.push(newUser)
        return newUser
    },
    getById(id) {
        return users.find(user => user.id === id)
    },
    delete(id) {
        const user = users.find(user => user.id === id)
        if (user) {
            users = users.filter(u => u.id !== id)
        }
        return user
    },
    update(id, changes) {
        const user = users.find(user => user.id === id)
        if(!user) {
            return null
        } else {
            const updatedUser = { id, ...changes }
            users = users.map(u => {
                if (u.id === id) return updatedUser
                return u
            })
            return updatedUser
        }
    }
}


//Endpoints for Users
server.get('/api/users', (req, res) => {
    const users = User.getAll()
    if(users) {
        res.status(200).json(users)
    } else {
        res.status(500).json({ message: "The users information could not be retrieved." })
    }
})
server.post('/api/users', (req, res) => {
    const userFromClient = req.body
    if(!userFromClient.name || !userFromClient.bio) {
        res.status(400).json({ message: "Please provide name and bio for the user."})
    } else {
        const newlyCreatedUser = User.createNew(userFromClient)
        res.status(201).json(newlyCreatedUser)
    }
})
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params
    const user = User.getById(id)
    if (user) {
        res.status(200).json(user)
    } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." })
    }
})
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params
    const deleted = User.delete(id)
    if (deleted) {
        res.status(200).json(deleted)
    } else res.status(404).json({ message: "The user with the specified ID does not exist." })
})
server.put('/api/users/:id', (req, res) => {
    const changes = req.body
    const { id } = req.params
    const updatedUser = User.update(id, changes)
    if (updatedUser) {
        res.status(200).json(updatedUser)
    } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." })
    }
})
//Catch-All Endpoint
server.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found'})
})

// Start Server
server.listen(5000, () => {
    console.log('Listening on port 5000')
});
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status - :response-time ms :body'))

persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateID = () => {
    return Math.floor(Math.random() * 100000)
}

// Info page
app.get('/info', (request, response) => {
    const info = `<p>Phonebook has info for ${persons.length} people</p>`
    const time = `<p>${Date()}</p>`

    response.end(info+time)
})

// Get all
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Get ID
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// Delete ID
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

// Create
app.post('/api/persons', (request, response) => {
    const body = request.body

    // Name error
    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else {
        nameExists = persons.some(person => person.name === body.name)
        if (nameExists) {
            return response.status(400).json({
                error: 'name must be unique'
            })
        }
    }

    // Number error
    if (!body.number) {
        return response.status(400).json({
            error: "number missing"
        })
    }

    const person = {
        id: generateID(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const dbConnection = require("./dbConnection")


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const resultsPerPage = 10

//create
app.post('/addContact', (request, response) => {
    const { name, email, address, phone } = request.body
    const db = dbConnection.getDbConnectionInstance()
    const result = db.insertContact(name, email, address, phone)

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err))
})

//read
app.get('/getContacts', (request, response) => {
    const db = dbConnection.getDbConnectionInstance()
    let page = request.query.page ? Number(request.query.page) : 1
    let limit = request.query.limit ? Number(request.query.limit) : resultsPerPage
    const offset = (page - 1) * limit
    const results = db.getAllContacts(limit, offset)
    results
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err))
})

//read
app.get('/getAllContacts', (request, response) => {
    const db = dbConnection.getDbConnectionInstance()
    const results = db.getAllContacts(-1, 0)
    results
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err))
})

//update
app.patch('/updateContact', (request, response) => {
    const { id, name, email, address, phone } = request.body
    const db = dbConnection.getDbConnectionInstance()
    const result = db.updateContact(id, name, email, address, phone)

    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err))
})

//delete
app.delete('/deleteContact/:id', (request, response) => {
    const { id } = request.params
    const db = dbConnection.getDbConnectionInstance()
    const result = db.deleteContact(id)

    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err))
})

app.listen(process.env.PORT, () => console.log('server is live'))
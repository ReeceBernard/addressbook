const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const dbConnection = require("./dbConnection")


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const db = dbConnection.getDbConnectionInstance()

for (i = 0; i <= 50; i++) {
    full_name = makeid(10)
    email = makeid(10) + '@gmail.com'
    address = makeid(25)
    phone = makeNum(10)
    db.insertContact(full_name, email, address, phone)
}
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function makeNum(length) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
        if (i == 2 | i == 5) {
            result += "-"
        }
    }
    return result;
}
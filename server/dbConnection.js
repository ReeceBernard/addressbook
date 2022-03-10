const mysql = require("mysql")
const dotenv = require('dotenv')
let instance = null
dotenv.config()

const db = mysql.createConnection({
    host: "database-addressbook2.cjxa2sfrtrqw.us-east-1.rds.amazonaws.com",
    port: "3306",
    user: "admin",
    password: process.env.DB_PASSWORD,
    database: "addressbook_db"
})

db.connect((err) => {
    if (err) {
        console.log(err.message)
        return
    }
    console.log("database Connected")
})

class DbConnection {
    static getDbConnectionInstance() {
        return instance ? instance : new DbConnection()
    }
    async getAllContacts(limit, offset) {
        try {
            if (limit > 0) {
                const response = await new Promise((resolve, reject) => {
                    const query = "SELECT * FROM contacts ORDER BY name LIMIT ? OFFSET ?"
                    db.query(query, [limit, offset], (err, results) => {
                        if (err) reject(new Error(err.message))
                        resolve(results)
                    })
                })
                return response
            } else {
                const response = await new Promise((resolve, reject) => {
                    const query = "SELECT * FROM contacts ORDER BY name"
                    db.query(query, (err, results) => {
                        if (err) reject(new Error(err.message))
                        resolve(results)
                    })
                })
                return response
            }
        } catch (error) {
            console.log(error)
        }
    }

    async insertContact(name, email, address, phone) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO contacts (name, email, address, phone) VALUES (?,?,?,?);"
                db.query(query, [name, email, address, phone], (err, result) => {
                    if (err) reject(new Error(err.message))
                    resolve(result.insertId)
                })
            })
            return {
                id: insertId,
                name: name,
                email: email,
                address: address,
                phone: phone
            }
        } catch (error) {
            console.log(error)
        }
    }

    async deleteContact(id) {
        try {
            id = parseInt(id, 10)
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM contacts WHERE id = ?"
                db.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message))
                    resolve(result.affectedRows)
                })
            })
            return response === 1 ? true : false
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async updateContact(id, name, email, address, phone) {
        try {
            id = parseInt(id, 10)
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE contacts SET name = ?, email = ?, address = ?, phone = ? WHERE id = ?"
                db.query(query, [name, email, address, phone, id], (err, result) => {
                    if (err) reject(new Error(err.message))
                    resolve(result.affectedRows)
                })
            })
            return response === 1 ? true : false
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

module.exports = DbConnection
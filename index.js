const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const url = require('url');

const PORT = process.env.PORT || 3001;


const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));
let sql;
const db = new sqlite3.Database('./test.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

app.post('/add', (req, res) => {
    try {
        const {name, phone, email, tag} = req.body;
        sql = `INSERT INTO contacts(name,phone,email,tag) VALUES(?,?,?,?)`;
        db.run(sql, [name, phone, email, tag], (err) => {
            if (err) return res.json({status: 300, success: false, error: err});
            console.log('successful added ', name, phone, email, tag)
        })

        return res.json({
            status: 200,
            success: true,
        })
    } catch (e) {
        return res.json({
            status: 400,
            success: false,
        })
    }
})
app.get('/contacts', (req, res) => {
    sql = `SELECT * FROM contacts`
    try {
        const queryObject = url.parse(req.url, true).query
        if (queryObject.id) {
            sql += ` WHERE id = ${queryObject.id}`
        }
        db.all(sql, [], (err, rows) => {
            if (err) return res.json({status: 300, success: false, error: err});
            if (rows.length < 1) {
                return res.json({status: 300, success: false, error: "No match"});
            }
            return res.json({contacts: rows});
        })
    } catch (e) {
        return res.json({
            status: 400,
            success: false,
        })
    }
})
app.post('/delete', (req, res) => {
    try {
        const {id} = req.body;
        sql = `DELETE FROM contacts WHERE id = ?`;
        db.run(sql, [id], (err) => {
            if (err) return res.json({status: 300, success: false, error: err});
        })

        return res.json({
            status: 200,
            success: true,
        })
    } catch (e) {
        return res.json({
            status: 400,
            success: false,
        })
    }
})
app.listen(PORT)


// //create table
// // sql = `CREATE TABLE contacts(id INTEGER PRIMARY KEY, name, phone, email, tag)`;
// // db.run(sql);
//
// //drop table
// // db.run("DROP TABLE contacts")
//
// //insert data into table
// sql = `INSERT INTO contacts(name,phone,email,tag) VALUES(?,?,?,?)`;
// db.run(sql, ['John', '+998972386505', 'john@gmail.com', 'друг'], (err) => {
//     if (err) return console.error(err.message);
// })
//
// //update data
// // sql = `UPDATE contacts SET name = ? WHERE id = ?`;
// // db.run(sql, ['Karen', 1], (err) => {
// //     if (err) return console.error(err.message);
// // })
//
// //delete data
// // sql = `DELETE FROM contacts WHERE id = ?`;
// // db.run(sql, [1], (err) => {
// //     if (err) return console.error(err.message);
// // })
//
// //query the data
// // sql = `SELECT * FROM contacts`
// // db.all(sql, [], (err, rows) => {
// //     if (err) return console.error(err.message);
// //     rows.forEach(row => {
// //         console.log(row)
// //     })
// // })
//
// //query the data
// // sql = `SELECT * FROM contacts WHERE id = ?`
// // db.all(sql, [3], (err, row) => {
// //     if (err) return console.error(err.message);
// //     console.log(row)
// // })
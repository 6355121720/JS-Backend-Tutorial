require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000

app.get('/',(req,res) => {
    res.send('<i>viral r. dobariya</i>')
})

app.get('/login',(req,res) => {
    res.send('<h1>Kindly login to enter our website</h1>')
})


app.listen(process.env.PORT, () => {
    console.log('app is listening on port 5500')
})
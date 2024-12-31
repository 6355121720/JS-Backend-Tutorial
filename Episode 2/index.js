import express from 'express'
import 'dotenv/config'

const app = express()

app.get('/', (req, res) => {
    res.send('viral dobariya')
})


app.listen(process.env.PORT || port, () => {
    console.log(`server is started on port ${process.env.PORT || port}`)
})
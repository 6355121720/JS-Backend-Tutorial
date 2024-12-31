import connectDB from './db/index.js'
import dotenv from 'dotenv'
import {app} from './app.js'

dotenv.config({
    path:'./.env'
})


connectDB()

app.listen(process.env.PORT, () => {
    console.log(`App is listening at  http://localhost:${process.env.PORT}`)
})
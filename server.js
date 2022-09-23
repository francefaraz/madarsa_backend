const cors=require("cors");
const connection=require('./db')
const  express = require('express');
const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
app.use(cors())
connection()
app.get("/",(req,res) => {
    res.send("hello backend is running")
})

// app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(` app listening on port ${port}!`))

module.exports = app;

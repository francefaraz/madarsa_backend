const cors=require("cors");
const connection=require('./configs/db.config')
const  express = require('express');
const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
app.use(cors())
connection()
app.get("/",(req,res) => {
    res.send("hello backend is running")
})
const students=require('./routes/student.routes')
const notificationRoutes=require('./routes/notification.routes')
app.use('/api',notificationRoutes)

// app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(` app listening on port ${port}!`))
app.use('/api/students',students)
module.exports = app;

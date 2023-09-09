const cors=require("cors");
const connection=require('./configs/db.config')
const  express = require('express');
const app = express()
const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));

const port = process.env.PORT || 5000
// app.use(express.json())
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors())
connection()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.get("/",(req,res) => {
    console.log("hello")
    res.send("hello backend is running")
})


const students=require('./routes/student.routes')
const notificationRoutes=require('./routes/notification.routes')
app.use('/api',notificationRoutes)

// app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(` app listening on port ${port}!`))
app.use('/api/students',students)
module.exports = app;

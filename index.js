import express from 'express'
import path from 'path'

const __dirname = path.resolve()
const PORT = process.env.PORT ?? 8000
const app = express()

const urlencodedParser = express.urlencoded({extended: false});

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'))
})

app.get('/catalog', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'catalog.html'))
    // res.json({ pervoePole: "123asd", vtoroePole: 345 })
})

app.post("/catalog", urlencodedParser, (req, res) =>{
    if(!req.body) return res.sendStatus(400);
    console.log(req.body);
    res.send(`${req.body.userName} - ${req.body.userAge}`);
})

app.listen(PORT, ()=>{
    console.log(`Server has been started on port ${PORT}...`)
})
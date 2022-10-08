const express = require('express');
const mongoose = require('mongoose')
const path = require('path')

const app = express()

main()
    .then((res) => {
        console.log('MONGOOSE CONECT!')
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/testcamp');
}

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.send('Home')
})

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000")
})
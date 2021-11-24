const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('<h1>Watch Shop</h1> <h4>Message: Success</h4> <p>Version 0.2</p>');
})

app.get('/watchs', (req, res) => {
  res.send([
    {
        inventory: 200,
        price: 1599,
        name: "petite emerald",
        color: "yellow",
        watchID: 1002
    },
    {
        inventory: 450,
        price: 999,
        name: "prod PETITE CORNWALL",
        color: "black",
        watchID: 1018
    },
    {
        inventory: 800,
        price: 999,
        name: "PETITE DOVER",
        color: "rose gold",
        watchID: 1005
    },
  ])
})

app.listen(port, ()=> {
  console.log(`Demo app is up and listening to port: ${port}`);
})
const express = require('express');
//var cors = require('cors');
const connection = require('./connection');
//const userRoute = require('./routes/users')
const departmentRoute = require('./routes/department')
const serviceRoute = require('./routes/service')
const ordersRoute = require('./routes/orders')
const assignOrderRoute = require('./routes/assign-order')
//const operatorRoute = require('./routes/operators')
const app = express();

const port = 8080

//app.use(cors())
//app.use(express.urlencoded({extended:true}))
app.use(express.json())
//app.use('/users',userRoute)
app.use('/department',departmentRoute)
app.use('/order-service',serviceRoute)
//app.use('/orders',ordersRoute)
app.use('/assign-order',assignOrderRoute)
//app.use('/operator',operatorRoute)

//app.use(express.static("Frontend"))

app.listen(3000, () => {
  console.log(`Example app listening on port ${port}`)
})

//module.exports = app;

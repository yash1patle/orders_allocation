const mysql = require('mysql');

var connection = mysql.createConnection({
    port: 3306,
    host: 'localhost',
    user: 'greatweb_orderAllocation',
    password: 'greatweb_order_allocation',
    database: 'greatweb_order_allocation',
    multipleStatements:true
}) 

connection.connect((err) => {

    if(!err){
        console.log('Connected')
    }
    else{
        console.log(err)
    }
});

module.exports = connection;
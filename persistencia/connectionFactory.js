var mysql = require('mysql')

function createDBConnection(){
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'eaa69cpxy2',
        database: 'payfast'
    })
}

module.exports = () => {
    return createDBConnection
}
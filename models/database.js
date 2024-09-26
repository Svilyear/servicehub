const {Sequelize } = require('sequelize');
//create instance and connect to mysql
const sequelize = new Sequelize('servicehub','root', 'Vill@4171#', {
    host: 'localhost',
    dialect:'mysql'
});
//test connection
sequelize.authenticate()
.then(() => console.log('connected to MYSQL'))

.catch(err => ('Unable to connect to MYSQL ', err));
module.exports = sequelize;





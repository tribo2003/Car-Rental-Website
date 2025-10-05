const {Sequelize} = require('sequelize')
const sequelize = require('../util/database')
const Place = require('./place')
const {Vehicle} = require('./vehicle')
const {User} = require('./user')


const DailyRental = sequelize.define('Daily',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey: true,
    },
    rental_time:{type: Sequelize.DATE},
    return_time:{type: Sequelize.DATE,allowNull:true},
    rental_point: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Places',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    return_point: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Places',
            key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull:true
    },
    vehicle:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Vehicles',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    payment_method: {
        type: Sequelize.ENUM,
        values: ['Cash', 'ATM', 'Linepay'],
        allowNull: false,
        unique:false,
        defaultValue:'Cash'
    },
    isPay:{type: Sequelize.BOOLEAN,defaultValue: false,unique:false},
    isLent:{type: Sequelize.BOOLEAN,defaultValue: false,unique:false},
    isReturn:{type: Sequelize.BOOLEAN,defaultValue:  false,unique:false},
    feedback:{type: Sequelize.STRING,allowNull:  false,unique:false,default:''},
    price:{type: Sequelize.INTEGER,defaultValue: 0,unique:false},
    classify: {
        type: Sequelize.ENUM,
        values: ['day', 'Month'],
        allowNull: false,
        unique:false,
        defaultValue:'day'
    },
})



DailyRental.belongsTo(Place, { as: 'rentalPlace', foreignKey: 'rental_point', onDelete: 'CASCADE' });
DailyRental.belongsTo(Place, { as: 'returnPlace', foreignKey: 'return_point', onDelete: 'CASCADE' });
DailyRental.belongsTo(Vehicle, { foreignKey: 'vehicle', onDelete: 'CASCADE' });
DailyRental.belongsTo(User, { foreignKey: 'user', onDelete: 'CASCADE' });

Place.hasMany(DailyRental, { as: 'RentalPlaces', foreignKey: 'rental_point', onDelete: 'CASCADE' });
Place.hasMany(DailyRental, { as: 'ReturnPlaces', foreignKey: 'return_point', onDelete: 'CASCADE' });
Vehicle.hasMany(DailyRental, { foreignKey: 'vehicle', onDelete: 'CASCADE' });
User.hasMany(DailyRental, { foreignKey: 'user', onDelete: 'CASCADE' });






module.exports  = { DailyRental }
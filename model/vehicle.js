const {Sequelize} = require('sequelize')
const sequelize = require('../util/database')

const Brand = sequelize.define('Brand',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey: true,
    },
    name: {type: Sequelize.STRING,allowNull:  false, unique:true},
    en_name : {type: Sequelize.STRING,allowNull:  false, unique:true},
})

const Vehicle = sequelize.define('Vehicle',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey: true,
    },
    name: {type: Sequelize.STRING,allowNull:  false,unique:false},
    age: {type: Sequelize.INTEGER,allowNull:  false,unique:false},
    type: {
        type: Sequelize.ENUM,
        values: ['car', 'Luxury_car', 'RV','boxcar','motorcycle', 'truck'],
        allowNull: false,
        unique:false
    },
    image: {type: Sequelize.STRING,allowNull:  false,unique:false},
    introduction : {type: Sequelize.STRING,allowNull:  false,unique:false},
    license_plate: {type: Sequelize.STRING,allowNull:  false, unique: true},
    price :{type:Sequelize.INTEGER ,allowNull:  false, unique: false,default:0},
    subscription :{type:Sequelize.INTEGER ,allowNull:  false, unique: false,default:0},
    brandId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Brands',
            key: 'id',
        },
        onDelete: 'CASCADE',
    }
})

Brand.hasMany(Vehicle, { foreignKey: 'brandId' ,onDelete: 'CASCADE',});
Vehicle.belongsTo(Brand, { foreignKey: 'brandId' });
module.exports  = {Brand,Vehicle}
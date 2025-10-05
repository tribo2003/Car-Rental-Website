const {Sequelize} = require('sequelize')
const sequelize = require('../util/database')

const User = sequelize.define('User',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey: true,
    },
    name: {type: Sequelize.STRING,allowNull:  false,unique: false},
    password: {type: Sequelize.STRING,allowNull:  false,unique: false},
    identity: {type: Sequelize.STRING,allowNull:  false ,unique: true},
    email: {type: Sequelize.STRING,allowNull:  false ,unique: true},
    country: {type: Sequelize.STRING,allowNull:  false,unique: false},
    birthday: {type: Sequelize.STRING,allowNull:  false,unique: false},
    phone: {type: Sequelize.STRING,allowNull:  false,unique: false},
    permission: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1,
        validate: {
            isIn: [[1, 2, 3]]
        }
    }
})


const Comment = sequelize.define('Comment',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey: true,
    },
    text: {type: Sequelize.STRING,allowNull:  false,unique:false},
    userId :{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User, // 引用模型的名称应与定义一致
            key: 'id',
        },
        onDelete: 'CASCADE',
    }

})
User.hasMany(Comment, { foreignKey: 'userId' ,onDelete: 'CASCADE',});
Comment.belongsTo(User, { foreignKey: 'userId' });


module.exports  = {User,Comment}
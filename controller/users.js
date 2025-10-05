const {User} = require('../model/user')
const sequelize = require('../util/database')
const { Op } = require('sequelize');


const login= (req, res, next) => {
    if(req.session.isLogin === true){
        res.redirect('/')
    }else{
        if(req.method === 'GET'){
            res.render('users/login');
        }else{
            User.findOne({where:{'email':req.body['email']}}).then(user=>{
                if(user){
                    if(req.body['password'] === user.password){
                        req.session.isLogin = true
                        req.session.user = user
                        req.session.save()
                        res.send({'errno':0})
                    }else{
                        res.send({'errno':1})
                    }
                }else{
                    res.send({'errno':1})
                }
            }).catch(()=>{
                res.send({'errno':1})
            })
        }
    }
}

const register = async (req, res, next) => {
    if(req.session.isLogin === true){
        res.redirect('/')
    }else{
        if(req.method === 'GET'){
            res.render('users/register');
        }else{
            const name = req.body['name']
            const password = req.body['password']
            const identity = req.body['identity']
            const email = req.body['email']
            const country= req.body['country']
            const birthday= req.body['birthday']
            const phone= req.body['phone']

            const user = await User.findOne({
                where: {
                    [Op.or]: [
                        { email: email },
                        { identity: identity }
                    ]
                }
            })
            if(user){
                res.send({'errno':1})
            }else{
                await User.create({
                    name :name,
                    password: password,
                    identity:identity,
                    email:email,
                    country:country,
                    birthday:birthday,
                    phone:phone,
                })
                res.send({'errno':0})
            }
        }
    }
}

const logout = (req,res,next)=>{
    req.session.destroy()
    res.redirect('/login/')
}

module.exports = {login,register,logout}
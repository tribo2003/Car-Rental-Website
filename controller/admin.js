const {User, Comment} = require('../model/user')
const  {Brand,Vehicle} = require('../model/vehicle')
const Place = require('../model/place')
const sequelize = require('../util/database')
const {where} = require("sequelize");
const {DailyRental} = require('../model/order')
const moment = require('moment');
const {order} = require("./index");


const login = (req, res, next) => {
    if(req.session.isLogin === true){
        res.redirect('/admin/')
    }else{
        if(req.method  === 'GET'){
            res.render('admin/login');
        }else{
            User.findOne({where:{'email':req.body['email']}}).then(user=>{
                if(user){
                    if(user.permission === 1){
                        res.send({'errno':2})
                    }else{
                        if(req.body['password'] === user.password){
                            req.session.isLogin = true
                            req.session.user = user
                            req.session.save()
                            res.send({'errno':0})
                        }else{
                            res.send({'errno':1})
                        }
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
const index = async (req, res, next) => {
    if(!req.session.isLogin || req.session.user.permission === "1"){
        res.redirect('/login')
    }else{
        if(req.method === 'GET'){
            const orders = await DailyRental.findAll({
                include: [
                    {model: User,},
                    {model: Vehicle,}
                ],
                order: [
                    ['rental_time', 'DESC']
                ]
            });
            res.render('admin/index',{
                'user':req.user,
                'orders':orders
            })
        }else{
            if(req.body['type'] === 'isReturn' ){
                const order = await DailyRental.findOne({where:{id:req.body['id']}})
                order.isReturn = true
                await order.save()
            }else if(req.body['type'] === 'notReturn' ){
                const order = await DailyRental.findOne({where:{id:req.body['id']}})
                order.isReturn = false
                await order.save()
            }else if(req.body['type'] === 'isPay' ){
                const order = await DailyRental.findOne({where:{id:req.body['id']}})
                order.isPay = true
                await order.save()
            }else if(req.body['type'] === 'notPay' ){
                const order = await DailyRental.findOne({where:{id:req.body['id']}})
                order.isPay = false
                await order.save()
            }
            res.send('success')
        }
    }
}
const brand = (req, res, next) => {
    if(!req.session.isLogin){
        res.redirect('/admin/login')
    }else{
        if(req.method === 'GET'){
            res.render('admin/brand',{
                'user':req.user
            })
        }else if(req.method === 'POST'){
            Brand.findAll().then(brands=>{
                if(req.body['fetch'] === 1){
                    res.send({'errno':0,'brands':brands})
                }else{
                    sequelize.sync().then(() => {
                        Brand.create({
                            name:req.body['name'],
                            en_name:req.body['en_name']
                        }).then((brand)=>{
                            res.send({'errno':0,'brand':brand})
                        })
                    })
                }
            })
        }else if(req.method === 'PATCH'){
            Brand.destroy({
                where: { id: req.body['id'] }
            }).then(() => {
                Brand.findAll().then(brands=>{
                    res.send({'errno':0,'brands':brands})
                })
            });
        }
    }
}

const vehicle = (req, res, next) => {
    if(!req.session.isLogin){
        res.redirect('/admin/login')
    }else{
        if(req.method === 'GET'){
            res.render('admin/vehicle',{
                'user':req.user
            })
        }else if(req.method === 'POST'){
            if(req.body['fetch'] == 0) {
                const type = {
                    '1': 'car',
                    '2': 'Luxury_car',
                    '3': 'RV',
                    '4': 'boxcar',
                    '5': 'motorcycle',
                    '6': 'truck'
                }
                const typeId = req.body['type']
                Vehicle.create({
                    'brandId': req.body['brand'],
                    'image': req.file.path.replace('public',''),
                    'name': req.body['name'],
                    'age': Number(req.body['age']),
                    'type': type[typeId],
                    'license_plate': req.body['license_plate'],
                    'introduction': req.body['introduction'],
                    'subscription': req.body['sub'],
                    'price': req.body['price']
                }).then((vehicle) => {
                    res.send({'errno': 0,"vehicle":vehicle})
                })
            }else if(req.body['fetch'] === 1){
                Vehicle.findAll().then(vehicles=>{
                    return res.send({'errno': 0,vehicles:vehicles})
                })
            }
        }else if(req.method === 'PATCH'){
            Vehicle.destroy({
                where: { id: req.body['id'] }
            }).then(() => {
                Vehicle.findAll().then(vehicles=>{
                    res.send({'errno':0,'vehicles':vehicles})
                })
            });
        }
    }
}
const place = (req, res, next) => {
    if(!req.session.isLogin){
        res.redirect('/admin/login')
    }else{
        if(req.method === 'GET'){
            res.render('admin/place',{
                'user':req.user
            })
        }else if(req.method === 'POST'){
            Place.findAll().then(places=>{
                if( req.body['fetch'] === 1 ){
                    res.send({'errno':0,'places':places})
                } else {
                    Place.create({
                        name:req.body['name'],
                        address:req.body['address'],
                        area:req.body['area'],
                        city:req.body['city'],
                    }).then((place)=>{
                        res.send({'errno':0,"place":place})
                    })
                }
            })
        }else if(req.method === 'PATCH'){
            Place.destroy({
                where: { id: req.body['id'] }
            }).then(() => {
                Place.findAll().then(places=>{
                    res.send({'errno':0,'places':places})
                })
            });
        }
    }
}
const bill = async (req, res, next) => {
    if(!req.session.isLogin){
        res.redirect('/admin/login')
    }else{
        const bill = {}
        const orders = await  DailyRental.findAll()
        orders.forEach(item=>{
            const dateObj = moment(item.rental_time)
            const month = dateObj.month() + 1;
            if(bill[month]){
                bill[month] += item.price
            }else{
                bill[month] = item.price
            }
        })
        const arr = []
        for (const key in bill) {
            arr.push({
                month:key,
                price:bill[key]
            })
        }
        res.render('admin/bill',{
            user:req.user,
            arr:arr,
        })
    }
}


const single= async (req, res, next) => {
    if(!req.session.isLogin){
        res.redirect('/admin/login')
    }else{
        const order = await DailyRental.findOne({
            where:{id:req.params['id']},
            include: [
                {model: User,},
                {model: Vehicle,}
            ],
            order: [
                ['rental_time', 'DESC']
            ]
        });
        res.render('admin/single',{
            user:req.user,
            order:order
        })
    }
}


const calendar = async  (req, res, next) => {
    if(!req.session.isLogin){
        res.redirect('/admin/login')
    }else{

        const orders = await DailyRental.findAll({
            include: [
                {model: Vehicle}
            ],
            order: [
                ['rental_time', 'DESC']
            ]
        });
        if(req.method ==='GET'){
            res.render('admin/calendar',{
                'user':req.user,

            })
        }else{
            const daily = []
            const Month = []
            orders.forEach(item=>{
                if(item.Vehicle.id === Number(req.params['id'])){
                    if(item.classify === 'Month'){
                        Month.push(item.rental_time)
                    }else{
                        daily.push({
                            start:item.rental_time,
                            end:item.return_time
                        })
                    }
                }
            })
            res.send({
                'daily':daily,
                'Month':Month
            })
        }
    }
}


module.exports = {login,index,brand,place,vehicle,bill,single,calendar}
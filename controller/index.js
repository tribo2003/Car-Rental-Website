const {Brand,Vehicle} = require('../model/vehicle')
const Place = require('../model/place')
const {DailyRental,Subscription} = require('../model/order')
const {User,Comment} = require('../model/user')
const {isOverlapping} = require('../util/checkDate')

const index = (req, res, next) => {
    if(req.method === 'POST'){
        if(req.session.isLogin){

            if(req.body['single'] === true) {
                DailyRental.findAll({
                    include: [
                        {model: Vehicle}
                    ],
                    order: [
                        ['rental_time', 'DESC']
                    ]
                }).then(orders => {
                    if (orders) {

                        for (const order of orders) {
                            if(Number(req.body['vehicle']) === order.Vehicle.id){
                                const return_date = new Date(req.body['start'])
                                const currentMonth = return_date.getMonth();
                                return_date.setMonth(currentMonth + 1);
                                if (order.classify === 'day') {
                                    if (isOverlapping(req.body['start'], return_date, order.rental_time, order.return_time)) {
                                        res.send({'errno': 2})
                                        return
                                    }
                                } else {
                                    const end = new Date(order.rental_time)
                                    const currentMonth = end.getMonth();
                                    end.setMonth(currentMonth + 1);
                                    if (isOverlapping(req.body['start'], return_date, order.rental_time, end)) {
                                        res.send({'errno': 2})
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    return res.send({errno: 0})
                })
            }else{
                return res.send({errno: 0})
            }
        }else{
            res.send({errno:1})
        }
    }else{
        if(req.session.isLogin){
            res.render('index/index',{
                'user':req.user
            });
        }else{
            if (req.method === 'GET') {
                res.render('index/index', {
                    'user': ''
                });
            }
        }
    }
}



const brand = (req, res, next) => {
    Brand.findAll().then(brands=>{
        return res.send({'brands':brands})
    })
}

const place = (req, res, next) => {
    Place.findAll().then(places=>{
        return res.send({'places':places})
    })
}

const vehicle =  (req,res,next) =>{
    const query = req.query['type']
    const type = {
        'car': "經濟轎車",
        'Luxury_car': '豪華轎車',
        'RV': "休旅車",
        'boxcar': "箱型車",
        'motorcycle': "機車",
        'truck': "貨車/卡車"
    }
    if(query=== undefined || query === "" || query === null) {
        Vehicle.findAll().then(vehicles => {
            vehicles.forEach(item => {
                item.type = type[item.type]
                item.image = item.image.replace("public", "");
                item.introduction = item.introduction.substring(0, 25) + "...."
            })
            if (req.method === "GET") {
                if (req.session.isLogin) {
                    res.render('index/vehicle', {
                        'user': req.user,
                        vehicles: vehicles,
                    });
                } else {
                    res.render('index/vehicle', {
                        'user': '',
                        vehicles: vehicles,
                    });
                }
            } else {
                if (req.body['filter'] === true){

                    let remove_list = []
                    DailyRental.findAll({
                        include: [
                            {model: Vehicle}
                        ],
                        order: [
                            ['rental_time', 'DESC']
                        ]
                    }).then(orders=>{
                        orders.forEach(order=>{
                            const return_date = new Date(req.body['start'])
                            const currentMonth = return_date.getMonth();
                            return_date.setMonth(currentMonth + 1);
                            if(order.classify === 'day'){
                                if(isOverlapping(req.body['start'],return_date,order.rental_time,order.return_time)){
                                    remove_list.push(order.Vehicle.id)
                                }
                            }else{

                                const end = new Date(order.rental_time)
                                const currentMonth = end.getMonth();
                                end.setMonth(currentMonth + 1);
                                if(isOverlapping(req.body['start'],return_date,order.rental_time,end)){
                                    remove_list.push(order.Vehicle.id)
                                }
                            }
                        })
                        let  updatedVehicles = vehicles.filter(item => !remove_list.includes(item.id));

                        updatedVehicles = updatedVehicles.filter(item => {
                            return (req.body['brand'] === '不限'  || item.brandId === Number(req.body['brand']) ) && (req.body['type'] === '不限' || item.type === type[req.body['type']]) && (req.body['low_price'] === '' || item.subscription > Number(req.body['low_price']) )&& ( req.body['high_price'] === '' || item.subscription < Number(req.body['high_price']))
                        });

                        res.send({'vehicles': updatedVehicles})
                    })



                }else{

                    let remove_list = []
                    DailyRental.findAll({
                        include: [
                            {model: Vehicle}
                        ],
                        order: [
                            ['rental_time', 'DESC']
                        ]
                    }).then(orders=>{
                        orders.forEach(order=>{
                            if(order.classify === 'day'){
                                if(isOverlapping(req.body['start'],req.body['end'],order.rental_time,order.return_time)){
                                    remove_list.push(order.Vehicle.id)
                                }
                            }else{
                                const end = new Date(order.rental_time)
                                const currentMonth = end.getMonth();
                                end.setMonth(currentMonth + 1);
                                if(isOverlapping(req.body['start'],req.body['end'],order.rental_time,end)){
                                    remove_list.push(order.Vehicle.id)
                                }
                            }
                        })
                        const updatedVehicles = vehicles.filter(item => !remove_list.includes(item.id));
                        res.send({'vehicles': updatedVehicles})
                    })
                }
            }
        })
    }else{
        Vehicle.findAll({where:{type:query}}).then((vehicles)=>{
            vehicles.forEach(item => {
                item.type = type[item.type]
                item.image = item.image.replace("public", "");
                item.introduction = item.introduction.substring(0, 25) + "...."
            })
            if (req.session.isLogin) {
                res.render('index/vehicle', {
                    'user': req.user,
                    vehicles: vehicles,
                });
            } else {
                res.render('index/vehicle', {
                    'user': '',
                    vehicles: vehicles,
                });
            }
        })
    }
}

const single = (req,res,next) =>{
    const type = {'car':"經濟轎車", 'Luxury_car':'豪華轎車', 'RV':"休旅車",'boxcar':"箱型車",'motorcycle':"機車", 'truck':"貨車/卡車"}
    const id = req.params['id']
    Vehicle.findOne({where:{"id":id}}).then(vehicle=>{
        vehicle.type = type[vehicle.type]
        vehicle.image = vehicle.image.replace("public", "");
        Brand.findOne({where:{"id":vehicle.brandId}}).then(brand=>{
            if(req.session.isLogin){
                res.render('index/single',{
                    'user':req.user,
                    'vehicle':vehicle,
                    'brand':brand,
                    'id':id
                });
            }else{
                res.render('index/single', {
                    'user': '',
                    'vehicle':vehicle,
                    'brand':brand,
                    'id':id
                });
            }
        })
    })
}


const order = async (req, res, next) => {
    if (req.session.isLogin) {
        if(req.method === 'GET') {
            let { classify, vehicle: vehicleId, rental_place: rentalPlaceId, return_place: returnPlaceId, dayDifference, rental_date, return_date } = req.query;
            if(returnPlaceId === 'undefined'  || returnPlaceId=== undefined){
                returnPlaceId = rentalPlaceId
            }
            if(return_date === undefined){
                return_date = ''
            }
            const type = {'car':"經濟轎車", 'Luxury_car':'豪華轎車', 'RV':"休旅車",'boxcar':"箱型車",'motorcycle':"機車", 'truck':"貨車/卡車"}
            const vehicle = await Vehicle.findOne({ where: { id: Number(vehicleId) } });
            const brand = await Brand.findOne({where:{id:Number(vehicle.brandId)}})
            const rental_place = await Place.findOne({ where: { id: Number(rentalPlaceId) } });
            const return_place = await Place.findOne({ where: { id: Number(returnPlaceId) } });
            if (!vehicle || !rental_place || !return_place) {
                return res.status(404).send('Vehicle or place not found');
            }
            let price, time;
            if (classify === 'day') {
                price = Number(dayDifference) * vehicle.price;
                time = dayDifference;
            } else {
                price = vehicle.subscription;
            }
            res.render('index/order', {
                brand, time, vehicle, price, classify, rental_place, return_place,
                user: req.user,
                std_rental_date:rental_date,
                std_return_date:return_date,
                rental_date:rental_date.replace('T'," ").replace('+08:00',""),
                return_date:return_date.replace('T'," ").replace('+08:00',""),
                dayDifference: time,
                type:type[vehicle.type],
                image:vehicle.image.replace("public", "")
            });
        } else {
            if(req.body['classify'] === 'day'){
                DailyRental.create({
                    'rental_time':req.body['rental_time'],
                    'return_time':req.body['return_time'],
                    'rental_point':req.body['rental_point'],
                    'return_point':req.body['return_point'],
                    'vehicle':req.body['vehicle'],
                    'price':req.body['price'],
                    'user':req.user.id,
                    "payment_method":req.body['payment_method'],
                    "classify":"day",
                    "feedback":''
                }).then(()=>{
                    res.send({'errno':0})
                }).catch(e=>{
                    console.log(e)
                    res.send({'errno':1})
                })
            }else{
                DailyRental.create({
                    'rental_time':req.body['rental_time'],
                    'rental_point':req.body['rental_point'],
                    'return_point':req.body['rental_point'],
                    'vehicle':req.body['vehicle'],
                    'price':req.body['price'],
                    'user':req.user.id,
                    "payment_method":req.body['payment_method'],
                    "classify":'Month',
                    "feedback":''
                }).then(()=>{
                    res.send({'errno':0})
                }).catch(e=>{
                    console.log(e)
                    res.send({'errno':1})
                })
            }
        }
    } else {
        res.redirect('/login');
    }
};



const options = {
    timeZone: 'Asia/Taipei', // 使用台北时区
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
};
const formatter = new Intl.DateTimeFormat('en-US', options);

const profile = async (req,res,next) =>{
    if(req.session.isLogin){
        const dailyRentals = await DailyRental.findAll({
            where: {  user: req.user.id },
        });
        const history = []
        for(let item of dailyRentals){

            // console.log(item.isPay)
            console.log("isreturn ",item.isReturn)
            if((Date.now() > item.return_time && item.classify === 'day')|| (item.classify === 'Month' && item.isReturn === true)){
                history.push(item)
            }
            item.isFeedback = !(item.feedback === '')
            item.vehicle = await Vehicle.findOne({where:{id:item.vehicle}})
            item.rental_point = await Place.findOne({where:{id:item.rental_point}})
            item.return_point = await Place.findOne({where:{id:item.return_point}})
            item.rental_time_ = await  formatter.format(item.rental_time).replace(',', '');
            item.return_time_ = await  formatter.format(item.return_time).replace(',', '');
            // console.log(item.isPay)
            if(item.isPay === false){
                item.status = '尚未付款'
            }else{
                if(item.isReturn === false){
                    item.status = '尚未還車'
                }else{
                    item.status = '已歸還車量'
                }
            }
        }
        res.render('index/profile',{
            'user':req.user,
            'dailyRental':dailyRentals,
            'history':history
        });
    }else{
        res.redirect('/login')
    }
}

const comment = async (req,res,next)=>{
    if(req.method === 'POST'){
        if(req.user){
            Comment.create({
                'text':req.body['input_comment'],
                'userId':req.user.id
            }).then(()=>{
                res.send({'errno':0})
            }).catch(e=>{
                res.send({'errno':2})
            })
        }else{
            res.send({'errno':1})
        }
    }else if(req.method === 'PATCH'){
        const comments = await Comment.findAll({
            include: [
                {
                    model: User,
                },
            ],
            order: [
                ['id', 'DESC']
            ]
        });
        res.send({'comments':comments})
    }
}


const feedback = async (req,res,next)=>{
    try{
        const id = req.body['id']
        const feedback = req.body['feedback']
        const order = await DailyRental.findOne({where:{id:id}})
        order.feedback = feedback
        await order.save();
        res.send({'errno':0})
    }catch (e){
        console.log(e)
        res.send({'errno':1})
    }

}

module.exports = {comment,index,place,brand,vehicle,single,order,profile,feedback }
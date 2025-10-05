const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,'public/file')
    },
    filename: function (req,file,cb){
        const unique = Date.now()+Math.round(Math.random()*10)
        console.log(unique+file.originalname)
        cb(null,unique+file.originalname)
    }
})


const filter = (req,file,cb)=>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}


module.exports = {storage,filter}
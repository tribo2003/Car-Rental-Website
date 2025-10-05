const isAuth = (req,res,next)=>{
    if(!req.session.isLogin){
        return res.redirect('/login')
    }
    next()
}


const isAdmin = (req,res,next)=>{
    if(!req.session.isLogin){
        return res.redirect('/login')
    }else{
        if(req.user.permission === "1" || req.user.permission === 1){
            return res.redirect('/login')
        }
    }
    next()
}

module.exports = {isAdmin,isAuth}
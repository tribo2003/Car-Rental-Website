const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');

const app = express();
const sequelize = require('./util/database');

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connect success');

        await sequelize.sync();
        console.log('Database created!');
    } catch(e) {
        console.log(e)
        console.error('Unable to connect to the database');
    }
})();



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const session = require('express-session')
const Session = require('./model/session')
const SequelizeStore = require('connect-session-sequelize')(session.Store);

Session.sync();
const store = new SequelizeStore({
  db: sequelize,
  table: 'Session'
});
// 使請求會自動生成 session-cookie
app.use(
    session({
        secret:'secret',
        store:store,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000*24 // 1 hour * 24
        }
    })
)

const {User} = require('./model/user')
// 登入中間件的設定
app.use((req,res,next)=>{
    res.locals.isAuthenticated = req.session.isLogin;
    if(!req.session.user){
        req.session.isLogin = false
        res.locals.isAuthenticated = false
        next()
    }else{
        User.findOne({where:{"email":req.session.user.email}}).then(user=>{
            req.user = user
            next()
        })
    }
})

const multer = require('multer');
const {storage,filter} = require('./util/photo')
app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/admin/',multer({storage}).single('file'),adminRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;

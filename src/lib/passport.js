const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const pool=require('../database');
const helpers=require('../lib/helpers');

passport.use('local.signin',new LocalStrategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback:true
},async (req,username,password,done)=>{
    const rows=await pool.query('SELECT * FROM usuario WHERE username=?',[username]);
    if (rows.length>0) {
        const user=rows[0];
        
        const validPassword=await helpers.matchPassword(password,user.password);
        if (validPassword) {
            done(null,user,req.flash('success','welcome '+user.username));
        }
        else{

            done(null,false,req.flash('message','incorrect password'));
        }
    }
    else{
        return done(null,false,req.flash('message','the username does not exists'));
    }
}));


passport.use('local.signup',new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback:true
},async (req,username,password,done)=>{
    // console.log(req.body);
    const {fullname}=req.body;
    const newuser={
        username,password,fullname
    };
    newuser.password=await helpers.encryptPassword(password);
    const result=await pool.query('INSERT INTO USUARIO SET ?',[newuser]);
    // console.log(result);
    newuser.id=result.insertId;
    return done(null,newuser);
}));
passport.serializeUser((user,done)=>{
    done(null,user.id);
});
passport.deserializeUser(async (id,done)=>{
    try {
        console.log("ID OSCAR"+id);
        const usuarios=await pool.query('SELECT * FROM USUARIO WHERE id=?',[id]);
        if (!usuarios[0]) {
            return done(null,null);
        }
        else{
            done(null,usuarios[0]);
        }
      } catch (e) {
        done(null,null);
      }
});
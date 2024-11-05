const express =  require('express');
const app = express();
const cookiesParser = require('cookie-parser');
const session = require('express-session');

app.use(session ({
    secret: 'secretcookiews', 
    resave: false, 
    saveUninitialized:true }) 
);


app.get('/countSession', (req,res)=>{

    if(req.session.count){
        req.session.count ++;
    }else{
        req.session.count = 1;
    }

    res.send(`Number of session is ${req.session.count}`);

})





// app.get('/test', (req,res)=>{
//     res.send('expression Session');
// })



// app.use(cookiesParser('sercretcode'));

// app.get('/signedCookies',(req,res)=>{
//     res.cookie('made-In', 'India', { signed: true });
//     res.send('Signed cookies have been stored');
    
// });


// app.get('/verifyCookies',(req,res)=>{
//     console.log(req.signedCookies);
//     console.log(req.cookies);
//     res.send('verified');
// })




// app.get('/cookies',(req,res)=>{
//     res.cookie('greet', 'hello');
//     res.cookie('madeIn','India');
//     res.send('cookies are being stored');
// })

// app.get('/greet', (req,res)=>{
//     let {name = 'anonymous'} = req.cookies;
//     console.log(name);
//     res.send(`Hi, ${name}`);
// })


app.listen(3000, ()=>{
    console.log('server is listening');
})
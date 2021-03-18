const express=require("express");
const bodyParser = require('body-parser')
const data =require("sqlite3");
const friends = require("./class/amisclass.js");


function init(){

    const router =express.Router();
         
    router.use(express.json());

    router.use((req, res, next) => {

        console.log('API: method %s, path %s', req.method, req.path);
        
        console.log('Body', req.body);
        
        next();
    });

    const db=new data.Database("frdsdata",(err)=>{
        
        if(err){
        
            throw err;
    
        }
    
    });
       
    const user= new friends.default(db)
 
    router.use(bodyParser.urlencoded({
    
        extended: true
      
    }));

    router.get('/',(req,res)=>{
    
        res.send("ok your in amis.js noice !");
    
    });

    router.post("/bound", async (req, res) => {
        
       
    });



    router.post("/unbound", async(req,res)=>{

    });
        
    
    return router;
}


exports.default = init;








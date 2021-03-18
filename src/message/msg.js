const express=require("express");
const bodyParser = require('body-parser')
const Datastore = require('nedb')
const message= require("./class/clsmsg.js");

function init(){

    const router =express.Router();
    
    const db=new Datastore('msgdata.db')   // creation de notre database  

    db.loadDatabase()      // telecharger le fichier 

    db.find({id:"index"},(err,data)=> {
        console.log("on est pas encore la ")

        if(data.length==0){                    

            db.insert({id:'index',value:-1});
        
        }
    
    })

    const msg=new message.default(db);

    router.use(express.json());

    router.use((req, res, next) => {

        console.log('API: method %s, path %s', req.method, req.path);
        
        console.log('Body', req.body);
        
        next();
    
    });
   
    router.use(bodyParser.urlencoded({
      
        extended: true
    
    }));

    const authen=(req, res, next) => {

        if (req.session.user_id) {
        
            next();
        
        } else {
        
            req.session.error = "You have to Login first";
        
            res.redirect("/login_page");
        
        }
    }; 


    router.post("/make_msg",authen,async(req,res)=>{
        
        try{
            
            const {message}=req.body 

            if(!message){

                res.status(400).json({
                
                    status: 400,
                
                    "message": "Requête invalide : login et password nécessaires"
                
                })
                
                return;
            }
            
            if(await msg.insert(req.session.user_id,req.session.pseudo_name,message)){
                console.log("good")
                d=await msg.getMessage(req.session)
               // console.log("great")
                //console.log("fghjklmù",d)
                res.status(200).render("chatroom");

            }

        }catch(err){
            
            res.status(500).json({
                
                status: 500,
                
                message: err,
                
                details: ("Erreur inconnue ta3 catch").toString()
           
            });
        }
    })


    router.get("/get_msg",authen, async(req,res)=>{

        try{
                        
            const allmsg=await msg.getMessage(req.body);

            res.status(200).redirect("");
        
        }catch(err){
            
            res.status(500).json({
               
                status: 500,
               
                message: "erreur interne",
               
                details: ("Erreur inconnue ta3 catch").toString()
            
            }).render("chatroom",allmsg)  }
 
    })

    router.delete("/del_message",authen, async(req,res)=>{

        try{
             
           if(await msg.delmessage(req.body)){

            res.status(200).send(allmsg);

           }
           throw Error;

        }catch(err){
            
            res.status(500).json({

                status: 500,
                
                message: "erreur interne",
                
                details: ("Erreur inconnue ta3 catch").toString()
            
            });
        }    
    })




    router.post("/add_comment",authen, async(req,res)=>{


        try{
             
           if(await msg.delmessage(req.body)){

            res.status(200).send(allmsg);

           }

           throw Error;

           

     
        }catch(err){
            
            res.status(500).json({

                status: 500,
                
                message: "erreur interne",
                
                details: ("Erreur inconnue ta3 catch").toString()
            
            });
        }    
    })



    router.delete("/del_comment",authen, async(req,res)=>{

        try{
             
           if(await msg.delmessage(req.body)){

            res.status(200).send(allmsg);

           }
           throw Error;

           

     
        }catch(err){
            
            res.status(500).json({

                status: 500,
                
                message: "erreur interne",
                
                details: ("Erreur inconnue ta3 catch").toString()
            
            });
        }    
    })








    return router;

}


exports.default = init;
const express=require("express");
const bodyParser = require('body-parser')
const data =require("sqlite3");
const New_user = require("./classe/new_user.js");


function init(){

    const router =express.Router();
         
    router.use(express.json());

    router.use((req, res, next) => {

        console.log('API: method %s, path %s', req.method, req.path);
        
        console.log('Body', req.body);
        
        next();
    });

    const db=new data.Database("mydata",(err)=>{
        
        if(err){
        
            throw err;
    
        }
    
    });
       
    const user= new New_user.default(db)
 
    router.use(bodyParser.urlencoded({
    
        extended: true
      
    }));

    router.get('/',(req,res)=>{
    
        res.send("ok your in input.js noice !");
    
    });

    router.post("/register", async (req, res) => {
        
        try{

            const {email , first_name, last_name, password, pseudo_name}=req.body


            if(!email || !first_name || !last_name || !password || !pseudo_name){

                res.status(400).json({

                    status: 400,
                    
                    "message": "Requête invalide : il faut remplire tout les champs !"
                
                }).redirect("/register_page")
                
                return;
            }
            
            
            if(await user.exists(email,pseudo_name)){
                
                res.status(400).json({
                
                    status: 400,
                
                    "message": "l'utilisateur existe deja !!"
                
                }).redirect("/register_page")

            }else{

                if(await user.register(email,first_name,last_name,password,pseudo_name)){

                    res.status(200).redirect("/login_page")
               
                }

            }
                
               

        }catch(err){
            
            res.status(500).json({

                status: 500,
                
                message: err,
                
                details: ("erreur in catch(reject propablement)").toString()
            });
        }
    })



    router.post("/login", async(req,res)=>{

        const {email, password}=req.body

        console.log(req.body)

        var data;

        if(data=await user.existsuser(email,password)){


            req.session.user_id=data.user_id
            
            req.session.pseudo_name=data.pname

            console.log(req.body)
            
            req.session.auth=true
            
            res.redirect('/authentification/authentified')
        
        }else{
        
            res.status(400).json({
        
                status: 400,
        
                "message": "email ou password inexistant"
            });
            
        }

        return;
        
    });
    
    const authen=(req, res, next) => {
        
        if (req.session.auth) {
        
            next();
        
        } else {
        
            req.session.error = "You have to Login first";
        
            res.redirect("/login_page");
        }
    }; 

    router.get("/authentified",authen,async(req,res)=>{        
        
        res.render('authentified') 
    
    })
    

    router.get("/logout",async(req,res)=>{
    
        
        req.session.destroy((err) => {
    
            if (err) throw err;
    
            res.redirect("/login_page");
    
        });
    
    })
    
    return router;
}


exports.default = init;
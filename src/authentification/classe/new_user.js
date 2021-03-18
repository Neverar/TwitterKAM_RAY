const express = require("express");

/* 
CLASS : New Utilisateur 
cette class est chargé de crée la base de donnée pour les users 
ca fonction consiste a insere les nouveau utilisateurs 
verifier l'exitance de user 
*/

class New_user{
    
    constructor(db){
        /*
        @param (database) cette arg va nous permettre de crée et de manipuler les tables 
        */

        this.db=db
    

        /* creation de notre table user avec les attribue suivent 
            user_id -> primary key
            fname -> first name
            lname -> last name
            pname -> pseudo name 
            email 
            password -> mot de passe
        */ 

        this.db.run("CREATE TABLE IF NOT EXISTS data(user_id INTEGER PRIMARY KEY  AUTOINCREMENT,fname VARCHAR(100),lname VARCHAR(100),pname VARCHAR(100) ,email VARCHAR(100),password VARCHAR(100))");

    }


    register(email,first_name,last_name,password,pseudo_name){
        /* 
        @param les information du nouveau utilisateur 
        @return une promesse qui va insere cet utilisateur dans notre base de donné sql qu'on crée dans le constructeur 
        */
        return new Promise((resolve,reject)=>{

            const stmt=this.db.prepare("INSERT INTO data(fname,lname,pname,email,password) VALUES(?,?,?,?,?)")
            
            stmt.run([first_name,last_name,pseudo_name,email,password],(err)=>{
                
                if(err){
                
                    reject("impossible de crée cette utilisateur !");
            
                }

                console.log(this.us)
           
                resolve("utilisateur crée avec succés")
            
            })
        
            
        })
    }

    exists(email,pseudo_name){
        
        /*
        cette fonction est utliser avant la création d'un nouveau utilisateur 
        @param information de l'utilisateur qui doivent etre unique (d'apres mon avis)
        @return le resulat de nos recherche si le user existe un on renvoie une affirmation sinon on 
        notifie au serveur que cette utilisateur existe .
        */

        return new Promise((resolve,reject)=>{

            let requete ="SELECT email , pname FROM data WHERE email=? AND pname=?"
            
            this.db.all(requete, [email,pseudo_name], (err, data) => {
            
                if (err) {
            
                    reject("erreur dans notre base de donnée ")
            
                } else {
            
                    if (data.length != 0) {
            
                        resolve(1)  // 1 indique que l'utilisateur existe déja, 0 sinon 
            
                    } else {
            
                        resolve(0)
                    }
                }
            });
            
        })

    }

    existsuser(email,password){
    /*
    cette partie est utilisé au momment du login 
    @param email
    @param mot de passe
    @return l'affiramtion que ce mot de passe correspond a cet email 


    */
        return new Promise((resolve,reject)=>{

            let requete ="SELECT email, password , user_id ,pname FROM data WHERE email=? AND password=?"
                
                this.db.all(requete, [email, password], (err, data) => {
                    
                    if (err) {
                        
                        reject("erreur a au niveau de la base de donnée")
                    
                    } else {
                    
                        if (data.length != 0) {
                           
                            resolve(data[0]) // de la meme maniere que dans la fonction précédante 
                    
                        } else {
                    
                            reject("mot de passe ou email incorrect !")
                    
                        }
                    
                    }
                });
                
    });
    
    
    }




    closedb(){

        this.db.close((err)=>{
            
        if(err){

            throw err
        }

        console.log("you succesfuly close your data base !!!!!!")
        
    })
    }
}

exports.default = New_user;

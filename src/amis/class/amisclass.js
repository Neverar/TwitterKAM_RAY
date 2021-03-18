const express = require("express");

/* 
CLASS : amis 
cette class est chargé de crée la base de donnée pour les couple d'amis 
ca fonction consiste a insere les nouveau amis 
verifier l'exitance de ces dernier 
*/

class clsfriends{
    
    constructor(db){
     

        this.db=db
    
 

        this.db.run("CREATE TABLE IF NOT EXISTS Friends (from_user INTEGER NOT NULL, to_user INTEGER NOT NULL, date TIMESTAMP NOT NULL)");

    }


    bound(from_user,to_user){
        
        return new Promise((resolve,reject)=>{

            const stmt=this.db.prepare("INSERT INTO Friends(from_user,to_user) VALUES(?,?)")
            
            stmt.run([from_user,to_user],(err)=>{
                
                if(err){
                
                    reject("impossible de crée cette amitié !");
            
                }

                console.log(this.us)
           
                resolve("Know your friends !")
            
            })
        
            
        })
    }

    exists(from_user,to_user){
        
        /*
        cette fonction est utliser avant la création d'un nouveau utilisateur 
        @param information de l'utilisateur qui doivent etre unique (d'apres mon avis)
        @return le resulat de nos recherche si le user existe un on renvoie une affirmation sinon on 
        notifie au serveur que cette utilisateur existe .
        */

        return new Promise((resolve,reject)=>{

            let requete ="SELECT from_user,to_user FROM Friends WHERE from_user=? AND to_user=?"
            
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

    unBound(from_user,to_user){
        
        return new Promise((resolve,reject)=>{

            const stmt=this.db.prepare("DELETE FROM Friends WHERE from_user=? AND to_user=? ")
            
            stmt.run([from_user,to_user],(err)=>{
                
                if(err){
                
                    reject("impossible de crée cette utilisateur !");
            
                }

                console.log(this.us)
           
                resolve("thats sad !")
            
            })
        
            
        })
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

exports.default =clsfriends;
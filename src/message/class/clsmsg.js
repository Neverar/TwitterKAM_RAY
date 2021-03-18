class message{

    constructor(db){

        this.db=db

        this.db.loadDatabase()
        
    }





    insert(user_id,pseudo,message){

        return new Promise((resolve,reject)=>{

            this.db.findOne({id:"index"},(err,doc)=>{
                
                if(err){

                    reject("index not found")
                
                }else{

                    console.log("inder");

                    console.log(doc);

                    this.db.insert({
                        
                        user_id:user_id,
                        
                        pseudo_name : pseudo,

                        message:message,
                
                        message_id:++doc.value,
                
                        comment: new Set(),
                
                        date: new Date()

                    },(err)=> {
                        if(err){

                            reject("error with the insertion !")
                        
                        }else{
                        
                            this.db.update({id:"index"},{$set :{value:++doc.value}})
                            resolve("susses !")
                        
                        }
                    })
                }
            })
            
        });
    }




    getMessage(data){
        // data =req.session
        return new Promise((resolve,reject)=>{
            console.log("we are in message")
            console.log(data)
            console.log("we are in message v5") 
            
            let ma_requete={}

            console.log("we are in message v4") 

            if (data.user_id){
                ma_requete.user_id=data.user_id ;
            }

            console.log("we are in message v5")
            if (data.pseudo_name){
                ma_requete.pseudo_name=data.pseudo_name;
            }


            if (data.message_id){
                ma_requete.message_id=data.message_id;
            }

            console.log(ma_requete)
            console.log("ici")
            console.log("ici")


            this.db.find( {user_id: 2, pseudo_name: 'r'} ,(err,doc)=>{

                console.log("we are in message 2")

                if(err){
        
                    reject("no data found !");
        
                }else{
                    
                    resolve(doc);
        
                }
            })
        })
       
    
    }


    delMessage(data){

        return new Promise((resolve,reject)=>{
            this.data.remove({user_id:data.user_id, pseudo_name : data.pseudo,message_id: data.message_id},(err,doc)=>{
        
                if(err){
        
                    reject("Huston !; we have a problem(problem with del) ");
        
                }else{
        
                    resolve(doc);
        
                }
            })
        })
       
    
    }
    
    addcomment(data){

        return new Promise((resolve,reject)=>{
            
            this.data.update({ message_id: data.message_id }, { $addToSet: {comment:{user_id: data.user_id, comment:data.comment}} }, {}, (err)=>{
               if (err){
                   reject("add comment with issue ")
               }
               resolve("comment added with succes ")
            }); 
        });
    }



    delcomment(data){

        return new Promise((resolve,reject)=>{
            
            this.data.update({ message_id: data.message_id }, { $pull: {comment:{user_id: data.user_id, comment:data.comment}} }, {}, (err)=>{
               if (err){
                   
                   reject("add comment with issue ")
               }
               
               resolve("comment added with succes ")
            
            }); 

        });
    }


    close(){
        this.db.close();
    }

}

exports.default = message;
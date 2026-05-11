import mongoose from "mongoose";

export const connect_db=async()=>{
    try {
     const connection=   await mongoose.connect(process.env.MONGO_URL)
     if(connection){
        console.log("database successfully connection....");
        
     }else{
        console.log("error in database connection");
        
     }
    } catch (error) {
        console.log(error);
        
        
    }
}
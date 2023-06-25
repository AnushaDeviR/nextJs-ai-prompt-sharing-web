import mongoose from "mongoose";

let isConnected = false

export const connectToDB = async () => {
    mongoose.set('strictQuery', true)

    if(isConnected) { 
        console.log("[CMD] | connectToDB | MongoDB Connected")
        return   
    }
    try { 
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'share_prompt',
            useNewUrlParser: true, 
            useUnifiedTopology: true,
        })

        isConnected = true
        console.log("[CMD] | connectToDB | isConnected:", isConnected)

    } catch (error) { 
        console.error(error);
    }
}

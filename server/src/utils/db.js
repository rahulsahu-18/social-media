import mongoose from "mongoose"

export const connectdb = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("mongodb connect successfull")
    } catch (error) {
                console.log("mongodb connect faield")
    }
}
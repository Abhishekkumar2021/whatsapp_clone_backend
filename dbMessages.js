import mongoose from 'mongoose'

const whatsappSchema = new mongoose.Schema({
    message:String,
    timestamp:String,
    name:String,
    recieved:Boolean
})

export default mongoose.model('messagecontent',whatsappSchema); 
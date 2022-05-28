// importing
import express from "express"
import mongoose from "mongoose"
import Messages from './dbMessages.js'
import Pusher from 'pusher'
import cors from 'cors'
const PORT = process.env.PORT || 9000;

const db = mongoose.connection;
db.once("open",()=>{
    console.log("DB connected");
    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();
    changeStream.on('change',(change)=>{
       if(change.operationType==='insert'){
           const messageDetails = change.fullDocument;
           pusher.trigger('messages','inserted',{
               name:messageDetails.name,
               message:messageDetails.message,
               timestamp:messageDetails.timestamp,
               recieved:messageDetails.recieved

           })
       }else{
           console.log("Error triggering pusher!");
       }
    })
})


// App config
const app = express();


// Middlewares
app.use(express.json())
app.use(cors())


// DB config
mongoose.connect("mongodb+srv://admin:jvwtCyAxQZj9Phuh@cluster0.jtbso.mongodb.net/?retryWrites=true&w=majority",{
    // useCreateIndex:true,
    // useNewUriParse:true,
    // useUnifiedTopology:true
})


// pusher
const pusher = new Pusher({
    appId: "1415401",
    key: "cdbda62dc4f6b4d7034a",
    secret: "b8ff92f138db89622ac9",
    cluster: "ap2",
    useTLS: true
  });
  


// api routes
app.get("/",(req,res)=>{
    res.status(200).send("Hello world");
})
app.post('/messages/new',(req,res)=>{
    const dbMessage = req.body;
    Messages.create(dbMessage,(err,data)=>{
        if(err)
        res.status(500).send(err);
        else res.status(201).send(data)
    })
})

app.get('/messages/sync',(req,res)=>{
    Messages.find((err,data)=>{
        if(err)
        res.status(500).send(err);
        else res.status(200).send(data)
    })
})

// listener
app.listen(PORT,()=>{
    console.log("Your app is running on "+ PORT)
})


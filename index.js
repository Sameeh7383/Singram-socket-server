const io= require("socket.io")(4000,{
    cors:{
        origin:"http://localhost:3000"
    }
});

let connections=[]

const addConnection = (user_id,socket_id)=>{
!connections.some((connection=>connection.user_id==user_id)) &&
connections.push({user_id:user_id,socket_id:socket_id})
}
const findUser=async (userId)=>{
return await connections.find((connection=>connection.user_id===userId))
}
const disconnect=(socketId)=>{
    connections=connections.filter(connection=>connection.socket_id!=socketId)
}

io.on("connection",(socket) => {
console.log("user connected");
socket.on("connect1",userId=>{
    addConnection(userId,socket.id)
    io.emit("getConnections",connections)
})
socket.on("ping",async({senderId,recieverId,content})=>{
    console.log(senderId,recieverId,content)
    console.log(connections)
    let user= await findUser(recieverId)
    io.to(user.socket_id).emit("getMessage",{sender:senderId,text:content})
})
socket.on("typing",async ({senderId,recieverId})=>{
    let user= await findUser(recieverId)
    console.log(user)
    io.to(user.socket_id).emit("typingUpdate",{sender:senderId,typing:true})
})
socket.on("offTyping",async ({senderId,recieverId})=>{
    let user=await findUser(recieverId)
    console.log("sameeh2")
    io.to(user.socket_id).emit("typingUpdateOff",{sender:senderId,typing:false})
})

socket.on("disconnect",async ()=>{
    console.log("user disconnected");
     await disconnect(socket.id)
    io.emit("getConnections",connections)
})
// io.emit("hey","Hai,this is the first socket message of mine, this is just a start"); 
})
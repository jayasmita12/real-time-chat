const socket = io();

const form = document.getElementById("form");
const input = document.getElementById("input");
const container = document.querySelector(".messageContainer");
const joinChatBtn = document.getElementById("join-chat")
const groupName = document.getElementById("group-name")
const chatWindow = document.getElementById("chat-window")
chatWindow.classList.add("hidden")
let audio = new Audio("ring.mp3")

//append Function
const appendFunction = (user , message , position , color) =>{
    const userName = document.createElement("p")
    userName.innerText=user
    userName.classList.add("font-bold" , "text-blue-600")
    const messageElement = document.createElement("p");
    messageElement.innerText = message;
    messageElement.classList.add(
    "text-sm",
    "font-medium",
    "shadow-xl",
    "w-fit",
    "rounded-lg",
    "py-1",
    "px-3",
    `bg-[${color}]`,
    "flex",
    `justify-self-${position}`
  );
  container.append(userName , messageElement);
  if(position == "start"){
    audio.play()
  }
}


//new user join the chat
joinChatBtn.addEventListener("click",(e)=>{
    const userName = prompt('Enter your name:');
    console.log(userName ,"join the chat")
    groupName.classList.add("hidden")
    chatWindow.classList.remove("hidden")
    socket.emit('new-user-joined', userName);  
    appendFunction("" ,`${userName} join the chat.` , 'center' , "#fff6b8")
})

//msg sent to every one
socket.on("message-to-all", (data) => {
    console.log(data)
  appendFunction(data.name , data.message , 'start' , "#d9fdd3")
});

//chat input msg send to every one. 
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value !== "") {
    socket.emit("chat-message-from-you", `${input.value}`)
    appendFunction("", input.value , 'end' , "#d9fdd3")
    input.value = "";
  }
});

socket.on("user-left" , name=>{
    appendFunction("",`${name} left the chat` , 'center' , "#fff6b8")
})



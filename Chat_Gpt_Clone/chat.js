const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");
let bot_Image = document.querySelector(".Bot-image")
const black_Box = document.querySelector(".black-box");
const New_Chat = document.querySelector(".New_chat");
let userText = null;
const API_KEY = "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";
const loadDataFromLS = () => {
    const themeColor = localStorage.getItem("themeColor");
    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
    const defaultText = `<div class="default-text">
                              <img src="chat_gpt_Logo.png" style="border-radius: 100px;" alt="Bot" height="50px" width="50px">
                            <h1>ChatGPT</h1>
                            <p>Start a conversation and explore the power of AI.<br> Your chat history will be displayed here.</p>
                        </div>`;

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
};
const createChatElement = (content, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv;
};
const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const pElement = document.createElement("p");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo-0613",
            messages: [
                {
                    role: 'user',
                    content: userText,
                }
            ],
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    };
    try {
        const response = await fetch(API_URL, requestOptions);
        const responseData = await response.json();
        const responseContent = responseData.choices[0].message.content;
        // Split response content into words
        const words = responseContent.split(" ");
        let index = 0;
        // Function to print words one by one with a delay
        const printWord = () => {
            if (index < words.length) {
                pElement.textContent += words[index] + " ";
                index++;
                setTimeout(printWord, 100); // Adjust speed as needed
            }
        };
        // Start printing words
        printWord();
    } catch (error) {
        console.error("Error fetching chat response:", error);
        pElement.classList.add("error");
        pElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";
    }
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
};
const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
};
const showTypingAnimation = () => {
    const html = `<div class="chat-content">
                    <div class="chat-details">
                    <img src="SIMPLE.jpeg" style="border-radius: 20px;" alt="Bot">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>`;
    const incomingChatDiv = createChatElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
};
const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if (!userText) return;

    chatInput.value = "";
    // const initialInputHeight = chatInput.scrollHeight; // Define initialInputHeight here or wherever appropriate
    const html = `<div class="chat-content">
                    <div class="chat-details" >
                        <img src="ZOQ.png" style="border-radius: 20px; alt="BOt">
                        <p>${userText}</p>
                    </div>
                </div>`;

    const outgoingChatDiv = createChatElement(html, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
    black_Box.append(userText);
};
deleteButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all the chats?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLS();
    };
});
New_Chat.addEventListener("click", () => {
    localStorage.removeItem("all-chats");
    loadDataFromLS();
})
themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("themeColor", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    if (black_Box.style.backgroundColor === "#343541") {
        black_Box.style.backgroundColor = "white";
        black_Box.style.border = "10px solid black";
        black_Box.style.color = "black";
    } else {
        black_Box.style.backgroundColor = "#343541";
        black_Box.style.border = "5px solid white";
        black_Box.style.color = "white";
    }
});
// Define initialInputHeight here or wherever appropriate
const initialInputHeight = chatInput.scrollHeight;
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
    console.log("hello")
});
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
    // let element = document.innerHTML = `<div class="content"> <br>`//
    // black_Box.appendChild(element);
});
loadDataFromLS();
sendButton.addEventListener("click", handleOutgoingChat);

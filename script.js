let prompt = document.querySelector("#prompt");
let container = document.querySelector(".container");
let btn = document.querySelector("#btn");
let ChatContainer = document.querySelector(".chat-container");
let userMessage = null;
let api_url =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBwfR4HsfYzAp6dYC6mTCU_LOCVMok_bA8";

function CreateChatBox(html, className) {
  let div = document.createElement("div");
  div.classList.add(className);
  div.innerHTML = html;
  return div;
}

async function getApiResponse(AIChatBox) {
  let textElement = AIChatBox.querySelector(".text");

  try {
    let response = await fetch(api_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();
    console.log("API Response Data:", data); // Debugging

    let ApiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (ApiResponse) {
      textElement.innerText = ApiResponse; // Set the response text
    } else {
      textElement.innerText = "Sorry, no response received.";
    }
  } catch (error) {
    console.error("Error:", error);
    textElement.innerText = "An error occurred while fetching the response.";
  } finally {
    AIChatBox.querySelector(".loading").style.display = "none"; // Hide the loading spinner
  }
}

function showloading() {
  let html2 = `
        <div class="img">
            <img src="AI-chatbot.png" alt="" width="50px">
        </div>
        <p class="text"></p>
        <img class="loading" src="loading-gif.gif" alt="loading" height="50px">
    `;
  let AIChatBox = CreateChatBox(html2, "AI-chat-box");
  ChatContainer.appendChild(AIChatBox); // Append AI chatbox to the chat container
  getApiResponse(AIChatBox);
}

btn.addEventListener("click", () => {
  userMessage = prompt.value;
  if (userMessage == "") {
    container.style.display = "flex";
  } else {
    container.style.display = "none";
  }

  if (!userMessage) return;

  let html = `
        <div class="img">
            <img src="user.png" alt="" width="50px">
        </div>
        <p class="text"></p>
    `;
  let userChatBox = CreateChatBox(html, "user-chat-box");
  userChatBox.querySelector(".text").innerText = userMessage; // Set the user's message
  ChatContainer.appendChild(userChatBox); // Append the user's chatbox to the chat container
  prompt.value = ""; // Clear the input field
  setTimeout(showloading, 500); // Show loading indicator after 500ms
});

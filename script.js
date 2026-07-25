/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const latestQuestion = document.getElementById("latestQuestion");
const WORKER_URL = "https://YOUR-WORKER.workers.dev/";

let messages = [
  {
    role: "system",
    content:
      "You are L'Oréal Beauty Advisor. " +
      "You only answer questions about L'Oréal products, skincare, haircare, makeup, fragrances, beauty routines, and beauty recommendations. " +
      "If someone asks anything unrelated, politely explain that you can only answer beauty and L'Oréal related questions.",
  },
];

// Set initial message

addMessage(
  "assistant",
  "👋 Welcome to the L'Oréal Beauty Advisor! Ask me about skincare, makeup, haircare, fragrances, or personalized beauty routines.",
);

/* Handle form submit */
chatForm.addEventListener("submit", async function (event) {
  // Stop the page from refreshing
  event.preventDefault();

  // Get what the user typed
  const question = userInput.value.trim();

  // Don't send empty messages
  if (question === "") {
    return;
  }

  // Display the user's latest question
  latestQuestion.textContent = question;

  // Show the user's message
  addMessage("user", question);

  // Save it into conversation history
  messages.push({
    role: "user",
    content: question,
  });

  // Clear the textbox
  userInput.value = "";

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        messages: messages,
      }),
    });
    const data = await response.json();

    // Get the AI's answer
    const reply = data.choices[0].message.content;

    // Display the response
    addMessage("assistant", reply);

    // Save the AI's reply
    messages.push({
      role: "assistant",
      content: reply,
    });
  } catch (error) {
    console.error(error);

    addMessage(
      "assistant",
      "Sorry, something went wrong while connecting to the server.",
    );
  }
});
function addMessage(sender, text) {
  // Create a new div
  const message = document.createElement("div");

  // Every message has the "msg" class
  message.classList.add("msg");

  // Decide if it is a user or AI message
  if (sender === "user") {
    message.classList.add("user");
  } else {
    message.classList.add("ai");
  }

  // Put the text inside the message
  message.textContent = text;

  // Add it to the chat window
  chatWindow.appendChild(message);

  // Automatically scroll down
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

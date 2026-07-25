/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const latestQuestion = document.getElementById("latestQuestion");
const WORKER_URL = "https://loreal-beauty-advisor.jprusino.workers.dev/";

let messages = [
  {
    role: "system",
    content:
      "You are L'Oréal Beauty Advisor. " +
      "You only answer questions about L'Oréal products, skincare, haircare, makeup, fragrances, beauty routines, and beauty recommendations. " +
      "If someone asks anything unrelated, politely explain that you can only answer beauty and L'Oréal related questions.",
  },
];

addMessage(
  "assistant",
  "👋 Welcome to the L'Oréal Beauty Advisor! Ask me about skincare, makeup, haircare, fragrances, or personalized beauty routines.",
);

chatForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const question = userInput.value.trim();

  if (question === "") {
    return;
  }

  latestQuestion.textContent = question;

  addMessage("user", question);

  messages.push({
    role: "user",
    content: question,
  });

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

    const reply = data.choices[0].message.content;

    addMessage("assistant", reply);

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
  const message = document.createElement("div");

  message.classList.add("msg");

  if (sender === "user") {
    message.classList.add("user");
  } else {
    message.classList.add("ai");
  }

  message.textContent = text;

  chatWindow.appendChild(message);

  chatWindow.scrollTop = chatWindow.scrollHeight;
}

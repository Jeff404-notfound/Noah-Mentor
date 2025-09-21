// Send message to backend chatbot
async function sendMessage() {
  const input = document.getElementById("userInput").value;
  document.getElementById("chatbox").innerHTML += `<p><b>You:</b> ${input}</p>`;
  
  const res = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({message: input})
  });

  const data = await res.json();
  document.getElementById("chatbox").innerHTML += `<p><b>AI:</b> ${data.reply}</p>`;
}

// Save mood in localStorage
function saveMood() {
  const mood = document.getElementById("moodSelect").value;
  let history = JSON.parse(localStorage.getItem("moods")) || [];
  history.push({mood, date: new Date().toLocaleString()});
  localStorage.setItem("moods", JSON.stringify(history));
  showMoodHistory();
}

function showMoodHistory() {
  let history = JSON.parse(localStorage.getItem("moods")) || [];
  let display = "<h4>Your Mood History:</h4>";
  history.forEach(entry => {
    display += `<p>${entry.date}: Mood ${entry.mood}</p>`;
  });
  document.getElementById("moodHistory").innerHTML = display;
}

showMoodHistory();


let moodChart;
function initializeMoodChart() {
    const ctx = document.getElementById('mood-chart').getContext('2d');
    moodChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Dates
            datasets: [{
                label: 'Mood Score',
                data: [], // Scores
                borderColor: '#474241',
                backgroundColor: 'rgba(118, 199, 192, 0.2)',
                borderWidth: 2,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: 'Date' }
                },
                y: {
                    min: 1,
                    max: 5,
                    ticks: {
                        callback: function(value) {
                            const moods = ['😠', '😢', '😟', '😐', '😊'];
                            return moods[value - 1];
                        }
                    },
                    title: { display: true, text: 'Mood' }
                }
            }
        }
    });
}

// Save Mood
function saveMood(mood) {
    const moodScores = { '😊': 5, '😐': 4, '😟': 3, '😢': 2, '😠': 1 };
    const moodLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];
    moodLogs.push({
        mood,
        score: moodScores[mood],
        date: new Date().toLocaleDateString()
    });
    localStorage.setItem('moodLogs', JSON.stringify(moodLogs));
    updateMoodChart();
}

// Update Mood Chart
function updateMoodChart() {
    const moodLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];
    moodChart.data.labels = moodLogs.map(log => log.date);
    moodChart.data.datasets[0].data = moodLogs.map(log => log.score);
    moodChart.update();
}

// Page Initialization
window.onload = function () {
    initializeMoodChart();
    updateMoodChart();
};

// Navigation
function navigateToMoodTracker() {
    document.getElementById('mood-tracker').scrollIntoView({ behavior: 'smooth' });
}

// Breathing Exercise
// Function to start a breathing exercise based on the mood
function startBreathingExercise(exerciseType) {
    const breathingContainer = document.getElementById('breathing-animation');
    breathingContainer.style.display = 'block'; // Make the breathing container visible
    breathingContainer.innerHTML = ''; // Clear previous animations

    const breathingBox = document.createElement('div');
    breathingBox.classList.add('breathing-box');
    breathingContainer.appendChild(breathingBox);

    let inhaleTime, holdTime, exhaleTime;

    if (exerciseType === 'calm') {
        inhaleTime = 4000; // 4 seconds
        holdTime = 4000; // 4 seconds
        exhaleTime = 6000; // 6 seconds
    } else if (exerciseType === 'anxiety') {
        inhaleTime = 4000; // 4 seconds
        holdTime = 7000; // 7 seconds
        exhaleTime = 8000; // 8 seconds
    } else if (exerciseType === 'grounding') {
        inhaleTime = 5000; // 5 seconds
        holdTime = 5000; // 5 seconds
        exhaleTime = 5000; // 5 seconds
    }

    // Limit to 2 cycles
    startBreathingCycle(breathingBox, inhaleTime, holdTime, exhaleTime, 2);
}

function startBreathingCycle(element, inhaleTime, holdTime, exhaleTime, maxCycles) {
    let cycleCount = 0;

    function speakText(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // Set the language
        speechSynthesis.speak(utterance);
    }

    function breatheIn() {
        if (cycleCount >= maxCycles) {
            stopBreathingCycle();
            return;
        }
        element.style.transform = 'scale(1.5)';
        element.style.transition = `${inhaleTime / 1000}s ease-in-out`;
        speakText("Inhale");
        setTimeout(breatheHold, inhaleTime);
    }

    function breatheHold() {
        element.style.transform = 'scale(1.5)'; // No change during hold
        speakText("Hold");
        setTimeout(breatheOut, holdTime);
    }

    function breatheOut() {
        element.style.transform = 'scale(1)';
        element.style.transition = `${exhaleTime / 1000}s ease-in-out`;
        speakText("Exhale");
        cycleCount++;
        setTimeout(breatheIn, exhaleTime); // Restart the cycle
    }

    function stopBreathingCycle() {
        speakText("Breathing exercise complete.");
        const breathingContainer = document.getElementById('breathing-animation');
        setTimeout(() => {
            breathingContainer.style.display = 'none';
        }, 2000); // Hide the breathing animation after 2 seconds
    }

    breatheIn(); // Start the cycle
}

// Function for Calm Breathing Exercise (for Happy/Relaxed Mood)
function calmBreathing() {
    let i = 0;
    const breathingBox = document.querySelector('.breathing-box.calm');
    const breathAnimation = setInterval(() => {
        if (i % 3 === 0) {
            breathingBox.style.animation = 'breathing-calm-in 4s ease-in-out infinite';
            speak("Inhale");
        } else if (i % 3 === 1) {
            breathingBox.style.animation = 'breathing-calm-hold 4s ease-in-out infinite';
            speak("Hold");
        } else {
            breathingBox.style.animation = 'breathing-calm-out 6s ease-in-out infinite';
            speak("Exhale");
        }
        i++;
    }, 4000); // Change animation every 4 seconds
    setTimeout(() => clearInterval(breathAnimation), 18000); // Stop after 18 seconds
}

// Function for Anxiety Relief Breathing
function anxietyReliefBreathing() {
    const breathingBox = document.querySelector('.breathing-box.anxiety');
    breathingBox.style.animation = 'breathing-anxiety-in 4s ease-in-out infinite';
    speak("Inhale");

    setTimeout(() => {
        breathingBox.style.animation = 'breathing-anxiety-hold 7s ease-in-out infinite';
        speak("Hold");
    }, 4000);

    setTimeout(() => {
        breathingBox.style.animation = 'breathing-anxiety-out 8s ease-in-out infinite';
        speak("Exhale");
    }, 11000);
}

// Function for Grounding Breathing Exercise
function groundingBreathing() {
    const breathingBox = document.querySelector('.breathing-box.grounding');
    breathingBox.style.animation = 'breathing-grounding-in 5s ease-in-out infinite';
    speak("Inhale");

    setTimeout(() => {
        breathingBox.style.animation = 'breathing-grounding-hold 5s ease-in-out infinite';
        speak("Hold");
    }, 5000);

    setTimeout(() => {
        breathingBox.style.animation = 'breathing-grounding-out 5s ease-in-out infinite';
        speak("Exhale");
    }, 10000);
}

// Function to speak the text (Text-to-Speech)
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';  // Set language (can be changed to other languages)
    speechSynthesis.speak(utterance);  // Speak the text
}

// Example CSS Animations
const style = document.createElement('style');
breathingContainer.innerHTML = `
    <div class="breathing-box anxiety"></div>
`;
style.innerHTML = `
    /* Smooth breathing animation */
    @keyframes breathing-calm-in {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.5);
        }
    }

    @keyframes breathing-calm-hold {
        0%, 100% {
            transform: scale(1.5);
        }
    }

    @keyframes breathing-calm-out {
        0%, 100% {
            transform: scale(1.5);
        }
        50% {
            transform: scale(1);
        }
    }

    /* Breathing animation for Anxiety Relief */
    @keyframes breathing-anxiety-in {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.4);
        }
    }

    @keyframes breathing-anxiety-hold {
        0%, 100% {
            transform: scale(1.4);
        }
    }

    @keyframes breathing-anxiety-out {
        0%, 100% {
            transform: scale(1.4);
        }
        50% {
            transform: scale(1);
        }
    }

    /* Breathing animation for Grounding */
    @keyframes breathing-grounding-in {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.3);
        }
    }

    @keyframes breathing-grounding-hold {
        0%, 100% {
            transform: scale(1.3);
        }
    }

    @keyframes breathing-grounding-out {
        0%, 100% {
            transform: scale(1.3);
        }
        50% {
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

// Play selected sound and stop any other sound
function playSound(type) {
    // Pause all audio elements
    document.querySelectorAll('audio').forEach(audio => audio.pause());
  
    // Play the selected sound
    const sound = document.getElementById(type);
    sound.currentTime = 0; // Reset to start
    sound.play();
  
    // Save the user's choice in Local Storage
    localStorage.setItem('currentSound', type);
  }
  
  // Automatically play the saved soundscape on load
  window.onload = () => {
    const savedSound = localStorage.getItem('currentSound');
    if (savedSound) {
      const sound = document.getElementById(savedSound);
      sound.play();
    }
  };


// Gratitude Journal
    function openGratitudeJournal() {
        const journalSection = document.getElementById("journal-section");
        journalSection.style.display = "block";  // Show the journal section
    }

    function saveJournalEntry() {
        const journalEntry = document.getElementById("journal-entry").value;
        const entriesList = document.getElementById("entries-list");

        if (journalEntry.trim() !== "") {
            const listItem = document.createElement("li");
            listItem.textContent = journalEntry;
            entriesList.appendChild(listItem);

            // Clear the textarea after saving the entry
            document.getElementById("journal-entry").value = "";

            // Optionally, save entries to Local Storage
            saveEntriesToLocalStorage();
        } else {
            alert("Please write something before saving!");
        }
    }

    // // Function to save journal entries to Local Storage (Optional)
    function saveEntriesToLocalStorage() {
        const entriesList = document.getElementById("entries-list");
        const entries = [];
        for (let i = 0; i < entriesList.children.length; i++) {
            entries.push(entriesList.children[i].textContent);
        }
        localStorage.setItem("journalEntries", JSON.stringify(entries));
    }

    // Function to load saved entries from Local Storage (Optional)
    function loadEntriesFromLocalStorage() {
        const entries = JSON.parse(localStorage.getItem("journalEntries"));
        if (entries) {
            const entriesList = document.getElementById("entries-list");
            entries.forEach(entry => {
                const listItem = document.createElement("li");
                listItem.textContent = entry;
                entriesList.appendChild(listItem);
            });
        }
    }
function voice(){
    var recognition = new webkitSpeechRecognition();
    recognition.lang="en-GB";
    recognition.onresult = function(event){
        console.log(event);
        document.getElementById("journal-entry").value = event.results[0][0].transcript;
    }
    recognition.start();
}
document.addEventListener('DOMContentLoaded', () => {
    // --- MASTER SWITCH ---
    // In the morning, change this to true to test if the Translation API works.
    // If it gives an error, change it back to false for a safe, English-only demo.
    const APIs_ARE_WORKING = true; 

    const messageList = document.getElementById('message-list');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const langBadge = document.getElementById('lang-badge');
    const langToggleButton = document.getElementById('lang-toggle-btn');
    const micButton = document.getElementById('mic-btn');

    let currentLanguage = 'te';
    let userLocation = null;

    // --- Initial Setup ---
    initializeChat();

    function initializeChat() {
        getUserLocation();
        setupSpeechRecognition();

        // Hide or show the language switcher based on the master switch
        if (!APIs_ARE_WORKING) {
            langToggleButton.style.display = 'none';
            langBadge.textContent = 'EN';
            currentLanguage = 'en';
        }

        messageForm.addEventListener('submit', handleSendMessage);
        langToggleButton.addEventListener('click', toggleLanguage);

        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.getAttribute('data-query');
                messageInput.value = query;
                handleSendMessage(new Event('submit'));
            });
        });

        messageList.addEventListener('click', function(e) {
            const copyBtn = e.target.closest('.copy-btn');
            if (copyBtn) {
                const content = copyBtn.previousElementSibling.textContent;
                navigator.clipboard.writeText(content);
            }
        });
    }

    async function handleSendMessage(e) {
        e.preventDefault();
        const userMessage = messageInput.value.trim();
        if (!userMessage) return;

        renderMessage(userMessage, 'user');
        messageInput.value = '';
        showLoadingIndicator(true);

        try {
            const payload = {
                message: userMessage,
                language: APIs_ARE_WORKING ? currentLanguage : 'en' // Use master switch
            };
            if (userLocation) {
                payload.lat = userLocation.latitude;
                payload.lon = userLocation.longitude;
            }

            const response = await fetch('http://127.0.0.1:5000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            
            // If APIs are off, the reply is in English. Otherwise, it's translated.
            renderMessage(data.reply, 'bot');

        } catch (error) {
            console.error('Error fetching chat response:', error);
            const errorMessage = APIs_ARE_WORKING 
                ? "The Translation API might be disabled. Check your Google Cloud billing account." 
                : "Sorry, I'm having trouble connecting. Please check if the Python server is running.";
            renderMessage(errorMessage, 'bot');
        } finally {
            showLoadingIndicator(false);
        }
    }

    function toggleLanguage() {
        currentLanguage = (currentLanguage === 'te') ? 'hi' : 'te';
        langBadge.textContent = currentLanguage;
    }

    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
            });
        }
    }
    
    function setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            micButton.disabled = true;
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.interimResults = false;
        
        micButton.addEventListener('click', () => {
            recognition.lang = APIs_ARE_WORKING 
                ? (currentLanguage === 'te' ? 'te-IN' : 'hi-IN') 
                : 'en-US'; // Use English if APIs are off
            recognition.start();
        });

        recognition.addEventListener('result', (e) => {
            const transcript = e.results[0][0].transcript;
            messageInput.value = transcript;
        });
    }

    // --- UI Rendering Functions (no changes below this line) ---
    function renderMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        contentDiv.appendChild(textSpan);
        if (sender === 'bot') {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';
            contentDiv.appendChild(copyBtn);
        }
        messageDiv.appendChild(contentDiv);
        messageList.appendChild(messageDiv);
        messageList.scrollTop = messageList.scrollHeight;
    }

    function showLoadingIndicator(show) {
        let loadingIndicator = messageList.querySelector('.loading');
        if (show) {
            if (!loadingIndicator) {
                loadingIndicator = document.createElement('div');
                loadingIndicator.className = 'message bot loading';
                loadingIndicator.innerHTML = '<span></span><span></span><span></span>';
                messageList.appendChild(loadingIndicator);
                messageList.scrollTop = messageList.scrollHeight;
            }
        } else {
            if (loadingIndicator) loadingIndicator.remove();
        }
    }
});
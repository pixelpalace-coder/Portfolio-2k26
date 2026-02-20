/* ========================================
   CHATBOT.JS — "Shy" AI Assistant
   ======================================== */

const SHY_RESPONSES = {
    greeting: [
        "Hi there! I'm Shy, Suryansh's assistant. How can I help you today?",
        "Hello! I'm Shy — feel free to ask me anything about Suryansh's work."
    ],
    skills: [
        "Suryansh is primarily a Python programmer, skilled in libraries like Pandas, Matplotlib, Streamlit, Pygame, and pyttsx3. On the web side, he works with HTML, CSS, JavaScript, MySQL, and Java.",
        "His core skills include Python (with Pandas, Matplotlib, Streamlit), JavaScript, HTML/CSS, MySQL, and Java. He's also experienced with version control using Git."
    ],
    projects: [
        "Suryansh has built some impressive projects: a Food Delivery System (Python + MySQL + ML), a Lyrics Animation System (Pygame), an Expense Manager (Streamlit), and an Interactive Tourism Website (Three.js + Firebase).",
        "Key projects include a smart Food Delivery System with data analytics, a Pygame Lyrics Animation tool, an Expense Manager web app, and an Interactive 3D Tourism Website."
    ],
    experience: [
        "Suryansh worked as a Front End Developer at CodeAlpha from January to February 2026, where he built responsive web pages with HTML, CSS, and JavaScript, and collaborated closely with UX/UI designers.",
        "He completed a Front End Developer internship at CodeAlpha (Jan–Feb 2026), focusing on responsive design, cross-platform development, and version control with Git."
    ],
    contact: [
        "You can reach Suryansh at suryanshdevniranjan@gmail.com or call/WhatsApp him at 8171630731. Find his work on GitHub, or connect on LinkedIn!",
        "Best way to reach him: suryanshdevniranjan@gmail.com for professional inquiries. He's also active on LinkedIn and GitHub."
    ],
    education: [
        "Suryansh is pursuing a Bachelor of Computer Applications (BCA) from GLA University, Mathura, India. He's passionate about expanding his knowledge in Python, Kotlin, Go, and modern web tech.",
        "He's a BCA student at GLA University, Mathura, UP — combining academic learning with hands-on project development."
    ],
    certifications: [
        "Suryansh holds certifications in CodePunk v1.0 (GLA University), GeekVerse V.1 (GLA University), Introduction to Azure Static Web Apps (M.S.L.A.), and SQL Bootcamp (Lets Upgrade).",
        "His certifications include CodePunk v1.0, GeekVerse V.1, Azure Static Web Apps, and SQL Bootcamp — covering cloud, databases, and development best practices."
    ],
    default: [
        "That's a great question! For detailed info, I'd suggest reaching out to Suryansh directly at suryanshdevniranjan@gmail.com.",
        "I'm not sure about that specific topic, but feel free to ask about Suryansh's skills, projects, experience, or how to contact him!",
        "Hmm, I don't have that detail right now. Try asking about skills, projects, certifications, experience, or contact info!"
    ]
};

const QUICK_REPLIES = ['Skills', 'Projects', 'Experience', 'Contact', 'Certifications'];

let chatOpen = false;

function initChatbot() {
    const toggle = document.getElementById('chat-toggle');
    const window_ = document.getElementById('chat-window');
    const messages = document.getElementById('chat-messages');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const quickReplies = document.getElementById('quick-replies');

    if (!toggle || !window_) return;

    // Quick reply buttons
    QUICK_REPLIES.forEach(q => {
        const btn = document.createElement('button');
        btn.className = 'qr-btn';
        btn.textContent = q;
        btn.addEventListener('click', () => handleUserMessage(q.toLowerCase()));
        quickReplies.appendChild(btn);
    });

    // Toggle chat
    toggle.addEventListener('click', () => {
        chatOpen = !chatOpen;
        toggle.classList.toggle('open', chatOpen);

        if (chatOpen) {
            window_.classList.add('is-open');
            gsap.to(window_, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.4,
                ease: 'back.out(1.4)'
            });
            // Greet on first open
            if (messages.children.length === 0) {
                setTimeout(() => addBotMessage(getRandom(SHY_RESPONSES.greeting)), 400);
            }
            // Focus input
            setTimeout(() => input.focus(), 450);
        } else {
            gsap.to(window_, {
                opacity: 0,
                y: 20,
                scale: 0.95,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => window_.classList.remove('is-open')
            });
        }
    });

    // Send
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') sendMessage();
    });

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        handleUserMessage(text);
    }

    function handleUserMessage(text) {
        addUserMessage(text);
        const lower = text.toLowerCase();
        const category = detectIntent(lower);

        // Show typing indicator
        const typingEl = showTyping();
        const delay = 700 + Math.random() * 600;

        setTimeout(() => {
            typingEl.remove();
            addBotMessage(getRandom(SHY_RESPONSES[category]));
        }, delay);
    }

    function detectIntent(text) {
        if (/hi|hello|hey|greet|who are you/i.test(text)) return 'greeting';
        if (/skill|python|language|tech|stack|know|code/i.test(text)) return 'skills';
        if (/project|built|made|work|app|system/i.test(text)) return 'projects';
        if (/experience|intern|job|work|company|codealpha/i.test(text)) return 'experience';
        if (/contact|email|phone|reach|linkedin|github/i.test(text)) return 'contact';
        if (/education|university|college|study|gla|bca/i.test(text)) return 'education';
        if (/cert|certificate|award|badge|bootcamp/i.test(text)) return 'certifications';
        return 'default';
    }

    function addBotMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'msg bot';
        msg.innerHTML = `<div class="msg-bubble">${text}</div>`;
        messages.appendChild(msg);
        scrollBottom();
    }

    function addUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'msg user';
        msg.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
        messages.appendChild(msg);
        scrollBottom();
    }

    function showTyping() {
        const el = document.createElement('div');
        el.className = 'msg bot';
        el.innerHTML = `<div class="msg-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
        messages.appendChild(el);
        scrollBottom();
        return el;
    }

    function scrollBottom() {
        messages.scrollTop = messages.scrollHeight;
    }

    function getRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}

window.initChatbot = initChatbot;

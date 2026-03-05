/* ========================================
   CHATBOT.JS — "Shy" AI Assistant
   ======================================== */

const SHY_RESPONSES = {
    greeting: [
        "👋 Hello! I'm Shy, Suryansh's personal AI assistant. \n\nI can tell you about his:\n• 🐍 Python & Tech Skills\n• 🚀 Featured Projects\n• 🎓 Education & Certs\n• ✉️ Contact Information\n• 📂 GitHub Profiles\n\nHow can I help you explore today?",
        "Hi there! I'm Shy. I help people learn more about Suryansh's work. What would you like to know?"
    ],
    skills: [
        "Suryansh specializes in **Python Development**. Here's his tech stack:\n\n**Core Languages:**\n• Python (Expert)\n• JavaScript\n• Java, HTML/CSS, SQL\n\n**Key Libraries:**\n• Pandas, Matplotlib (Data Science)\n• Streamlit, Pygame\n• Three.js, AOS.js (Web Visuals)",
        "His expertise covers:\n• **Programming:** Python, Java, JavaScript\n• **Data Tools:** Pandas, Matplotlib\n• **Web:** HTML5, CSS3, Three.js, Firebase\n• **Databases:** MySQL"
    ],
    projects: [
        "Suryansh has built some great projects. Here are the highlights:\n\n• 🍕 **Food Delivery System**: Python + MySQL + Analytics\n• 🎵 **Lyrics Animation**: Pygame-based sync visuals\n• 💰 **Expense Manager**: Streamlit web application\n• 🗺️ **3D Tourism Map**: Interactive Three.js experience",
        "Most notable work:\n1. 3D Tourism Website (Three.js)\n2. Food Delivery System (Python/MySQL)\n3. Expense Management Tool (Streamlit)\n4. Lyrics Animation System (Pygame)"
    ],
    experience: [
        "**Recent Experience:**\n\n• **CodeAlpha** (Jan - Feb 2026)\n*Front End Developer Intern*\n- Built responsive platforms using HTML/CSS/JS\n- Translated UI/UX designs into functional code\n- Managed version control with Git",
        "He recently interned at CodeAlpha as a Front End Developer, mastering responsive design and collaborative development workflows."
    ],
    contact: [
        "You can connect with Suryansh through:\n\n• ✉️ **Email**: suryanshdevniranjan@gmail.com\n• 📞 **Phone/WhatsApp**: +91 8171630731\n• 🔗 **LinkedIn**: [Suryansh Niranjan](https://linkedin.com/in/suryansh-niranjan)\n\nHe's always open to new opportunities!",
        "Reach out via email at suryanshdevniranjan@gmail.com or connect on LinkedIn. He's very responsive!"
    ],
    github: [
        "Suryansh manages **3 different GitHub profiles**:\n\n1. 🏠 **Main Development**: [pixelpalace-coder](https://github.com/pixelpalace-coder)\n2. 🧬 **Data Science & ML**: (Please provide link)\n3. 🛠️ **Utility & Scripts**: (Please provide link)\n\nYou can find all his latest code there!",
        "He has three GitHub accounts for organized development:\n- **Main**: pixelpalace-coder\n- **Projects/Labs**: (Link needed)\n- **Archives**: (Link needed)"
    ],
    education: [
        "**Academic Background:**\n\n• 🎓 **Bachelor of Computer Application (BCA)**\n• 🏛️ **GLA University**, Mathura, India\n• 📚 Pursuing deeper expertise in Python, Cloud, and Web Architecture.",
        "Suryansh is a BCA student at GLA University, maintaining a strong focus on Python and interactive web technologies."
    ],
    certifications: [
        "**Verified Credentials:**\n\n• 🏆 CodePunk v1.0 (GLA University)\n• 🏆 GeekVerse V.1 (GLA University)\n• 🏆 Azure Static Web Apps (M.S.L.A.)\n• 🏆 SQL Bootcamp (Lets Upgrade)",
        "He holds multiple certifications including GLA University's CodePunk and GeekVerse, Azure Web Apps, and SQL masterclasses."
    ],
    default: [
        "I'm not quite sure about that. Could you try asking about his **Skills**, **Projects**, **Contact**, or **GitHub**?",
        "That's interesting! I might not have that specific detail yet. Feel free to ask about his background, tech stack, or achievements.",
        "Hmm, I'm still learning! Try asking about 'GitHub' or 'Projects' to see what Suryansh has been up to."
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
        if (/github/i.test(text)) return 'github';
        if (/contact|email|phone|reach|linkedin/i.test(text)) return 'contact';
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

// ASSIGNMENT 5: Advanced JavaScript and DOM Manipulation
// Kept separate from Assignment 4 to preserve the original website.
document.addEventListener("DOMContentLoaded", () => {
    // TASK 4: Keep event handling out of HTML attributes.
    document.querySelectorAll(".logo img").forEach(image => {
        image.addEventListener("error", () => {
            if (image.dataset.fallbackUsed) return;
            image.dataset.fallbackUsed = "true";
            image.src = "https://cdn-icons-png.flaticon.com/512/53/53283.png";
        });
    });

    // TASK 2: Keyboard navigation in the Bootstrap menu.
    const navLinks = [...document.querySelectorAll(".navbar-nav .nav-link")];
    navLinks.forEach((link, index) => {
        link.addEventListener("keydown", event => {
            let next;
            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                next = (index + 1) % navLinks.length;
            } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                next = (index - 1 + navLinks.length) % navLinks.length;
            } else {
                return;
            }
            event.preventDefault();
            navLinks[next].focus();
        });
    });

    // TASK 3: One short sound at a time; avoid overlapping sounds.
    let audioContext = null;
    let lastSoundAt = -Infinity;
    function playNotificationSound() {
        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) return;
        if (!audioContext) audioContext = new Context();
        if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
        if (audioContext.currentTime - lastSoundAt < 0.22) return;
        lastSoundAt = audioContext.currentTime;
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = 660;
        gain.gain.setValueAtTime(0.06, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.16);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.16);
    }

    // TASK 1: Only ONE option from Manipulating Attributes: READ MORE.
    const readMoreBtn = document.getElementById("read-more-btn");
    const moreContent = document.getElementById("more-content");
    if (readMoreBtn && moreContent) {
        readMoreBtn.addEventListener("click", () => {
            const isHidden = getComputedStyle(moreContent).display === "none";
            moreContent.hidden = !isHidden;
            moreContent.style.display = isHidden ? "block" : "none";
            readMoreBtn.textContent = isHidden ? "Read Less" : "Read More";
            readMoreBtn.setAttribute("aria-expanded", String(isHidden));
            playNotificationSound();
        });
    }

    // TASK 2: Choose ONE button event option: Show Current Time.
    const timeBtn = document.getElementById("show-time-btn");
    const timeOutput = document.getElementById("current-time");
    if (timeBtn && timeOutput) {
        timeBtn.addEventListener("click", () => {
            timeOutput.textContent = "Current Time: " + new Date().toLocaleTimeString();
        });
    }

    // TASK 2: Choose ONE switch option: time-of-day greeting.
    function getGreeting() {
        const hour = new Date().getHours();
        const period = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
        switch (period) {
            case "morning": return "Good morning, football fans!";
            case "afternoon": return "Good afternoon, football fans!";
            case "evening": return "Good evening, football fans!";
            default: return "Welcome to Football Hub!";
        }
    }
    const greetingBtn = document.getElementById("greeting-btn");
    const greetingOutput = document.getElementById("greeting-message");
    if (greetingBtn && greetingOutput) {
        greetingBtn.addEventListener("click", () => {
            greetingOutput.textContent = getGreeting();
        });
    }

    // TASK 3: Object + method, array + loop, higher-order function.
    const footballHub = {
        name: "Football Hub",
        topic: "Football",
        describe() { return `${this.name}: ${this.topic} news and profiles`; }
    };
    console.log(footballHub.describe());
    const highlights = [
        { title: "Champions League", detail: "Explore the fixtures on our Matches page." },
        { title: "Star Players", detail: "Discover Ronaldo, Kane, Mbappé, and Yamal." },
        { title: "Football Community", detail: "Share your feedback through our Contact page." }
    ];
    const newsContainer = document.getElementById("football-news");
    if (newsContainer) {
        highlights.forEach(item => {
            const column = document.createElement("div");
            column.className = "col-12 col-md-6 col-lg-4";
            const card = document.createElement("div");
            card.className = "a5-news-card";
            card.tabIndex = 0;
            card.setAttribute("role", "button");
            card.setAttribute("aria-label", `Celebrate ${item.title}`);
            const heading = document.createElement("h3");
            heading.textContent = item.title;
            const description = document.createElement("p");
            description.textContent = item.detail;
            card.append(heading, description);
            function celebrate() {
                card.classList.remove("a5-celebrate");
                void card.offsetWidth;
                card.classList.add("a5-celebrate");
                playNotificationSound();
            }
            card.addEventListener("click", celebrate);
            card.addEventListener("keydown", event => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    celebrate();
                }
            });
            column.appendChild(card);
            newsContainer.appendChild(column);
        });
    }
    document.querySelectorAll(".card").forEach(card => card.classList.add("player-animate"));

    // TASK 2: Choose ONE callback option: async POST contact form.
    // This demo endpoint does not actually deliver a message.
    const form = document.getElementById("contact-form");
    const feedback = document.getElementById("form-errors");
    function showFormFeedback(message, color) {
        if (!feedback) return;
        feedback.textContent = message;
        feedback.style.color = color;
        feedback.setAttribute("role", "status");
    }
    if (form) {
        form.addEventListener("submit", async event => {
            event.preventDefault();
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmation = document.getElementById("confirm-password").value;
            const message = document.getElementById("message").value.trim();
            const errors = [];
            if (!name) errors.push("Name is required.");
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Invalid email format.");
            if (password.length < 6) errors.push("Password must be at least 6 characters long.");
            if (password !== confirmation) errors.push("Passwords do not match.");
            if (!message) errors.push("Message is required.");
            if (errors.length) {
                showFormFeedback(errors.join(" "), "red");
                return;
            }
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;
            showFormFeedback("Sending demo request...", "#0d6efd");
            try {
                const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    // Never transmit passwords to the demo endpoint.
                    body: JSON.stringify({ name, email, message })
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                showFormFeedback("Demo POST successful! No real message was delivered.", "green");
                form.reset();
                playNotificationSound();
            } catch (error) {
                showFormFeedback("Demo request failed. Check your internet connection.", "red");
                console.error("Contact demo POST:", error);
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }
});
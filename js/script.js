document.addEventListener("DOMContentLoaded", () => {
    
    function updateDateTime() {
        const dateDisplays = document.querySelectorAll(".datetime-display");
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const formattedDate = now.toLocaleDateString('en-US', options);
        
        dateDisplays.forEach(display => {
            display.innerText = formattedDate;
        });
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // TASK 4: Изменение цвета фона
    const bgBtn = document.getElementById("change-bg-btn");
    const colors = ["#ffffff", "#f8f9fa", "#e9ecef", "#dee2e6", "#e3f2fd", "#f1f8e9"];
    let colorIndex = 0;
    if (bgBtn) {
        bgBtn.addEventListener("click", () => {
            colorIndex = (colorIndex + 1) % colors.length;
            document.body.style.backgroundColor = colors[colorIndex];
        });
    }

    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach(question => {
        question.addEventListener("click", function() {
            this.classList.toggle("active");
            const answer = this.nextElementSibling;
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
            } else {
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    const openPopupBtn = document.getElementById("open-popup-btn");
    const closePopupBtn = document.getElementById("close-popup-btn");
    const popupOverlay = document.getElementById("popup-overlay");

    if (openPopupBtn && popupOverlay) {
        openPopupBtn.addEventListener("click", () => popupOverlay.style.display = "flex");
        closePopupBtn.addEventListener("click", () => popupOverlay.style.display = "none");
        window.addEventListener("click", (e) => {
            if (e.target === popupOverlay) popupOverlay.style.display = "none";
        });
    }

    const contactForm = document.getElementById("contact-form");
    const formErrors = document.getElementById("form-errors");

    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault(); 
            let errors = [];
            
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errors.push("Invalid email format.");
            }
            if (password.length < 6) {
                errors.push("Password must be at least 6 characters long.");
            }
            if (password !== confirmPassword) {
                errors.push("Passwords do not match.");
            }
            
            if (errors.length > 0) {
                formErrors.innerHTML = errors.join("<br>");
                formErrors.style.color = "red";
            } else {
                formErrors.innerHTML = "Success! Form submitted.";
                formErrors.style.color = "green";
                contactForm.reset();
            }
        });
    }
});
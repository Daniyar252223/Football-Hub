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
 // Assignment 5 contact form is handled in js/assignment5.js.
});
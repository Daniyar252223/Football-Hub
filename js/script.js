document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------
    // 1. LIGHT & DARK MODE TOGGLE (localStorage)
    // -------------------------------------------------------------
    const themeToggleBtn = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    
    if (themeToggleBtn) {
        themeToggleBtn.textContent = savedTheme === "dark" ? "☀️ Light" : "🌙 Dark";
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            themeToggleBtn.textContent = newTheme === "dark" ? "☀️ Light" : "🌙 Dark";
        });
    }

    // -------------------------------------------------------------
    // FAQ ACCORDION LOGIC
    // -------------------------------------------------------------
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

    // -------------------------------------------------------------
   // 2. AUTH NAVIGATION CHECK
  // -------------------------------------------------------------
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const authLinkContainer = document.getElementById("auth-link");

    if (authLinkContainer && currentUser) {
    authLinkContainer.innerHTML = `<a class="btn btn-outline-info btn-sm" href="profile.html">👤 ${currentUser.name}</a>`;
    }

    // Profile Page Logic
    if (window.location.pathname.includes("profile.html")) {
        if (!currentUser) {
            window.location.href = "auth.html";
            return;
        }
        document.getElementById("profile-name").textContent = currentUser.name;
        document.getElementById("profile-email").textContent = currentUser.email;
        document.getElementById("profile-phone").textContent = currentUser.phone || "N/A";
        
        const searches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
        if (searches.length > 0) {
            document.getElementById("profile-history").textContent = searches.join(", ");
        }

        document.getElementById("logout-btn").addEventListener("click", () => {
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
        });
    }

    // -------------------------------------------------------------
    // 3. COPY PROMO CODE & TOAST NOTIFICATION (UI Effect)
    // -------------------------------------------------------------
    const copyBtn = document.getElementById("a6-copy-btn");
    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            const promoText = document.getElementById("a6-promo-text").textContent;
            navigator.clipboard.writeText(promoText).then(() => {
                copyBtn.innerHTML = "<span>✅</span> Copied!";
                copyBtn.classList.remove("btn-outline-dark");
                copyBtn.classList.add("btn-success");
                showToast("Promo code copied to clipboard!");

                setTimeout(() => {
                    copyBtn.innerHTML = "<span>📋</span> Copy Code";
                    copyBtn.classList.remove("btn-success");
                    copyBtn.classList.add("btn-outline-dark");
                }, 2500);
            });
        });
    }

    function showToast(message) {
        const toastContainer = document.getElementById("toast-container");
        if (!toastContainer) return;

        const toast = document.createElement("div");
        toast.className = "toast align-items-center text-bg-dark border-0 show mb-2";
        toast.setAttribute("role", "alert");
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // -------------------------------------------------------------
    // 4. FORM VALIDATIONS & AUTHENTICATION (Sign Up / Log In)
    // -------------------------------------------------------------
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{9,15}$/;

    function showError(element, text) {
        if (!element) return;
        element.textContent = text;
        element.classList.remove("d-none");
    }

    // Sign Up Validation & Registration
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const errDiv = document.getElementById("signup-error");
            if (errDiv) errDiv.classList.add("d-none");

            const name = document.getElementById("signup-name").value.trim();
            const email = document.getElementById("signup-email").value.trim().toLowerCase();
            const phone = document.getElementById("signup-phone").value.trim();
            const pass = document.getElementById("signup-pass").value;

            if (!name) return showError(errDiv, "Full Name is required.");
            if (!emailRegex.test(email)) return showError(errDiv, "Invalid email format.");
            if (!phoneRegex.test(phone)) return showError(errDiv, "Invalid phone number pattern.");
            if (pass.length < 6) return showError(errDiv, "Password must be at least 6 characters long.");

            let users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
            
            const existingUser = users.find(u => u.email.toLowerCase() === email);
            if (existingUser) {
                return showError(errDiv, "An account with this email already exists.");
            }

            const newUser = { name, email, phone, password: pass };
            users.push(newUser);
            
            localStorage.setItem("registeredUsers", JSON.stringify(users));
            localStorage.setItem("currentUser", JSON.stringify(newUser));
            
          
            window.location.href = "profile.html";
        });
    }

    // Log In Validation & Sign In
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const errDiv = document.getElementById("login-error");
            if (errDiv) errDiv.classList.add("d-none");

            const email = document.getElementById("login-email").value.trim().toLowerCase();
            const pass = document.getElementById("login-pass").value;

            if (!emailRegex.test(email)) return showError(errDiv, "Please enter a valid email.");
            if (!pass) return showError(errDiv, "Password field is required.");

            let users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
            const storedCurrent = JSON.parse(localStorage.getItem("currentUser"));
            
            if (storedCurrent && !users.some(u => u.email.toLowerCase() === storedCurrent.email.toLowerCase())) {
                users.push(storedCurrent);
            }

            const user = users.find(u => u.email.toLowerCase() === email && u.password === pass);

            if (user) {
                localStorage.setItem("currentUser", JSON.stringify(user));
                window.location.href = "profile.html";
            } else {
                showError(errDiv, "Incorrect email or password.");
            }
        });
    }

    // -------------------------------------------------------------
    // CONTACT FORM SUBMISSION WITH SUCCESS ALERT 
    // -------------------------------------------------------------
    const contactForm = document.getElementById("contact-form");
    const contactError = document.getElementById("contact-error");
    const contactSuccess = document.getElementById("contact-success");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            const name = document.getElementById("contact-name").value.trim();
            const email = document.getElementById("contact-email").value.trim();
            const phone = document.getElementById("contact-phone").value.trim();
            const message = document.getElementById("contact-msg").value.trim();

            if (!name || !email || !phone || !message) {
                if (contactError) {
                    contactError.textContent = "Please fill in all fields before submitting!";
                    contactError.classList.remove("d-none");
                }
                if (contactSuccess) contactSuccess.classList.add("d-none");
                return;
            }

            if (contactError) contactError.classList.add("d-none");
            if (contactSuccess) {
                contactSuccess.textContent = "✅ Your message has been sent successfully!";
                contactSuccess.classList.remove("d-none");
            }

            contactForm.reset();

            setTimeout(() => {
                if (contactSuccess) contactSuccess.classList.add("d-none");
            }, 4000);
        });
    }
    // -------------------------------------------------------------
    // 5. EXTERNAL API INTEGRATION & SEARCH LOGIC
    // -------------------------------------------------------------
    const apiContainer = document.getElementById("api-data-container");
    const apiLoading = document.getElementById("api-loading");
    const apiError = document.getElementById("api-error");
    const reloadBtn = document.getElementById("reload-api-btn");
    const searchInput = document.getElementById("api-search-input");
    const searchBtn = document.getElementById("api-search-btn");

   
    const fallbackTeams = [
        { 
            strTeam: "Arsenal FC", 
            strCountry: "England", 
            strStadium: "Emirates Stadium", 
            strBadge: "css/images/clubs/the best club in the world.webp",
            onlineBadge: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" 
        },
        { 
            strTeam: "Real Madrid", 
            strCountry: "Spain", 
            strStadium: "Santiago Bernabéu", 
            strBadge: "css/images/clubs/real madrid.webp",
            onlineBadge: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg" 
        },
        { 
            strTeam: "FC Barcelona", 
            strCountry: "Spain", 
            strStadium: "Spotify Camp Nou", 
            strBadge: "css/images/clubs/barsa.webp",
            onlineBadge: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona.svg" 
        },
        { 
            strTeam: "Manchester City", 
            strCountry: "England", 
            strStadium: "Etihad Stadium", 
            strBadge: "css/images/clubs/man city.webp",
            onlineBadge: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg" 
        },
        { 
            strTeam: "Bayern Munich", 
            strCountry: "Germany", 
            strStadium: "Allianz Arena", 
            strBadge: "css/images/clubs/bayern munich.jpg",
            onlineBadge: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg" 
        },
        { 
            strTeam: "Liverpool FC", 
            strCountry: "England", 
            strStadium: "Anfield", 
            strBadge: "css/images/clubs/liverpool.jpg",
            onlineBadge: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg" 
        }
    ];

    function renderTeams(teams) {
        if (!apiContainer) return;
        apiContainer.innerHTML = "";

        if (!teams || teams.length === 0) {
            apiContainer.innerHTML = `<div class="col-12 text-center text-muted py-4"><p class="fs-5 mb-0">No teams found matching your search.</p></div>`;
            return;
        }

        teams.forEach(team => {
            
            const imgSrc = team.strBadge || team.onlineBadge || 'https://cdn-icons-png.flaticon.com/512/53/53283.png';
            const fallbackSrc = team.onlineBadge || 'https://cdn-icons-png.flaticon.com/512/53/53283.png';

            const col = document.createElement("div");
            col.className = "col-12 col-md-4";
            col.innerHTML = `
                <div class="card h-100 p-3 text-center shadow-sm">
                    <img src="${imgSrc}" class="mx-auto my-2" style="max-height: 100px; object-fit: contain;" alt="${team.strTeam}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='${fallbackSrc}';">
                    <h4 class="h5">${team.strTeam}</h4>
                    <p class="small text-muted mb-1">Country: ${team.strCountry || 'N/A'}</p>
                    <p class="small mb-0">Stadium: ${team.strStadium || 'N/A'}</p>
                </div>
            `;
            apiContainer.appendChild(col);
        });
    }

    async function fetchLeagueTeams(query = "") {
        if (!apiContainer) return;

        apiLoading.style.display = "block";
        if (apiError) apiError.style.display = "none";

        const cleanQuery = query.trim().toLowerCase();

        try {
            const searchUrl = cleanQuery 
                ? `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(cleanQuery)}`
                : `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Arsenal`;

            const response = await fetch(searchUrl);
            if (!response.ok) throw new Error("API error");
            const data = await response.json();

            apiLoading.style.display = "none";

            if (data && data.teams && data.teams.length > 0) {
                renderTeams(data.teams.slice(0, 6));
            } else {
                const filtered = fallbackTeams.filter(t => t.strTeam.toLowerCase().includes(cleanQuery));
                renderTeams(filtered);
            }

        } catch (error) {
            apiLoading.style.display = "none";
            if (cleanQuery) {
                const filtered = fallbackTeams.filter(t => t.strTeam.toLowerCase().includes(cleanQuery));
                renderTeams(filtered);
            } else {
                renderTeams(fallbackTeams);
            }
        }
    }

    if (apiContainer) {
        fetchLeagueTeams();

        if (reloadBtn) {
            reloadBtn.addEventListener("click", () => {
                if (searchInput) searchInput.value = "";
                fetchLeagueTeams();
            });
        }

        const handleSearch = () => {
            const term = searchInput ? searchInput.value.trim() : "";
            fetchLeagueTeams(term);
            if (term && typeof saveSearch === "function") saveSearch(term);
        };

        if (searchBtn) searchBtn.addEventListener("click", handleSearch);

        if (searchInput) {
            searchInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") handleSearch();
            });
        }
    }

    // -------------------------------------------------------------
    // 6. PLAYERS SEARCH & FILTERING (players.html)
    // -------------------------------------------------------------
    const playerSearch = document.getElementById("player-search");
    const positionFilter = document.getElementById("position-filter");
    const playerCards = document.querySelectorAll(".player-card-wrapper");

    function filterPlayers() {
        if (!playerCards.length) return;
        const searchText = playerSearch.value.toLowerCase();
        const selectedPos = positionFilter.value;

        playerCards.forEach(card => {
            const name = card.getAttribute("data-name").toLowerCase();
            const pos = card.getAttribute("data-position");

            const matchesSearch = name.includes(searchText);
            const matchesPos = selectedPos === "all" || pos === selectedPos;

            card.style.display = (matchesSearch && matchesPos) ? "block" : "none";
        });
    }

    if (playerSearch && positionFilter) {
        playerSearch.addEventListener("input", filterPlayers);
        positionFilter.addEventListener("change", filterPlayers);
    }
});

// ---------------------
// ⏰ LIVE NAVBAR CLOCK 
// ---------------------
function updateLiveClock() {
    const clockElement = document.getElementById("live-clock");
    if (!clockElement) return;

    const now = new Date();
    

    const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', dateOptions);
    
    
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const timeStr = now.toLocaleTimeString('en-US', timeOptions);

    clockElement.textContent = `${dateStr} at ${timeStr}`;
}
setInterval(updateLiveClock, 1000);
updateLiveClock();

// -------------------------------------------------------------
// READ MORE / READ LESS TOGGLE
// -------------------------------------------------------------
const readMoreBtn = document.getElementById("read-more-btn");
const moreInfoBox = document.getElementById("more-info-box");

if (readMoreBtn && moreInfoBox) {
    readMoreBtn.addEventListener("click", () => {
        if (moreInfoBox.classList.contains("d-none")) {
            moreInfoBox.classList.remove("d-none");
            readMoreBtn.textContent = "Read Less";
        } else {
            moreInfoBox.classList.add("d-none");
            readMoreBtn.textContent = "Read More";
        }
    });
}
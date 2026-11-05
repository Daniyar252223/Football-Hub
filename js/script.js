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


// ASSIGNMENT 6: JQUERY LOGIC

$(document).ready(function() {
    console.log("jQuery is ready!"); // Task 0

    // Task 1, 2, 3: Search, Autocomplete, Highlighting
    const searchData = ["Cristiano Ronaldo", "Lionel Messi", "Champions League", "Stadium", "Coach", "World Cup"];
    
    $('#a6-search-input').on('keyup', function() {
        let keyword = $(this).val().toLowerCase();
        
        // Task 2: Autocomplete Suggestions
        $('#a6-autocomplete-suggestions').empty().hide();
        if (keyword.length > 0) {
            let suggestions = searchData.filter(item => item.toLowerCase().includes(keyword));
            if (suggestions.length > 0) {
                suggestions.forEach(suggest => {
                    $('#a6-autocomplete-suggestions').append(`<li>${suggest}</li>`);
                });
                $('#a6-autocomplete-suggestions').show();
            }
        }

        // Task 1: Real-time Live Filter
        $('.a6-content-item').filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(keyword) > -1);
        });

        // Task 3: Search Highlighting
        $('.a6-content-item').each(function() {
            // Remove previous tags securely
            let originalText = $(this).text().replace(/<[^>]*>?/gm, ''); 
            if (keyword.length > 1 && originalText.toLowerCase().includes(keyword)) {
                let regex = new RegExp(`(${keyword})`, "gi");
                let newText = originalText.replace(regex, "<span class='a6-highlight'>$1</span>");
                $(this).html(newText);
            } else {
                $(this).text(originalText);
            }
        });
    });

    $(document).on('click', '#a6-autocomplete-suggestions li', function() {
        $('#a6-search-input').val($(this).text()).trigger('keyup');
        $('#a6-autocomplete-suggestions').hide();
    });
    
    // Task 4: Scroll Progress Bar
    $(window).on('scroll', function() {
        let scrollHeight = $(document).height() - $(window).height();
        let scrollPosition = $(window).scrollTop();
        let progress = (scrollPosition / scrollHeight) * 100;
        $('#scroll-progress').css('width', progress + '%');
    });

    // Task 5: Animated Number Counter
    let counterStarted = false;
    $(window).on('scroll', function() {
        if ($('.counter').length) {
            // Check if user scrolled to the counters section
            let offset = $('.counter').first().offset().top - $(window).height();
            if (!counterStarted && $(window).scrollTop() > offset) {
                $('.counter').each(function() {
                    $(this).prop('Counter', 0).animate({
                        Counter: $(this).data('target')
                    }, {
                        duration: 2000,
                        easing: 'swing',
                        step: function(now) {
                            $(this).text(Math.ceil(now) + "+");
                        }
                    });
                });
                counterStarted = true;
            }
        }
    });

    // Task 7: Notification System (Toast)
    function showToast(message) {
        let $toast = $(`<div class="a6-toast">${message}</div>`);
        $('#toast-container').append($toast);
        $toast.fadeIn(400).delay(3000).fadeOut(400, function() {
            $(this).remove();
        });
    }

    // Task 6: Loading Spinner on Submit
    $('#a6-action-form').on('submit', function(e) {
        e.preventDefault();
        let $btn = $('#a6-submit-btn');
        let originalText = $btn.html();
        
        $btn.prop('disabled', true).html('<span class="a6-spinner"></span> Wait...');
        
        // Simulating server request
        setTimeout(function() {
            $btn.prop('disabled', false).html(originalText);
            showToast('Form submitted successfully!');
            $('#a6-action-form')[0].reset();
        }, 2000);
    });

    // Task 8: Copied to Clipboard Button
    $('#a6-copy-btn').on('click', function() {
        let textToCopy = $('#a6-promo-text').text();
        navigator.clipboard.writeText(textToCopy).then(() => {
            let $btn = $(this);
            $btn.html('<span>✅</span> Copied!');
            $btn.removeClass('btn-outline-dark').addClass('btn-success');
            showToast('Promo code copied to clipboard!');
            
            setTimeout(() => {
                $btn.html('<span>📋</span> Copy Code');
                $btn.removeClass('btn-success').addClass('btn-outline-dark');
            }, 3000);
        });
    });

    // Task 9: Image Lazy Loading
    function lazyLoad() {
        $('.a6-lazy-image').each(function() {
            if ($(this).offset().top < $(window).scrollTop() + $(window).height() + 100) {
                let realSrc = $(this).attr('data-src');
                if (realSrc && $(this).attr('src') !== realSrc) {
                    $(this).attr('src', realSrc).addClass('loaded');
                }
            }
        });
    }
    
    // Call lazyLoad on scroll and on initial page load
    $(window).on('scroll', lazyLoad);
    lazyLoad();
});
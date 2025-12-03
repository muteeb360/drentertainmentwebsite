// Hamburger menu functionality
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('nav-mobile');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMobile.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    const mobileNavLinks = navMobile.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMobile.classList.remove('active');
        });
    });
}

// WhatsApp Buy Button functionality
document.querySelectorAll(".app-buy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const msg = encodeURIComponent(btn.dataset.message);
        window.open("https://wa.me/447930653655?text=" + msg, "_blank");
    });
});

document.querySelectorAll(".btn-buy").forEach(btn => {
    btn.addEventListener("click", () => {
        const msg = encodeURIComponent(btn.dataset.message);
        window.open("https://wa.me/447930653655?text=" + msg, "_blank");
    });
});

document.querySelectorAll(".btn-hero").forEach(btn => {
    btn.addEventListener("click", () => {
        const msg = encodeURIComponent(btn.dataset.message);
        window.open("https://wa.me/447930653655?text=" + msg, "_blank");
    });
});

document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const msg = encodeURIComponent(btn.dataset.message);
        window.open("https://wa.me/447930653655?text=" + msg, "_blank");
    });
});

document.querySelectorAll(".btn-trial").forEach(btn => {
    btn.addEventListener("click", () => {
        const msg = encodeURIComponent(btn.dataset.message);
        window.open("https://wa.me/447930653655?text=" + msg, "_blank");
    });
});

// Carousel Drag/Swipe functionality
class InfiniteCarousel {
    constructor(trackId) {
        this.track = document.getElementById(trackId);
        this.container = this.track.closest('.carousel-container');
        this.cards = Array.from(this.track.children);

        this.cardWidth = this.cards[0].offsetWidth;
        this.gap = 15;
        this.step = this.cardWidth + this.gap;

        this.isDragging = false;
        this.startX = 0;
        this.current = 0;
        this.autoSpeed = 0.2; // pixels per frame

        this.clone();
        this.initEvents();

        requestAnimationFrame(() => this.autoMove());
    }

    clone() {
        // Double content for looping
        this.track.innerHTML += this.track.innerHTML;
        this.totalWidth = this.track.scrollWidth / 2;
    }

    initEvents() {
        this.container.addEventListener("mousedown", e => this.dragStart(e));
        window.addEventListener("mousemove", e => this.dragMove(e));
        window.addEventListener("mouseup", () => this.dragEnd());

        this.container.addEventListener("touchstart", e => this.dragStart(e.touches[0]));
        window.addEventListener("touchmove", e => this.dragMove(e.touches[0]));
        window.addEventListener("touchend", () => this.dragEnd());

        this.container.addEventListener("mouseenter", () => this.paused = true);
        this.container.addEventListener("mouseleave", () => this.paused = false);
    }

    dragStart(e) {
        this.isDragging = true;
        this.startX = e.clientX;
        this.prev = this.current;
    }

    dragMove(e) {
        if (!this.isDragging) return;

        const diff = e.clientX - this.startX;
        this.current = this.prev + diff;

        this.wrapPosition();
        this.update();
    }

    dragEnd() {
        this.isDragging = false;
    }

    wrapPosition() {
        if (this.current < -this.totalWidth) this.current += this.totalWidth;
        if (this.current > 0) this.current -= this.totalWidth;
    }

    autoMove() {
        if (!this.paused && !this.isDragging) {
            this.current -= this.autoSpeed;
            this.wrapPosition();
            this.update();
        }

        requestAnimationFrame(() => this.autoMove());
    }

    update() {
        this.track.style.transform = `translateX(${this.current}px)`;
        this.track.style.transition = 'none';
    }
}

//email form submission
document.getElementById("contactForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = e.target.user_email.value;
    const message = e.target.user_message.value;

    const button = e.target.querySelector(".contact-submit");
    button.disabled = true;
    button.innerText = "Sending...";

    const res = await fetch("/.netlify/functions/sendEmail", {
        method: "POST",
        body: JSON.stringify({ email, message })
    });

    const data = await res.json();

    if (data.success) {
        alert("Message sent!");
        e.target.reset();
    } else {
        alert("Error sending email.");
    }

    button.disabled = false;
    button.innerText = "Send Message";
});

// Highlight Active Nav Link Automatically
const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll("nav a").forEach(link => {
    const linkPage = link.getAttribute("href");

    // For multi-page (streamingapps.html, index.html, etc.)
    if (linkPage === currentPage) {
        link.classList.add("active");
    }

    // For same-page sections (#live, #contact, etc.)
    if (linkPage.startsWith("#") && window.location.hash === linkPage) {
        link.classList.add("active");
    }
});





// Initialize
new InfiniteCarousel("channelTrack");
new InfiniteCarousel("moviesTrack");
new InfiniteCarousel("bannersTrack");
new InfiniteCarousel("reviewsTrack");

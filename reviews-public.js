(function () {
    const listEl = document.getElementById("firebaseReviewsList");
    const emptyEl = document.getElementById("firebaseReviewsEmpty");
    const loadingEl = document.getElementById("firebaseReviewsLoading");

    if (!listEl) return;

    function stars(rating) {
        const filled = "★".repeat(rating);
        const empty = "☆".repeat(5 - rating);
        return filled + empty;
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function formatDate(timestamp) {
        if (!timestamp || !timestamp.toDate) return "";
        return timestamp.toDate().toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    }

    db.collection("reviews")
        .where("approved", "==", true)
        .get()
        .then((snapshot) => {
            if (loadingEl) loadingEl.hidden = true;

            if (snapshot.empty) {
                if (emptyEl) emptyEl.hidden = false;
                return;
            }

            const docs = snapshot.docs.slice().sort((a, b) => {
                const aTime = a.data().createdAt && a.data().createdAt.toMillis
                    ? a.data().createdAt.toMillis()
                    : 0;
                const bTime = b.data().createdAt && b.data().createdAt.toMillis
                    ? b.data().createdAt.toMillis()
                    : 0;
                return bTime - aTime;
            }).slice(0, 24);

            listEl.innerHTML = docs.map((doc) => {
                const data = doc.data();
                return `
                    <article class="fb-review-card">
                        <div class="fb-review-top">
                            <strong class="fb-review-name">${escapeHtml(data.name)}</strong>
                            <span class="fb-review-stars" aria-label="${data.rating} out of 5 stars">${stars(data.rating)}</span>
                        </div>
                        <p class="fb-review-text">${escapeHtml(data.text)}</p>
                        <time class="fb-review-date">${formatDate(data.createdAt)}</time>
                    </article>
                `;
            }).join("");
        })
        .catch((err) => {
            console.error("Failed to load reviews:", err);
            if (loadingEl) {
                loadingEl.hidden = false;
                loadingEl.textContent = "Unable to load reviews right now.";
            }
        });
})();

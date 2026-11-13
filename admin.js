(function () {
    const loginPanel = document.getElementById("loginPanel");
    const dashboardPanel = document.getElementById("dashboardPanel");
    const loginForm = document.getElementById("adminLoginForm");
    const loginStatus = document.getElementById("loginStatus");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const adminUserEmail = document.getElementById("adminUserEmail");
    const adminList = document.getElementById("adminList");
    const adminLoading = document.getElementById("adminLoading");
    const adminEmpty = document.getElementById("adminEmpty");
    const tabs = document.querySelectorAll(".admin-tab");

    let currentFilter = "pending";

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function stars(rating) {
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    }

    function formatDate(timestamp) {
        if (!timestamp || !timestamp.toDate) return "Just now";
        return timestamp.toDate().toLocaleString();
    }

    function showLoginStatus(message, type) {
        loginStatus.hidden = false;
        loginStatus.textContent = message;
        loginStatus.className = "form-status " + type;
    }

    function setView(isLoggedIn, user) {
        loginPanel.hidden = isLoggedIn;
        dashboardPanel.hidden = !isLoggedIn;
        if (isLoggedIn && user) {
            adminUserEmail.textContent = (user.email || "") + " | UID: " + user.uid;
            loadReviews();
        }
    }

    async function loadReviews() {
        adminLoading.hidden = false;
        adminLoading.textContent = "Loading reviews...";
        adminEmpty.hidden = true;
        adminList.innerHTML = "";

        const approved = currentFilter === "approved";

        try {
            // Equality-only query avoids needing a composite index
            const snapshot = await db.collection("reviews")
                .where("approved", "==", approved)
                .get();

            adminLoading.hidden = true;

            if (snapshot.empty) {
                adminEmpty.hidden = false;
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
            });

            adminList.innerHTML = docs.map((doc) => {
                const data = doc.data();
                const actions = approved
                    ? `<button type="button" class="admin-action reject" data-action="delete" data-id="${doc.id}">Delete</button>`
                    : `
                        <button type="button" class="admin-action approve" data-action="approve" data-id="${doc.id}">Approve</button>
                        <button type="button" class="admin-action reject" data-action="delete" data-id="${doc.id}">Reject</button>
                    `;

                return `
                    <article class="admin-review-card" data-id="${doc.id}">
                        <div class="fb-review-top">
                            <strong class="fb-review-name">${escapeHtml(data.name)}</strong>
                            <span class="fb-review-stars">${stars(data.rating)}</span>
                        </div>
                        <p class="fb-review-text">${escapeHtml(data.text)}</p>
                        <time class="fb-review-date">${formatDate(data.createdAt)}</time>
                        <div class="admin-actions">${actions}</div>
                    </article>
                `;
            }).join("");
        } catch (err) {
            console.error(err);
            adminLoading.hidden = false;

            const code = err && err.code ? err.code : "unknown";
            const message = err && err.message ? err.message : "Unknown error";
            const uid = auth.currentUser ? auth.currentUser.uid : "not signed in";

            if (code === "permission-denied") {
                adminLoading.textContent =
                    "Permission denied. Your UID must match isAdmin() in Firestore rules. Current UID: " + uid;
            } else {
                adminLoading.textContent = "Could not load reviews (" + code + "): " + message;
            }
        }
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        loginBtn.disabled = true;
        loginBtn.textContent = "Signing in...";

        try {
            await auth.signInWithEmailAndPassword(
                document.getElementById("adminEmail").value.trim(),
                document.getElementById("adminPassword").value
            );
        } catch (err) {
            console.error(err);
            showLoginStatus("Sign-in failed. Check email and password.", "error");
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = "Sign In";
        }
    });

    logoutBtn.addEventListener("click", () => {
        auth.signOut();
    });

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            currentFilter = tab.dataset.filter;
            loadReviews();
        });
    });

    adminList.addEventListener("click", async (e) => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;

        const id = btn.dataset.id;
        const action = btn.dataset.action;
        btn.disabled = true;

        try {
            if (action === "approve") {
                await db.collection("reviews").doc(id).update({ approved: true });
            } else if (action === "delete") {
                await db.collection("reviews").doc(id).delete();
            }
            await loadReviews();
        } catch (err) {
            console.error(err);
            alert("Action failed: " + (err.message || "permission error"));
            btn.disabled = false;
        }
    });

    auth.onAuthStateChanged((user) => {
        setView(!!user, user);
    });
})();

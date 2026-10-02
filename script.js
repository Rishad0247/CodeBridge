/* =========================================================
   CODEBRIDGE - GLOBAL JAVASCRIPT
   Works with the current CodeBridge HTML pages
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       BOOTSTRAP SAFETY
    ===================================================== */

    if (typeof bootstrap === "undefined") {
        console.error("Bootstrap JS is not loaded.");
        return;
    }


    /* =====================================================
       TOOLTIP
    ===================================================== */

    document
        .querySelectorAll('[data-bs-toggle="tooltip"]')
        .forEach(function (element) {

            try {
                bootstrap.Tooltip.getOrCreateInstance(element);
            } catch (error) {
                console.warn("Tooltip error:", error);
            }

        });


    /* =====================================================
       ACTIVE NAVBAR
    ===================================================== */

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document
        .querySelectorAll(".navbar-nav .nav-link")
        .forEach(function (link) {

            const href = link.getAttribute("href");

            if (!href) return;

            const cleanHref =
                href.split("#")[0].split("?")[0];

            if (
                cleanHref === currentPage ||
                (currentPage === "index.html" && cleanHref === "")
            ) {
                link.classList.add("active");
            }

        });


    /* =====================================================
       PROJECT SEARCH + FILTER
       ===================================================== */

    const projectSearch =
        document.getElementById("projectSearch");

    const projectItems =
        document.querySelectorAll(".project-item");

    const projectFilters =
        document.querySelectorAll(".filter-btn");

    let activeProjectFilter = "all";


    function updateProjects() {

        const query =
            projectSearch
                ? projectSearch.value.toLowerCase().trim()
                : "";

        let visibleProjects = 0;


        projectItems.forEach(function (item) {

            const text =
                item.innerText.toLowerCase();

            const category =
                item.getAttribute("data-category") || "";


            const searchMatch =
                text.includes(query);

            const categoryMatch =
                activeProjectFilter === "all" ||
                category === activeProjectFilter;


            if (searchMatch && categoryMatch) {

                item.style.display = "";

                visibleProjects++;

            } else {

                item.style.display = "none";

            }

        });


        const noResults =
            document.getElementById("projectNoResults");

        if (noResults) {

            noResults.classList.toggle(
                "d-none",
                visibleProjects !== 0
            );

        }

    }


    if (projectSearch) {

        projectSearch.addEventListener(
            "input",
            updateProjects
        );

    }


    projectFilters.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                projectFilters.forEach(
                    function (btn) {
                        btn.classList.remove("active");
                    }
                );


                button.classList.add("active");


                activeProjectFilter =
                    button.getAttribute("data-filter") || "all";


                updateProjects();

            }
        );

    });


    /* =====================================================
       DEVELOPER SEARCH + FILTER
       ===================================================== */

    const developerSearch =
        document.getElementById("developerSearch");

    const developerItems =
        document.querySelectorAll(".developer-item");

    const developerFilters =
        document.querySelectorAll(".developer-filter");

    let activeDeveloperFilter = "all";


    function updateDevelopers() {

        const query =
            developerSearch
                ? developerSearch.value.toLowerCase().trim()
                : "";

        let visibleDevelopers = 0;


        developerItems.forEach(function (item) {

            const text =
                item.innerText.toLowerCase();

            const category =
                item.getAttribute("data-category") || "";


            const searchMatch =
                text.includes(query);

            const categoryMatch =
                activeDeveloperFilter === "all" ||
                category === activeDeveloperFilter;


            if (searchMatch && categoryMatch) {

                item.style.display = "";

                visibleDevelopers++;

            } else {

                item.style.display = "none";

            }

        });


        const noResults =
            document.getElementById("developerNoResults");

        if (noResults) {

            noResults.classList.toggle(
                "d-none",
                visibleDevelopers !== 0
            );

        }

    }


    if (developerSearch) {

        developerSearch.addEventListener(
            "input",
            updateDevelopers
        );

    }


    developerFilters.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                developerFilters.forEach(
                    function (btn) {
                        btn.classList.remove("active");
                    }
                );


                button.classList.add("active");


                activeDeveloperFilter =
                    button.getAttribute("data-filter") || "all";


                updateDevelopers();

            }
        );

    });


    /* =====================================================
       3D CARD TILT
       ===================================================== */

    const tiltCards =
        document.querySelectorAll(
            ".tilt-card, .tilt-developer, [data-tilt]"
        );


    tiltCards.forEach(function (card) {

        card.addEventListener(
            "mousemove",
            function (event) {

                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;


                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;


                const rotateX =
                    ((y - centerY) / centerY) * -5;

                const rotateY =
                    ((x - centerX) / centerX) * 5;


                card.style.transform =
                    `perspective(1000px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-6px)`;

            }
        );


        card.addEventListener(
            "mouseleave",
            function () {

                card.style.transform = "";

            }
        );

    });


    /* =====================================================
       LOGIN STATE
       ===================================================== */

    updateLoginState();


    /* =====================================================
       LOGIN FORM
       ===================================================== */

    const loginForm =
        document.getElementById("loginForm");


    if (loginForm) {

        /*
         * Capture phase prevents the old inline login
         * handlers from showing a second alert.
         */

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();
                event.stopImmediatePropagation();


                if (!loginForm.checkValidity()) {

                    loginForm.classList.add(
                        "was-validated"
                    );

                    return;

                }


                const emailInput =
                    loginForm.querySelector(
                        "#loginEmail, input[type='email']"
                    );


                const email =
                    emailInput
                        ? emailInput.value.trim()
                        : "CodeBridge User";


                localStorage.setItem(
                    "codebridgeLoggedIn",
                    "true"
                );


                localStorage.setItem(
                    "codebridgeUser",
                    email
                );


                updateLoginState();


                const modalElement =
                    document.getElementById("loginModal");


                if (modalElement) {

                    const modal =
                        bootstrap.Modal.getOrCreateInstance(
                            modalElement
                        );

                    modal.hide();

                }


                loginForm.reset();

                loginForm.classList.remove(
                    "was-validated"
                );


                showAlert(
                    "Welcome to CodeBridge! You are now logged in.",
                    "success"
                );

            },
            true
        );

    }


    /* =====================================================
       LOGOUT
       ===================================================== */

    document
        .querySelectorAll("[data-logout]")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    localStorage.removeItem(
                        "codebridgeLoggedIn"
                    );

                    localStorage.removeItem(
                        "codebridgeUser"
                    );

                    window.location.reload();

                }
            );

        });


    /* =====================================================
       PROJECT MODAL
       ===================================================== */

    window.openProject =
        function (
            title,
            category,
            budget,
            deadline,
            tech
        ) {

            const modalTitle =
                document.getElementById("modalTitle");

            const modalCategory =
                document.getElementById("modalCategory");

            const modalBudget =
                document.getElementById("modalBudget");

            const modalDeadline =
                document.getElementById("modalDeadline");

            const modalTech =
                document.getElementById("modalTech");


            if (modalTitle) {
                modalTitle.textContent =
                    title || "Project";
            }


            if (modalCategory) {
                modalCategory.textContent =
                    category || "Project";
            }


            if (modalBudget) {
                modalBudget.textContent =
                    budget || "₹0";
            }


            if (modalDeadline) {
                modalDeadline.textContent =
                    deadline || "Flexible";
            }


            if (modalTech) {
                modalTech.textContent =
                    tech || "Various technologies";
            }


            const modalElement =
                document.getElementById("projectModal");


            if (modalElement) {

                const modal =
                    bootstrap.Modal.getOrCreateInstance(
                        modalElement
                    );

                modal.show();

            }

        };


    /* =====================================================
       HIRE FORM
       ===================================================== */

    const hireForm =
        document.getElementById("hireForm");


    if (hireForm) {

        hireForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();
                event.stopImmediatePropagation();


                if (!hireForm.checkValidity()) {

                    hireForm.classList.add(
                        "was-validated"
                    );

                    return;

                }


                const modalElement =
                    document.getElementById("hireModal");


                if (modalElement) {

                    const modal =
                        bootstrap.Modal.getOrCreateInstance(
                            modalElement
                        );

                    modal.hide();

                }


                hireForm.reset();

                hireForm.classList.remove(
                    "was-validated"
                );


                showAlert(
                    "Your project request has been submitted successfully!",
                    "success"
                );

            },
            true
        );

    }


    /* =====================================================
       POST PROJECT FORM
       ===================================================== */

    const postProjectForm =
        document.getElementById(
            "postProjectForm"
        );


    if (postProjectForm) {

        postProjectForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();
                event.stopImmediatePropagation();


                if (!postProjectForm.checkValidity()) {

                    postProjectForm.classList.add(
                        "was-validated"
                    );

                    return;

                }


                const modalElement =
                    document.getElementById(
                        "postProjectModal"
                    );


                if (modalElement) {

                    const modal =
                        bootstrap.Modal.getOrCreateInstance(
                            modalElement
                        );

                    modal.hide();

                }


                postProjectForm.reset();

                postProjectForm.classList.remove(
                    "was-validated"
                );


                showAlert(
                    "Your project has been posted successfully!",
                    "success"
                );

            },
            true
        );

    }


    /* =====================================================
       GENERAL DEMO FORMS
       ===================================================== */

    document
        .querySelectorAll("form[data-demo-form]")
        .forEach(function (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    if (!form.checkValidity()) {

                        form.classList.add(
                            "was-validated"
                        );

                        return;

                    }


                    showAlert(
                        "Your request was submitted successfully!",
                        "success"
                    );


                    form.reset();

                    form.classList.remove(
                        "was-validated"
                    );

                }
            );

        });


    /* =====================================================
       SMOOTH ANCHOR SCROLL
       ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        link.getAttribute("href");


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(targetId);


                    if (target) {

                        event.preventDefault();


                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

                }
            );

        });


    /* =====================================================
       NAVBAR SCROLL EFFECT
       ===================================================== */

    const navbar =
        document.querySelector(".glass-navbar");


    if (navbar) {

        function updateNavbar() {

            if (window.scrollY > 40) {

                navbar.classList.add(
                    "navbar-scrolled"
                );

            } else {

                navbar.classList.remove(
                    "navbar-scrolled"
                );

            }

        }


        window.addEventListener(
            "scroll",
            updateNavbar
        );


        updateNavbar();

    }


    /* =====================================================
       PARTICLES
       ===================================================== */

    createParticles();


    /* =====================================================
       PAGE LOADED
       ===================================================== */

    document.body.classList.add(
        "page-loaded"
    );

});


/* =========================================================
   LOGIN STATE
   ========================================================= */

function updateLoginState() {

    const loggedIn =
        localStorage.getItem(
            "codebridgeLoggedIn"
        ) === "true";


    const user =
        localStorage.getItem(
            "codebridgeUser"
        );


    /*
     * Supports both the newer data-login-button
     * and your existing nav-login buttons.
     */

    const loginButtons =
        document.querySelectorAll(
            "[data-login-button], .nav-login"
        );


    loginButtons.forEach(function (button) {

        if (loggedIn) {

            button.innerHTML =
                `<i class="bi bi-person-check me-1"></i>
                 Logged In`;


            button.removeAttribute(
                "data-bs-toggle"
            );

            button.removeAttribute(
                "data-bs-target"
            );


            button.onclick =
                function (event) {

                    event.preventDefault();

                    showLoggedInMenu();

                };


        } else {

            /*
             * Keep the existing Bootstrap modal behaviour.
             */

            button.innerHTML =
                "Login";


            button.setAttribute(
                "data-bs-toggle",
                "modal"
            );


            button.setAttribute(
                "data-bs-target",
                "#loginModal"
            );


            button.onclick = null;

        }

    });


    document
        .querySelectorAll("[data-user-email]")
        .forEach(function (element) {

            element.textContent =
                user || "";

        });

}


/* =========================================================
   LOGGED-IN MENU
   ========================================================= */

function showLoggedInMenu() {

    const user =
        localStorage.getItem(
            "codebridgeUser"
        ) || "CodeBridge User";


    const shouldLogout =
        window.confirm(
            "Logged in as:\n" +
            user +
            "\n\nPress OK to logout."
        );


    if (shouldLogout) {

        localStorage.removeItem(
            "codebridgeLoggedIn"
        );

        localStorage.removeItem(
            "codebridgeUser"
        );


        window.location.reload();

    }

}


/* =========================================================
   GLOBAL ALERT
   ========================================================= */

function showAlert(
    message,
    type = "success"
) {

    let container =
        document.getElementById(
            "globalAlertContainer"
        );


    if (!container) {

        container =
            document.createElement("div");


        container.id =
            "globalAlertContainer";


        container.style.position =
            "fixed";

        container.style.top =
            "90px";

        container.style.right =
            "25px";

        container.style.zIndex =
            "99999";

        container.style.width =
            "min(400px, calc(100vw - 40px))";


        document.body.appendChild(
            container
        );

    }


    const alert =
        document.createElement("div");


    alert.className =
        `alert alert-${type} alert-dismissible fade show shadow`;


    alert.setAttribute(
        "role",
        "alert"
    );


    const icon =
        type === "danger"
            ? "bi-exclamation-triangle"
            : "bi-check-circle";


    alert.innerHTML = `
        <i class="bi ${icon} me-2"></i>
        ${message}
        <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert">
        </button>
    `;


    container.appendChild(
        alert
    );


    setTimeout(
        function () {

            if (alert) {

                const instance =
                    bootstrap.Alert.getOrCreateInstance(
                        alert
                    );

                instance.close();

            }

        },
        5000
    );

}


/* =========================================================
   PARTICLES
   ========================================================= */

function createParticles() {

    /*
     * Your Developers page uses #particles.
     * Some other pages may use .particles.
     */

    const container =
        document.getElementById("particles") ||
        document.querySelector(".particles");


    if (!container) {
        return;
    }


    /*
     * Don't duplicate particles if the page already
     * created them with its own JavaScript.
     */

    if (container.children.length > 0) {
        return;
    }


    const count =
        window.innerWidth < 768
            ? 20
            : 40;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const particle =
            document.createElement("span");


        particle.className =
            "particle";


        particle.style.left =
            Math.random() * 100 + "%";


        particle.style.top =
            Math.random() * 100 + "%";


        particle.style.animationDelay =
            Math.random() * 6 + "s";


        particle.style.animationDuration =
            4 + Math.random() * 6 + "s";


        container.appendChild(
            particle
        );

    }

}
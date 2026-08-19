// ========================================
// DATA AWAL
// ========================================

let links = JSON.parse(localStorage.getItem("linkVault")) || [
    {
        id: 1,
        name: "Template PPT Presentasi",
        url: "https://www.canva.com/",
        category: "Canva",
        description: "Kumpulan template presentasi Canva untuk tugas kuliah.",
        favorite: true
    },

    {
        id: 2,
        name: "Template Instagram Post",
        url: "https://www.canva.com/",
        category: "Design",
        description: "Template desain untuk Instagram dan media sosial.",
        favorite: false
    },

    {
        id: 3,
        name: "Google Drive Kuliah",
        url: "https://drive.google.com/",
        category: "Dokumen",
        description: "Folder penyimpanan berbagai dokumen perkuliahan.",
        favorite: true
    }
];


let currentCategory = "Semua";
let favoritesOnly = false;


// ========================================
// SAVE DATA
// ========================================

function saveData() {

    localStorage.setItem(
        "linkVault",
        JSON.stringify(links)
    );

}


// ========================================
// DISPLAY LINKS
// ========================================

function displayLinks(data = links) {

    const container =
        document.getElementById("linkContainer");

    const emptyState =
        document.getElementById("emptyState");

    container.innerHTML = "";


    let filtered = data.filter(link => {

        if (currentCategory !== "Semua" &&
            link.category !== currentCategory) {

            return false;
        }

        if (favoritesOnly &&
            !link.favorite) {

            return false;
        }

        return true;

    });


    if (filtered.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }


    filtered.forEach(link => {

        const card =
            document.createElement("div");

        card.className = "link-card";


        const icon =
            getCategoryIcon(link.category);


        card.innerHTML = `

            <div class="card-top">

                <div class="category-icon">
                    ${icon}
                </div>

                <button
                    class="favorite ${link.favorite ? "active" : ""}"
                    onclick="toggleFavorite(${link.id})"
                >
                    ${link.favorite ? "♥" : "♡"}
                </button>

            </div>


            <h3>
                ${escapeHTML(link.name)}
            </h3>


            <p>
                ${escapeHTML(
                    link.description ||
                    "Tidak ada deskripsi."
                )}
            </p>


            <span class="link-url">
                ${escapeHTML(link.url)}
            </span>


            <div class="card-actions">

                <button
                    onclick="copyLink('${link.url}')"
                >
                    📋 Copy
                </button>

                <button
                    onclick="editLink(${link.id})"
                >
                    ✏ Edit
                </button>

                <button
                    onclick="deleteLink(${link.id})"
                >
                    🗑 Hapus
                </button>

                <button
                    class="open-button"
                    onclick="openLink('${link.url}')"
                >
                    Buka
                </button>

            </div>

        `;


        container.appendChild(card);

    });


    updateStatistics(filtered.length);

}


// ========================================
// CATEGORY ICON
// ========================================

function getCategoryIcon(category) {

    const icons = {

        Canva: "✦",

        Design: "◇",

        Dokumen: "▤",

        Lainnya: "🔗"

    };

    return icons[category] || "🔗";

}


// ========================================
// STATISTICS
// ========================================

function updateStatistics(resultCount) {

    document.getElementById("totalLinks")
        .textContent = links.length;


    document.getElementById("canvaCount")
        .textContent =
        links.filter(
            link => link.category === "Canva"
        ).length;


    document.getElementById("favoriteCount")
        .textContent =
        links.filter(
            link => link.favorite
        ).length;


    document.getElementById("resultCount")
        .textContent =
        `${resultCount} links`;

}


// ========================================
// FILTER CATEGORY
// ========================================

function filterCategory(category, button) {

    currentCategory = category;

    favoritesOnly = false;


    document.querySelectorAll(
        ".category"
    ).forEach(btn => {

        btn.classList.remove("active");

    });


    document.querySelectorAll(
        ".nav-item"
    ).forEach(btn => {

        btn.classList.remove("active");

    });


    if (button) {

        button.classList.add("active");

    }


    displayLinks();

}


// ========================================
// FAVORITES
// ========================================

function showFavorites(button) {

    favoritesOnly = true;

    currentCategory = "Semua";


    document.querySelectorAll(
        ".nav-item"
    ).forEach(btn => {

        btn.classList.remove("active");

    });


    button.classList.add("active");


    document.querySelectorAll(
        ".category"
    ).forEach(btn => {

        btn.classList.remove("active");

    });


    displayLinks();

}


// ========================================
// SEARCH
// ========================================

function searchLinks() {

    const keyword =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    const result =
        links.filter(link => {

            return (
                link.name.toLowerCase().includes(keyword) ||
                link.description.toLowerCase().includes(keyword) ||
                link.category.toLowerCase().includes(keyword)
            );

        });


    displayLinks(result);

}


// ========================================
// MODAL
// ========================================

function openModal(editData = null) {

    const modal =
        document.getElementById("modal");

    modal.classList.add("show");


    if (editData) {

        document.getElementById("modalTitle")
            .textContent = "Edit Link";

        document.getElementById("editId")
            .value = editData.id;

        document.getElementById("linkName")
            .value = editData.name;

        document.getElementById("linkUrl")
            .value = editData.url;

        document.getElementById("linkCategory")
            .value = editData.category;

        document.getElementById("linkDescription")
            .value = editData.description;

    } else {

        document.getElementById("modalTitle")
            .textContent = "Tambah Link";

        document.getElementById("linkForm")
            .reset();

        document.getElementById("editId")
            .value = "";

    }

}


function closeModal() {

    document
        .getElementById("modal")
        .classList.remove("show");

}


// ========================================
// ADD / EDIT LINK
// ========================================

document
    .getElementById("linkForm")
    .addEventListener("submit", function(e) {

        e.preventDefault();


        const id =
            document
                .getElementById("editId")
                .value;


        const data = {

            name:
                document
                    .getElementById("linkName")
                    .value,

            url:
                document
                    .getElementById("linkUrl")
                    .value,

            category:
                document
                    .getElementById("linkCategory")
                    .value,

            description:
                document
                    .getElementById("linkDescription")
                    .value

        };


        if (id) {

            const index =
                links.findIndex(
                    link => link.id == id
                );


            links[index] = {

                ...links[index],

                ...data

            };


            showToast("Link berhasil diperbarui!");

        } else {

            links.unshift({

                id: Date.now(),

                ...data,

                favorite: false

            });


            showToast("Link berhasil ditambahkan!");

        }


        saveData();

        closeModal();

        displayLinks();

    });


// ========================================
// EDIT
// ========================================

function editLink(id) {

    const link =
        links.find(
            item => item.id === id
        );


    if (link) {

        openModal(link);

    }

}


// ========================================
// DELETE
// ========================================

function deleteLink(id) {

    const confirmDelete =
        confirm(
            "Apakah kamu yakin ingin menghapus link ini?"
        );


    if (!confirmDelete) return;


    links =
        links.filter(
            link => link.id !== id
        );


    saveData();

    displayLinks();

    showToast("Link berhasil dihapus!");

}


// ========================================
// FAVORITE
// ========================================

function toggleFavorite(id) {

    const link =
        links.find(
            item => item.id === id
        );


    if (!link) return;


    link.favorite =
        !link.favorite;


    saveData();

    displayLinks();

}


// ========================================
// COPY LINK
// ========================================

function copyLink(url) {

    navigator.clipboard
        .writeText(url)
        .then(() => {

            showToast(
                "Link berhasil disalin!"
            );

        });

}


// ========================================
// OPEN LINK
// ========================================

function openLink(url) {

    window.open(
        url,
        "_blank"
    );

}


// ========================================
// TOAST
// ========================================

function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.textContent = message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


// ========================================
// SECURITY
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ========================================
// CLOSE MODAL WHEN CLICK OUTSIDE
// ========================================

document
    .getElementById("modal")
    .addEventListener("click", function(e) {

        if (e.target === this) {

            closeModal();

        }

    });


// ========================================
// INITIAL DISPLAY
// ========================================

displayLinks();
// ========================================
// LINK VAULT - SUPABASE VERSION
// ========================================

// ========================================
// SUPABASE
// ========================================

const SUPABASE_URL = "https://gkailfxyrpazjxnxxsva.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_8hZq6onMtZH4elKRKCGSMQ_AoBgm8j-";

const { createClient } = window.supabase;

const db = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ========================================
// DATA
// ========================================

let links = [];

let currentCategory = "Semua";
let favoritesOnly = false;


// Data awal.
// Data ini hanya akan dimasukkan jika tabel Supabase kosong.
const defaultLinks = [
    {
        name: "Template PPT Presentasi",
        url: "https://www.canva.com/",
        category: "Canva",
        description: "Kumpulan template presentasi Canva untuk tugas kuliah.",
        favorite: true
    },

    {
        name: "Template Instagram Post",
        url: "https://www.canva.com/",
        category: "Design",
        description: "Template desain untuk Instagram dan media sosial.",
        favorite: false
    },

    {
        name: "Google Drive Kuliah",
        url: "https://drive.google.com/",
        category: "Dokumen",
        description: "Folder penyimpanan berbagai dokumen perkuliahan.",
        favorite: true
    }
];


// ========================================
// LOAD DATA DARI SUPABASE
// ========================================

async function loadData() {

    try {

        const { data, error } = await db
            .from("links")
            .select("*")
            .order("id", { ascending: true });

        if (error) {

            console.error(
                "Gagal mengambil data dari Supabase:",
                error
            );

            showToast("Gagal mengambil data dari database.");

            return;
        }


        // Jika tabel Supabase masih kosong,
        // masukkan data awal.
        if (!data || data.length === 0) {

            const {
                data: insertedData,
                error: insertError
            } = await db
                .from("links")
                .insert(defaultLinks)
                .select();


            if (insertError) {

                console.error(
                    "Gagal memasukkan data awal:",
                    insertError
                );

                links = [];

                displayLinks();

                return;
            }


            links = insertedData || [];

        } else {

            links = data;

        }


        displayLinks();


        console.log(
            "Data berhasil dimuat dari Supabase:",
            links
        );

    } catch (error) {

        console.error(
            "Terjadi kesalahan saat load data:",
            error
        );

    }
}


// ========================================
// DISPLAY LINKS
// ========================================

function displayLinks(data = links) {

    const container =
        document.getElementById("linkContainer");

    const emptyState =
        document.getElementById("emptyState");


    if (!container) return;


    container.innerHTML = "";


    let filtered = data.filter(link => {


        if (
            currentCategory !== "Semua" &&
            link.category !== currentCategory
        ) {

            return false;

        }


        if (
            favoritesOnly &&
            !link.favorite
        ) {

            return false;

        }


        return true;

    });


    if (filtered.length === 0) {

        if (emptyState) {

            emptyState.style.display = "block";

        }

    } else {

        if (emptyState) {

            emptyState.style.display = "none";

        }

    }


    filtered.forEach(link => {

        const card =
            document.createElement("div");


        card.className =
            "link-card";


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
                    aria-label="Favorite"
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
                    onclick="copyLink(${JSON.stringify(link.url)})"
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
                    onclick="openLink(${JSON.stringify(link.url)})"
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

    const totalLinks =
        document.getElementById("totalLinks");

    const canvaCount =
        document.getElementById("canvaCount");

    const favoriteCount =
        document.getElementById("favoriteCount");

    const resultCountElement =
        document.getElementById("resultCount");


    if (totalLinks) {

        totalLinks.textContent =
            links.length;

    }


    if (canvaCount) {

        canvaCount.textContent =
            links.filter(
                link => link.category === "Canva"
            ).length;

    }


    if (favoriteCount) {

        favoriteCount.textContent =
            links.filter(
                link => link.favorite
            ).length;

    }


    if (resultCountElement) {

        resultCountElement.textContent =
            `${resultCount} links`;

    }

}


// ========================================
// FILTER CATEGORY
// ========================================

function filterCategory(category, button) {

    currentCategory =
        category;


    favoritesOnly =
        false;


    document
        .querySelectorAll(".category")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    document
        .querySelectorAll(".nav-item")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    if (button) {

        button.classList.add("active");

    }


    displayLinks();

}


// ========================================
// FAVORITES FILTER
// ========================================

function showFavorites(button) {

    favoritesOnly =
        true;


    currentCategory =
        "Semua";


    document
        .querySelectorAll(".nav-item")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    if (button) {

        button.classList.add("active");

    }


    document
        .querySelectorAll(".category")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    displayLinks();

}


// ========================================
// SEARCH
// ========================================

function searchLinks() {

    const searchInput =
        document.getElementById("searchInput");


    const keyword =
        (searchInput?.value || "")
            .toLowerCase()
            .trim();


    const result =
        links.filter(link => {

            return (

                (link.name || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (link.description || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (link.category || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (link.url || "")
                    .toLowerCase()
                    .includes(keyword)

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


    if (!modal) return;


    modal.classList.add("show");


    if (editData) {


        document.getElementById("modalTitle")
            .textContent =
            "Edit Link";


        document.getElementById("editId")
            .value =
            editData.id;


        document.getElementById("linkName")
            .value =
            editData.name;


        document.getElementById("linkUrl")
            .value =
            editData.url;


        document.getElementById("linkCategory")
            .value =
            editData.category;


        document.getElementById("linkDescription")
            .value =
            editData.description || "";


    } else {


        document.getElementById("modalTitle")
            .textContent =
            "Tambah Link";


        document.getElementById("linkForm")
            .reset();


        document.getElementById("editId")
            .value =
            "";

    }

}


// ========================================
// CLOSE MODAL
// ========================================

function closeModal() {

    const modal =
        document.getElementById("modal");


    if (modal) {

        modal.classList.remove("show");

    }

}


// ========================================
// ADD / EDIT LINK
// ========================================

const linkForm =
    document.getElementById("linkForm");


if (linkForm) {

    linkForm.addEventListener(
        "submit",
        async function(e) {

            e.preventDefault();


            const id =
                document
                    .getElementById("editId")
                    .value;


            const data = {

                name:
                    document
                        .getElementById("linkName")
                        .value
                        .trim(),


                url:
                    document
                        .getElementById("linkUrl")
                        .value
                        .trim(),


                category:
                    document
                        .getElementById("linkCategory")
                        .value,


                description:
                    document
                        .getElementById("linkDescription")
                        .value
                        .trim()

            };


            // ========================================
            // EDIT
            // ========================================

            if (id) {


                const {
                    data: updatedData,
                    error
                } = await db

                    .from("links")

                    .update(data)

                    .eq("id", id)

                    .select()

                    .single();


                if (error) {

                    console.error(
                        "Gagal mengedit link:",
                        error
                    );

                    showToast(
                        "Gagal memperbarui link."
                    );

                    return;

                }


                const index =
                    links.findIndex(
                        link =>
                            String(link.id) ===
                            String(id)
                    );


                if (index !== -1) {

                    links[index] =
                        updatedData;

                }


                showToast(
                    "Link berhasil diperbarui!"
                );


            }


            // ========================================
            // TAMBAH
            // ========================================

            else {


                const newLink = {

                    ...data,

                    favorite:
                        false

                };


                const {
                    data: insertedData,
                    error
                } = await db

                    .from("links")

                    .insert([newLink])

                    .select()

                    .single();


                if (error) {

                    console.error(
                        "Gagal menambahkan link:",
                        error
                    );

                    showToast(
                        "Gagal menambahkan link."
                    );

                    return;

                }


                links.unshift(
                    insertedData
                );


                showToast(
                    "Link berhasil ditambahkan!"
                );

            }


            closeModal();

            displayLinks();

        }
    );

}


// ========================================
// EDIT LINK
// ========================================

function editLink(id) {

    const link =
        links.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (link) {

        openModal(link);

    }

}


// ========================================
// DELETE LINK
// ========================================

async function deleteLink(id) {

    const confirmDelete =
        confirm(
            "Apakah kamu yakin ingin menghapus link ini?"
        );


    if (!confirmDelete) return;


    const {
        error
    } = await db

        .from("links")

        .delete()

        .eq("id", id);


    if (error) {

        console.error(
            "Gagal menghapus link:",
            error
        );

        showToast(
            "Gagal menghapus link."
        );

        return;

    }


    links =
        links.filter(
            link =>
                String(link.id) !==
                String(id)
        );


    displayLinks();


    showToast(
        "Link berhasil dihapus!"
    );

}


// ========================================
// FAVORITE
// ========================================

async function toggleFavorite(id) {

    const link =
        links.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!link) return;


    const newFavorite =
        !link.favorite;


    const {
        data,
        error
    } = await db

        .from("links")

        .update({

            favorite:
                newFavorite

        })

        .eq("id", id)

        .select()

        .single();


    if (error) {

        console.error(
            "Gagal mengubah favorite:",
            error
        );

        showToast(
            "Gagal mengubah favorite."
        );

        return;

    }


    const index =
        links.findIndex(
            item =>
                String(item.id) ===
                String(id)
        );


    if (index !== -1) {

        links[index] =
            data;

    }


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

        })

        .catch(error => {

            console.error(
                "Gagal menyalin link:",
                error
            );

            showToast(
                "Gagal menyalin link."
            );

        });

}


// ========================================
// OPEN LINK
// ========================================

function openLink(url) {

    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


// ========================================
// TOAST
// ========================================

function showToast(message) {

    const toast =
        document.getElementById("toast");


    if (!toast) return;


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 2500);

}


// ========================================
// SECURITY
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text ?? "";


    return div.innerHTML;

}


// ========================================
// CLOSE MODAL WHEN CLICK OUTSIDE
// ========================================

const modal =
    document.getElementById("modal");


if (modal) {

    modal.addEventListener(
        "click",
        function(e) {

            if (
                e.target === this
            ) {

                closeModal();

            }

        }
    );

}


// ========================================
// INITIAL LOAD
// ========================================

// Data tidak diambil dari localStorage.
// Data diambil langsung dari Supabase.

loadData();
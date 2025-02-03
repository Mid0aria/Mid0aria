document.addEventListener("keydown", konamiCodeCheck);
document.addEventListener("keydown", hmmnewcategory);
document.addEventListener("DOMContentLoaded", async function () {
    checktitle();
    const api = "https://api.github.com/repos/mid0hub/website-api";
    const Gallery = document.getElementById("Gallery");
    const categorySelect = document.getElementById("categorySelect");
    const tiktokMenu = document.getElementById("tiktokMenu");
    const tiktokSelect = document.getElementById("tiktokSelect");
    const instagramMenu = document.getElementById("instagramMenu");
    let loadMoreButton = null;
    let firstcategory = categorySelect[0].value;
    let firstcategorymedia = await getCachedMedia(firstcategory);
    displayMediaBatched(firstcategorymedia);
    categorySelect.addEventListener("change", async function () {
        const category = categorySelect.value;

        Gallery.innerHTML = "";

        if (category === "tiktok") {
            switchCategory("Gallery");
            tiktokMenu.style.display = "block";
            instagramMenu.style.display = "none";
            resetLoadMoreButton();
            await fetchtiktok();
        } else if (category === "instagram") {
            switchCategory("Gallery");
            tiktokMenu.style.display = "none";
            instagramMenu.style.display = "block";
            resetLoadMoreButton();
            await fetchInstagram();
        } else if (category === "liked") {
            switchCategory("liked_category");
            tiktokMenu.style.display = "none";
            instagramMenu.style.display = "none";
            const mediaLinks = await getCachedMedia(category);
            resetLoadMoreButton();
            displayMediaBatched(mediaLinks);
        } else if (category === "saved") {
            switchCategory("saved_category");
            tiktokMenu.style.display = "none";
            instagramMenu.style.display = "none";
            const mediaLinks = await getCachedMedia(category);
            resetLoadMoreButton();
            displayMediaBatched(mediaLinks);
        } else {
            switchCategory("Gallery");
            tiktokMenu.style.display = "none";
            instagramMenu.style.display = "none";
            const mediaLinks = await getCachedMedia(category);
            resetLoadMoreButton();
            displayMediaBatched(mediaLinks);
        }
    });

    function switchCategory(a) {
        const container = document.querySelector(".gallery");
        if (container) {
            container.id = a;
            console.log(
                "%c Switch Category ",
                "background: purple; color: white; font-size: 15px; font-weight: bold;",
                `Switched to ${a}.`
            );
        }
    }

    tiktokSelect.addEventListener("change", async function () {
        Gallery.innerHTML = "";
        const selecttiktok = tiktokSelect.value;
        const tiktokmedia = await getCachedMedia(`tiktok/${selecttiktok}`);
        resetLoadMoreButton();
        displayMediaBatched(tiktokmedia);
    });

    instagramSelect.addEventListener("change", async function () {
        Gallery.innerHTML = "";
        selectInstagram = instagramSelect.value;
        const instagramMedia = await getCachedMedia(
            `instagram/${selectInstagram}`
        );

        resetLoadMoreButton();
        displayMediaBatched(instagramMedia);
    });

    // /*});*/ //That interesting

    async function fetchtiktok() {
        const tiktoksResponse = await fetch(`${api}/contents/galery/tiktok`);
        const tiktoksData = await tiktoksResponse.json();

        const cachedTiktokers = localStorage.getItem("cachedtiktokers");

        if (!cachedTiktokers) {
            console.log(
                "%c Fetch Tiktok ",
                "background: purple; color: white; font-size: 15px; font-weight: bold;",
                `Tiktokers is caching...`
            );
            localStorage.setItem(
                "cachedtiktokers",
                JSON.stringify(tiktoksData)
            );
        } else {
            if (cachedTiktokers.includes("API rate limit")) {
                console.log(
                    "%c Fetch Tiktok ",
                    "background: purple; color: white; font-size: 15px; font-weight: bold;",
                    "Cached Tiktokers contain API rate limit message. Removing cache."
                );
                localStorage.removeItem("cachedtiktokers");
                console.log(
                    "%c Fetch Tiktok ",
                    "background: purple; color: white; font-size: 15px; font-weight: bold;",
                    `Tiktokers is recaching...`
                );
                localStorage.setItem(
                    "cachedtiktokers",
                    JSON.stringify(tiktoksData)
                );
            } else {
                const cachedCommitDate = localStorage.getItem(
                    "cachedCommitDate_tiktok"
                );
                const commitsURL = `${api}/commits`;
                const commitsResponse = await fetch(commitsURL);

                if (commitsResponse.ok) {
                    const commitsData = await commitsResponse.json();
                    const latestCommitDate = commitsData[0].commit.author.date;

                    if (cachedCommitDate !== latestCommitDate) {
                        console.log(
                            "%c Fetch Tiktok ",
                            "background: purple; color: white; font-size: 15px; font-weight: bold;",
                            "YEEEYYY New TikTokerssss"
                        );
                        localStorage.setItem(
                            "cachedtiktokers",
                            JSON.stringify(tiktoksData)
                        );
                        localStorage.setItem(
                            "cachedCommitDate_tiktok",
                            latestCommitDate
                        );
                    } else {
                        console.log(
                            "%c Fetch Tiktok ",
                            "background: purple; color: white; font-size: 15px; font-weight: bold;",
                            `Tiktokers:\ncachedCommitDate: ${cachedCommitDate}\nlatestCommitDate: ${latestCommitDate}`
                        );
                    }
                } else {
                    console.log(
                        "%c Fetch Tiktok ",
                        "background: purple; color: white; font-size: 15px; font-weight: bold;",
                        `You Forbidden Github Api\nReason: github rate limit activated please try again after 1 hour\nResponse:`
                    );
                    console.log(
                        "%c Fetch Tiktok ",
                        "background: purple; color: white; font-size: 15px; font-weight: bold;",
                        commitsResponse
                    );
                }
            }
        }

        const updatedCachedTiktokers = localStorage.getItem("cachedtiktokers");
        const tiktokers = JSON.parse(updatedCachedTiktokers);

        tiktokSelect.innerHTML = "";

        tiktokers.forEach((tiktoker) => {
            const tiktokOption = document.createElement("option");
            tiktokOption.value = tiktoker.name;
            tiktokOption.textContent = tiktoker.name;
            tiktokSelect.appendChild(tiktokOption);
        });

        const firstTiktok = tiktokers[0].name;
        const firsttiktokmedia = await getCachedMedia(`tiktok/${firstTiktok}`);
        displayMediaBatched(firsttiktokmedia);
    }

    async function fetchInstagram() {
        const instagramsResponse = await fetch(
            `${api}/contents/galery/instagram`
        );

        const instagramsData = await instagramsResponse.json();

        const cachedInstagrammers = localStorage.getItem("cachedInstagrammers");
        if (!cachedInstagrammers) {
            console.log(
                "%c Fetch Instagram ",
                "background: purple; color: white; font-size: 15px; font-weight: bold;",
                `Instagrammers is caching...`
            );
            localStorage.setItem(
                "cachedInstagrammers",
                JSON.stringify(instagramsData)
            );
        } else {
            if (cachedInstagrammers.includes("API rate limit")) {
                console.log(
                    "%c Fetch Instagram ",
                    "background: purple; color: white; font-size: 15px; font-weight: bold;",
                    "Cached Instagrammers contain API rate limit message. Removing cache."
                );
                localStorage.removeItem("cachedInstagrammers");
                console.log(
                    "%c Fetch Instagram ",
                    "background: purple; color: white; font-size: 15px; font-weight: bold;",
                    `Instagrammers is recaching...`
                );
                localStorage.setItem(
                    "cachedInstagrammers",
                    JSON.stringify(instagramsData)
                );
            } else {
                const cachedCommitDate = localStorage.getItem(
                    "cachedCommitDate_instagram"
                );
                const commitsURL = `${api}/commits`;
                const commitsResponse = await fetch(commitsURL);

                if (commitsResponse.ok) {
                    const commitsData = await commitsResponse.json();
                    const latestCommitDate = commitsData[0].commit.author.date;

                    if (cachedCommitDate !== latestCommitDate) {
                        console.log(
                            "%c Fetch Instagram ",
                            "background: purple; color: white; font-size: 15px; font-weight: bold;",
                            "YEEEYYY New instagrammerssss"
                        );
                        localStorage.setItem(
                            "cachedInstagrammers",
                            JSON.stringify(instagramsData)
                        );
                        localStorage.setItem(
                            "cachedCommitDate_instagram",
                            latestCommitDate
                        );
                    } else {
                        console.log(
                            "%c Fetch Instagram ",
                            "background: purple; color: white; font-size: 15px; font-weight: bold;",
                            `Instagrammers:\ncachedCommitDate: ${cachedCommitDate}\nlatestCommitDate: ${latestCommitDate}`
                        );
                    }
                } else {
                    console.log(
                        "%c Fetch Instagram ",
                        "background: purple; color: white; font-size: 15px; font-weight: bold;",
                        `You Forbidden Github Api\nReason: github rate limit activated please try again after 1 hour\nResponse:`
                    );
                    console.log(
                        "%c Fetch Instagram ",
                        "background: purple; color: white; font-size: 15px; font-weight: bold;",
                        commitsResponse
                    );
                }
            }
        }

        const updatedCachedInstagrammers = localStorage.getItem(
            "cachedInstagrammers"
        );
        const instagrammers = JSON.parse(updatedCachedInstagrammers);

        instagramSelect.innerHTML = "";

        instagrammers.forEach((instagramer) => {
            const instagramOption = document.createElement("option");
            instagramOption.value = instagramer.name;
            instagramOption.textContent = instagramer.name;
            instagramSelect.appendChild(instagramOption);
        });

        const firstInstagram = instagrammers[0].name;
        let cachedInstagramerImages = await getCachedMedia(
            `instagram/${firstInstagram}`
        );
        displayMediaBatched(cachedInstagramerImages);
    }

    /*
==========================
	Display Media
==========================
*/

    async function displayMediaBatched(mediaLinks) {
        if (!mediaLinks) {
            return;
        }
        const batchSize = 4;
        let startIndex = 0;
        function loadNextBatch() {
            const batch = mediaLinks.slice(startIndex, startIndex + batchSize);
            if (batch.length > 0) {
                displayMedia(batch);
                startIndex += batchSize;
            } else {
                loadMoreButton.style.display = "none";
            }
        }

        loadNextBatch();

        loadMoreButton = document.createElement("button");
        loadMoreButton.textContent = "Load More";
        loadMoreButton.id = "loadmorebutton";
        loadMoreButton.style.display = "block";
        loadMoreButton.style.margin = "20px auto";
        loadMoreButton.style.padding = "10px 20px";
        loadMoreButton.style.fontSize = "16px";
        loadMoreButton.addEventListener("click", function () {
            loadNextBatch();
        });
        document.body.appendChild(loadMoreButton);
    }

    function resetLoadMoreButton() {
        if (loadMoreButton) {
            loadMoreButton.remove();
            loadMoreButton = null;
        }
    }

    async function displayMedia(mediaLinks) {
        const liked = localStorage.getItem("liked") || "[]";
        const parsedLiked = JSON.parse(liked);
        const saved = localStorage.getItem("saved") || "[]";
        const parsedSaved = JSON.parse(saved);

        mediaLinks.forEach((mediaLink) => {
            const mediaContainer = document.createElement("div");
            mediaContainer.classList.add("media-container");

            let mediaElement;
            if (mediaLink.endsWith(".mp4")) {
                mediaElement = document.createElement("video");
                mediaElement.controls = true;
            } else if (
                mediaLink.endsWith(".png") ||
                mediaLink.endsWith(".jpg") ||
                mediaLink.endsWith(".webp")
            ) {
                mediaElement = document.createElement("img");
                mediaElement.addEventListener("click", () => {
                    openPopup(mediaLink);
                });
            } else {
                console.error("Unsupported media format:", mediaLink);
                return;
            }

            mediaElement.src = mediaLink;

            const isLiked = parsedLiked.includes(mediaLink);
            if (isLiked) {
                mediaElement.setAttribute("data-liked", "true");
            }

            const isSaved = parsedSaved.includes(mediaLink);
            if (isSaved) {
                mediaElement.setAttribute("data-saved", "true");
            }

            mediaContainer.appendChild(mediaElement);

            const likeButton = document.createElement("button");
            likeButton.innerHTML = isLiked
                ? '<i class="bi bi-suit-heart-fill"></i>'
                : '<i class="bi bi-suit-heart"></i>';
            likeButton.classList.add("like-button");

            likeButton.addEventListener("click", function () {
                toggleLikeStatus(mediaLink, mediaElement, likeButton);
            });

            mediaContainer.appendChild(likeButton);

            const savedButton = document.createElement("button");
            savedButton.innerHTML = isSaved
                ? '<i class="bi bi-bookmarks-fill"></i>'
                : '<i class="bi bi-bookmarks"></i>';
            savedButton.classList.add("saved-button");

            savedButton.addEventListener("click", function () {
                toggleSavedStatus(mediaLink, mediaElement, savedButton);
            });

            mediaContainer.appendChild(savedButton);
            checkambiance();
            Gallery.appendChild(mediaContainer);
        });
    }

    /*
==========================
	POPUP
==========================
*/

    function openPopup(imageUrl) {
        const existingPopup = document.querySelector(".popup-container");
        if (existingPopup) {
            existingPopup.remove();
        }
        const popupContainer = document.createElement("div");
        popupContainer.classList.add("popup-container");

        const popupContent = document.createElement("div");
        popupContent.classList.add("popup-content");

        const popupImage = document.createElement("img");
        popupImage.src = imageUrl;
        popupContent.appendChild(popupImage);

        const closeButton = document.createElement("span");
        closeButton.innerHTML = `<i class="bi bi-x-circle"></i>`;
        closeButton.classList.add("close-btn");
        closeButton.style =
            "position:absolute; top: 50px; right: -35px; font-size: 35px; padding: 5px;";

        closeButton.addEventListener("click", function () {
            closePopup(popupContainer);
        });

        popupContent.appendChild(closeButton);
        popupContainer.appendChild(popupContent);

        document.body.appendChild(popupContainer);
        popupContainer.style.display = "block";
    }

    function closePopup(popupContainer) {
        popupContainer.style.display = "none";
        document.body.removeChild(popupContainer);
    }
    /*
==========================
	toggle Status
==========================
*/
    function toggleLikeStatus(mediaLink, mediaElement, likeButton) {
        const liked = JSON.parse(localStorage.getItem("liked")) || [];
        const isLiked = liked.includes(mediaLink);

        if (!isLiked) {
            liked.push(mediaLink);
            localStorage.setItem("liked", JSON.stringify(liked));
            likeButton.innerHTML = '<i class="bi bi-suit-heart-fill"></i>';
            mediaElement.setAttribute("data-liked", "true");
        } else {
            const updatedLikes = liked.filter((link) => link !== mediaLink);
            localStorage.setItem("liked", JSON.stringify(updatedLikes));
            likeButton.innerHTML = '<i class="bi bi-suit-heart"></i>';
            mediaElement.removeAttribute("data-liked");

            const likedCategory = document.getElementById("liked_category");
            if (likedCategory) {
                const mediaContainers =
                    likedCategory.querySelectorAll(".media-container");
                mediaContainers.forEach((container) => {
                    const videoElement = container.querySelector("video");
                    const imgElement = container.querySelector("img");
                    if (videoElement && videoElement.src === mediaLink) {
                        container.remove();
                    }
                    if (imgElement && imgElement.src === mediaLink) {
                        container.remove();
                    }
                });
            }
        }
    }

    function toggleSavedStatus(mediaLink, mediaElement, savedButton) {
        const saved = JSON.parse(localStorage.getItem("saved")) || [];
        const issaved = saved.includes(mediaLink);

        if (!issaved) {
            saved.push(mediaLink);
            localStorage.setItem("saved", JSON.stringify(saved));
            savedButton.innerHTML = '<i class="bi bi-bookmarks-fill"></i>';
            mediaElement.setAttribute("data-saved", "true");
        } else {
            const updatedsaveds = saved.filter((link) => link !== mediaLink);
            localStorage.setItem("saved", JSON.stringify(updatedsaveds));
            savedButton.innerHTML = '<i class="bi bi-bookmarks"></i>';
            mediaElement.removeAttribute("data-saved");

            const savedCategory = document.getElementById("saved_category");
            if (savedCategory) {
                const mediaContainers =
                    savedCategory.querySelectorAll(".media-container");
                mediaContainers.forEach((container) => {
                    const videoElement = container.querySelector("video");
                    const imgElement = container.querySelector("img");
                    if (videoElement && videoElement.src === mediaLink) {
                        container.remove();
                    }
                    if (imgElement && imgElement.src === mediaLink) {
                        container.remove();
                    }
                });
            }
        }
    }

    /*
==========================
	Fetch And Cache
==========================
*/

    async function fetchAndCacheMedia(category) {
        if (category == "liked") {
            return JSON.parse(localStorage.getItem("liked"));
        } else if (category == "saved") {
            return JSON.parse(localStorage.getItem("saved"));
        }

        const mediaFolderURL = `${api}/contents/galery/` + category;
        const commitsURL = `${api}/commits`;
        const commitsResponse = await fetch(commitsURL);
        const commitsData = await commitsResponse.json();
        const latestCommitDate = commitsData[0].commit.author.date;
        const response = await fetch(mediaFolderURL);
        const data = await response.json();
        const mediaLinks = data.map((item) => item.download_url);
        const cachedCommitDate = localStorage.getItem(
            "cachedCommitDate_" + category
        );

        if (!cachedCommitDate || cachedCommitDate !== latestCommitDate) {
            console.log(
                "%c fetchAndCacheMedia ",
                "background: purple; color: white; font-size: 15px; font-weight: bold;",
                `${category} is caching via commit date`
            );
            localStorage.setItem(
                "cached_" + category,
                JSON.stringify(mediaLinks)
            );
            localStorage.setItem(
                "cachedCommitDate_" + category,
                latestCommitDate
            );
        }

        return mediaLinks;
    }

    async function getCachedMedia(category) {
        if (category === "tiktok" || category === "instagram") {
            return;
        }
        if (category.includes("tiktok/")) {
            let cachedMedia = localStorage.getItem("cached_" + category);

            if (!cachedMedia) {
                console.log(
                    "%c Get Cached Media ",
                    "background: purple; color: white; font-size: 15px; font-weight: bold;",
                    `${category} is caching...`
                );
                cachedMedia = await fetchAndCacheMedia(category);
            } else {
                const cachedCommitDate = localStorage.getItem(
                    "cachedCommitDate_" + category
                );
                const commitsURL = `${api}/commits`;
                const commitsResponse = await fetch(commitsURL);

                if (commitsResponse.status === 403) {
                    console.log(
                        "%c Get Cached Media ",
                        "background: purple; color: white; font-size: 15px; font-weight: bold;",
                        `You Forbidden Github Api\nReason: github rate limit activated please try again after 1 hour\nResponse:`
                    );
                    console.log(
                        "%c Get Cached Media ",
                        "background: purple; color: white; font-size: 15px; font-weight: bold;",
                        commitsResponse
                    );
                    cachedMedia = JSON.parse(cachedMedia);
                    cachedMedia.reverse();
                } else {
                    const commitsData = await commitsResponse.json();
                    const latestCommitDate = commitsData[0].commit.author.date;

                    if (cachedCommitDate !== latestCommitDate) {
                        console.log(
                            "%c Get Cached Media ",
                            "background: purple; color: white; font-size: 15px; font-weight: bold;",
                            "YEEEYYY New Mediassss"
                        );
                        cachedMedia = await fetchAndCacheMedia(category);
                    } else {
                        console.log(
                            "%c Get Cached Media ",
                            "background: purple; color: white; font-size: 15px; font-weight: bold;",
                            `Category: ${category}\ncachedCommitDate: ${cachedCommitDate}\nlatestCommitDate: ${latestCommitDate}`
                        );
                        cachedMedia = JSON.parse(cachedMedia);
                    }
                }
            }
            cachedMedia.reverse();

            return cachedMedia;
        } else if (category.includes("instagram/")) {
            let cachedMedia = localStorage.getItem("cached_" + category);

            if (!cachedMedia) {
                console.log(
                    "%c Get Cached Media ",
                    "background: purple; color: white; font-size: 15px; font-weight: bold;",
                    `${category} is caching...`
                );
                cachedMedia = await fetchAndCacheMedia(category);
            } else {
                const cachedCommitDate = localStorage.getItem(
                    "cachedCommitDate_" + category
                );
                const commitsURL = `${api}/commits`;
                const commitsResponse = await fetch(commitsURL);

                if (commitsResponse.status === 403) {
                    console.log(
                        "%c Get Cached Media ",
                        "background: purple; color: white; font-size: 15px; font-weight: bold;",
                        `You Forbidden Github Api\nReason: github rate limit activated please try again after 1 hour\nResponse:`
                    );
                    console.log(
                        "%c Get Cached Media ",
                        "background: purple; color: white; font-size: 15px; font-weight: bold;",
                        commitsResponse
                    );
                    cachedMedia = JSON.parse(cachedMedia);
                    cachedMedia.reverse();
                } else {
                    const commitsData = await commitsResponse.json();
                    const latestCommitDate = commitsData[0].commit.author.date;

                    if (cachedCommitDate !== latestCommitDate) {
                        console.log(
                            "%c Get Cached Media ",
                            "background: purple; color: white; font-size: 15px; font-weight: bold;",
                            "YEEEYYY New Mediassss"
                        );
                        cachedMedia = await fetchAndCacheMedia(category);
                    } else {
                        console.log(
                            "%c Get Cached Media ",
                            "background: purple; color: white; font-size: 15px; font-weight: bold;",
                            `Category: ${category}\ncachedCommitDate: ${cachedCommitDate}\nlatestCommitDate: ${latestCommitDate}`
                        );
                        cachedMedia = JSON.parse(cachedMedia);
                    }
                }
            }
            cachedMedia.reverse();

            return cachedMedia;
        }
        let cachedMedia = localStorage.getItem("cached_" + category);

        if (!cachedMedia) {
            console.log(
                "%c Get Cached Media ",
                "background: purple; color: white; font-size: 15px; font-weight: bold;",
                `${category} is caching...`
            );
            cachedMedia = await fetchAndCacheMedia(category);
        } else {
            const cachedCommitDate = localStorage.getItem(
                "cachedCommitDate_" + category
            );
            const commitsURL = `${api}/commits`;
            const commitsResponse = await fetch(commitsURL);

            if (commitsResponse.status === 403) {
                console.log(
                    "%c Get Cached Media ",
                    "background: purple; color: white; font-size: 15px; font-weight: bold;",
                    `You Forbidden Github Api\nReason: github rate limit activated please try again after 1 hour\nResponse:`
                );
                console.log(
                    "%c Get Cached Media ",
                    "background: purple; color: white; font-size: 15px; font-weight: bold;",
                    commitsResponse
                );
                cachedMedia = JSON.parse(cachedMedia);
            } else {
                const commitsData = await commitsResponse.json();
                const latestCommitDate = commitsData[0].commit.author.date;

                if (cachedCommitDate !== latestCommitDate) {
                    console.log(
                        "%c Get Cached Media ",
                        "background: purple; color: white; font-size: 15px; font-weight: bold;",
                        "YEEEYYY New Mediassss"
                    );
                    cachedMedia = await fetchAndCacheMedia(category);
                } else {
                    console.log(
                        "%c Get Cached Media ",
                        "background: purple; color: white; font-size: 15px; font-weight: bold;",
                        `Category: ${category}\ncachedCommitDate: ${cachedCommitDate}\nlatestCommitDate: ${latestCommitDate}`
                    );
                    cachedMedia = JSON.parse(cachedMedia);
                }
            }
        }

        return cachedMedia;
    }
});

/*
==========================
		Settings
==========================
*/
const settingsButton = document.getElementById("settingsButton");
const settingsModal = document.getElementById("settingsModal");
const ambianceToggleSwitch = document.getElementById("ambianceToggleSwitch");
// const ambianceColorPicker = document.getElementById("ambianceColorPicker");
const changeTitleInput = document.getElementById("newTitle");
const resetTitleButton = document.getElementById("resettitle");
const desc1 = document.getElementById("desc1");

ambianceToggleSwitch.addEventListener("change", function () {
    if (ambianceToggleSwitch.checked) {
        document
            .querySelectorAll(".media-container")
            .forEach(function (mediaContainer) {
                mediaContainer.style.boxShadow = "0 0 20px rgb(255, 255, 255)";
            });
        localStorage.setItem("ambianceMode", "true");
        console.log(
            "%c Settings ",
            "background: blue; color: white; font-size: 15px; font-weight: bold;",
            "Ambiance Mode: True"
        );
    } else {
        document
            .querySelectorAll(".media-container")
            .forEach(function (mediaContainer) {
                mediaContainer.style.boxShadow = "0 0 20px rgb(0, 0, 0)";
            });
        localStorage.setItem("ambianceMode", "false");
        console.log(
            "%c Settings ",
            "background: blue; color: white; font-size: 15px; font-weight: bold;",
            "Ambiance Mode: False"
        );
    }
});

changeTitleInput.addEventListener("input", function () {
    desc1.textContent = changeTitleInput.value;
    localStorage.setItem("title", desc1.textContent);
    /* console.log(
        "%c Settings ",
        "background: blue; color: white; font-size: 15px; font-weight: bold;",
        `New Title: ${desc1.textContent}`
    );*/
});
resetTitleButton.addEventListener("click", function () {
    desc1.textContent = "ε(´｡•᎑•`)っ 💕";
    localStorage.setItem("title", desc1.textContent);
    document.getElementById("newTitle").value = desc1.textContent;
    console.log(
        "%c Settings ",
        "background: blue; color: white; font-size: 15px; font-weight: bold;",
        `Title resetted`
    );
});

settingsButton.addEventListener("click", function () {
    settingsModal.style.display = "block";
    localtitle = localStorage.getItem("title");
    if (localtitle) {
        if (localtitle.trim() === "") {
            desc1.textContent = "ε(´｡•᎑•`)っ 💕";
            localStorage.setItem("title", desc1.textContent);
            document.getElementById("newTitle").value = desc1.textContent;
        } else {
            document.getElementById("newTitle").value = localtitle;
        }
    }
});

function closeModal() {
    settingsModal.style.display = "none";
}

function checkambiance() {
    const isAmbianceMode = localStorage.getItem("ambianceMode");
    if (isAmbianceMode && isAmbianceMode === "true") {
        ambianceToggleSwitch.checked = true;
        document
            .querySelectorAll(".media-container")
            .forEach(function (mediaContainer) {
                mediaContainer.style.boxShadow = "0 0 20px rgb(255, 255, 255)";
            });
    }
}

function checktitle() {
    const title = localStorage.getItem("title");
    if (title) {
        if (title.trim() === "") {
            desc1.textContent = "ε(´｡•᎑•`)っ 💕";
            localStorage.setItem("title", desc1.textContent);
        } else {
            desc1.textContent = title;
            console.log(
                "%c Settings ",
                "background: darkblue; color: white; font-size: 15px; font-weight: bold;",
                `Title: ${title}`
            );
        }
    }
}

/*
==========================
		konamicode
==========================
*/
const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
];
let konamiCodePosition = 0;
function konamiCodeCheck(event) {
    if (
        event.key.toLowerCase() === konamiCode[konamiCodePosition].toLowerCase()
    ) {
        konamiCodePosition++;
        if (konamiCodePosition === konamiCode.length) {
            document.getElementById("desc1").innerHTML =
                "You Found The Secret! , again , Congratulations!";
            console.log(
                "%c Easter Egg ",
                "background: yellow; color: white; font-size: 15px; font-weight: bold;",
                "ε(´｡•᎑•`)っ ❤️"
            );
            setTimeout(() => {
                window.location.href = "/fuksci.html";
            }, 2500);
            konamiCodePosition = 0;
        }
    } else {
        konamiCodePosition = 0;
    }
}

/*
==========================
		NewCategory
==========================
*/

const newcategorykeys = [
    "ArrowLeft",
    "ArrowLeft",
    "ArrowRight",
    "ArrowRight",
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "q",
    "w",
    "e",
];
let newcategorykeyposition = 0;

function hmmnewcategory(event) {
    if (
        event.key.toLowerCase() ===
        newcategorykeys[newcategorykeyposition].toLowerCase()
    ) {
        newcategorykeyposition++;

        if (newcategorykeyposition === newcategorykeys.length) {
            console.log(
                "%c Adding Category ",
                "background: purple; color: white; font-size: 15px; font-weight: bold;",
                "Hmm new category... interesting"
            );
            localStorage.setItem("newCategorys", true);
            const categorySelect = document.getElementById("categorySelect");
            const tiktokOption = categorySelect.querySelector(
                'option[value="tiktok"]'
            );
            const instagramOption = categorySelect.querySelector(
                'option[value="instagram"]'
            );
            if (!tiktokOption) {
                const newOption = document.createElement("option");
                newOption.value = "tiktok";
                newOption.textContent = "💃 tiktok 💃";
                categorySelect.appendChild(newOption);
                console.log(
                    "%c Adding Category ",
                    "background: purple; color: white; font-size: 15px; font-weight: bold;",
                    "tiktok category added!"
                );
            }

            if (!instagramOption) {
                const newOption = document.createElement("option");
                newOption.value = "instagram";
                newOption.textContent = "🔴 instagram 🟡";
                categorySelect.appendChild(newOption);
                console.log(
                    "%c Adding Category ",
                    "background: purple; color: white; font-size: 15px; font-weight: bold;",
                    "instagram category added!"
                );
            }
            newcategorykeyposition = 0;
        }
    } else {
        newcategorykeyposition = 0;
    }
}

const newCategorys = localStorage.getItem("newCategorys");
if (newCategorys !== null && newCategorys === "true") {
    const categorySelect = document.getElementById("categorySelect");
    const tiktokOption = categorySelect.querySelector('option[value="tiktok"]');
    const instagramOption = categorySelect.querySelector(
        'option[value="instagram"]'
    );
    if (!tiktokOption) {
        const newOption = document.createElement("option");
        newOption.value = "tiktok";
        newOption.textContent = "💃 tiktok 💃";
        categorySelect.appendChild(newOption);
        console.log(
            "%c Adding Category ",
            "background: purple; color: white; font-size: 15px; font-weight: bold;",
            "tiktok category added!"
        );
    }
    if (!instagramOption) {
        const newOption = document.createElement("option");
        newOption.value = "instagram";
        newOption.textContent = "🔴 instagram 🟡";
        categorySelect.appendChild(newOption);
        console.log(
            "%c Adding Category ",
            "background: purple; color: white; font-size: 15px; font-weight: bold;",
            "instagram category added!"
        );
    }
}

document.addEventListener("keydown", hmmnewcategory);

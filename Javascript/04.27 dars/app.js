const followButton = document.querySelector(".follow-btn");
const likeButton = document.querySelector(".like-btn");
const likesCount = document.querySelector(".likes-count");

const baseLikes = 1240;

let isFollowing = false;
let isLiked = false;

function formatLikes(value) {
    return value.toLocaleString("en-US");
}

function renderFollowState() {
    followButton.textContent = isFollowing ? "Followed" : "Follow";
    followButton.classList.toggle("is-following", isFollowing);
    followButton.setAttribute("aria-pressed", String(isFollowing));
}

function renderLikeState() {
    likeButton.classList.toggle("is-liked", isLiked);
    likeButton.setAttribute("aria-pressed", String(isLiked));
    likesCount.textContent = formatLikes(isLiked ? baseLikes + 1 : baseLikes);
}

function setFollowState(nextValue) {
    isFollowing = nextValue;
    renderFollowState();
}

function setLikeState(nextValue) {
    isLiked = nextValue;
    renderLikeState();
}

followButton.addEventListener("click", () => {
    setFollowState(!isFollowing);
});

likeButton.addEventListener("click", () => {
    setLikeState(!isLiked);
});

renderFollowState();
renderLikeState();

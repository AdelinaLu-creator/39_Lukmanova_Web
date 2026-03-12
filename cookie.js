function saveReviews() {
    document.cookie = "reviews=" + encodeURIComponent(JSON.stringify(reviews)) + "; path=/; max-age=31536000";
}

function loadReviews() {
    const match = document.cookie.match(/reviews=([^;]+)/);
    if (match) {
        try {
            reviews = JSON.parse(decodeURIComponent(match[1]));
        } catch {
            reviews = [];
        }
    }
}

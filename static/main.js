let mediaData = [];

async function loadMediaData() {
    try {
        const response = await fetch('./static/media.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const mediaItems = await response.json();
        mediaData = mediaItems;
    } catch (error) {
        console.error('Error loading media data:', error);
        // Fallback to empty array or default data
        mediaData = [];
    }
}



// Sample media data

// Predefined comments and usernames
const commentTexts = [
    "Absolutely stunning work!",
    "This speaks to my soul",
    "Love the color composition",
    "Incredible attention to detail",
    "This is pure artistry",
    "Beautiful perspective!",
    "Amazing use of light and shadow",
    "This made my day better",
    "Such creative vision",
    "Masterpiece!",
    "The emotion in this is powerful",
    "Breathtaking work",
    "This is so inspiring",
    "Perfect timing and composition",
    "Art at its finest",
    "This deserves to be in a museum",
    "Wow, just wow!",
    "The technique is flawless",
    "This gives me chills",
    "Pure magic captured"
];

const usernames = [
    "ArtLover92", "PixelMaster", "CreativeSoul", "VisualPoet", "ArtisticEye",
    "ColorEnthusiast", "DesignGuru", "ArtCritic", "VisualStoryteller", "CreativeGenius",
    "ArtAddict", "PixelPerfect", "VisualArtist", "CreativeMind", "ArtAppreciator",
    "DesignLover", "ArtisticSpirit", "VisualDreamer", "CreativeHeart", "ArtInspired"
];




function createMediaCard(item, index) {
    const card = document.createElement('div');
    card.className = 'media-card';
    card.innerHTML = `
        <div class="media-container">
            ${item.type === 'video' 
                ? `<video controls muted playsinline>
                        <source src="${item.src}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>`
                : `<img src="${item.src}" alt="${item.title}">`
            }
        </div>
        <div class="media-info">
            <div class="media-title">${item.title}</div>
            <div class="media-artist">by ${item.artist}</div>
            <div class="interaction-bar">
                <button class="like-btn" onclick="toggleLike(${index})">
                    <span>❤️</span>
                    <span class="like-count">${item.likes}</span>
                </button>
                <div class="comment-count">${item.comments.length} comments</div>
            </div>
            <div class="comments-section" id="comments-${index}">
                ${item.comments.map(comment => createCommentHTML(comment)).join('')}
            </div>
        </div>
    `;
    return card;
}

function createCommentHTML(comment) {
    return `
        <div class="comment">
            <div class="comment-author">${comment.author}</div>
            <div class="comment-text">${comment.text}</div>
            <div class="comment-time">${comment.time}</div>
        </div>
    `;
}

function toggleLike(index) {
    const item = mediaData[index];
    item.likes += Math.floor(Math.random() * 3) + 1; // Add 1-3 likes
    
    const likeBtn = document.querySelector(`#galleryGrid .media-card:nth-child(${index + 1}) .like-btn`);
    const likeCount = likeBtn.querySelector('.like-count');
    
    likeCount.textContent = item.likes;
    likeBtn.classList.add('like-animation', 'liked');
    
    setTimeout(() => {
        likeBtn.classList.remove('like-animation');
    }, 300);
}

function addRandomComment(index) {
    const item = mediaData[index];
    const randomComment = commentTexts[Math.floor(Math.random() * commentTexts.length)];
    const randomUser = usernames[Math.floor(Math.random() * usernames.length)];
    const now = new Date();
    
    const comment = {
        author: randomUser,
        text: randomComment,
        time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
    };
    
    item.comments.unshift(comment);
    
    // Update the comment section
    const commentsSection = document.getElementById(`comments-${index}`);
    const commentCount = document.querySelector(`#galleryGrid .media-card:nth-child(${index + 1}) .comment-count`);
    
    commentsSection.insertAdjacentHTML('afterbegin', createCommentHTML(comment));
    commentCount.textContent = `${item.comments.length} comments`;
}

function addRandomLike(index) {
    const item = mediaData[index];
    item.likes += Math.floor(Math.random() * 2) + 1; // Add 1-2 likes
    
    const likeCount = document.querySelector(`#galleryGrid .media-card:nth-child(${index + 1}) .like-count`);
    likeCount.textContent = item.likes;
}

function startAutoInteractions() {
    setInterval(() => {
        const randomIndex = Math.floor(Math.random() * mediaData.length);
        const action = Math.random() > 0.4 ? 'comment' : 'like'; // 60% chance for comment, 40% for like
        
        if (action === 'comment') {
            addRandomComment(randomIndex);
        } else {
            addRandomLike(randomIndex);
        }
    }, 3000); // Every 3 seconds
}

// Initialize gallery
function initGallery() {
    
    const galleryGrid = document.getElementById('galleryGrid');

    mediaData.forEach((item, index) => {
        const card = createMediaCard(item, index);
        galleryGrid.appendChild(card);
    });
    
    // Start automatic interactions after a short delay
    setTimeout(startAutoInteractions, 2000);
}

function loadVideos() {
    const videos = document.getElementsByTagName("source");
    console.log(videos);
    videos.forEach((video) => video.load());
};

// Load gallery when page is ready
document.addEventListener('DOMContentLoaded', function() {
    loadMediaData().then(() => {
        initGallery();
    });
});
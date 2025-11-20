// App State
let currentUser = null;
let posts = JSON.parse(localStorage.getItem('posts')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let userMenuOpen = false;

// Default profile picture (simple SVG as base64)
const defaultProfilePic = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNDQ3NmZmIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9Ijg1IiByPSI0MCIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEwMCAxNDBDMTE2LjU2OSAxNDAgMTMwIDE1My40MzEgMTMwIDE3MEg3MEM3MCAxNTMuNDMxIDgzLjQzMSAxNDAgMTAwIDE0MFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=';

// DOM Elements
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const profileModal = document.getElementById('profileModal');
const app = document.getElementById('app');
const postsContainer = document.getElementById('posts');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    setupEventListeners();
    renderPosts();
    updateSidebarStats();
});

// Event Listeners
function setupEventListeners() {
    // Login/Register forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('showRegister').addEventListener('click', showRegister);
    document.getElementById('showLogin').addEventListener('click', showLogin);
    
    // Image upload
    imageInput.addEventListener('change', handleImageUpload);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-menu')) {
            closeUserMenu();
        }
    });
}

// Login System
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        hideModals();
        showApp();
        updateUserProfilePics();
    } else {
        alert('Invalid username or password');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    if (users.find(u => u.username === username)) {
        alert('Username already exists');
        return;
    }
    
    const newUser = { 
        username, 
        email, 
        password, 
        profilePic: defaultProfilePic,
        bio: 'Hello! I am new to V-Nexus.',
        joinDate: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Registration successful! Please login.');
    showLogin();
}

function showLogin() {
    registerModal.style.display = 'none';
    loginModal.style.display = 'flex';
    document.getElementById('loginForm').reset();
}

function showRegister() {
    loginModal.style.display = 'none';
    registerModal.style.display = 'flex';
    document.getElementById('registerForm').reset();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    app.style.display = 'none';
    loginModal.style.display = 'flex';
    document.getElementById('loginForm').reset();
    closeUserMenu();
}

function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        hideModals();
        showApp();
        updateUserProfilePics();
    }
}

function hideModals() {
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
    profileModal.style.display = 'none';
}

function showApp() {
    app.style.display = 'block';
    document.getElementById('currentUser').textContent = currentUser.username;
    document.getElementById('sidebarUsername').textContent = currentUser.username;
}

// User Menu
function toggleUserMenu() {
    userMenuOpen = !userMenuOpen;
    const dropdown = document.getElementById('userDropdown');
    if (userMenuOpen) {
        dropdown.classList.add('show');
    } else {
        dropdown.classList.remove('show');
    }
}

function closeUserMenu() {
    userMenuOpen = false;
    document.getElementById('userDropdown').classList.remove('show');
}

// Profile Pictures
function updateUserProfilePics() {
    const headerPic = document.getElementById('headerProfilePic');
    const sidebarPic = document.getElementById('sidebarProfilePic');
    
    if (currentUser.profilePic) {
        headerPic.src = currentUser.profilePic;
        sidebarPic.src = currentUser.profilePic;
    } else {
        headerPic.src = defaultProfilePic;
        sidebarPic.src = defaultProfilePic;
    }
}

function getUserProfilePic(username) {
    const user = users.find(u => u.username === username);
    return user?.profilePic || defaultProfilePic;
}

// Image Upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

// Posts System
function addPost() {
    const input = document.getElementById('postInput');
    const postText = input.value.trim();
    
    if (!postText && !imagePreview.innerHTML) {
        alert('Post cannot be empty!');
        return;
    }
    
    const imageSrc = imagePreview.querySelector('img')?.src || null;
    
    const newPost = {
        id: Date.now(),
        userId: currentUser.username,
        text: postText,
        image: imageSrc,
        timestamp: new Date().toISOString(),
        likes: [],
        comments: []
    };
    
    posts.unshift(newPost);
    savePosts();
    renderPosts();
    updateSidebarStats();
    
    // Reset form
    input.value = '';
    imagePreview.innerHTML = '';
    imageInput.value = '';
}

function renderPosts() {
    postsContainer.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    });
}

function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.innerHTML = `
        <div class="post-header" onclick="viewUserProfile('${post.userId}')">
            <img src="${getUserProfilePic(post.userId)}" alt="${post.userId}" class="post-avatar">
            <div class="post-user-info">
                <div class="post-user">${post.userId}</div>
                <div class="post-time">${formatTime(post.timestamp)}</div>
            </div>
        </div>
        <div class="post-content">
            ${post.text ? `<p>${post.text}</p>` : ''}
            ${post.image ? `<img src="${post.image}" class="post-image" alt="Post image">` : ''}
        </div>
        <div class="post-actions">
            <button class="action-btn ${post.likes.includes(currentUser.username) ? 'liked' : ''}" 
                    onclick="toggleLike(${post.id})">
                <i class="fas fa-heart"></i>
                <span>${post.likes.length}</span>
            </button>
            <button class="action-btn" onclick="focusComment(${post.id})">
                <i class="fas fa-comment"></i>
                <span>${post.comments.length}</span>
            </button>
        </div>
        <div class="comments-section">
            ${renderComments(post.comments)}
            <div class="comment-input">
                <input type="text" id="comment-${post.id}" placeholder="Write a comment...">
                <button onclick="addComment(${post.id})">Post</button>
            </div>
        </div>
    `;
    
    return postDiv;
}

function renderComments(comments) {
    if (comments.length === 0) return '';
    
    return comments.map(comment => `
        <div class="comment">
            <div class="comment-header">
                <span class="comment-user" onclick="viewUserProfile('${comment.userId}')">${comment.userId}</span>
                <span class="comment-time">${formatTime(comment.timestamp)}</span>
            </div>
            <p>${comment.text}</p>
        </div>
    `).join('');
}

// Like System
function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const userIndex = post.likes.indexOf(currentUser.username);
    
    if (userIndex > -1) {
        post.likes.splice(userIndex, 1);
    } else {
        post.likes.push(currentUser.username);
    }
    
    savePosts();
    renderPosts();
    updateSidebarStats();
}

// Comment System
function addComment(postId) {
    const commentInput = document.getElementById(`comment-${postId}`);
    const commentText = commentInput.value.trim();
    
    if (!commentText) return;
    
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const newComment = {
        id: Date.now(),
        userId: currentUser.username,
        text: commentText,
        timestamp: new Date().toISOString()
    };
    
    post.comments.push(newComment);
    savePosts();
    renderPosts();
    updateSidebarStats();
    
    commentInput.value = '';
}

function focusComment(postId) {
    const commentInput = document.getElementById(`comment-${postId}`);
    commentInput.focus();
}

// Profile System
function viewMyProfile() {
    viewUserProfile(currentUser.username);
    closeUserMenu();
}

function viewUserProfile(username) {
    const user = users.find(u => u.username === username);
    if (!user) return;
    
    const userPosts = posts.filter(p => p.userId === username);
    const totalLikes = userPosts.reduce((sum, post) => sum + post.likes.length, 0);
    const totalComments = userPosts.reduce((sum, post) => sum + post.comments.length, 0);
    
    const isOwnProfile = username === currentUser.username;
    
    document.getElementById('profileContent').innerHTML = `
        <div class="profile-header">
            <img src="${user.profilePic || defaultProfilePic}" alt="${username}" class="profile-picture-large">
            <h2 class="profile-username">${username}</h2>
            <p class="profile-email">${user.email}</p>
            <p class="profile-bio">${user.bio || 'No bio yet.'}</p>
            <div class="profile-stats">
                <div class="profile-stat">
                    <span class="profile-stat-number">${userPosts.length}</span>
                    <span class="profile-stat-label">Posts</span>
                </div>
                <div class="profile-stat">
                    <span class="profile-stat-number">${totalLikes}</span>
                    <span class="profile-stat-label">Likes</span>
                </div>
                <div class="profile-stat">
                    <span class="profile-stat-number">${totalComments}</span>
                    <span class="profile-stat-label">Comments</span>
                </div>
            </div>
            ${isOwnProfile ? `
                <div class="profile-actions">
                    <button class="edit-profile-btn" onclick="openEditProfile()">Edit Profile</button>
                </div>
            ` : ''}
        </div>
        <div class="profile-posts">
            <h3>${isOwnProfile ? 'Your Posts' : `${username}'s Posts`}</h3>
            ${userPosts.length === 0 ? 
                `<p style="text-align: center; padding: 40px; color: #666;">No posts yet.</p>` : 
                userPosts.map(post => `
                    <div class="post">
                        <div class="post-content">
                            ${post.text ? `<p>${post.text}</p>` : ''}
                            ${post.image ? `<img src="${post.image}" class="post-image" alt="Post image">` : ''}
                        </div>
                        <div class="post-actions">
                            <span><i class="fas fa-heart"></i> ${post.likes.length}</span>
                            <span><i class="fas fa-comment"></i> ${post.comments.length}</span>
                            <span class="post-time">${formatTime(post.timestamp)}</span>
                        </div>
                    </div>
                `).join('')}
        </div>
    `;
    
    profileModal.style.display = 'flex';
}

function openEditProfile() {
    document.getElementById('profileContent').innerHTML = `
        <h2>Edit Profile</h2>
        <div class="edit-profile-form">
            <div class="form-group">
                <label>Profile Picture</label>
                <div class="profile-picture-upload">
                    <img id="editProfilePicPreview" src="${currentUser.profilePic || defaultProfilePic}" 
                         alt="Profile Preview" class="profile-picture-preview">
                    <div>
                        <input type="file" id="editProfilePicInput" accept="image/*" 
                               onchange="previewProfilePicture(this)" style="margin-bottom: 10px;">
                        <br>
                        <button type="button" onclick="document.getElementById('editProfilePicInput').click()">
                            Change Picture
                        </button>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="editBio">Bio</label>
                <textarea id="editBio" placeholder="Tell us about yourself..." 
                          style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; resize: vertical;">${currentUser.bio || ''}</textarea>
            </div>
            <div class="form-group">
                <label for="editEmail">Email</label>
                <input type="email" id="editEmail" value="${currentUser.email}" 
                       style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div style="display: flex; gap: 10px;">
                <button type="button" onclick="saveProfile()" style="flex: 1;">Save Changes</button>
                <button type="button" onclick="closeProfileModal()" 
                        style="flex: 1; background-color: #6c757d;">Cancel</button>
            </div>
        </div>
    `;
    
    profileModal.style.display = 'flex';
}

function previewProfilePicture(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('editProfilePicPreview').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function saveProfile() {
    const newBio = document.getElementById('editBio').value;
    const newEmail = document.getElementById('editEmail').value;
    const profilePicInput = document.getElementById('editProfilePicInput');
    
    // Update current user
    currentUser.bio = newBio;
    currentUser.email = newEmail;
    
    // Handle profile picture update
    if (profilePicInput.files && profilePicInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentUser.profilePic = e.target.result;
            updateUserInStorage();
            updateUserProfilePics();
            closeProfileModal();
            viewMyProfile(); // Refresh profile view
        };
        reader.readAsDataURL(profilePicInput.files[0]);
    } else {
        updateUserInStorage();
        closeProfileModal();
        viewMyProfile(); // Refresh profile view
    }
}

function updateUserInStorage() {
    // Update in users array
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Update current user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function closeProfileModal() {
    profileModal.style.display = 'none';
}

// Sidebar Stats
function updateSidebarStats() {
    const userPosts = posts.filter(p => p.userId === currentUser.username);
    const totalLikes = userPosts.reduce((sum, post) => sum + post.likes.length, 0);
    const totalComments = userPosts.reduce((sum, post) => sum + post.comments.length, 0);
    
    document.getElementById('postCount').textContent = userPosts.length;
    document.getElementById('likeCount').textContent = totalLikes;
    document.getElementById('commentCount').textContent = totalComments;
}

// Utility Functions
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
}

function savePosts() {
    localStorage.setItem('posts', JSON.stringify(posts));
}

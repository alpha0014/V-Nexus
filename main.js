// DOM Elements
const loginModal = document.getElementById('loginModal');
const appContainer = document.getElementById('appContainer');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutBtn');
const navLinks = document.querySelectorAll('.nav-links a');
const pages = document.querySelectorAll('.page');
const likeButtons = document.querySelectorAll('.like-button');
const createPostBtn = document.getElementById('createPostBtn');
const friendsTabs = document.querySelectorAll('.friends-tab');
const friendsGrid = document.getElementById('friendsGrid');
const notificationsList = document.getElementById('notificationsList');
const searchInput = document.getElementById('searchInput');
const loginError = document.getElementById('loginError');

// Sample Data
const friendsData = {
    all: [
        { id: 1, name: 'Alex Johnson', initials: 'AJ', mutualFriends: 12 },
        { id: 2, name: 'Sarah Miller', initials: 'SM', mutualFriends: 8 },
        { id: 3, name: 'Michael Kim', initials: 'MK', mutualFriends: 15 },
        { id: 4, name: 'Emma Roberts', initials: 'ER', mutualFriends: 5 },
        { id: 5, name: 'David Chen', initials: 'DC', mutualFriends: 7 },
        { id: 6, name: 'Lisa Wang', initials: 'LW', mutualFriends: 3 }
    ],
    requests: [
        { id: 7, name: 'James Wilson', initials: 'JW', mutualFriends: 4 },
        { id: 8, name: 'Olivia Brown', initials: 'OB', mutualFriends: 6 },
        { id: 9, name: 'Noah Taylor', initials: 'NT', mutualFriends: 2 }
    ],
    suggestions: [
        { id: 10, name: 'Sophia Garcia', initials: 'SG', mutualFriends: 9 },
        { id: 11, name: 'William Martinez', initials: 'WM', mutualFriends: 11 },
        { id: 12, name: 'Isabella Lee', initials: 'IL', mutualFriends: 5 }
    ]
};

const notificationsData = [
    {
        id: 1,
        type: 'friend_request',
        icon: 'user-plus',
        text: '<strong>Alex Johnson</strong> sent you a friend request.',
        time: '10 minutes ago',
        unread: true
    },
    {
        id: 2,
        type: 'like',
        icon: 'heart',
        text: '<strong>Sarah Miller</strong> and 12 others liked your post.',
        time: '2 hours ago',
        unread: false
    },
    {
        id: 3,
        type: 'comment',
        icon: 'comment',
        text: '<strong>Michael Kim</strong> commented on your post: "Great shot!"',
        time: '5 hours ago',
        unread: false
    },
    {
        id: 4,
        type: 'birthday',
        icon: 'birthday-cake',
        text: 'It\'s <strong>Emma Roberts</strong>\'s birthday today. Wish them a happy birthday!',
        time: '1 day ago',
        unread: false
    }
];

// Initialize the application
function initApp() {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('vnexusLoggedIn');
    const savedUsername = localStorage.getItem('vnexusUsername');
    
    if (isLoggedIn === 'true' && savedUsername) {
        // User is logged in, show the app
        showApp();
        updateProfileInfo(savedUsername);
    } else {
        // User is not logged in, show login modal
        showLogin();
    }
    
    // Load initial data
    loadFriends('all');
    loadNotifications();
    setupEventListeners();
}

// Setup all event listeners
function setupEventListeners() {
    // Login functionality
    loginButton.addEventListener('click', handleLogin);
    
    // Allow login with Enter key
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
    
    // Logout functionality
    logoutButton.addEventListener('click', handleLogout);
    
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(link.getAttribute('data-page'));
        });
    });
    
    // Like functionality
    likeButtons.forEach(button => {
        button.addEventListener('click', toggleLike);
    });
    
    // Create Post Button
    createPostBtn.addEventListener('click', createPost);
    
    // Friends tabs
    friendsTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchFriendsTab(tab.getAttribute('data-tab'));
        });
    });
    
    // Search functionality
    searchInput.addEventListener('keyup', handleSearch);
    
    // Settings changes
    document.getElementById('privateAccount').addEventListener('change', saveSettings);
    document.getElementById('emailNotifications').addEventListener('change', saveSettings);
    document.getElementById('pushNotifications').addEventListener('change', saveSettings);
    document.getElementById('postVisibility').addEventListener('change', saveSettings);
    document.getElementById('friendRequests').addEventListener('change', saveSettings);
    document.getElementById('language').addEventListener('change', saveSettings);
    document.getElementById('theme').addEventListener('change', saveSettings);
    document.getElementById('manageBlocked').addEventListener('click', manageBlockedUsers);
    document.getElementById('addFriendBtn').addEventListener('click', addFriend);
}

// Login handler
function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Validate inputs
    if (!username || !password) {
        showLoginError('Please enter both username and password');
        return;
    }
    
    if (password.length < 3) {
        showLoginError('Password must be at least 3 characters long');
        return;
    }
    
    // Simulate login process
    loginError.textContent = '';
    loginButton.textContent = 'Logging in...';
    loginButton.disabled = true;
    
    setTimeout(() => {
        // Successful login
        localStorage.setItem('vnexusLoggedIn', 'true');
        localStorage.setItem('vnexusUsername', username);
        showApp();
        updateProfileInfo(username);
        
        // Reset login form
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        loginButton.textContent = 'Log In';
        loginButton.disabled = false;
    }, 1000);
}

// Show login error
function showLoginError(message) {
    loginError.textContent = message;
    loginModal.classList.add('shake');
    setTimeout(() => {
        loginModal.classList.remove('shake');
    }, 500);
}

// Logout handler
function handleLogout() {
    localStorage.removeItem('vnexusLoggedIn');
    localStorage.removeItem('vnexusUsername');
    showLogin();
}

// Show login modal
function showLogin() {
    loginModal.classList.remove('hidden');
    appContainer.style.display = 'none';
}

// Show main app
function showApp() {
    loginModal.classList.add('hidden');
    appContainer.style.display = 'flex';
}

// Update profile information
function updateProfileInfo(username) {
    const profileName = document.querySelector('.profile-info .name');
    const profileUsername = document.querySelector('.profile-info .username');
    const profilePic = document.querySelector('.profile-summary .profile-pic');
    
    // Generate initials from username
    const initials = username.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    
    if (profileName) profileName.textContent = username;
    if (profileUsername) profileUsername.textContent = `@${username.toLowerCase().replace(/\s+/g, '')}`;
    if (profilePic) profilePic.textContent = initials;
}

// Switch between pages
function switchPage(pageId) {
    // Remove active class from all links
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to clicked link
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
    
    // Hide all pages
    pages.forEach(page => page.classList.remove('active'));
    
    // Show the selected page
    document.getElementById(pageId).classList.add('active');
}

// Toggle like on posts
function toggleLike(e) {
    const button = e.currentTarget;
    const icon = button.querySelector('i');
    const likesElement = button.closest('.post').querySelector('.likes');
    
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.classList.add('liked');
        
        // Update likes count
        const currentLikes = parseInt(likesElement.textContent) || 0;
        likesElement.textContent = `${currentLikes + 1} likes`;
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.classList.remove('liked');
        
        // Update likes count
        const currentLikes = parseInt(likesElement.textContent) || 1;
        likesElement.textContent = `${currentLikes - 1} likes`;
    }
}

// Create a new post
function createPost() {
    const postContent = document.getElementById('postContent').value.trim();
    
    if (!postContent) {
        alert('Please write something to post!');
        return;
    }
    
    // In a real app, this would send the post to a server
    alert(`Post created: "${postContent}"`);
    document.getElementById('postContent').value = '';
}

// Switch friends tabs
function switchFriendsTab(tabId) {
    // Remove active class from all tabs
    friendsTabs.forEach(tab => tab.classList.remove('active'));
    
    // Add active class to clicked tab
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // Load the appropriate friends list
    loadFriends(tabId);
}

// Load friends based on tab
function loadFriends(tabId) {
    const friends = friendsData[tabId];
    
    if (!friends) return;
    
    // Clear the grid
    friendsGrid.innerHTML = '';
    
    // Add friends to the grid
    friends.forEach(friend => {
        const friendCard = document.createElement('div');
        friendCard.className = 'friend-card';
        friendCard.innerHTML = `
            <div class="profile-pic">${friend.initials}</div>
            <div class="name">${friend.name}</div>
            <div class="mutual-friends">${friend.mutualFriends} mutual friends</div>
            <div class="friend-actions">
                <button class="message-btn">Message</button>
                ${tabId === 'all' ? '<button class="remove">Remove</button>' : 
                  tabId === 'requests' ? '<button class="accept">Accept</button><button class="decline">Decline</button>' : 
                  '<button class="add">Add Friend</button>'}
            </div>
        `;
        friendsGrid.appendChild(friendCard);
    });
    
    // Add event listeners to friend action buttons
    document.querySelectorAll('.message-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const friendName = e.target.closest('.friend-card').querySelector('.name').textContent;
            alert(`Opening chat with ${friendName}`);
        });
    });
    
    document.querySelectorAll('.remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const friendCard = e.target.closest('.friend-card');
            const friendName = friendCard.querySelector('.name').textContent;
            if (confirm(`Are you sure you want to remove ${friendName} as a friend?`)) {
                friendCard.style.opacity = '0';
                setTimeout(() => {
                    friendCard.remove();
                }, 300);
            }
        });
    });
    
    document.querySelectorAll('.accept, .add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const friendCard = e.target.closest('.friend-card');
            const friendName = friendCard.querySelector('.name').textContent;
            alert(`Friend request sent to ${friendName}`);
            friendCard.style.opacity = '0';
            setTimeout(() => {
                friendCard.remove();
            }, 300);
        });
    });
    
    document.querySelectorAll('.decline').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const friendCard = e.target.closest('.friend-card');
            friendCard.style.opacity = '0';
            setTimeout(() => {
                friendCard.remove();
            }, 300);
        });
    });
}

// Load notifications
function loadNotifications() {
    // Clear the list
    notificationsList.innerHTML = '';
    
    // Add notifications to the list
    notificationsData.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification ${notification.unread ? 'unread' : ''}`;
        notificationElement.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${notification.icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-text">${notification.text}</div>
                <div class="notification-time">${notification.time}</div>
            </div>
            <div class="notification-actions">
                ${notification.type === 'friend_request' ? 
                  '<button class="accept-notification"><i class="fas fa-check"></i></button>' : ''}
                <button class="dismiss-notification"><i class="fas fa-times"></i></button>
            </div>
        `;
        notificationsList.appendChild(notificationElement);
    });
    
    // Add event listeners to notification buttons
    document.querySelectorAll('.accept-notification').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const notification = e.target.closest('.notification');
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    });
    
    document.querySelectorAll('.dismiss-notification').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const notification = e.target.closest('.notification');
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    });
}

// Handle search
function handleSearch(e) {
    if (e.key === 'Enter') {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            alert(`Searching for: "${searchTerm}"`);
            // In a real app, this would make an API call to search for content/users
        }
    }
}

// Save settings
function saveSettings() {
    const settings = {
        privateAccount: document.getElementById('privateAccount').checked,
        emailNotifications: document.getElementById('emailNotifications').checked,
        pushNotifications: document.getElementById('pushNotifications').checked,
        postVisibility: document.getElementById('postVisibility').value,
        friendRequests: document.getElementById('friendRequests').value,
        language: document.getElementById('language').value,
        theme: document.getElementById('theme').value
    };
    
    localStorage.setItem('vnexusSettings', JSON.stringify(settings));
    console.log('Settings saved:', settings);
}

// Load settings
function loadSettings() {
    const savedSettings = localStorage.getItem('vnexusSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        document.getElementById('privateAccount').checked = settings.privateAccount || false;
        document.getElementById('emailNotifications').checked = settings.emailNotifications !== false;
        document.getElementById('pushNotifications').checked = settings.pushNotifications !== false;
        document.getElementById('postVisibility').value = settings.postVisibility || 'Friends';
        document.getElementById('friendRequests').value = settings.friendRequests || 'Everyone';
        document.getElementById('language').value = settings.language || 'English';
        document.getElementById('theme').value = settings.theme || 'Dark';
    }
}

// Manage blocked users
function manageBlockedUsers() {
    alert('Blocked users management would open here');
}

// Add friend
function addFriend() {
    alert('Add friend functionality would open here');
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    loadSettings();
});

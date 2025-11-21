// V-nexus Social Media App - Enhanced Version
document.addEventListener('DOMContentLoaded', function() {
    console.log('V-nexus App Initializing...');
    
    // Initialize the app
    initApp();
});

function initApp() {
    // Set default user
    setDefaultUser();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load sample data
    loadSampleData();
    
    // Load content
    loadContent();
    
    // Initialize theme
    initTheme();
    
    console.log('V-nexus App Ready!');
}

function setDefaultUser() {
    const defaultUser = {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        avatar: 'JD',
        bio: 'Digital creator | Photography enthusiast | Travel lover',
        stats: {
            posts: 128,
            followers: 1200,
            following: 856
        },
        achievements: ['writer', 'popular', 'streak']
    };
    
    localStorage.setItem('vnexus_currentUser', JSON.stringify(defaultUser));
    updateUserInfo();
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            switchPage(this.getAttribute('data-page'));
        });
    });
    
    // Friends tabs
    document.querySelectorAll('.friends-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchFriendsTab(this.getAttribute('data-tab'));
        });
    });
    
    // Profile tabs
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchProfileTab(this.getAttribute('data-tab'));
        });
    });
    
    // Create post
    document.getElementById('createPostBtn').addEventListener('click', createPost);
    
    // Post actions
    document.querySelectorAll('.post-action').forEach(action => {
        action.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            handlePostAction(type);
        });
    });
    
    // Voice recording
    document.getElementById('startRecording').addEventListener('click', startRecording);
    document.getElementById('stopRecording').addEventListener('click', stopRecording);
    
    // Search
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Messages
    document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
    document.getElementById('messageText').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
    
    // Theme toggle
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);
    document.getElementById('floatingThemeToggle').addEventListener('click', toggleTheme);
    document.getElementById('themeSelect').addEventListener('change', function() {
        changeTheme(this.value);
    });
    
    // Settings
    document.querySelectorAll('.toggle input, .select-setting').forEach(element => {
        element.addEventListener('change', saveSettings);
    });
    
    // Conversation items
    document.addEventListener('click', function(e) {
        if (e.target.closest('.conversation-item')) {
            const conversationItem = e.target.closest('.conversation-item');
            selectConversation(conversationItem);
        }
        
        if (e.target.closest('.story')) {
            const story = e.target.closest('.story');
            viewStory(story);
        }
    });
}

function updateUserInfo() {
    const userData = JSON.parse(localStorage.getItem('vnexus_currentUser'));
    
    if (userData) {
        document.getElementById('userName').textContent = userData.name;
        document.getElementById('userHandle').textContent = `@${userData.username}`;
        document.getElementById('userAvatar').textContent = userData.avatar;
        document.getElementById('currentUserAvatar').textContent = userData.avatar;
        document.getElementById('profileName').textContent = userData.name;
        document.getElementById('profileBio').textContent = userData.bio;
        document.getElementById('profileMainAvatar').textContent = userData.avatar;
        
        // Update stats
        document.querySelector('.stat:nth-child(1) strong').textContent = userData.stats.posts;
        document.querySelector('.stat:nth-child(2) strong').textContent = userData.stats.followers;
        document.querySelector('.stat:nth-child(3) strong').textContent = userData.stats.following;
    }
}

function switchPage(pageId) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
    
    // Update pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    // Load page-specific content
    loadPageContent(pageId);
}

function switchFriendsTab(tabId) {
    document.querySelectorAll('.friends-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    loadFriends(tabId);
}

function switchProfileTab(tabId) {
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    loadProfileContent(tabId);
}

function handlePostAction(type) {
    switch(type) {
        case 'image':
            alert('Image upload functionality would open here');
            break;
        case 'voice':
            toggleVoiceRecorder();
            break;
        case 'schedule':
            schedulePost();
            break;
    }
}

function toggleVoiceRecorder() {
    const recorder = document.getElementById('voiceRecorder');
    if (recorder.style.display === 'none') {
        recorder.style.display = 'block';
    } else {
        recorder.style.display = 'none';
        stopRecording();
    }
}

let recording = false;
let recordingTimer;
let recordingSeconds = 0;

function startRecording() {
    recording = true;
    recordingSeconds = 0;
    
    document.getElementById('startRecording').disabled = true;
    document.getElementById('stopRecording').disabled = false;
    document.getElementById('audioPlayback').style.display = 'none';
    
    // Start timer
    recordingTimer = setInterval(() => {
        recordingSeconds++;
        const minutes = Math.floor(recordingSeconds / 60).toString().padStart(2, '0');
        const seconds = (recordingSeconds % 60).toString().padStart(2, '0');
        document.querySelector('.recording-timer').textContent = `${minutes}:${seconds}`;
    }, 1000);
    
    alert('Recording started... (This is a simulation)');
}

function stopRecording() {
    if (!recording) return;
    
    recording = false;
    clearInterval(recordingTimer);
    
    document.getElementById('startRecording').disabled = false;
    document.getElementById('stopRecording').disabled = true;
    document.getElementById('audioPlayback').style.display = 'block';
    
    alert('Recording stopped! Voice message ready to send.');
}

function schedulePost() {
    const datetime = prompt('Enter date and time for scheduling (YYYY-MM-DD HH:MM):');
    if (datetime) {
        alert(`Post scheduled for ${datetime}`);
    }
}

function createPost() {
    const content = document.getElementById('postContent').value.trim();
    
    if (!content) {
        alert('Please write something to post!');
        return;
    }
    
    const userData = JSON.parse(localStorage.getItem('vnexus_currentUser'));
    
    const newPost = {
        id: Date.now(),
        user: userData,
        content: content,
        likes: 0,
        comments: 0,
        time: 'Just now'
    };
    
    // Add to posts array
    if (!window.sampleData) loadSampleData();
    window.sampleData.posts.unshift(newPost);
    
    // Update user stats
    userData.stats.posts++;
    localStorage.setItem('vnexus_currentUser', JSON.stringify(userData));
    updateUserInfo();
    
    // Reload posts
    loadPosts();
    
    // Clear input
    document.getElementById('postContent').value = '';
    
    alert('Post created successfully!');
}

function handleSearch() {
    const term = document.getElementById('searchInput').value.trim();
    
    if (term) {
        alert(`Searching for: "${term}"`);
        // In a real app, this would filter content
    }
}

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('vnexus_theme') || 'dark';
    changeTheme(savedTheme);
    
    // Update theme select
    document.getElementById('themeSelect').value = savedTheme;
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    changeTheme(newTheme);
}

function changeTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('vnexus_theme', theme);
    
    // Update theme toggle buttons
    const themeIcons = document.querySelectorAll('#themeToggleBtn i, #floatingThemeToggle i');
    themeIcons.forEach(icon => {
        icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    });
    
    // Update theme select
    document.getElementById('themeSelect').value = theme;
}

function saveSettings() {
    const settings = {
        theme: document.getElementById('themeSelect').value,
        highContrast: document.getElementById('highContrast').checked,
        privateAccount: document.getElementById('privateAccount').checked,
        emailNotifications: document.getElementById('emailNotifications').checked,
        pushNotifications: document.getElementById('pushNotifications').checked,
        postVisibility: document.getElementById('postVisibility').value,
        friendRequests: document.getElementById('friendRequests').value,
        language: document.getElementById('language').value,
        autoplayVideos: document.getElementById('autoplayVideos').checked
    };
    
    localStorage.setItem('vnexus_settings', JSON.stringify(settings));
    
    // Apply theme if changed
    if (settings.theme !== document.body.getAttribute('data-theme')) {
        changeTheme(settings.theme);
    }
    
    // Apply high contrast
    if (settings.highContrast) {
        document.body.setAttribute('data-theme', 'high-contrast');
    }
}

// Data Loading Functions
function loadSampleData() {
    window.sampleData = {
        posts: [
            {
                id: 1,
                user: { name: 'Alex Johnson', username: 'alexj', avatar: 'AJ' },
                content: 'Just finished hiking the beautiful trails at Blue Mountain. The view was absolutely breathtaking! 🏞️ #NatureLover #HikingAdventures',
                image: true,
                likes: 124,
                comments: 23,
                time: '2 hours ago'
            },
            {
                id: 2,
                user: { name: 'Sarah Miller', username: 'sarahm', avatar: 'SM' },
                content: 'Just launched my new website! Check it out and let me know what you think. Special thanks to everyone who supported me through this journey. 🙏',
                image: false,
                likes: 89,
                comments: 14,
                time: '5 hours ago'
            },
            {
                id: 3,
                user: { name: 'Michael Kim', username: 'michaelk', avatar: 'MK' },
                content: 'The future is here! Just got my hands on the latest VR headset and the experience is mind-blowing. 🤯 #Tech #Innovation',
                image: true,
                likes: 215,
                comments: 42,
                time: '1 day ago'
            }
        ],
        reels: [
            {
                id: 1,
                user: { name: 'Travel Moments', username: 'travel', avatar: 'TM' },
                caption: 'Beautiful sunset at the beach 🌅',
                likes: 2400,
                comments: 142
            },
            {
                id: 2,
                user: { name: 'Foodie Central', username: 'foodie', avatar: 'FC' },
                caption: 'How to make the perfect pasta 🍝',
                likes: 5700,
                comments: 324
            },
            {
                id: 3,
                user: { name: 'Fitness Guru', username: 'fitness', avatar: 'FG' },
                caption: '5 minute full body workout 💪',
                likes: 8900,
                comments: 512
            }
        ],
        friends: {
            all: [
                { id: 1, name: 'Alex Johnson', avatar: 'AJ', mutual: 12 },
                { id: 2, name: 'Sarah Miller', avatar: 'SM', mutual: 8 },
                { id: 3, name: 'Michael Kim', avatar: 'MK', mutual: 15 },
                { id: 4, name: 'Emma Roberts', avatar: 'ER', mutual: 5 }
            ],
            requests: [
                { id: 5, name: 'James Wilson', avatar: 'JW', mutual: 4 }
            ],
            suggestions: [
                { id: 6, name: 'Sophia Garcia', avatar: 'SG', mutual: 9 }
            ]
        },
        notifications: [
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
            }
        ],
        stories: [
            { id: 1, user: { name: 'Alex', avatar: 'AJ' }, hasNew: true },
            { id: 2, user: { name: 'Sarah', avatar: 'SM' }, hasNew: false },
            { id: 3, user: { name: 'Mike', avatar: 'MK' }, hasNew: true },
            { id: 4, user: { name: 'Emma', avatar: 'ER' }, hasNew: false },
            { id: 5, user: { name: 'David', avatar: 'DC' }, hasNew: true }
        ],
        conversations: [
            {
                id: 1,
                user: { name: 'Alex Johnson', avatar: 'AJ', status: 'Online' },
                messages: [
                    { id: 1, text: 'Hey! How are you doing?', time: '10:30 AM', sent: false },
                    { id: 2, text: 'I\'m good! Just working on some new projects. How about you?', time: '10:32 AM', sent: true }
                ]
            },
            {
                id: 2,
                user: { name: 'Sarah Miller', avatar: 'SM', status: '2h ago' },
                messages: [
                    { id: 1, text: 'Did you see the new update?', time: 'Yesterday', sent: false }
                ]
            }
        ],
        achievements: [
            {
                id: 1,
                icon: '📝',
                title: 'Writer',
                description: 'Created your first post'
            },
            {
                id: 2,
                icon: '❤️',
                title: 'Popular',
                description: 'Received 100+ likes on your posts'
            },
            {
                id: 3,
                icon: '🔥',
                title: 'Hot Streak',
                description: 'Posted for 7 consecutive days'
            }
        ]
    };
}

function loadContent() {
    loadStories();
    loadPosts();
    loadReels();
    loadFriends('all');
    loadNotifications();
    loadConversations();
    loadSettings();
}

function loadPageContent(pageId) {
    switch(pageId) {
        case 'home':
            loadStories();
            loadPosts();
            break;
        case 'reels':
            loadReels();
            break;
        case 'friends':
            loadFriends('all');
            break;
        case 'messages':
            loadConversations();
            break;
        case 'profile':
            loadProfileContent('posts');
            break;
        case 'notifications':
            loadNotifications();
            break;
    }
}

function loadStories() {
    const container = document.getElementById('storiesContainer');
    if (!container || !window.sampleData) return;
    
    // Add current user's story first
    const userData = JSON.parse(localStorage.getItem('vnexus_currentUser'));
    const currentUserStory = {
        id: 0,
        user: userData,
        hasNew: false
    };
    
    const allStories = [currentUserStory, ...window.sampleData.stories];
    
    container.innerHTML = allStories.map(story => `
        <div class="story" data-story-id="${story.id}">
            <div class="story-avatar ${story.hasNew ? 'has-new' : ''}">
                <div class="profile-pic">${story.user.avatar}</div>
            </div>
            <div class="story-username">${story.id === 0 ? 'Your Story' : story.user.name}</div>
        </div>
    `).join('');
}

function viewStory(storyElement) {
    const storyId = storyElement.getAttribute('data-story-id');
    if (storyId === '0') {
        alert('Create your story!');
    } else {
        alert(`Viewing ${storyElement.querySelector('.story-username').textContent}'s story`);
    }
}

function loadPosts() {
    const container = document.getElementById('postsContainer');
    if (!container || !window.sampleData) return;
    
    container.innerHTML = window.sampleData.posts.map(post => `
        <div class="post" data-post-id="${post.id}">
            <div class="post-header">
                <div class="profile-pic">${post.user.avatar}</div>
                <div class="post-user-info">
                    <div class="name">${post.user.name}</div>
                    <div class="time">${post.time}</div>
                </div>
                <div class="post-options">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            <div class="post-content">${post.content}</div>
            ${post.image ? `<div class="post-image"><i class="fas fa-mountain"></i> Post Image</div>` : ''}
            <div class="post-stats">
                <div class="likes">${post.likes} likes</div>
                <div class="comments">${post.comments} comments</div>
            </div>
            <div class="post-actions-bar">
                <div class="post-action-button like-button">
                    <i class="far fa-heart"></i>
                    <span>Like</span>
                </div>
                <div class="post-action-button">
                    <i class="far fa-comment"></i>
                    <span>Comment</span>
                </div>
                <div class="post-action-button">
                    <i class="far fa-share-square"></i>
                    <span>Share</span>
                </div>
                <div class="post-action-button save-button">
                    <i class="far fa-bookmark"></i>
                    <span>Save</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Attach post interaction events
    attachPostEvents();
}

function attachPostEvents() {
    // Like buttons
    document.querySelectorAll('.like-button').forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const likesElement = this.closest('.post').querySelector('.likes');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.classList.add('liked');
                incrementLikes(likesElement);
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.classList.remove('liked');
                decrementLikes(likesElement);
            }
        });
    });
    
    // Save buttons
    document.querySelectorAll('.save-button').forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.classList.add('saved');
                alert('Post saved!');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.classList.remove('saved');
                alert('Post unsaved!');
            }
        });
    });
}

function incrementLikes(likesElement) {
    const current = parseInt(likesElement.textContent) || 0;
    likesElement.textContent = `${current + 1} likes`;
}

function decrementLikes(likesElement) {
    const current = parseInt(likesElement.textContent) || 1;
    likesElement.textContent = `${current - 1} likes`;
}

function loadReels() {
    const container = document.getElementById('reelsContainer');
    if (!container || !window.sampleData) return;
    
    container.innerHTML = window.sampleData.reels.map(reel => `
        <div class="reel">
            <div class="reel-video">
                <i class="fas fa-play-circle"></i> Video Content
            </div>
            <div class="reel-info">
                <div class="reel-user">
                    <div class="profile-pic">${reel.user.avatar}</div>
                    <div class="name">${reel.user.name}</div>
                </div>
                <div class="reel-caption">${reel.caption}</div>
                <div class="reel-stats">
                    <span><i class="far fa-heart"></i> ${reel.likes}</span>
                    <span><i class="far fa-comment"></i> ${reel.comments}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function loadFriends(tab) {
    const container = document.getElementById('friendsGrid');
    if (!container || !window.sampleData) return;
    
    const friends = window.sampleData.friends[tab] || [];
    container.innerHTML = friends.map(friend => `
        <div class="friend-card">
            <div class="profile-pic">${friend.avatar}</div>
            <div class="name">${friend.name}</div>
            <div class="mutual-friends">${friend.mutual} mutual friends</div>
            <div class="friend-actions">
                <button class="message-btn">Message</button>
                ${tab === 'all' ? '<button class="remove">Remove</button>' : 
                  tab === 'requests' ? '<button class="accept">Accept</button><button class="decline">Decline</button>' : 
                  '<button class="add">Add Friend</button>'}
            </div>
        </div>
    `).join('');
    
    // Attach friend action events
    document.querySelectorAll('.message-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const name = this.closest('.friend-card').querySelector('.name').textContent;
            alert(`Opening chat with ${name}`);
        });
    });
    
    document.querySelectorAll('.remove, .decline').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.friend-card');
            card.style.opacity = '0';
            setTimeout(() => card.remove(), 300);
        });
    });
    
    document.querySelectorAll('.accept, .add').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.friend-card');
            card.style.opacity = '0';
            setTimeout(() => card.remove(), 300);
            alert('Friend request accepted!');
        });
    });
}

function loadNotifications() {
    const container = document.getElementById('notificationsList');
    if (!container || !window.sampleData) return;
    
    container.innerHTML = window.sampleData.notifications.map(notification => `
        <div class="notification ${notification.unread ? 'unread' : ''}">
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
        </div>
    `).join('');
    
    // Attach notification action events
    document.querySelectorAll('.accept-notification, .dismiss-notification').forEach(btn => {
        btn.addEventListener('click', function() {
            const notification = this.closest('.notification');
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        });
    });
}

function loadConversations() {
    const container = document.getElementById('conversationsList');
    if (!container || !window.sampleData) return;
    
    container.innerHTML = window.sampleData.conversations.map(conversation => `
        <div class="conversation-item" data-conversation-id="${conversation.id}">
            <div class="profile-pic">${conversation.user.avatar}</div>
            <div class="conversation-info">
                <div class="conversation-name">${conversation.user.name}</div>
                <div class="conversation-preview">${conversation.messages[conversation.messages.length - 1].text}</div>
            </div>
        </div>
    `).join('');
    
    // Select first conversation by default
    if (window.sampleData.conversations.length > 0) {
        selectConversation(document.querySelector('.conversation-item'));
    }
}

function selectConversation(conversationItem) {
    // Update active conversation
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
    });
    conversationItem.classList.add('active');
    
    // Load conversation messages
    const conversationId = conversationItem.getAttribute('data-conversation-id');
    const conversation = window.sampleData.conversations.find(c => c.id == conversationId);
    
    if (conversation) {
        document.getElementById('chatUserName').textContent = conversation.user.name;
        document.getElementById('chatUserAvatar').textContent = conversation.user.avatar;
        document.querySelector('.status').textContent = conversation.user.status;
        
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.innerHTML = conversation.messages.map(message => `
            <div class="message ${message.sent ? 'sent' : 'received'}">
                <div class="message-text">${message.text}</div>
                <div class="message-time">${message.time}</div>
            </div>
        `).join('');
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function sendMessage() {
    const messageInput = document.getElementById('messageText');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    const messagesContainer = document.getElementById('chatMessages');
    
    // Add message to UI
    const newMessage = {
        id: Date.now(),
        text: message,
        time: 'Just now',
        sent: true
    };
    
    messagesContainer.innerHTML += `
        <div class="message sent">
            <div class="message-text">${message}</div>
            <div class="message-time">Just now</div>
        </div>
    `;
    
    // Clear input
    messageInput.value = '';
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Simulate reply after delay
    setTimeout(() => {
        const replies = ['Nice!', 'That sounds great!', 'I agree!', 'Interesting!'];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        messagesContainer.innerHTML += `
            <div class="message received">
                <div class="message-text">${randomReply}</div>
                <div class="message-time">Just now</div>
            </div>
        `;
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
}

function loadProfileContent(tabId) {
    const container = document.getElementById('profileContent');
    if (!container || !window.sampleData) return;
    
    switch(tabId) {
        case 'posts':
            container.innerHTML = `
                <div class="posts-grid">
                    ${window.sampleData.posts.map(post => `
                        <div class="profile-post">
                            <div class="post-content">${post.content}</div>
                            ${post.image ? `<div class="post-image"><i class="fas fa-mountain"></i></div>` : ''}
                            <div class="post-stats">${post.likes} likes • ${post.comments} comments</div>
                        </div>
                    `).join('')}
                </div>
            `;
            break;
        case 'reels':
            container.innerHTML = `
                <div class="reels-grid">
                    ${window.sampleData.reels.map(reel => `
                        <div class="profile-reel">
                            <div class="reel-thumbnail"><i class="fas fa-play-circle"></i></div>
                            <div class="reel-stats">${reel.likes} likes</div>
                        </div>
                    `).join('')}
                </div>
            `;
            break;
        case 'tagged':
            container.innerHTML = '<p>No tagged posts yet.</p>';
            break;
        case 'achievements':
            container.innerHTML = `
                <div class="achievements-list">
                    ${window.sampleData.achievements.map(achievement => `
                        <div class="achievement-card">
                            <div class="achievement-icon">${achievement.icon}</div>
                            <div class="achievement-info">
                                <h4>${achievement.title}</h4>
                                <p>${achievement.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            break;
    }
}

function loadSettings() {
    const savedSettings = localStorage.getItem('vnexus_settings');
    
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Apply settings to form elements
        Object.keys(settings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = settings[key];
                } else {
                    element.value = settings[key];
                }
            }
        });
    }
}

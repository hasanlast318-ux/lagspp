// استخدام Firebase الذي تم تهيئته في HTML
// Firebase objects متاحة على window من الـ <script type="module"> الأول
console.log('🔴 [DEBUG] script.js is starting to execute...');

// تعريف DB و Auth بشكل آمن
const db = () => window.db;
const auth = () => window.auth;
const collection = (...args) => window.collection(...args);
const query = (...args) => window.query(...args);
const doc = (...args) => window.doc(...args);
const updateDoc = (...args) => window.updateDoc(...args);
const orderBy = (...args) => window.orderBy(...args);
const addDoc = (...args) => window.addDoc(...args);
const deleteDoc = (...args) => window.deleteDoc(...args);
const limit = (...args) => window.limit(...args);
const onSnapshot = (...args) => window.onSnapshot(...args);
const getDocs = (...args) => window.getDocs(...args);
const functions = () => window.functions;
const httpsCallable = (...args) => window.httpsCallable(...args);
const COLLECTION_NAME = "reports";
const USERS_COLLECTION_NAME = "users";
const GUEST_USERS_COLLECTION_NAME = "guestUsers";
const NOTIFICATION_REQUESTS_COLLECTION = "notificationRequests";
const USER_DELETION_REQUESTS_COLLECTION = "userDeletionRequests";
const GAS_URL = "https://script.google.com/macros/s/AKfycbzPymoY-eLQdGfkxvX_BeDYRma4gBM8murSh3cEsT_z9CDOkBHXuxdz_8xALzAxzA3FtA/exec";
const MAX_ATTACHMENT_SIZE = 50 * 1024 * 1024;
const PRESENCE_REFRESH_INTERVAL = 5000;
const ONLINE_HEARTBEAT_TIMEOUT = 15000;
const REPORT_PAGE_HEARTBEAT_TIMEOUT = 9000;

// متغيرات عامة
let allUsers = [];
let appUsers = [];
let guestUsers = [];
let pageViewsData = [];
let selectedUserId = null;
let activeView = 'chat';
let activeUsersPanel = 'selection';
let selectedNotificationUserId = null;
let selectedGuestUserId = null;
let selectedNotificationHistoryId = null;
let guestUsersLoadError = null;
let currentMessages = [];
let messageListener = null;
let notificationHistoryListener = null;
let notificationHistoryLoadError = null;
let selectedNotificationListener = null;
let guestUsersListener = null;
let supportListenersStarted = false;
let currentTheme = 'light';
let selectedAttachmentFile = null;
let selectedAttachmentKind = null;
let attachmentPreviewUrl = null;
let isSendingMessage = false;
let presenceRefreshTimer = null;
let statusTooltipElement = null;
let statusTooltipLongPressTimer = null;
const selectedConversationIds = new Set();
const selectedNotificationUserIds = new Set();
const selectedGuestUserIds = new Set();
const selectedNotificationHistoryIds = new Set();
const resolvedAttachmentUrls = new Map();
let notificationHistory = [];

// عناصر DOM للتسجيل الدخول (سيتم تهيئتها بعد تحميل DOM)
let loginContainer = null;
let appContainer = null;
let loginForm = null;
let emailInput = null;
let passwordInput = null;
let loginBtn = null;
let loginError = null;

// عناصر DOM الجديدة (سيتم تهيئتها بعد تحميل DOM)
let conversationsList = null;
let messagesList = null;
let messagesContainer = null;
let emptyState = null;
let replyArea = null;
let chatHeader = null;
let messageInput = null;
let sendBtn = null;
let attachBtn = null;
let attachmentInput = null;
let attachmentPreview = null;
let searchInput = null;
let usersCountSpan = null;
let totalTicketsSpan = null;
let messagesEnd = null;
let userStatusToggle = null;
let userStatusPopover = null;
let showInfoBtn = null;
let infoPanel = null;
let closeInfoBtn = null;
let infoContent = null;
let logoutBtn = null;
let sidebarLogoutBtn = null;
let toggleReplyBtn = null;
let toggleStatusBtn = null;
let deleteChatBtn = null;
let statusDropdown = null;
let themeToggleBtn = null;
let settingsToggleBtn = null;
let settingsPage = null;
let settingsBackBtn = null;
let settingsMenuToggleBtn = null;
let settingsEmailValue = null;
let copyEmailBtn = null;
let resetPasswordFormBtn = null;
let shortcutFormCard = null;
let cancelShortcutFormBtn = null;
let activeSettingsPanel = 'hub';
let savePasswordBtn = null;
let accountUsername = null;
let accountEmail = null;
let accountCreatedDate = null;
let currentPassword = null;
let newPassword = null;
let confirmNewPassword = null;
let passwordChangeError = null;
let shortcutsList = null;
let shortcutName = null;
let shortcutText = null;
let saveShortcutBtn = null;
let openAddShortcutFromViewBtn = null;
let collapseBtn = null;
let restoreSidebarBtn = null;
let conversationsCountSpan = null;
let selectAllConversations = null;
let deleteSelectedChatsBtn = null;
let selectedChatsCount = null;
let archiveSelectedChatsBtn = null;
let archivedChatsCount = null;
let archiveViewBtn = null;
let mediaViewer = null;
let mediaViewerBody = null;
let mediaViewerTitle = null;
let mediaViewerOpenLink = null;
let mediaViewerCloseBtn = null;
let mediaViewerBackdrop = null;
let chatViewBtn = null;
let usersViewBtn = null;
let dashboardViewBtn = null;
let usersPage = null;
let dashboardPage = null;
let usersTableList = null;
let usersSearchInput = null;
let usersPresenceFilter = null;
let usersAppVersionFilter = null;
let usersInactivityFilter = null;
let usersCustomInactivityWrap = null;
let usersCustomInactivityValue = null;
let usersCustomInactivityUnit = null;
let usersAdvancedFiltersBtn = null;
let usersAdvancedFilters = null;
let usersActiveFiltersCount = null;
let usersClearFiltersBtn = null;
let usersSelectionTabBtn = null;
let guestUsersTabBtn = null;
let notificationsHistoryTabBtn = null;
let usersSelectionView = null;
let guestsView = null;
let notificationsHistoryView = null;
let usersToolsPanel = null;
let guestsToolsPanel = null;
let usersPrimaryStatLabel = null;
let usersSecondaryStatWrap = null;
let usersSecondaryStatLabel = null;
let guestsTableList = null;
let guestsSearchInput = null;
let guestUsersCountBadge = null;
let guestsAppVersionFilter = null;
let guestsInactivityFilter = null;
let guestsPresenceFilter = null;
let guestsCustomInactivityWrap = null;
let guestsCustomInactivityValue = null;
let guestsCustomInactivityUnit = null;
let guestsAdvancedFiltersBtn = null;
let guestsAdvancedFilters = null;
let guestsActiveFiltersCount = null;
let guestsClearFiltersBtn = null;
let selectAllGuestUsers = null;
let deleteSelectedGuestsBtn = null;
let guestUserDetails = null;
let notificationsHistoryList = null;
let notificationHistoryDetails = null;
let notificationsHistorySearchInput = null;
let notificationsHistoryCount = null;
let selectAllNotificationHistory = null;
let deleteSelectedNotificationsBtn = null;
let selectedNotificationsCount = null;
let selectAllNotificationUsers = null;
let deleteSelectedUsersBtn = null;
let allUsersCount = null;
let notificationSelectedCount = null;
let selectedUserDetails = null;
let notificationTitleInput = null;
let notificationBodyInput = null;
let notificationLinkInput = null;
let notificationCustomLinkInput = null;
let sendNotificationBtn = null;

// عناصر الـ Modal المخصصة لتعديل الرسالة
let editingMessageId = null;
let editModal = null;
let editMessageTextarea = null;
let saveEditBtn = null;
let cancelEditBtn = null;
let closeEditModalBtn = null;

// ========== دالة تهيئة عناصر DOM ==========
function initializeDOMElements() {
    // عناصر تسجيل الدخول
    loginContainer = document.getElementById('loginContainer');
    appContainer = document.getElementById('appContainer');
    loginForm = document.getElementById('loginForm');
    emailInput = document.getElementById('emailInput');
    passwordInput = document.getElementById('passwordInput');
    loginBtn = document.getElementById('loginBtn');
    loginError = document.getElementById('loginError');
    
    // جميع عناصر الواجهة الأخرى
    conversationsList = document.getElementById('conversationsList');
    messagesList = document.getElementById('messagesList');
    messagesContainer = document.getElementById('messagesContainer');
    emptyState = document.getElementById('emptyState');
    replyArea = document.getElementById('replyArea');
    chatHeader = document.getElementById('chatHeader');
    messageInput = document.getElementById('messageInput');
    sendBtn = document.getElementById('sendBtn');
    attachBtn = document.getElementById('attachBtn');
    attachmentInput = document.getElementById('attachmentInput');
    attachmentPreview = document.getElementById('attachmentPreview');
    searchInput = document.getElementById('searchInput');
    usersCountSpan = document.getElementById('usersCount');
    totalTicketsSpan = document.getElementById('totalTickets');
    messagesEnd = document.getElementById('messagesEnd');
    userStatusToggle = document.getElementById('userStatusToggle');
    userStatusPopover = document.getElementById('userStatusPopover');
    showInfoBtn = document.getElementById('showInfoBtn');
    infoPanel = document.getElementById('infoPanel');
    closeInfoBtn = document.getElementById('closeInfoBtn');
    infoContent = document.getElementById('infoContent');
    logoutBtn = document.getElementById('logoutBtn');
    sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');
    toggleReplyBtn = document.getElementById('toggleReplyBtn');
    toggleStatusBtn = document.getElementById('toggleStatusBtn');
    deleteChatBtn = document.getElementById('deleteChatBtn');
    statusDropdown = document.getElementById('statusDropdown');
    themeToggleBtn = document.getElementById('themeToggleBtn');
    settingsToggleBtn = document.getElementById('settingsToggleBtn');
    settingsPage = document.getElementById('settingsPage');
    settingsBackBtn = document.getElementById('settingsBackBtn');
    settingsMenuToggleBtn = document.getElementById('settingsMenuToggleBtn');
    settingsEmailValue = document.getElementById('settingsEmailValue');
    copyEmailBtn = document.getElementById('copyEmailBtn');
    resetPasswordFormBtn = document.getElementById('resetPasswordFormBtn');
    shortcutFormCard = document.getElementById('shortcutFormCard');
    cancelShortcutFormBtn = document.getElementById('cancelShortcutFormBtn');
    savePasswordBtn = document.getElementById('savePasswordBtn');
    accountUsername = document.getElementById('accountUsername');
    accountEmail = document.getElementById('accountEmail');
    accountCreatedDate = document.getElementById('accountCreatedDate');
    currentPassword = document.getElementById('currentPassword');
    newPassword = document.getElementById('newPassword');
    confirmNewPassword = document.getElementById('confirmNewPassword');
    passwordChangeError = document.getElementById('passwordChangeError');
    shortcutsList = document.getElementById('shortcutsList');
    shortcutName = document.getElementById('shortcutName');
    shortcutText = document.getElementById('shortcutText');
    saveShortcutBtn = document.getElementById('saveShortcutBtn');
    openAddShortcutFromViewBtn = document.getElementById('openAddShortcutFromViewBtn');
    collapseBtn = document.getElementById('collapseSidebar');
    restoreSidebarBtn = document.getElementById('restoreSidebarBtn');
    conversationsCountSpan = document.getElementById('conversationsCount');
    selectAllConversations = document.getElementById('selectAllConversations');
    deleteSelectedChatsBtn = document.getElementById('deleteSelectedChatsBtn');
    selectedChatsCount = document.getElementById('selectedChatsCount');
    archiveSelectedChatsBtn = document.getElementById('archiveSelectedChatsBtn');
    archivedChatsCount = document.getElementById('archivedChatsCount');
    archiveViewBtn = document.getElementById('archiveViewBtn');
    mediaViewer = document.getElementById('mediaViewer');
    mediaViewerBody = document.getElementById('mediaViewerBody');
    mediaViewerTitle = document.getElementById('mediaViewerTitle');
    mediaViewerOpenLink = document.getElementById('mediaViewerOpenLink');
    mediaViewerCloseBtn = document.getElementById('mediaViewerCloseBtn');
    mediaViewerBackdrop = document.getElementById('mediaViewerBackdrop');
    chatViewBtn = document.getElementById('chatViewBtn');
    usersViewBtn = document.getElementById('usersViewBtn');
    dashboardViewBtn = document.getElementById('dashboardViewBtn');
    usersPage = document.getElementById('usersPage');
    dashboardPage = document.getElementById('dashboardPage');
    usersTableList = document.getElementById('usersTableList');
    usersSearchInput = document.getElementById('usersSearchInput');
    usersPresenceFilter = document.getElementById('usersPresenceFilter');
    usersAppVersionFilter = document.getElementById('usersAppVersionFilter');
    usersInactivityFilter = document.getElementById('usersInactivityFilter');
    usersCustomInactivityWrap = document.getElementById('usersCustomInactivityWrap');
    usersCustomInactivityValue = document.getElementById('usersCustomInactivityValue');
    usersCustomInactivityUnit = document.getElementById('usersCustomInactivityUnit');
    usersAdvancedFiltersBtn = document.getElementById('usersAdvancedFiltersBtn');
    usersAdvancedFilters = document.getElementById('usersAdvancedFilters');
    usersActiveFiltersCount = document.getElementById('usersActiveFiltersCount');
    usersClearFiltersBtn = document.getElementById('usersClearFiltersBtn');
    usersSelectionTabBtn = document.getElementById('usersSelectionTabBtn');
    guestUsersTabBtn = document.getElementById('guestUsersTabBtn');
    notificationsHistoryTabBtn = document.getElementById('notificationsHistoryTabBtn');
    usersSelectionView = document.getElementById('usersSelectionView');
    guestsView = document.getElementById('guestsView');
    notificationsHistoryView = document.getElementById('notificationsHistoryView');
    usersToolsPanel = document.getElementById('usersToolsPanel');
    guestsToolsPanel = document.getElementById('guestsToolsPanel');
    usersPrimaryStatLabel = document.getElementById('usersPrimaryStatLabel');
    usersSecondaryStatWrap = document.getElementById('usersSecondaryStatWrap');
    usersSecondaryStatLabel = document.getElementById('usersSecondaryStatLabel');
    guestsTableList = document.getElementById('guestsTableList');
    guestsSearchInput = document.getElementById('guestsSearchInput');
    guestUsersCountBadge = document.getElementById('guestUsersCount');
    guestsAppVersionFilter = document.getElementById('guestsAppVersionFilter');
    guestsInactivityFilter = document.getElementById('guestsInactivityFilter');
    guestsPresenceFilter = document.getElementById('guestsPresenceFilter');
    guestsCustomInactivityWrap = document.getElementById('guestsCustomInactivityWrap');
    guestsCustomInactivityValue = document.getElementById('guestsCustomInactivityValue');
    guestsCustomInactivityUnit = document.getElementById('guestsCustomInactivityUnit');
    guestsAdvancedFiltersBtn = document.getElementById('guestsAdvancedFiltersBtn');
    guestsAdvancedFilters = document.getElementById('guestsAdvancedFilters');
    guestsActiveFiltersCount = document.getElementById('guestsActiveFiltersCount');
    guestsClearFiltersBtn = document.getElementById('guestsClearFiltersBtn');
    selectAllGuestUsers = document.getElementById('selectAllGuestUsers');
    deleteSelectedGuestsBtn = document.getElementById('deleteSelectedGuestsBtn');
    guestUserDetails = document.getElementById('guestUserDetails');
    notificationsHistoryList = document.getElementById('notificationsHistoryList');
    notificationHistoryDetails = document.getElementById('notificationHistoryDetails');
    notificationsHistorySearchInput = document.getElementById('notificationsHistorySearchInput');
    notificationsHistoryCount = document.getElementById('notificationsHistoryCount');
    selectAllNotificationHistory = document.getElementById('selectAllNotificationHistory');
    deleteSelectedNotificationsBtn = document.getElementById('deleteSelectedNotificationsBtn');
    selectedNotificationsCount = document.getElementById('selectedNotificationsCount');
    selectAllNotificationUsers = document.getElementById('selectAllNotificationUsers');
    deleteSelectedUsersBtn = document.getElementById('deleteSelectedUsersBtn');
    allUsersCount = document.getElementById('allUsersCount');
    notificationSelectedCount = document.getElementById('notificationSelectedCount');
    selectedUserDetails = document.getElementById('selectedUserDetails');
    notificationTitleInput = document.getElementById('notificationTitleInput');
    notificationBodyInput = document.getElementById('notificationBodyInput');
    notificationLinkInput = document.getElementById('notificationLinkInput');
    notificationCustomLinkInput = document.getElementById('notificationCustomLinkInput');
    sendNotificationBtn = document.getElementById('sendNotificationBtn');
    
    // عناصر Modal التعديل
    editModal = document.getElementById('editModal');
    editMessageTextarea = document.getElementById('editMessageTextarea');
    saveEditBtn = document.getElementById('saveEditBtn');
    cancelEditBtn = document.getElementById('cancelEditBtn');
    closeEditModalBtn = document.getElementById('closeEditModalBtn');
    
    console.log('✅ تم تهيئة جميع عناصر DOM بنجاح');
}

// ========== دوال تسجيل الدخول ==========
function checkAuthState() {
    window.onAuthStateChanged(auth(), (user) => {
        if (user) {
            console.log('✅ مسجل دخول:', user.email);
            loginContainer.style.display = 'none';
            appContainer.style.display = 'flex';
            init();
        } else {
            console.log('❌ لم يقم بتسجيل الدخول');
            loginContainer.style.display = 'flex';
            appContainer.style.display = 'none';
            resetLoginForm();
            
            // Reset mobile top bar and close drawer on logout
            const mobileTopBar = document.getElementById('mobileTopBar');
            if (mobileTopBar) mobileTopBar.style.display = '';
            closeMobileSidebar();
        }
    });
}

async function handleLogin(email, password) {
    loginBtn.disabled = true;
    loginError.style.display = 'none';
    
    try {
        await window.signInWithEmailAndPassword(auth(), email, password);
        console.log('✅ تم تسجيل الدخول بنجاح');
    } catch (error) {
        console.error('❌ خطأ في تسجيل الدخول:', error);
        
        let errorMessage = 'خطأ في تسجيل الدخول';
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'البريد الإلكتروني غير مسجل';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'كلمة المرور غير صحيحة';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'البريد الإلكتروني غير صحيح';
        } else if (error.code === 'auth/user-disabled') {
            errorMessage = 'الحساب معطل';
        }
        
        loginError.textContent = '❌ ' + errorMessage;
        loginError.style.display = 'block';
    }
    
    loginBtn.disabled = false;
}

async function handleLogout() {
    try {
        await window.signOut(auth());
        console.log('✅ تم تسجيل الخروج');
        showToast('تم تسجيل الخروج بنجاح');
    } catch (error) {
        console.error('❌ خطأ في تسجيل الخروج:', error);
        showToast('خطأ في تسجيل الخروج', true);
    }
}

function resetLoginForm() {
    emailInput.value = '';
    passwordInput.value = '';
    loginError.style.display = 'none';
    if (emailInput) emailInput.focus();
}

function disableBrowserAutofill(input) {
    if (!input || input.dataset.autofillGuard === '1') return;
    input.dataset.autofillGuard = '1';
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('readonly', 'readonly');
    input.addEventListener('focus', () => input.removeAttribute('readonly'));
    input.addEventListener('mousedown', () => input.removeAttribute('readonly'));
}

// ========== دوال مساعدة ==========
async function notifyUser(reportId, messageText) {
    if (!GAS_URL || GAS_URL === "ضع_هنا_رابط_السكريبت_الخاص_بك") {
        console.warn("لم يتم تعيين رابط سكريبت جوجل للإشعارات بعد");
        return;
    }

    try {
        await fetch(GAS_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "web_notification",
                reportId: reportId,
                messageText: messageText
            })
        });
        console.log("تم إرسال طلب الإشعار للسكريبت");
    } catch (error) {
        console.error("فشل إرسال طلب الإشعار:", error);
    }
}

function updateStatusDropdownClass(val) {
    const status = (typeof val === 'string') ? val : (val ? val.value : '');
    
    // Update native select if it exists and differs
    if (statusDropdown && statusDropdown.value !== status) {
        statusDropdown.value = status;
    }
    
    // Update native select class
    if (statusDropdown) {
        statusDropdown.classList.remove('status-pending', 'status-inprogress', 'status-solved');
        if (status === 'Pending') {
            statusDropdown.classList.add('status-pending');
        } else if (status === 'In Progress') {
            statusDropdown.classList.add('status-inprogress');
        } else if (status === 'Solved') {
            statusDropdown.classList.add('status-solved');
        }
    }
    
    // Update Custom Dropdown Trigger UI
    const trigger = document.getElementById('statusDropdownTrigger');
    if (trigger) {
        trigger.classList.remove('status-pending', 'status-inprogress', 'status-solved');
        const triggerText = trigger.querySelector('.trigger-text');
        
        if (status === 'Pending') {
            trigger.classList.add('status-pending');
            if (triggerText) triggerText.innerHTML = '⏳ قيد الانتظار';
        } else if (status === 'In Progress') {
            trigger.classList.add('status-inprogress');
            if (triggerText) triggerText.innerHTML = '🔄 قيد المعالجة';
        } else if (status === 'Solved') {
            trigger.classList.add('status-solved');
            if (triggerText) triggerText.innerHTML = '✅ تم الحل';
        }
    }
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.style.background = isError ? '#ef4444' : '#10b981';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 86400000) {
        return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 604800000) {
        return date.toLocaleDateString('ar-SA', { weekday: 'short' });
    } else {
        return date.toLocaleDateString('ar-SA', { day: '2-digit', month: '2-digit' });
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeAttribute(text) {
    return escapeHtml(text).replace(/"/g, '&quot;');
}

function safeMediaUrl(url) {
    const value = String(url || '').trim();
    if (!value || !/^https?:\/\//i.test(value)) return '';
    return value;
}

function toMillis(value) {
    if (!value) return 0;
    if (typeof value === 'number') return value < 10000000000 ? value * 1000 : value;
    if (typeof value === 'string') {
        const parsed = Date.parse(value);
        return Number.isNaN(parsed) ? 0 : parsed;
    }
    if (typeof value.toMillis === 'function') return value.toMillis();
    if (typeof value.seconds === 'number') return value.seconds * 1000;
    return 0;
}

function sanitizeStorageSegment(value) {
    return String(value || 'general')
        .trim()
        .replace(/[\\/#?[\]*]/g, '-')
        .replace(/\s+/g, '-')
        .slice(0, 120) || 'general';
}

function inferAttachmentType({ type = '', contentType = '', url = '' } = {}) {
    const hint = `${type} ${contentType}`.toLowerCase();
    if (hint.includes('video')) return 'video';
    if (hint.includes('image')) return 'image';

    const cleanUrl = String(url).split('?')[0].toLowerCase();
    if (/\.(mp4|mov|webm|m4v|avi|mkv)$/.test(cleanUrl)) return 'video';
    if (/\.(png|jpe?g|gif|webp|bmp|heic|svg)$/.test(cleanUrl)) return 'image';
    return 'file';
}

function getAttachmentPath(raw = {}) {
    return raw.path || raw.fullPath || raw.storagePath || raw.mediaPath || raw.filePath || raw.attachmentPath || raw.imagePath || raw.videoPath || raw.screenshotPath || '';
}

function normalizeAttachment(rawAttachment, message = {}) {
    if (!rawAttachment) return null;

    const raw = typeof rawAttachment === 'string'
        ? { url: rawAttachment }
        : rawAttachment;
    const path = getAttachmentPath(raw);

    const url = safeMediaUrl(
        raw.url ||
        raw.downloadURL ||
        raw.downloadUrl ||
        raw.mediaUrl ||
        raw.fileUrl ||
        raw.attachmentUrl ||
        raw.imageUrl ||
        raw.videoUrl ||
        raw.photoUrl ||
        raw.pictureUrl ||
        raw.screenshotUrl ||
        raw.src ||
        raw.uri ||
        raw.link
    ) || (path ? resolvedAttachmentUrls.get(path) || '' : '');

    if (!url) return null;

    const contentType =
        raw.contentType ||
        raw.mimeType ||
        raw.fileType ||
        message.contentType ||
        message.mimeType ||
        '';

    const type = inferAttachmentType({
        type: raw.type || raw.mediaType || raw.fileType || raw.attachmentType || message.mediaType || message.type || '',
        contentType,
        url
    });

    if (type !== 'image' && type !== 'video') return null;

    return {
        url,
        type,
        name: raw.name || raw.fileName || raw.filename || raw.originalName || (type === 'video' ? 'فيديو مرفق' : 'صورة مرفقة'),
        contentType,
        path
    };
}

function normalizeMessageAttachments(message = {}) {
    const candidates = [];

    if (Array.isArray(message.attachments)) candidates.push(...message.attachments);
    if (Array.isArray(message.media)) candidates.push(...message.media);
    if (message.attachment) candidates.push(message.attachment);
    if (message.file) candidates.push(message.file);
    if (message.imageUrl) candidates.push({ url: message.imageUrl, type: 'image', name: message.imageName, contentType: message.imageType });
    if (message.videoUrl) candidates.push({ url: message.videoUrl, type: 'video', name: message.videoName, contentType: message.videoType });
    if (message.mediaUrl) candidates.push({ url: message.mediaUrl, type: message.mediaType, name: message.mediaName, contentType: message.mimeType || message.contentType });
    if (message.fileUrl) candidates.push({ url: message.fileUrl, type: message.fileType, name: message.fileName, contentType: message.mimeType || message.contentType });
    if (message.attachmentUrl) candidates.push({ url: message.attachmentUrl, type: message.attachmentType, name: message.attachmentName, contentType: message.mimeType || message.contentType });
    if (message.url && (message.type || message.mediaType || message.contentType || message.mimeType)) candidates.push(message);
    if (message.downloadURL) candidates.push(message);
    if (message.downloadUrl) candidates.push(message);
    if (message.photoUrl) candidates.push({ url: message.photoUrl, type: 'image', name: message.photoName, contentType: message.photoType });
    if (message.pictureUrl) candidates.push({ url: message.pictureUrl, type: 'image', name: message.pictureName, contentType: message.pictureType });
    if (message.screenshotUrl) candidates.push({ url: message.screenshotUrl, type: 'image', name: message.screenshotName, contentType: message.screenshotType });

    const seenUrls = new Set();
    return candidates
        .map(attachment => normalizeAttachment(attachment, message))
        .filter(attachment => {
            if (!attachment || seenUrls.has(attachment.url)) return false;
            seenUrls.add(attachment.url);
            return true;
        });
}

function addAttachmentCandidates(candidates, value, typeHint = '') {
    if (!value) return;

    if (Array.isArray(value)) {
        value.forEach(item => addAttachmentCandidates(candidates, item, typeHint));
        return;
    }

    if (typeof value === 'string') {
        candidates.push({ url: value, type: typeHint });
        return;
    }

    candidates.push(typeHint ? { ...value, type: value.type || value.mediaType || typeHint } : value);
}

function normalizeReportAttachments(user = {}) {
    const candidates = [];

    addAttachmentCandidates(candidates, user.attachments);
    addAttachmentCandidates(candidates, user.reportAttachments);
    addAttachmentCandidates(candidates, user.problemAttachments);
    addAttachmentCandidates(candidates, user.media);
    addAttachmentCandidates(candidates, user.files);
    addAttachmentCandidates(candidates, user.images, 'image');
    addAttachmentCandidates(candidates, user.imageUrls, 'image');
    addAttachmentCandidates(candidates, user.photos, 'image');
    addAttachmentCandidates(candidates, user.photoUrls, 'image');
    addAttachmentCandidates(candidates, user.screenshots, 'image');
    addAttachmentCandidates(candidates, user.screenshotUrls, 'image');
    addAttachmentCandidates(candidates, user.videos, 'video');
    addAttachmentCandidates(candidates, user.videoUrls, 'video');
    addAttachmentCandidates(candidates, user.attachment);
    addAttachmentCandidates(candidates, user.file);
    addAttachmentCandidates(candidates, user.imageUrl, 'image');
    addAttachmentCandidates(candidates, user.photoUrl, 'image');
    addAttachmentCandidates(candidates, user.pictureUrl, 'image');
    addAttachmentCandidates(candidates, user.screenshotUrl, 'image');
    addAttachmentCandidates(candidates, user.videoUrl, 'video');
    addAttachmentCandidates(candidates, user.mediaUrl, user.mediaType);
    addAttachmentCandidates(candidates, user.fileUrl, user.fileType);
    addAttachmentCandidates(candidates, user.attachmentUrl, user.attachmentType);

    const seenUrls = new Set();
    return candidates
        .map(attachment => normalizeAttachment(attachment, user))
        .filter(attachment => {
            if (!attachment || seenUrls.has(attachment.url)) return false;
            seenUrls.add(attachment.url);
            return true;
        });
}

function renderReportAttachments(user = {}) {
    const attachments = normalizeReportAttachments(user);
    if (attachments.length === 0) return '';

    return `
        <div class="problem-message-new report-attachments-new">
            <strong>مرفقات البلاغ:</strong>
            <div class="report-attachments-grid-new">
                ${attachments.map(renderCompactAttachment).join('')}
            </div>
        </div>
    `;
}

function renderCompactAttachment(attachment) {
    const url = escapeHtml(attachment.url);
    const name = escapeHtml(attachment.name);
    const type = escapeHtml(attachment.type);

    if (attachment.type === 'video') {
        return `
            <button type="button" class="report-media-compact-new" data-media-url="${url}" data-media-type="${type}" data-media-name="${name}" title="${name}">
                <video class="report-media-compact-video-new" preload="metadata" src="${url}"></video>
            </button>
        `;
    }

    return `
        <button type="button" class="report-media-compact-new" data-media-url="${url}" data-media-type="${type}" data-media-name="${name}" title="${name}">
            <img class="report-media-compact-image-new" src="${url}" alt="${name}" loading="lazy">
        </button>
    `;
}

function collectAttachmentPaths(value, paths = new Set()) {
    if (!value) return paths;

    if (Array.isArray(value)) {
        value.forEach(item => collectAttachmentPaths(item, paths));
        return paths;
    }

    if (typeof value === 'string') {
        if (!safeMediaUrl(value) && value.includes('/') && /\.(png|jpe?g|gif|webp|heic|mp4|mov|webm|m4v)$/i.test(value.split('?')[0])) {
            paths.add(value);
        }
        return paths;
    }

    if (typeof value === 'object') {
        const path = getAttachmentPath(value);
        if (path) paths.add(path);

        ['attachments', 'reportAttachments', 'problemAttachments', 'media', 'files', 'images', 'photos', 'screenshots', 'videos'].forEach(key => {
            if (value[key]) collectAttachmentPaths(value[key], paths);
        });
    }

    return paths;
}

async function resolveUserAttachmentUrls(user = {}) {
    const activeStorage = getActiveStorage();
    if (!activeStorage) return;

    const paths = collectAttachmentPaths(user);
    await Promise.allSettled([...paths].map(async path => {
        if (resolvedAttachmentUrls.has(path)) return;
        const url = await getDownloadURL(ref(activeStorage, path));
        resolvedAttachmentUrls.set(path, url);
    }));
}

function renderAttachment(attachment) {
    const url = escapeHtml(attachment.url);
    const name = escapeHtml(attachment.name);
    const type = escapeHtml(attachment.type);

    if (attachment.type === 'video') {
        return `
            <div class="message-media-shell-new video-shell-new">
                <div class="message-media-top-new">
                    <span class="message-media-type-new">فيديو</span>
                    <button type="button" class="message-media-preview-new" data-media-url="${url}" data-media-type="${type}" data-media-name="${name}">عرض</button>
                    <a class="message-media-open-new" href="${url}" target="_blank" rel="noopener noreferrer">فتح الرابط</a>
                </div>
                <button type="button" class="message-media-preview-frame-new" data-media-url="${url}" data-media-type="${type}" data-media-name="${name}">
                    <video class="message-video-new" preload="metadata" src="${url}"></video>
                </button>
                <div class="message-media-name-new">${name}</div>
            </div>
        `;
    }

    return `
        <div class="message-media-shell-new image-shell-new">
            <div class="message-media-top-new">
                <span class="message-media-type-new">صورة</span>
                <button type="button" class="message-media-preview-new" data-media-url="${url}" data-media-type="${type}" data-media-name="${name}">عرض</button>
                <a class="message-media-open-new" href="${url}" target="_blank" rel="noopener noreferrer">فتح الرابط</a>
            </div>
            <button type="button" class="message-media-preview-frame-new" data-media-url="${url}" data-media-type="${type}" data-media-name="${name}">
                <img class="message-image-new" src="${url}" alt="${name}" loading="lazy">
            </button>
            <div class="message-media-name-new">${name}</div>
        </div>
    `;
}

function renderMessageAttachments(message) {
    const attachments = normalizeMessageAttachments(message);
    if (attachments.length === 0) return '';

    return `
        <div class="message-attachments-new">
            ${attachments.map(renderAttachment).join('')}
        </div>
    `;
}

function openMediaViewer(url, type, name = 'مرفق') {
    if (!mediaViewer || !mediaViewerBody) return;

    const safeUrl = safeMediaUrl(url);
    if (!safeUrl) return;

    if (mediaViewerTitle) mediaViewerTitle.textContent = name || 'مرفق';
    if (mediaViewerOpenLink) mediaViewerOpenLink.href = safeUrl;
    mediaViewerBody.innerHTML = type === 'video'
        ? `<video class="media-viewer-video" controls autoplay src="${escapeHtml(safeUrl)}"></video>`
        : `<img class="media-viewer-image" src="${escapeHtml(safeUrl)}" alt="${escapeHtml(name || 'مرفق')}">`;
    mediaViewer.style.display = 'flex';
    document.body.classList.add('media-viewer-open');
}

function closeMediaViewer() {
    if (!mediaViewer || !mediaViewerBody) return;

    mediaViewer.style.display = 'none';
    mediaViewerBody.innerHTML = '';
    document.body.classList.remove('media-viewer-open');
}

function bindMediaPreviewButtons() {
    document.querySelectorAll('.message-media-preview-new, .message-media-preview-frame-new, .report-media-compact-new').forEach(button => {
        button.addEventListener('click', () => {
            openMediaViewer(button.dataset.mediaUrl, button.dataset.mediaType, button.dataset.mediaName);
        });
    });
}

function getMessagePreview(message) {
    const text = (message?.text || '').trim();
    if (text) return text;

    const attachments = normalizeMessageAttachments(message || {});
    if (attachments.length === 0) return 'لا توجد رسائل';

    const firstAttachment = attachments[0];
    return firstAttachment.type === 'video' ? '🎬 فيديو' : '🖼️ صورة';
}

function getReportText(user = {}) {
    return user.message || user.text || user.description || user.desc || user.problem || user.issue || user.report || user.reportText || user.report_text || user.problemDescription || user.problem_description || user.msg || '';
}

function getReportPreview(user = {}, lastMessage) {
    const messagePreview = getMessagePreview(lastMessage);
    if (lastMessage || messagePreview !== 'لا توجد رسائل') return messagePreview;

    return (getReportText(user) || 'بلاغ جديد').trim();
}

function isReportOpenedByAdmin(user = {}) {
    return user.reportRead === true || user.adminRead === true || user.seenByAdmin === true || user.isRead === true || user.read === true;
}

function getUnreadCount(user = {}, messages = []) {
    const unreadMessages = messages.filter(message => message.sender === 'user' && !message.read).length;
    const hasUserMessage = messages.some(message => message.sender === 'user');
    const hasUnreadInitialReport = !!getReportText(user).trim() && !hasUserMessage && !isReportOpenedByAdmin(user);

    return unreadMessages + (hasUnreadInitialReport ? 1 : 0);
}

function getFreshTimestamp(user = {}, keys = []) {
    return Math.max(...keys.map(key => toMillis(user[key])), 0);
}

function firstTextValue(...values) {
    for (const value of values) {
        if (typeof value === 'string' && value.trim()) return value.trim();
    }
    return '';
}

function getUserLocationText(user = {}) {
    const presence = user.presence || user.userPresence || user.statusInfo || {};
    const level = user.level || user.currentLevel || user.levelNumber || presence.level || presence.currentLevel || '';
    const lesson = user.lessonNumber || user.currentLessonNumber || user.lessonNo || user.lesson || presence.lessonNumber || presence.currentLessonNumber || '';
    const page = firstTextValue(user.currentPage, user.activePage, user.screen, user.route, user.currentRoute);
    const location = firstTextValue(
        user.userLocation,
        user.user_location,
        user.locationName,
        user.location_name,
        user.pageTitle,
        user.page_title,
        user.currentPageName,
        user.current_page_name,
        user.activePageName,
        user.screenName,
        user.screen_name,
        user.routeName,
        user.route_name,
        presence.userLocation,
        presence.user_location,
        presence.locationName,
        presence.pageTitle,
        presence.currentPageName
    );
    const detail = firstTextValue(
        user.userSubLocation,
        user.user_sub_location,
        user.subLocation,
        user.sub_location,
        user.innerLocation,
        user.inner_location,
        user.sectionName,
        user.section_name,
        user.tabName,
        user.tab_name,
        user.subPageName,
        user.sub_page_name,
        user.currentSectionName,
        user.current_section_name,
        user.currentTabName,
        user.current_tab_name,
        presence.userSubLocation,
        presence.subLocation,
        presence.innerLocation,
        presence.sectionName,
        presence.tabName,
        presence.subPageName,
        presence.currentSectionName,
        presence.currentTabName
    );

    if (level && lesson) return `المستوى ${level} - الدرس ${lesson}`;
    if (location && detail && location !== detail) return `${location} - ${detail}`;
    if (location) return location;
    if (detail) return detail;
    if (page && !['app', 'report', 'offline'].includes(page.toLowerCase())) return page;
    return '';
}

// ========== دوال معلومات الشاشة والجهاز ==========
function getScreenDimensions(user = {}) {
    const resolution = readUserValue(user, [
        'screenResolution',
        'screen_resolution',
        'displayResolution',
        'display_resolution',
        'resolution',
        'screenWidth',
        'screen_width',
        'displayWidth',
        'display_width',
        'deviceWidth',
        'device_width',
        'width'
    ]);
    
    if (resolution) {
        return String(resolution);
    }
    return '';
}

function getScreenSizeInInches(user = {}) {
    const screenSize = readUserValue(user, [
        'screenInches',
        'screen_inches',
        'screenSize',
        'screen_size',
        'screenSizeInches',
        'screen_size_inches',
        'diagonalSize',
        'diagonal_size',
        'screenDiagonal'
    ]);
    
    if (screenSize) {
        return String(screenSize);
    }
    return '';
}

function getScreenDPI(user = {}) {
    const dpi = readUserValue(user, [
        'screenDPI',
        'screen_dpi',
        'dpi',
        'displayDPI',
        'display_dpi',
        'densityDPI',
        'density_dpi',
        'logicalDensityDpi'
    ]);
    
    if (dpi) {
        return String(dpi);
    }
    return '';
}

function getScreenDP(user = {}) {
    const dp = readUserValue(user, [
        'screenDP',
        'screen_dp',
        'dp',
        'displayDP',
        'display_dp',
        'devicePixels',
        'device_pixels',
        'scaledDensity'
    ]);
    
    if (dp) {
        return String(dp);
    }
    return '';
}

function getScreenDensity(user = {}) {
    const density = readUserValue(user, [
        'screenDensity',
        'screen_density',
        'density',
        'displayDensity',
        'display_density',
        'densityName',
        'density_name',
        'densityCategory'
    ]);
    
    if (density) {
        return String(density);
    }
    return '';
}

function getAndroidVersion(user = {}) {
    const osVersion = readUserValue(user, [
        'androidVersion',
        'android_version',
        'osVersion',
        'os_version',
        'version',
        'sdkVersion',
        'sdk_version',
        'apiLevel',
        'api_level',
        'buildVersion',
        'build_version',
        'systemVersion',
        'system_version',
        'releaseVersion'
    ]);
    
    if (osVersion) {
        return String(osVersion);
    }
    return '';
}

function getUserAvatarUrl(user = {}) {
    const profile = user.profile || user.userProfile || user.account || {};
    return safeMediaUrl(
        user.userAvatarUrl ||
        user.avatarUrl ||
        user.profileImageUrl ||
        user.profilePhotoUrl ||
        user.userImageUrl ||
        user.userPhotoUrl ||
        user.photoURL ||
        user.photoUrl ||
        user.pictureUrl ||
        user.profilePictureUrl ||
        profile.userAvatarUrl ||
        profile.avatarUrl ||
        profile.profileImageUrl ||
        profile.profilePhotoUrl ||
        profile.photoURL ||
        profile.photoUrl ||
        profile.pictureUrl
    );
}

function renderUserAvatar(user = {}, displayName = '') {
    const avatarUrl = getUserAvatarUrl(user);
    if (avatarUrl) {
        return `<img src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(displayName || 'المستخدم')}" loading="lazy">`;
    }

    return escapeHtml((displayName || '؟').charAt(0).toUpperCase());
}

function getPresenceState(user = {}) {
    const now = Date.now();
    const lastActiveAt = getFreshTimestamp(user, [
        'presenceUpdatedAt',
        'lastSeen',
        'lastSeenAt',
        'userLastSeen',
        'userLastActiveAt',
        'lastActive',
        'lastActiveAt',
        'updatedAt'
    ]);
    const reportPageAt = getFreshTimestamp(user, [
        'reportPageSeenAt',
        'reportPageActiveAt',
        'userInChatAt',
        'inChatAt',
        'chatActiveAt'
    ]);
    const isFreshOnline = lastActiveAt && now - lastActiveAt <= ONLINE_HEARTBEAT_TIMEOUT;
    const isFreshInChat = reportPageAt && now - reportPageAt <= REPORT_PAGE_HEARTBEAT_TIMEOUT;
    const page = String(user.currentPage || user.activePage || user.screen || '').toLowerCase();
    const explicitOffline = user.userOnline === false || user.online === false || user.isOnline === false || user.user_online === false || user.is_online === false || user.isActive === false;
    const explicitOutOfChat = user.userInChat === false || user.inChat === false || user.user_in_chat === false || user.in_chat === false;
    const explicitInChat = user.userInChat === true || user.inChat === true || user.user_in_chat === true || user.in_chat === true || page.includes('report') || page.includes('بلاغ') || page.includes('problem');
    const explicitOnline = user.userOnline === true || user.online === true || user.active === true || user.isOnline === true || user.user_online === true || user.is_online === true || user.isActive === true;
    const isStaleExplicitOnline = explicitOnline && lastActiveAt && now - lastActiveAt > ONLINE_HEARTBEAT_TIMEOUT;
    const locationText = getUserLocationText(user);

    if (explicitOffline) {
        return {
            className: 'offline',
            text: lastActiveAt ? `غير متصل - آخر ظهور ${formatTime(lastActiveAt)}` : 'غير متصل',
            color: 'var(--gray-500)'
        };
    }

    if ((isFreshInChat && !explicitOutOfChat) || (explicitInChat && isFreshOnline && !explicitOutOfChat)) {
        return {
            className: 'in-chat',
            text: 'متصل الآن في صفحة البلاغ',
            color: 'var(--success)'
        };
    }

    if (isFreshOnline || (explicitOnline && !isStaleExplicitOnline)) {
        return {
            className: 'active-app',
            text: locationText ? `متاح في التطبيق - ${locationText}` : 'متاح في التطبيق',
            color: 'var(--info)'
        };
    }

    return {
        className: 'offline',
        text: lastActiveAt ? `غير متصل - آخر ظهور ${formatTime(lastActiveAt)}` : 'غير متصل',
        color: 'var(--gray-500)'
    };
}

function formatFileSize(bytes) {
    if (!bytes) return '0 MB';
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(file) {
    const fromName = (file.name || '').split('.').pop();
    if (fromName && /^[a-z0-9]{2,5}$/i.test(fromName)) return fromName.toLowerCase();

    const knownTypes = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
        'video/mp4': 'mp4',
        'video/webm': 'webm',
        'video/quicktime': 'mov'
    };

    return knownTypes[file.type] || 'bin';
}

function getFileKind(file) {
    return inferAttachmentType({
        type: file.type,
        contentType: file.type,
        url: file.name
    });
}

function getFileContentType(file) {
    if (file.type) return file.type;

    const extension = getFileExtension(file);
    const knownTypes = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        gif: 'image/gif',
        heic: 'image/heic',
        mp4: 'video/mp4',
        webm: 'video/webm',
        mov: 'video/quicktime',
        m4v: 'video/mp4'
    };

    return knownTypes[extension] || 'application/octet-stream';
}

function getAttachmentButtons() {
    return [attachBtn].filter(Boolean);
}

function updateSendButtonState() {
    if (!sendBtn) return;

    const hasText = !!(messageInput && messageInput.value.trim());
    const canSubmit = editingMessageId !== null ? hasText : (hasText || !!selectedAttachmentFile);

    getAttachmentButtons().forEach(btn => {
        btn.disabled = isSendingMessage || editingMessageId !== null;
    });
    sendBtn.disabled = isSendingMessage || !canSubmit;

    const sendBtnSpan = sendBtn.querySelector('span');
    if (sendBtnSpan && !isSendingMessage) {
        sendBtnSpan.textContent = editingMessageId !== null ? 'حفظ التعديل' : 'إرسال';
    }
}

function setComposerLoading(isLoading) {
    isSendingMessage = isLoading;

    if (messageInput) messageInput.disabled = isLoading;
    if (attachmentInput) attachmentInput.disabled = isLoading;
    getAttachmentButtons().forEach(btn => {
        btn.disabled = isLoading || editingMessageId !== null;
    });

    const sendBtnSpan = sendBtn ? sendBtn.querySelector('span') : null;
    if (sendBtnSpan) sendBtnSpan.textContent = isLoading ? 'جارٍ الإرسال...' : (editingMessageId !== null ? 'حفظ التعديل' : 'إرسال');

    updateSendButtonState();
}

function clearSelectedAttachment(resetInput = true) {
    selectedAttachmentFile = null;
    selectedAttachmentKind = null;

    if (attachmentPreviewUrl) {
        URL.revokeObjectURL(attachmentPreviewUrl);
        attachmentPreviewUrl = null;
    }

    if (attachmentPreview) {
        attachmentPreview.innerHTML = '';
        attachmentPreview.style.display = 'none';
    }

    if (resetInput && attachmentInput) {
        attachmentInput.value = '';
    }

    updateSendButtonState();
}

function renderAttachmentPreview(file) {
    if (!attachmentPreview) return;

    if (attachmentPreviewUrl) {
        URL.revokeObjectURL(attachmentPreviewUrl);
    }

    attachmentPreviewUrl = URL.createObjectURL(file);
    const type = getFileKind(file);
    const preview = type === 'video'
        ? `<video class="attachment-preview-media-new" src="${attachmentPreviewUrl}" muted playsinline></video>`
        : `<img class="attachment-preview-media-new" src="${attachmentPreviewUrl}" alt="معاينة المرفق">`;

    attachmentPreview.innerHTML = `
        <div class="attachment-preview-content-new">
            ${preview}
            <div class="attachment-preview-info-new">
                <span class="attachment-preview-type-new">${type === 'video' ? 'فيديو جاهز للإرسال' : 'صورة جاهزة للإرسال'}</span>
                <span class="attachment-preview-name-new">${escapeHtml(file.name || (type === 'video' ? 'فيديو' : 'صورة'))}</span>
                <span class="attachment-preview-size-new">${formatFileSize(file.size)}</span>
            </div>
            <button type="button" class="attachment-remove-new" id="removeAttachmentBtn" title="إزالة المرفق">✕</button>
        </div>
    `;
    attachmentPreview.style.display = 'flex';

    const removeBtn = document.getElementById('removeAttachmentBtn');
    if (removeBtn) removeBtn.addEventListener('click', () => clearSelectedAttachment());
}

function handleAttachmentSelection(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const fileKind = getFileKind(file);
    const isSupported = fileKind === 'image' || fileKind === 'video';
    if (!isSupported) {
        showToast('❌ يمكن إرفاق الصور والفيديوهات فقط', true);
        clearSelectedAttachment();
        return;
    }

    if (file.size > MAX_ATTACHMENT_SIZE) {
        showToast(`❌ حجم الملف أكبر من ${formatFileSize(MAX_ATTACHMENT_SIZE)}`, true);
        clearSelectedAttachment();
        return;
    }

    selectedAttachmentFile = file;
    selectedAttachmentKind = fileKind;
    renderAttachmentPreview(file);
    updateSendButtonState();
}

function getActiveStorage() {
    return storage || (window.firebaseApp ? getStorage(window.firebaseApp) : null);
}

function getAttachmentBasePathCandidates(user) {
    const reportKey = sanitizeStorageSegment(user?.reportId || selectedUserId);
    const selectedKey = sanitizeStorageSegment(selectedUserId);
    const candidates = [];

    (user?.messages || currentMessages || []).forEach(message => {
        normalizeMessageAttachments(message).forEach(attachment => {
            if (attachment.path && attachment.path.includes('/')) {
                candidates.push(attachment.path.substring(0, attachment.path.lastIndexOf('/')));
            }
        });
    });

    candidates.push(
        `chat-attachments/${reportKey}`,
        `chat-attachments/${selectedKey}`,
        `reports/${reportKey}/attachments`,
        `attachments/${reportKey}`
    );

    return [...new Set(candidates.filter(Boolean))];
}

async function uploadBytesToFirstAllowedPath(activeStorage, file, user, fileName) {
    const contentType = getFileContentType(file);
    const basePathCandidates = getAttachmentBasePathCandidates(user);
    let lastError = null;

    for (const basePath of basePathCandidates) {
        const storagePath = `${basePath}/${fileName}`;
        const storageReference = ref(activeStorage, storagePath);

        try {
            const snapshot = await uploadBytes(storageReference, file, {
                contentType,
                customMetadata: {
                    sender: 'admin',
                    reportId: String(user.reportId || selectedUserId)
                }
            });
            return { snapshot, storagePath, contentType };
        } catch (error) {
            lastError = error;
            const code = error?.code || '';
            if (!code.includes('unauthorized') && !code.includes('permission-denied')) {
                throw error;
            }
        }
    }

    throw lastError || new Error('تعذر رفع المرفق إلى Storage');
}

async function uploadChatAttachment(file, user) {
    const activeStorage = getActiveStorage();
    if (!activeStorage) {
        throw new Error('Firebase Storage غير مهيأ');
    }

    const type = selectedAttachmentKind || getFileKind(file);
    const extension = getFileExtension(file);
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const fileName = `${type}-${uniqueId}.${extension}`;
    const { snapshot, storagePath, contentType } = await uploadBytesToFirstAllowedPath(activeStorage, file, user, fileName);

    const url = await getDownloadURL(snapshot.ref);

    return {
        type,
        url,
        name: file.name,
        path: storagePath,
        contentType,
        size: file.size
    };
}

function getAttachmentNotificationText(attachments) {
    if (!attachments || attachments.length === 0) return '';
    return attachments[0].type === 'video' ? 'تم إرسال فيديو من الدعم الفني' : 'تم إرسال صورة من الدعم الفني';
}

function getAttachmentMessageFields(attachments) {
    if (!attachments || attachments.length === 0) return {};

    const attachment = attachments[0];
    const isImage = attachment.type === 'image';
    const isVideo = attachment.type === 'video';

    return {
        attachment,
        file: attachment,
        media: [attachment],
        type: attachment.type,
        messageType: attachment.type,
        mediaType: attachment.type,
        fileType: attachment.type,
        attachmentType: attachment.type,
        url: attachment.url,
        mediaUrl: attachment.url,
        fileUrl: attachment.url,
        attachmentUrl: attachment.url,
        downloadURL: attachment.url,
        downloadUrl: attachment.url,
        name: attachment.name,
        mediaName: attachment.name,
        fileName: attachment.name,
        attachmentName: attachment.name,
        path: attachment.path,
        mediaPath: attachment.path,
        filePath: attachment.path,
        storagePath: attachment.path,
        contentType: attachment.contentType,
        mimeType: attachment.contentType,
        size: attachment.size,
        hasAttachment: true,
        isMedia: true,
        ...(isImage ? {
            imageUrl: attachment.url,
            imageName: attachment.name,
            imageType: attachment.contentType
        } : {}),
        ...(isVideo ? {
            videoUrl: attachment.url,
            videoName: attachment.name,
            videoType: attachment.contentType
        } : {})
    };
}

function getSendErrorMessage(error) {
    const code = error?.code || '';
    const message = error?.message || '';

    if (code.includes('unauthorized') || code.includes('permission-denied')) {
        return '❌ فشل الإرسال: صلاحيات Firebase لا تسمح بحفظ هذا المرفق';
    }

    if (code.includes('quota-exceeded')) {
        return '❌ فشل الإرسال: مساحة Storage ممتلئة أو تجاوزت الحد';
    }

    if (code.includes('canceled')) {
        return '❌ تم إلغاء رفع الملف';
    }

    if (message.includes('Firebase Storage غير مهيأ')) {
        return '❌ فشل الإرسال: Storage غير مهيأ في الصفحة';
    }

    return '❌ فشل إرسال الرد';
}

// ========== دوال الوضع المظلم ==========
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    if (theme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (themeToggleBtn) {
            const lightIcon = themeToggleBtn.querySelector('.theme-icon-light');
            const darkIcon = themeToggleBtn.querySelector('.theme-icon-dark');
            if (lightIcon) lightIcon.style.display = 'none';
            if (darkIcon) darkIcon.style.display = 'block';
        }
    } else {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if (themeToggleBtn) {
            const lightIcon = themeToggleBtn.querySelector('.theme-icon-light');
            const darkIcon = themeToggleBtn.querySelector('.theme-icon-dark');
            if (lightIcon) lightIcon.style.display = 'block';
            if (darkIcon) darkIcon.style.display = 'none';
        }
    }
    // إرسال الثيم للـ iframe (لوحة الإحصائيات)
    const iframe = document.getElementById('dashboardIframe');
    if (iframe && iframe.contentWindow) {
        try { iframe.contentWindow.postMessage({ type: 'SET_THEME', theme }, '*'); } catch(e) {}
    }
}

function toggleTheme() {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
}

// ========== دوال المستخدمين والمحادثات ==========
function getUserKey(user = {}) {
    return String(user.userId || user.uid || user.id || user.userEmail || user.email || user.reportId || '').trim();
}

function getAuthUid(user = {}) {
    return String(user.uid || user.authUid || user.firebaseUid || user.userId || '').trim();
}

function getDisplayName(user = {}) {
    return user.userName || user.displayName || user.name || user.fullName || user.userEmail || user.email || user.userId || user.uid || 'مستخدم مجهول';
}

function getUserEmail(user = {}) {
    return user.userEmail || user.email || user.accountEmail || '';
}

function isGuestUser(user = {}) {
    if (user.isGuest === true || user.isAnonymous === true) return true;
    if (user.isRegistered === false || user.registered === false) return true;

    const accountType = String(
        user.accountType || user.userType || user.authProvider || user.providerId || user.provider || ''
    ).toLowerCase();
    if (['guest', 'anonymous', 'guest_user', 'guestuser'].includes(accountType)) return true;

    const key = getUserKey(user);
    const docId = String(user.id || '').trim();
    if (key === 'guest' || docId === 'guest') return true;

    return false;
}

function getGuestKey(user = {}) {
    const candidates = [
        user.anonymousUid,
        user.guestId,
        user.id,
        user.sessionId,
        user.deviceId,
        user.installationId,
        user.uid,
        user.userId
    ].map(value => String(value || '').trim()).filter(Boolean);

    const realUid = candidates.find(value => value !== 'guest');
    if (realUid) return realUid;

    return candidates[0] || '';
}

function normalizeGuestDoc(docId, data = {}) {
    const id = String(docId || data.anonymousUid || data.guestId || '').trim();
    return {
        ...data,
        id: id || docId,
        guestId: id || docId,
        anonymousUid: data.anonymousUid || id || docId,
        isGuest: true
    };
}

function shouldIncludeAppUserAsGuest(user = {}) {
    if (isGuestUser(user)) return true;
    if (String(user.anonymousUid || '').trim() && String(user.anonymousUid).trim() !== 'guest') return true;
    if (user.isGuest === true || user.isAnonymous === true) return true;
    return false;
}

function mergeGuestIntoMap(merged, rawUser) {
    const key = getGuestKey(rawUser);
    if (!key) return;
    const existing = merged.get(key) || {};
    merged.set(key, { ...existing, ...rawUser, guestUserId: key, isGuest: true });
}

function buildGuestUsersList() {
    const merged = new Map();

    guestUsers.forEach(rawUser => mergeGuestIntoMap(merged, rawUser));

    appUsers.forEach(rawUser => {
        if (shouldIncludeAppUserAsGuest(rawUser)) mergeGuestIntoMap(merged, rawUser);
    });

    return [...merged.values()].sort((a, b) => {
        const activityA = getGuestLastSeenAt(a);
        const activityB = getGuestLastSeenAt(b);
        return activityB - activityA || getGuestDisplayName(a).localeCompare(getGuestDisplayName(b), 'ar');
    });
}

function formatGuestUid(uid = '') {
    const value = String(uid || '').trim();
    if (!value || value === 'guest') return 'بدون معرف';
    if (value.length <= 12) return value;
    return `${value.slice(0, 6)}…${value.slice(-4)}`;
}

function getGuestDisplayName(user = {}) {
    return 'مستخدم ضيف';
}

function getGuestSubtitle(user = {}) {
    const key = getGuestKey(user);
    const version = getAppVersion(user);
    const parts = [];
    if (key && key !== 'guest') parts.push(formatGuestUid(key));
    if (version) parts.push(`v${version}`);
    return parts.join(' • ') || 'غير مسجل';
}

function getGuestFirstSeenAt(user = {}) {
    const keys = ['createdAt', 'firstSeenAt', 'firstOpenAt', 'registeredAt', 'joinedAt'];
    return Math.max(...keys.map(key => toMillis(readUserValue(user, [key]))), 0);
}

function getGuestLastSeenAt(user = {}) {
    return getLastActivityAt(user);
}

function getGuestPresenceState(user = {}) {
    const lastSeenAt = getGuestLastSeenAt(user);
    const now = Date.now();

    if (!lastSeenAt) {
        return { className: 'offline', text: 'لا يوجد آخر ظهور' };
    }

    const diff = now - lastSeenAt;
    if (diff <= ONLINE_HEARTBEAT_TIMEOUT) {
        return { className: 'active-app', text: 'متصل الآن' };
    }
    if (diff <= 86400000) {
        return { className: 'active-app', text: `نشط اليوم - ${formatTime(lastSeenAt)}` };
    }

    return { className: 'offline', text: `آخر ظهور ${formatInactiveSince(lastSeenAt)}` };
}

function buildAllMergedUsers() {
    const merged = new Map();

    [...appUsers, ...allUsers].forEach(rawUser => {
        const key = getUserKey(rawUser);
        if (!key) return;
        const existing = merged.get(key) || {};
        merged.set(key, { ...existing, ...rawUser, notificationUserId: key });
    });

    return [...merged.values()].sort((a, b) => {
        const usageA = getUsageStats(a).daily;
        const usageB = getUsageStats(b).daily;
        return usageB - usageA || getDisplayName(a).localeCompare(getDisplayName(b), 'ar');
    });
}

function findUsersByKey(userKey) {
    return {
        reports: allUsers.filter(user => getUserKey(user) === userKey),
        appUser: appUsers.find(user => getUserKey(user) === userKey)
    };
}

function getFcmTokens(user = {}) {
    const tokens = [];
    [
        user.fcmToken,
        user.fcm_token,
        user.messagingToken,
        user.notificationToken,
        user.deviceToken,
        user.pushToken,
        user.tokens,
        user.fcmTokens,
        user.notificationTokens
    ].forEach(value => {
        if (Array.isArray(value)) tokens.push(...value);
        else if (value && typeof value === 'object') tokens.push(...Object.values(value));
        else if (typeof value === 'string') tokens.push(value);
    });

    return [...new Set(tokens.filter(Boolean))];
}

function readUsageValue(user = {}, keys = []) {
    for (const key of keys) {
        const value = user[key] ?? user.usageStats?.[key] ?? user.analytics?.[key] ?? user.activity?.[key];
        if (typeof value === 'number') return value;
        if (typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))) return Number(value);
    }
    return 0;
}

function getUsageStats(user = {}) {
    return {
        daily: readUsageValue(user, ['dailyUsageMinutes', 'avgDailyUsageMinutes', 'dailyAverageMinutes', 'todayUsageMinutes', 'usageTodayMinutes']),
        weekly: readUsageValue(user, ['weeklyUsageMinutes', 'avgWeeklyUsageMinutes', 'weeklyAverageMinutes', 'weekUsageMinutes']),
        monthly: readUsageValue(user, ['monthlyUsageMinutes', 'avgMonthlyUsageMinutes', 'monthlyAverageMinutes', 'monthUsageMinutes'])
    };
}

function readUserValue(user = {}, keys = []) {
    const sources = [user, user.presence, user.userPresence, user.statusInfo, user.deviceInfo, user.app, user.appInfo, user.analytics, user.activity, user.usageStats];
    for (const source of sources) {
        if (!source || typeof source !== 'object') continue;
        for (const key of keys) {
            const value = source[key];
            if (value !== undefined && value !== null && String(value).trim() !== '') return value;
        }
    }
    return '';
}

function getAppVersion(user = {}) {
    return String(readUserValue(user, [
        'appVersion',
        'app_version',
        'applicationVersion',
        'application_version',
        'version',
        'buildVersion',
        'build_version',
        'buildNumber',
        'build_number',
        'clientVersion',
        'client_version',
        'appBuild',
        'app_build'
    ]) || '').trim();
}

function getLastActivityAt(user = {}) {
    const keys = [
        'presenceUpdatedAt',
        'lastSeen',
        'lastSeenAt',
        'userLastSeen',
        'userLastActiveAt',
        'lastActive',
        'lastActiveAt',
        'lastLoginAt',
        'lastLogin',
        'lastUsedAt',
        'lastUseAt',
        'lastUsageAt',
        'lastAppOpenAt',
        'lastOpenedAt',
        'lastVisitAt',
        'lastVisitedAt',
        'lastOnlineAt',
        'lastConnectionAt',
        'lastConnectedAt',
        'lastSeenTime',
        'lastActiveTime',
        'lastUsedTime',
        'lastActivityTime',
        'activeAt',
        'seenAt',
        'heartbeatAt',
        'lastHeartbeatAt',
        'lastMessageTime',
        'timestamp',
        'updatedAt'
    ];

    return Math.max(...keys.map(key => toMillis(readUserValue(user, [key]))), 0);
}

function formatInactiveSince(timestamp) {
    if (!timestamp) return 'غير متوفر';

    const diff = Math.max(0, Date.now() - timestamp);
    const days = Math.floor(diff / 86400000);
    if (days <= 0) return 'اليوم';
    if (days === 1) return 'منذ يوم';
    if (days === 2) return 'منذ يومين';
    if (days < 7) return `منذ ${days} أيام`;

    const weeks = Math.floor(days / 7);
    if (days < 30) return weeks === 1 ? 'منذ أسبوع' : `منذ ${weeks} أسابيع`;

    const months = Math.floor(days / 30);
    return months === 1 ? 'منذ شهر' : `منذ ${months} أشهر`;
}

function getCustomInactivityRangeDays() {
    const value = Math.max(1, Number(usersCustomInactivityValue?.value || 1));
    const unit = usersCustomInactivityUnit ? usersCustomInactivityUnit.value : 'days';
    if (unit === 'weeks') return { min: value * 7, max: (value + 1) * 7 };
    if (unit === 'months') return { min: value * 30, max: (value + 1) * 30 };
    return { min: value, max: value + 1 };
}

function getInactivityFilterRangeDays() {
    const value = usersInactivityFilter ? usersInactivityFilter.value : 'all';
    if (value === 'custom') return getCustomInactivityRangeDays();
    if (value === '1') return { min: 1, max: 2 };
    if (value === '2') return { min: 2, max: 3 };
    if (value === '7') return { min: 7, max: 14 };
    if (value === '30') return { min: 30, max: 60 };
    const days = Number(value);
    return Number.isFinite(days) && days > 0 ? { min: days, max: days + 1 } : null;
}

function updateCustomInactivityVisibility() {
    if (!usersCustomInactivityWrap || !usersInactivityFilter) return;
    usersCustomInactivityWrap.classList.toggle('hidden', usersInactivityFilter.value !== 'custom');
}

function getActiveNotificationFiltersCount() {
    let count = 0;
    if (usersPresenceFilter && usersPresenceFilter.value !== 'all') count += 1;
    if (usersAppVersionFilter && usersAppVersionFilter.value !== 'all') count += 1;
    if (usersInactivityFilter && usersInactivityFilter.value !== 'all') count += 1;
    return count;
}

function updateAdvancedFiltersUI() {
    const count = getActiveNotificationFiltersCount();
    if (usersAdvancedFiltersBtn) {
        usersAdvancedFiltersBtn.classList.toggle('active', count > 0);
        usersAdvancedFiltersBtn.setAttribute('aria-expanded', usersAdvancedFilters && !usersAdvancedFilters.classList.contains('hidden') ? 'true' : 'false');
    }
    if (usersActiveFiltersCount) {
        usersActiveFiltersCount.textContent = count ? String(count) : '';
        usersActiveFiltersCount.style.display = count ? 'inline-flex' : 'none';
    }
    if (usersClearFiltersBtn) usersClearFiltersBtn.disabled = count === 0;
}

function toggleAdvancedFilters() {
    if (!usersAdvancedFilters) return;
    usersAdvancedFilters.classList.toggle('hidden');
    updateAdvancedFiltersUI();
}

function resetNotificationFilters() {
    if (usersPresenceFilter) usersPresenceFilter.value = 'all';
    if (usersAppVersionFilter) usersAppVersionFilter.value = 'all';
    if (usersInactivityFilter) usersInactivityFilter.value = 'all';
    if (usersCustomInactivityValue) usersCustomInactivityValue.value = '1';
    if (usersCustomInactivityUnit) usersCustomInactivityUnit.value = 'days';
    renderNotificationUsers();
}

function formatUsage(minutes) {
    if (!minutes) return 'غير متوفر';
    if (minutes < 60) return `${Math.round(minutes)} د`;
    const hours = Math.floor(minutes / 60);
    const rest = Math.round(minutes % 60);
    return rest ? `${hours} س ${rest} د` : `${hours} س`;
}

function buildNotificationUsers() {
    return buildAllMergedUsers().filter(user => !isGuestUser(user));
}

function syncAppVersionFilterOptions(users = buildNotificationUsers()) {
    if (!usersAppVersionFilter) return;

    const currentValue = usersAppVersionFilter.value || 'all';
    const versions = [...new Set(users.map(getAppVersion).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    usersAppVersionFilter.innerHTML = [
        '<option value="all">كل الإصدارات</option>',
        '<option value="unknown">بدون إصدار</option>',
        ...versions.map(version => `<option value="${escapeAttribute(version)}">${escapeHtml(version)}</option>`)
    ].join('');

    usersAppVersionFilter.value = [...versions, 'all', 'unknown'].includes(currentValue) ? currentValue : 'all';
}

function getFilteredNotificationUsers() {
    const search = usersSearchInput ? usersSearchInput.value.trim().toLowerCase() : '';
    const presenceFilter = usersPresenceFilter ? usersPresenceFilter.value : 'all';
    const appVersionFilter = usersAppVersionFilter ? usersAppVersionFilter.value : 'all';
    const inactivityFilter = usersInactivityFilter ? usersInactivityFilter.value : 'all';
    const inactivityRangeDays = getInactivityFilterRangeDays();

    return buildNotificationUsers().filter(user => {
        const appVersion = getAppVersion(user);
        const lastActivityAt = getLastActivityAt(user);
        const inactiveDays = lastActivityAt ? (Date.now() - lastActivityAt) / 86400000 : 0;
        const text = `${getDisplayName(user)} ${getUserEmail(user)} ${getUserKey(user)} ${appVersion}`.toLowerCase();
        const presence = getPresenceState(user);
        const matchesPresence =
            presenceFilter === 'all' ||
            (presenceFilter === 'online' && presence.className !== 'offline') ||
            (presenceFilter === 'offline' && presence.className === 'offline');
        const matchesVersion =
            appVersionFilter === 'all' ||
            (appVersionFilter === 'unknown' && !appVersion) ||
            appVersion === appVersionFilter;
        const matchesInactivity =
            inactivityFilter === 'all' ||
            (inactivityFilter === 'never' && !lastActivityAt) ||
            (inactivityRangeDays && lastActivityAt > 0 && inactiveDays >= inactivityRangeDays.min && inactiveDays < inactivityRangeDays.max);

        return text.includes(search) && matchesPresence && matchesVersion && matchesInactivity;
    });
}

function populateSettingsAccount() {
    const user = auth().currentUser;
    if (!user) return;

    if (accountEmail) accountEmail.textContent = user.email || '—';
    if (accountUsername) accountUsername.textContent = user.displayName || '—';
    if (accountCreatedDate && user.metadata?.creationTime) {
        accountCreatedDate.textContent = new Date(user.metadata.creationTime).toLocaleDateString('ar-SA');
    }
    if (settingsEmailValue) settingsEmailValue.textContent = user.email || '—';
}

function resetPasswordForm() {
    if (currentPassword) currentPassword.value = '';
    if (newPassword) newPassword.value = '';
    if (confirmNewPassword) confirmNewPassword.value = '';
    if (passwordChangeError) passwordChangeError.style.display = 'none';
}

function scrollSettingsNavToActive() {
    const activeItem = document.querySelector('.settings-nav-item.active');
    if (!activeItem) return;

    requestAnimationFrame(() => {
        activeItem.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
        });
    });
}

function setSettingsPanel(panel) {
    activeSettingsPanel = panel;

    document.querySelectorAll('.settings-nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.panel === panel);
    });

    document.querySelectorAll('.settings-panel-new').forEach(panelEl => {
        panelEl.classList.toggle('active', panelEl.dataset.panel === panel);
    });

    const settingsContent = document.getElementById('settingsContent');
    if (settingsContent) settingsContent.scrollTop = 0;

    scrollSettingsNavToActive();

    if (panel === 'account' || panel === 'email' || panel === 'hub') {
        populateSettingsAccount();
    }

    if (panel === 'password') {
        resetPasswordForm();
    }

    if (panel === 'shortcuts') {
        displayShortcuts();
    }
}

function openSettings(panel = 'hub') {
    setActiveView('settings');
    setSettingsPanel(panel);
}

function setActiveView(view) {
    activeView = view;
    const isUsers = view === 'users';
    const isDashboard = view === 'dashboard';
    const isSettings = view === 'settings';

    // إغلاق القائمة الجانبية تلقائياً عند تغيير الصفحة
    closeMobileSidebar();

    if (usersPage) usersPage.style.display = isUsers ? 'flex' : 'none';
    if (settingsPage) settingsPage.style.display = isSettings ? 'flex' : 'none';
    if (dashboardPage) {
        dashboardPage.style.display = isDashboard ? 'flex' : 'none';
        if (isDashboard) {
            const iframe = document.getElementById('dashboardIframe');
            if (iframe) {
                // تحميل الـ iframe مرة واحدة فقط عند أول فتح
                const currentSrc = iframe.getAttribute('data-loaded');
                if (!currentSrc) {
                    // إضافة cache-busting timestamp لمنع ظهور نسخة قديمة من الـ iframe
                    const cacheBuster = Date.now();
                    iframe.src = `dashboard/dashboard.html?v=${cacheBuster}`;
                    iframe.setAttribute('data-loaded', 'true');
                    // إرسال البيانات والثيم بعد تحميل الـ iframe
                    iframe.addEventListener('load', () => {
                        sendDataToDashboard();
                        // إرسال الثيم الحالي للـ iframe بعد التحميل
                        try { iframe.contentWindow.postMessage({ type: 'SET_THEME', theme: currentTheme || localStorage.getItem('theme') || 'light' }, '*'); } catch(e) {}
                    }, { once: true });
                } else {
                    // الـ iframe محمل بالفعل، أرسل البيانات والثيم مباشرة
                    sendDataToDashboard();
                    try { iframe.contentWindow.postMessage({ type: 'SET_THEME', theme: currentTheme || localStorage.getItem('theme') || 'light' }, '*'); } catch(e) {}
                }
            }
        }
    }
    
    const chatMain = document.querySelector('.chat-main');
    if (chatMain) chatMain.style.display = (isUsers || isDashboard || isSettings) ? 'none' : 'flex';
    
    if (chatViewBtn) chatViewBtn.classList.toggle('active', view === 'chat');
    if (usersViewBtn) usersViewBtn.classList.toggle('active', view === 'users');
    if (dashboardViewBtn) dashboardViewBtn.classList.toggle('active', view === 'dashboard');

    if (isSettings) {
        populateSettingsAccount();
    }
    
    if (isUsers) {
        if (activeUsersPanel === 'history') renderNotificationHistory();
        else if (activeUsersPanel === 'guests') renderGuestUsers();
        else renderNotificationUsers();
    }
}

// إرسال بيانات Firebase الحقيقية للـ iframe عبر postMessage
function sendDataToDashboard() {
    const iframe = document.getElementById('dashboardIframe');
    if (!iframe || !iframe.contentWindow) return;
    
    try {
        // تحويل بيانات المستخدمين لشكل قابل للإرسال (JSON-safe)
        const usersData = allUsers.map(u => {
            const obj = {};
            Object.keys(u).forEach(k => {
                const v = u[k];
                if (v && typeof v === 'object' && typeof v.toMillis === 'function') {
                    obj[k] = { _type: 'timestamp', millis: v.toMillis() };
                } else if (v && typeof v === 'object' && v.seconds !== undefined && v.nanoseconds !== undefined) {
                    obj[k] = { _type: 'timestamp', millis: v.seconds * 1000 };
                } else if (typeof v !== 'function') {
                    obj[k] = v;
                }
            });
            return obj;
        });
        
        const appUsersData = appUsers.map(u => {
            const obj = {};
            Object.keys(u).forEach(k => {
                const v = u[k];
                if (v && typeof v === 'object' && typeof v.toMillis === 'function') {
                    obj[k] = { _type: 'timestamp', millis: v.toMillis() };
                } else if (v && typeof v === 'object' && v.seconds !== undefined && v.nanoseconds !== undefined) {
                    obj[k] = { _type: 'timestamp', millis: v.seconds * 1000 };
                } else if (typeof v !== 'function') {
                    obj[k] = v;
                }
            });
            return obj;
        });
        
        iframe.contentWindow.postMessage({
            type: 'FIREBASE_DATA',
            users: appUsersData,
            reports: usersData
        }, '*');
        
        console.log('📤 تم إرسال البيانات للوحة الإحصائيات:', appUsersData.length, 'مستخدم،', usersData.length, 'تقرير');
    } catch (err) {
        console.warn('تعذر إرسال البيانات للـ iframe:', err);
    }
}

function loadUsers() {
    const q = query(collection(db(), COLLECTION_NAME));
    let retryCount = 0;
    const maxRetries = 3;
    
    const attemptLoad = () => {
        retryCount++;
        console.log(`📊 محاولة تحميل البيانات #${retryCount}...`);
        
        onSnapshot(q, async (snapshot) => {
            allUsers = [];
            console.log('📊 عدد التقارير:', snapshot.size);
            
            snapshot.forEach(doc => {
                const data = doc.data();
                const messages = data.messages || [];
                const lastMessage = messages[messages.length - 1];
                
                // طباعة البيانات الخام الأولى من Firebase فقط
                if (allUsers.length === 0) {
                    console.log('🔥 البيانات الخام الأولى من Firebase:', data);
                    console.log('🔍 هل توجد screenResolution؟', 'screenResolution' in data);
                    console.log('🔍 هل توجد androidVersion؟', 'androidVersion' in data);
                    console.log('🔍 هل توجد screenInches؟', 'screenInches' in data);
                    console.log('🔍 قائمة كاملة بالمفاتيح (المفاتيح الأولى 15):', Object.keys(data).slice(0, 15));
                }
                
                // التحقق من كل التقارير
                const reportNum = allUsers.length + 1;
                console.log(`📋 التقرير ${reportNum} - هل يحتوي على البيانات الجديدة؟`, {
                    reportId: data.reportId,
                    hasAndroidVersion: 'androidVersion' in data,
                    hasScreenResolution: 'screenResolution' in data,
                    hasScreenInches: 'screenInches' in data,
                    hasScreenDPI: 'screenDPI' in data,
                    hasScreenDP: 'screenDP' in data,
                    hasScreenDensity: 'screenDensity' in data
                });
                
                // طباعة البيانات الشاملة للتحقق من وجود معلومات الشاشة والجهاز
                if (data.screenResolution || data.screenInches || data.screenDPI || data.androidVersion) {
                    console.log('🖥️ بيانات جهاز محدثة للتقرير:', {
                        reportId: data.reportId,
                        screenResolution: data.screenResolution,
                        screenInches: data.screenInches,
                        screenDP: data.screenDP,
                        screenDPI: data.screenDPI,
                        screenDensity: data.screenDensity,
                        androidVersion: data.androidVersion
                    });
                }
                
                // طباعة أول 10 تقارير مع كل حقولها
                console.log(`📋 التقرير ${allUsers.length + 1}:`, {
                    reportId: data.reportId,
                    userName: data.userName,
                    android: data.androidVersion,
                    screen: data.screenResolution,
                    keyCount: Object.keys(data).length
                });
                
                allUsers.push({
                    id: doc.id,
                    ...data,
                    lastMessageText: getReportPreview(data, lastMessage),
                    lastMessageTime: lastMessage?.timestamp || data.timestamp || 0,
                    unreadCount: getUnreadCount(data, messages)
                });
            });
            
            // طباعة أول تقرير مع كل مفاتيحه
            if (allUsers.length > 0) {
                console.log('✅ عدد التقارير المحملة:', allUsers.length);
                console.log('📋 التقرير الأول - جميع المفاتيح:', Object.keys(allUsers[0]));
                console.log('📋 بيانات التقرير الأول:', allUsers[0]);
                
                // طباعة المفاتيح الجديدة بشكل صريح
                const firstReport = allUsers[0];
                console.log('🆕 المفاتيح الجديدة - قيم مباشرة:');
                console.log('  androidVersion:', firstReport.androidVersion);
                console.log('  screenResolution:', firstReport.screenResolution);
                console.log('  screenInches:', firstReport.screenInches);
                console.log('  screenDP:', firstReport.screenDP);
                console.log('  screenDPI:', firstReport.screenDPI);
                console.log('  screenDensity:', firstReport.screenDensity);
            }
            
            allUsers.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
            selectedConversationIds.forEach(id => {
                if (!allUsers.some(user => user.id === id)) selectedConversationIds.delete(id);
            });
            
            if (usersCountSpan) usersCountSpan.textContent = allUsers.length;
            if (totalTicketsSpan) totalTicketsSpan.textContent = allUsers.filter(u => u.status !== 'Solved').length;
            if (conversationsCountSpan) conversationsCountSpan.textContent = allUsers.filter(u => !u.archived).length;
            
            renderUsersList();
            if (activeView === 'users') renderNotificationUsers();
            // إرسال البيانات المحدّثة للوحة الإحصائيات إذا كانت مفتوحة
            if (activeView === 'dashboard') sendDataToDashboard();
            
            if (allUsers.length === 0) {
                console.warn('⚠️ لا توجد بيانات في قاعدة البيانات بعد!');
            }
        }, (error) => {
            console.error(`❌ خطأ في تحميل البيانات (محاولة #${retryCount}):`, error);
            
            // محاولة إعادة الاتصال إذا كانت هناك محاولات متبقية
            if (retryCount < maxRetries) {
                console.log(`⏳ محاولة إعادة الاتصال بعد 3 ثواني... (${maxRetries - retryCount} محاولات متبقية)`);
                setTimeout(attemptLoad, 3000);
            } else {
                showToast('❌ فشل الاتصال بـ Firebase بعد ' + maxRetries + ' محاولات. تأكد من الاتصال بالإنترنت.', true);
            }
        });
    };
    
    // بدء المحاولة الأولى
    attemptLoad();
}

function loadAppUsers() {
    const q = query(collection(db(), USERS_COLLECTION_NAME));
    let retryCount = 0;
    const maxRetries = 2;

    const attemptLoad = () => {
        retryCount++;
        console.log(`👥 محاولة تحميل بيانات المستخدمين #${retryCount}...`);

        onSnapshot(q, (snapshot) => {
            appUsers = [];
            snapshot.forEach(userDoc => {
                appUsers.push({
                    id: userDoc.id,
                    uid: userDoc.id,
                    ...userDoc.data()
                });
            });

            selectedNotificationUserIds.forEach(id => {
                if (!buildNotificationUsers().some(user => getUserKey(user) === id)) selectedNotificationUserIds.delete(id);
            });

            if (guestUsersCountBadge) guestUsersCountBadge.textContent = buildGuestUsersList().length;
            refreshGuestUsersUI();
            if (activeView === 'users' && activeUsersPanel !== 'guests') {
                renderNotificationUsers();
            }
            // إرسال البيانات المحدّثة للوحة الإحصائيات إذا كانت مفتوحة
            if (activeView === 'dashboard') sendDataToDashboard();
        }, (error) => {
            console.warn(`تعذر تحميل مجموعة users (محاولة #${retryCount}):`, error);
            
            // محاولة إعادة الاتصال إذا كانت هناك محاولات متبقية
            if (retryCount < maxRetries) {
                console.log(`⏳ محاولة إعادة الاتصال بعد 2 ثانية... (${maxRetries - retryCount} محاولات متبقية)`);
                setTimeout(attemptLoad, 2000);
            }
        });
    };

    attemptLoad();
}

function refreshGuestUsersUI() {
    const count = buildGuestUsersList().length;
    if (guestUsersCountBadge) guestUsersCountBadge.textContent = count;
    if (activeView === 'users') {
        if (activeUsersPanel === 'guests') renderGuestUsers();
        else updateUsersPageStats();
    }
}

async function fetchGuestUsersViaFunction() {
    if (!functions() || !httpsCallable) return null;

    try {
        const callable = httpsCallable(functions(), 'listGuestUsers');
        const result = await callable();
        const list = Array.isArray(result.data) ? result.data : [];
        return list.map(item => normalizeGuestDoc(item.id || item.anonymousUid, item));
    } catch (error) {
        console.warn('تعذر جلب الضيوف عبر Cloud Function:', error);
        return null;
    }
}

async function fetchGuestUsersDirectOnce() {
    if (!getDocs) return [];

    const snapshot = await getDocs(query(collection(db(), GUEST_USERS_COLLECTION_NAME)));
    return snapshot.docs.map(docSnap => normalizeGuestDoc(docSnap.id, docSnap.data()));
}

function applyGuestUsers(rawList = []) {
    guestUsers = rawList;
    guestUsersLoadError = null;
    console.log(`👤 تم تحديث قائمة الضيوف: ${guestUsers.length} مستند، ${buildGuestUsersList().length} بعد الدمج`);
    refreshGuestUsersUI();
}

async function reloadGuestUsersFallback(reason = '') {
    console.warn(`↻ محاولة جلب الضيوف بطرق بديلة${reason ? `: ${reason}` : ''}`);

    try {
        const directDocs = await fetchGuestUsersDirectOnce();
        if (directDocs.length > 0) {
            applyGuestUsers(directDocs);
            return true;
        }
    } catch (error) {
        console.warn('تعذر getDocs لـ guestUsers:', error);
    }

    const functionDocs = await fetchGuestUsersViaFunction();
    if (functionDocs && functionDocs.length > 0) {
        applyGuestUsers(functionDocs);
        return true;
    }

    return false;
}

function loadGuestUsers(force = false) {
    if (guestUsersListener) {
        guestUsersListener();
        guestUsersListener = null;
    }

    const q = query(collection(db(), GUEST_USERS_COLLECTION_NAME));
    let retryCount = 0;
    const maxRetries = 3;

    const attemptLoad = () => {
        retryCount++;
        console.log(`👤 محاولة تحميل بيانات الضيوف #${retryCount}...`);

        guestUsersListener = onSnapshot(q, async (snapshot) => {
            guestUsersLoadError = null;
            const loaded = [];
            snapshot.forEach(userDoc => {
                loaded.push(normalizeGuestDoc(userDoc.id, userDoc.data()));
            });

            console.log(`✅ guestUsers snapshot: ${loaded.length} مستند`);
            applyGuestUsers(loaded);

            if (loaded.length === 0 && retryCount === 1) {
                await reloadGuestUsersFallback('المجموعة فارغة');
            }
        }, async (error) => {
            guestUsersLoadError = error;
            console.warn(`تعذر تحميل مجموعة guestUsers (محاولة #${retryCount}):`, error);

            const recovered = await reloadGuestUsersFallback(error.code || error.message);
            if (recovered) return;

            if (retryCount < maxRetries) {
                setTimeout(attemptLoad, 2000);
                return;
            }

            refreshGuestUsersUI();
        });
    };

    attemptLoad();

    if (force) {
        reloadGuestUsersFallback('تحديث يدوي');
    }
}

function loadPageViews() {
    const q = query(collection(db(), 'pageViews'));
    let retryCount = 0;
    const maxRetries = 2;

    const attemptLoad = () => {
        retryCount++;
        console.log(`📊 محاولة تحميل بيانات PageViews #${retryCount}...`);

        onSnapshot(q, (snapshot) => {
            pageViewsData = [];
            snapshot.forEach(docSnap => {
                pageViewsData.push({
                    id: docSnap.id,
                    ...docSnap.data()
                });
            });
            // إرسال البيانات المحدّثة للوحة الإحصائيات إذا كانت مفتوحة
            if (activeView === 'dashboard') sendDataToDashboard();
        }, (error) => {
            console.warn(`تعذر تحميل مجموعة pageViews (محاولة #${retryCount}):`, error);
            
            // محاولة إعادة الاتصال إذا كانت هناك محاولات متبقية
            if (retryCount < maxRetries) {
                console.log(`⏳ محاولة إعادة الاتصال بعد 2 ثانية... (${maxRetries - retryCount} محاولات متبقية)`);
                setTimeout(attemptLoad, 2000);
            }
        });
    };

    attemptLoad();
}

function sortNotificationHistory(items = []) {
    return [...items].sort((a, b) => toMillis(b.createdAt || b.sentAt || b.processedAt) - toMillis(a.createdAt || a.sentAt || a.processedAt));
}

function applyNotificationHistorySnapshot(docs = []) {
    notificationHistory = sortNotificationHistory(docs.map(requestDoc => ({
        id: requestDoc.id,
        ...requestDoc.data()
    })));

    selectedNotificationHistoryIds.forEach(id => {
        if (!notificationHistory.some(item => item.id === id)) selectedNotificationHistoryIds.delete(id);
    });
    if (!notificationHistory.some(item => item.id === selectedNotificationHistoryId)) {
        selectedNotificationHistoryId = notificationHistory[0]?.id || null;
    }

    if (activeUsersPanel === 'history') {
        watchSelectedNotification(selectedNotificationHistoryId);
    }

    renderNotificationHistory();
}

function upsertNotificationHistoryItem(updatedItem = {}) {
    if (!updatedItem.id) return;
    const index = notificationHistory.findIndex(item => item.id === updatedItem.id);
    if (index >= 0) notificationHistory[index] = updatedItem;
    else notificationHistory.unshift(updatedItem);
    notificationHistory = sortNotificationHistory(notificationHistory);
}

function stopWatchingSelectedNotification() {
    if (selectedNotificationListener) selectedNotificationListener();
    selectedNotificationListener = null;
}

function watchSelectedNotification(notificationId) {
    stopWatchingSelectedNotification();
    if (!notificationId) return;

    selectedNotificationListener = onSnapshot(
        doc(db(), NOTIFICATION_REQUESTS_COLLECTION, notificationId),
        (snapshot) => {
            if (!snapshot.exists()) return;
            upsertNotificationHistoryItem({ id: snapshot.id, ...snapshot.data() });
            if (notificationsHistoryCount) notificationsHistoryCount.textContent = notificationHistory.length;
            if (activeUsersPanel !== 'history') return;
            renderNotificationHistoryDetails();
            renderNotificationHistoryListOnly();
        },
        (error) => console.warn('تعذر متابعة تحديثات الإشعار المحدد:', error)
    );
}

function renderNotificationHistoryListOnly() {
    if (!notificationsHistoryList) return;

    const history = getFilteredNotificationHistory();
    if (history.length === 0) return;

    notificationsHistoryList.innerHTML = history.map(item => {
        const recipients = getNotificationRecipients(item);
        const analytics = getNotificationAnalytics(item);
        const createdAt = formatNotificationDate(item.createdAt);
        const statusText = getNotificationStatusText(item.status);
        const checked = selectedNotificationHistoryIds.has(item.id);
        return `
            <div class="notification-history-card-new ${selectedNotificationHistoryId === item.id ? 'active' : ''} ${checked ? 'selected' : ''}" data-notification-id="${escapeAttribute(item.id)}">
                <label class="notification-history-check-new" title="تحديد الإشعار">
                    <input type="checkbox" class="notification-history-checkbox-new" data-notification-id="${escapeAttribute(item.id)}" ${checked ? 'checked' : ''}>
                </label>
                <div class="notification-history-card-content-new">
                    <div class="notification-history-card-head-new">
                        <strong>${escapeHtml(item.title || 'إشعار بدون عنوان')}</strong>
                        <span>${escapeHtml(statusText)}</span>
                    </div>
                    <p>${escapeHtml(item.body || 'لا يوجد نص محفوظ لهذا الإشعار')}</p>
                    <div class="notification-history-meta-new">
                        <span>${escapeHtml(createdAt)}</span>
                        <span>${recipients.length} مستلم</span>
                        <span>${analytics.openedCount} مفتوح</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    bindNotificationHistoryListEvents(history);
}

function getNotificationHistoryErrorMessage(error) {
    const code = String(error?.code || '').toLowerCase();
    if (code.includes('permission-denied')) {
        return 'تعذر قراءة سجل الإشعارات — أضف في Firestore Rules: <code>match /notificationRequests/{requestId} { allow read, write: if request.auth != null; }</code>';
    }
    return `تعذر تحميل سجل الإشعارات: ${escapeHtml(error?.message || 'خطأ غير معروف')}`;
}

async function refreshNotificationHistoryOnce() {
    try {
        const snapshot = await getDocs(query(collection(db(), NOTIFICATION_REQUESTS_COLLECTION), limit(200)));
        notificationHistoryLoadError = null;
        applyNotificationHistorySnapshot(snapshot.docs);
        return true;
    } catch (error) {
        console.warn('تعذر تحديث سجل الإشعارات يدوياً:', error);
        notificationHistoryLoadError = error;
        renderNotificationHistory();
        return false;
    }
}

function loadNotificationHistory() {
    if (notificationHistoryListener) notificationHistoryListener();

    const requestsRef = collection(db(), NOTIFICATION_REQUESTS_COLLECTION);
    const q = query(requestsRef, limit(200));

    notificationHistoryListener = onSnapshot(q, (snapshot) => {
        notificationHistoryLoadError = null;
        applyNotificationHistorySnapshot(snapshot.docs);

        snapshot.docChanges().forEach(change => {
            if (change.type !== 'modified') return;
            if (change.doc.id !== selectedNotificationHistoryId) return;
            if (activeUsersPanel !== 'history') return;
            renderNotificationHistoryDetails();
            renderNotificationHistoryListOnly();
        });
    }, (error) => {
        console.warn('تعذر تحميل سجل الإشعارات:', error);
        notificationHistoryLoadError = error;
        refreshNotificationHistoryOnce();
    });
}

function setUsersPanel(panel) {
    activeUsersPanel = panel;
    const isHistory = panel === 'history';
    const isGuests = panel === 'guests';
    const isSelection = panel === 'selection';

    if (usersSelectionView) usersSelectionView.style.display = isSelection ? 'grid' : 'none';
    if (guestsView) guestsView.style.display = isGuests ? 'flex' : 'none';
    if (notificationsHistoryView) notificationsHistoryView.style.display = isHistory ? 'grid' : 'none';
    if (usersToolsPanel) usersToolsPanel.style.display = isSelection ? '' : 'none';
    if (guestsToolsPanel) guestsToolsPanel.style.display = isGuests ? '' : 'none';

    if (usersSelectionTabBtn) usersSelectionTabBtn.classList.toggle('active', isSelection);
    if (guestUsersTabBtn) guestUsersTabBtn.classList.toggle('active', isGuests);
    if (notificationsHistoryTabBtn) notificationsHistoryTabBtn.classList.toggle('active', isHistory);

    updateUsersPageStats();

    if (isHistory) {
        watchSelectedNotification(selectedNotificationHistoryId);
        if (notificationHistoryLoadError || notificationHistory.length === 0) refreshNotificationHistoryOnce();
        renderNotificationHistory();
    }
    else if (isGuests) {
        stopWatchingSelectedNotification();
        loadGuestUsers(true);
        renderGuestUsers();
    }
    else {
        stopWatchingSelectedNotification();
        renderNotificationUsers();
    }
}

function updateUsersPageStats() {
    const isGuests = activeUsersPanel === 'guests';
    const isHistory = activeUsersPanel === 'history';
    const guestList = buildGuestUsersList();
    const registeredUsers = buildNotificationUsers();

    if (allUsersCount) {
        allUsersCount.textContent = isGuests ? guestList.length : registeredUsers.length;
    }
    if (usersPrimaryStatLabel) {
        usersPrimaryStatLabel.textContent = isGuests ? 'ضيف' : 'مستخدم';
    }
    if (usersSecondaryStatWrap) {
        usersSecondaryStatWrap.style.display = isSelectionPanelVisible() ? '' : 'none';
    }
    if (usersSecondaryStatLabel && notificationSelectedCount) {
        if (isGuests) {
            notificationSelectedCount.textContent = selectedGuestUserIds.size;
            usersSecondaryStatLabel.textContent = 'محدد';
        } else if (isHistory) {
            notificationSelectedCount.textContent = selectedNotificationHistoryIds.size;
            usersSecondaryStatLabel.textContent = 'محدد';
        } else {
            notificationSelectedCount.textContent = selectedNotificationUserIds.size;
            usersSecondaryStatLabel.textContent = 'محدد';
        }
    }
    if (guestUsersCountBadge) guestUsersCountBadge.textContent = guestList.length;
}

function isSelectionPanelVisible() {
    return activeUsersPanel === 'selection' || activeUsersPanel === 'guests';
}

function getGuestCustomInactivityRangeDays() {
    const value = guestsCustomInactivityValue ? Number(guestsCustomInactivityValue.value) : 1;
    if (!Number.isFinite(value) || value <= 0) return { min: 1, max: 2 };
    const unit = guestsCustomInactivityUnit ? guestsCustomInactivityUnit.value : 'days';
    if (unit === 'weeks') return { min: value * 7, max: (value + 1) * 7 };
    if (unit === 'months') return { min: value * 30, max: (value + 1) * 30 };
    return { min: value, max: value + 1 };
}

function getGuestInactivityRangeDays() {
    const value = guestsInactivityFilter ? guestsInactivityFilter.value : 'all';
    if (value === 'custom') return getGuestCustomInactivityRangeDays();
    if (value === '1') return { min: 1, max: 2 };
    if (value === '2') return { min: 2, max: 3 };
    if (value === '7') return { min: 7, max: 14 };
    if (value === '30') return { min: 30, max: 60 };
    const days = Number(value);
    return Number.isFinite(days) && days > 0 ? { min: days, max: days + 1 } : null;
}

function updateGuestCustomInactivityVisibility() {
    if (!guestsCustomInactivityWrap || !guestsInactivityFilter) return;
    guestsCustomInactivityWrap.classList.toggle('hidden', guestsInactivityFilter.value !== 'custom');
}

function getActiveGuestFiltersCount() {
    let count = 0;
    if (guestsPresenceFilter && guestsPresenceFilter.value !== 'all') count += 1;
    if (guestsAppVersionFilter && guestsAppVersionFilter.value !== 'all') count += 1;
    if (guestsInactivityFilter && guestsInactivityFilter.value !== 'all') count += 1;
    return count;
}

function updateGuestAdvancedFiltersUI() {
    const count = getActiveGuestFiltersCount();
    if (guestsAdvancedFiltersBtn) {
        guestsAdvancedFiltersBtn.classList.toggle('active', count > 0);
        guestsAdvancedFiltersBtn.setAttribute('aria-expanded', guestsAdvancedFilters && !guestsAdvancedFilters.classList.contains('hidden') ? 'true' : 'false');
    }
    if (guestsActiveFiltersCount) {
        guestsActiveFiltersCount.textContent = count ? String(count) : '';
        guestsActiveFiltersCount.style.display = count ? 'inline-flex' : 'none';
    }
    if (guestsClearFiltersBtn) guestsClearFiltersBtn.disabled = count === 0;
}

function toggleGuestAdvancedFilters() {
    if (!guestsAdvancedFilters) return;
    guestsAdvancedFilters.classList.toggle('hidden');
    updateGuestAdvancedFiltersUI();
}

function resetGuestFilters() {
    if (guestsPresenceFilter) guestsPresenceFilter.value = 'all';
    if (guestsAppVersionFilter) guestsAppVersionFilter.value = 'all';
    if (guestsInactivityFilter) guestsInactivityFilter.value = 'all';
    if (guestsCustomInactivityValue) guestsCustomInactivityValue.value = '1';
    if (guestsCustomInactivityUnit) guestsCustomInactivityUnit.value = 'days';
    renderGuestUsers();
}

function syncGuestVersionFilterOptions(users = buildGuestUsersList()) {
    if (!guestsAppVersionFilter) return;

    const currentValue = guestsAppVersionFilter.value || 'all';
    const versions = [...new Set(users.map(getAppVersion).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    guestsAppVersionFilter.innerHTML = [
        '<option value="all">كل الإصدارات</option>',
        '<option value="unknown">بدون إصدار</option>',
        ...versions.map(version => `<option value="${escapeAttribute(version)}">${escapeHtml(version)}</option>`)
    ].join('');

    guestsAppVersionFilter.value = [...versions, 'all', 'unknown'].includes(currentValue) ? currentValue : 'all';
}

function getFilteredGuestUsers() {
    const search = guestsSearchInput ? guestsSearchInput.value.trim().toLowerCase() : '';
    const presenceFilter = guestsPresenceFilter ? guestsPresenceFilter.value : 'all';
    const appVersionFilter = guestsAppVersionFilter ? guestsAppVersionFilter.value : 'all';
    const inactivityFilter = guestsInactivityFilter ? guestsInactivityFilter.value : 'all';
    const inactivityRangeDays = getGuestInactivityRangeDays();

    return buildGuestUsersList().filter(user => {
        const appVersion = getAppVersion(user);
        const lastSeenAt = getGuestLastSeenAt(user);
        const inactiveDays = lastSeenAt ? (Date.now() - lastSeenAt) / 86400000 : 0;
        const text = `${getGuestDisplayName(user)} ${getGuestKey(user)} ${appVersion} ${user.deviceModel || ''} ${user.platform || ''}`.toLowerCase();
        const presence = getGuestPresenceState(user);
        const matchesPresence =
            presenceFilter === 'all' ||
            (presenceFilter === 'online' && presence.className !== 'offline') ||
            (presenceFilter === 'offline' && presence.className === 'offline');
        const matchesVersion =
            appVersionFilter === 'all' ||
            (appVersionFilter === 'unknown' && !appVersion) ||
            appVersion === appVersionFilter;
        const matchesInactivity =
            inactivityFilter === 'all' ||
            (inactivityFilter === 'never' && !lastSeenAt) ||
            (inactivityRangeDays && lastSeenAt > 0 && inactiveDays >= inactivityRangeDays.min && inactiveDays < inactivityRangeDays.max);

        return text.includes(search) && matchesPresence && matchesVersion && matchesInactivity;
    });
}

function updateGuestSelectionUI(guests = null) {
    const visibleGuests = guests || getFilteredGuestUsers();
    const visibleIds = visibleGuests.map(user => getGuestKey(user));
    const selectedVisible = visibleIds.filter(id => selectedGuestUserIds.has(id)).length;

    updateUsersPageStats();
    if (deleteSelectedGuestsBtn) deleteSelectedGuestsBtn.disabled = selectedGuestUserIds.size === 0;
    if (selectAllGuestUsers) {
        selectAllGuestUsers.checked = visibleIds.length > 0 && selectedVisible === visibleIds.length;
        selectAllGuestUsers.indeterminate = selectedVisible > 0 && selectedVisible < visibleIds.length;
    }
}

function toggleSelectAllGuestUsers() {
    const guests = getFilteredGuestUsers();
    const shouldSelect = selectAllGuestUsers ? selectAllGuestUsers.checked : false;

    guests.forEach(user => {
        const key = getGuestKey(user);
        if (shouldSelect) selectedGuestUserIds.add(key);
        else selectedGuestUserIds.delete(key);
    });

    renderGuestUsers();
}

function updateGuestStats() {
    updateUsersPageStats();
}

function renderGuestDetails() {
    if (!guestUserDetails) return;

    if (!selectedGuestUserId) {
        guestUserDetails.innerHTML = '<div class="empty-user-details-new">اضغط على ضيف لعرض تفاصيله الكاملة.</div>';
        return;
    }

    const user = buildGuestUsersList().find(item => getGuestKey(item) === selectedGuestUserId);
    if (!user) {
        guestUserDetails.innerHTML = '<div class="empty-user-details-new">تعذر العثور على بيانات هذا الضيف.</div>';
        return;
    }

    const usage = getUsageStats(user);
    const presence = getGuestPresenceState(user);
    const lastSeenAt = getGuestLastSeenAt(user);
    const firstSeenAt = getGuestFirstSeenAt(user);
    const key = getGuestKey(user);
    const appVersion = getAppVersion(user);

    const detailRows = [
        ['معرف الضيف', key],
        ['Anonymous UID', user.anonymousUid || key],
        ['إصدار التطبيق', appVersion || 'غير متوفر'],
        ['الحالة', presence.text],
        ['آخر استخدام', lastSeenAt ? `${formatInactiveSince(lastSeenAt)} - ${new Date(lastSeenAt).toLocaleString('ar-SA')}` : 'غير متوفر'],
        ['أول ظهور', firstSeenAt ? new Date(firstSeenAt).toLocaleString('ar-SA') : 'غير متوفر']
    ].filter(([, value]) => value);

    guestUserDetails.innerHTML = `
        <div class="selected-user-card-new">
            <div class="selected-user-head-new">
                <div class="selected-user-avatar-new guest-avatar-new">${renderUserAvatar(user, 'ض')}</div>
                <div class="selected-user-title-new">
                    <h3>${escapeHtml(getGuestDisplayName(user))}</h3>
                    <p>${escapeHtml(getGuestSubtitle(user))}</p>
                </div>
            </div>
            <div class="guest-details-badge-new">حساب ضيف</div>
            <div class="selected-user-usage-new">
                <div><strong>${formatUsage(usage.daily)}</strong><span>يومي</span></div>
                <div><strong>${formatUsage(usage.weekly)}</strong><span>أسبوعي</span></div>
                <div><strong>${formatUsage(usage.monthly)}</strong><span>شهري</span></div>
            </div>
            <div class="selected-user-details-grid-new">
                ${detailRows.map(([label, value]) => `
                    <div><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderGuestUsers() {
    if (!guestsTableList) return;

    syncGuestVersionFilterOptions();
    updateGuestCustomInactivityVisibility();
    updateGuestAdvancedFiltersUI();
    updateGuestStats();

    if (guestUsersLoadError) {
        const isPermission = guestUsersLoadError.code === 'permission-denied';
        guestsTableList.innerHTML = `<div class="users-empty-new">${isPermission
            ? 'تعذر قراءة guestUsers — أضف في Firestore Rules: <code>allow read: if request.auth != null;</code> أو انشر Cloud Function listGuestUsers'
            : `تعذر تحميل بيانات الضيوف: ${escapeHtml(guestUsersLoadError.message || 'خطأ غير معروف')}`}</div>`;
        updateGuestSelectionUI([]);
        renderGuestDetails();
        return;
    }

    const guests = getFilteredGuestUsers();
    updateUsersPageStats();

    if (guests.length === 0) {
        const rawCount = guestUsers.length;
        const hint = rawCount > 0
            ? `تم تحميل ${rawCount} مستند لكن لا يطابق أي منها الفلاتر الحالية`
            : 'لا توجد بيانات ضيوف بعد — افتح التطبيق كضيف وتأكد من وجود مستندات في Firestore → guestUsers';
        guestsTableList.innerHTML = `<div class="users-empty-new">${hint}</div>`;
        updateGuestSelectionUI(guests);
        renderGuestDetails();
        return;
    }

    if (selectedGuestUserId && !guests.some(user => getGuestKey(user) === selectedGuestUserId)) {
        selectedGuestUserId = null;
    }

    guestsTableList.innerHTML = guests.map(user => {
        const key = getGuestKey(user);
        const usage = getUsageStats(user);
        const presence = getGuestPresenceState(user);
        const appVersion = getAppVersion(user);
        const lastSeenAt = getGuestLastSeenAt(user);
        const checked = selectedGuestUserIds.has(key);

        return `
            <div class="user-row-new guest-row-new ${selectedGuestUserId === key ? 'active' : ''}" data-guest-key="${escapeAttribute(key)}">
                <label class="user-row-check-new">
                    <input type="checkbox" class="guest-user-checkbox" data-guest-key="${escapeAttribute(key)}" ${checked ? 'checked' : ''}>
                </label>
                <div class="user-row-profile-new">
                    <div class="user-row-avatar-new guest-avatar-new">${renderUserAvatar(user, 'ض')}</div>
                    <div>
                        <strong>${escapeHtml(getGuestDisplayName(user))}</strong>
                        <span>${escapeHtml(getGuestSubtitle(user))}</span>
                    </div>
                </div>
                <div class="usage-pill-new" data-label="اليومي">${formatUsage(usage.daily)}</div>
                <div class="usage-pill-new" data-label="الأسبوعي">${formatUsage(usage.weekly)}</div>
                <div class="usage-pill-new" data-label="الشهري">${formatUsage(usage.monthly)}</div>
                <div class="usage-pill-new" data-label="الإصدار">${escapeHtml(appVersion || 'غير متوفر')}</div>
                <div class="usage-pill-new" data-label="آخر استخدام" title="${lastSeenAt ? escapeHtml(new Date(lastSeenAt).toLocaleString('ar-SA')) : ''}">${lastSeenAt ? formatInactiveSince(lastSeenAt) : 'غير متوفر'}</div>
                <div class="user-status-pill-new ${presence.className} status-tooltip-target" data-label="الحالة" data-full-status="${escapeAttribute(presence.text)}" aria-label="${escapeAttribute(presence.text)}">${escapeHtml(presence.text)}</div>
            </div>
        `;
    }).join('');

    updateGuestSelectionUI(guests);

    document.querySelectorAll('.guest-user-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', event => event.stopPropagation());
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) selectedGuestUserIds.add(checkbox.dataset.guestKey);
            else selectedGuestUserIds.delete(checkbox.dataset.guestKey);
            renderGuestUsers();
        });
    });

    document.querySelectorAll('.guest-row-new .user-row-check-new').forEach(area => {
        area.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            const checkbox = area.querySelector('.guest-user-checkbox');
            if (!checkbox) return;
            const guestKey = checkbox.dataset.guestKey;
            if (selectedGuestUserIds.has(guestKey)) {
                selectedGuestUserIds.delete(guestKey);
            } else {
                selectedGuestUserIds.add(guestKey);
            }
            renderGuestUsers();
        });
    });

    document.querySelectorAll('.guest-row-new').forEach(row => {
        row.addEventListener('click', () => {
            selectedGuestUserId = row.dataset.guestKey || null;
            renderGuestUsers();
        });
    });

    renderGuestDetails();
}

function getNotificationRecipients(notification = {}) {
    const recipients = Array.isArray(notification.recipients) ? notification.recipients : [];
    return recipients
        .map(recipient => typeof recipient === 'string' ? { userKey: recipient } : recipient)
        .filter(recipient => recipient && (recipient.userKey || recipient.userId || recipient.email || recipient.name));
}

function getRecipientKey(recipient = {}) {
    return String(recipient.userKey || recipient.userId || recipient.uid || recipient.email || '').trim();
}

function getRecipientTokensCount(recipient = {}) {
    if (Array.isArray(recipient.tokens)) return recipient.tokens.length;
    if (recipient.tokens && typeof recipient.tokens === 'object') return Object.values(recipient.tokens).filter(Boolean).length;
    if (typeof recipient.tokens === 'string' && recipient.tokens.trim()) return 1;
    return 0;
}

const NOTIFICATION_RETURN_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

function readTruthy(value) {
    if (value === true || value === 1) return true;
    if (value === false || value === 0 || value == null) return false;
    const normalized = String(value).trim().toLowerCase();
    return ['true', 'yes', '1', 'delivered', 'received', 'opened', 'clicked', 'sent', 'success', 'ok'].includes(normalized);
}

function getRecipientTokensList(recipient = {}) {
    if (Array.isArray(recipient.tokens)) return recipient.tokens.filter(Boolean);
    if (recipient.tokens && typeof recipient.tokens === 'object') return Object.values(recipient.tokens).filter(Boolean);
    if (typeof recipient.tokens === 'string' && recipient.tokens.trim()) return [recipient.tokens.trim()];
    return [];
}

function getRecipientStatsFromNotification(recipient = {}, notification = {}) {
    const key = getRecipientKey(recipient);
    const userId = String(recipient.userId || recipient.uid || '').trim();
    const email = String(recipient.email || '').trim();
    const maps = [
        notification.recipientStats,
        notification.recipientResults,
        notification.tracking,
        notification.recipientsStatus
    ];

    for (const map of maps) {
        if (!map || typeof map !== 'object') continue;
        const stats = map[key] || (userId && map[userId]) || (email && map[email]);
        if (stats) return stats;
    }
    return null;
}

function isRecipientListed(recipient = {}, list = []) {
    if (!Array.isArray(list)) return false;
    const key = getRecipientKey(recipient);
    const userId = String(recipient.userId || recipient.uid || '').trim();
    const email = String(recipient.email || '').trim();
    return list.some(item => item === key || item === userId || (email && item === email));
}

function getFailedTokensSet(notification = {}) {
    const failed = new Set();
    (Array.isArray(notification.errors) ? notification.errors : []).forEach(errorItem => {
        if (errorItem?.token) failed.add(errorItem.token);
    });
    return failed;
}

function isNotificationSent(notification = {}) {
    const status = String(notification.status || '').toLowerCase();
    return ['sent', 'done', 'completed', 'processing'].includes(status);
}

function readNotificationCount(notification = {}, keys = [], fallback = 0) {
    for (const key of keys) {
        const value = notification[key];
        if (typeof value === 'number' && Number.isFinite(value)) return value;
    }
    return fallback;
}

function getNotificationSentAt(notification = {}) {
    return toMillis(
        notification.sentAt || notification.sent_at || notification.deliveredAt ||
        notification.delivered_at || notification.processedAt || notification.createdAt
    );
}

function findNotificationUser(recipient = {}) {
    const key = getRecipientKey(recipient);
    if (!key) return null;
    return buildAllMergedUsers().find(user => getUserKey(user) === key) || null;
}

function inferRecipientDeliveryFromFcm(recipient = {}, notification = {}) {
    if (!isNotificationSent(notification)) return null;

    const tokens = getRecipientTokensList(recipient);
    const failedTokens = getFailedTokensSet(notification);
    const successCount = readNotificationCount(notification, ['successCount', 'sentCount', 'deliveredCount'], 0);

    if (tokens.length === 0) return 'no';
    if (tokens.some(token => !failedTokens.has(token))) return 'yes';
    if (tokens.every(token => failedTokens.has(token)) && failedTokens.size > 0) return 'no';
    if (successCount > 0 && failedTokens.size === 0) return 'yes';
    return null;
}

function inferRecipientStatusFromAggregate(recipient = {}, notification = {}, recipients = [], countKeys = []) {
    if (recipients.length !== 1) return null;
    const onlyRecipient = recipients[0];
    if (getRecipientKey(onlyRecipient) !== getRecipientKey(recipient)) return null;

    const count = readNotificationCount(notification, countKeys, 0);
    if (count > 0) return 'yes';
    if (isNotificationSent(notification)) return 'no';
    return null;
}

function getRecipientReceivedStatus(recipient = {}, notification = {}) {
    const stats = getRecipientStatsFromNotification(recipient, notification) || {};

    if (
        readTruthy(recipient.delivered) || readTruthy(recipient.received) || readTruthy(recipient.isDelivered) ||
        readTruthy(stats.delivered) || readTruthy(stats.received)
    ) return 'yes';

    if (
        recipient.delivered === false || recipient.received === false || recipient.isDelivered === false ||
        stats.delivered === false || stats.received === false
    ) return 'no';

    const status = String(recipient.status || recipient.deliveryStatus || stats.status || '').toLowerCase();
    if (['delivered', 'received', 'sent', 'success', 'ok'].includes(status)) return 'yes';
    if (['failed', 'error', 'undelivered', 'rejected', 'invalid'].includes(status)) return 'no';

    if (recipient.deliveredAt || recipient.receivedAt || recipient.delivered_at || stats.deliveredAt || stats.receivedAt) {
        return 'yes';
    }

    if (isRecipientListed(recipient, notification.deliveredBy || notification.deliveredUsers || notification.receivedBy)) {
        return 'yes';
    }

    const fcmStatus = inferRecipientDeliveryFromFcm(recipient, notification);
    if (fcmStatus) return fcmStatus;

    const recipients = getNotificationRecipients(notification);
    const aggregateStatus = inferRecipientStatusFromAggregate(
        recipient,
        notification,
        recipients,
        ['deliveredCount', 'delivered_count', 'receivedCount', 'received_count', 'successCount', 'sentCount']
    );
    if (aggregateStatus) return aggregateStatus;

    const notificationStatus = String(notification.status || '').toLowerCase();
    if (notificationStatus === 'pending' || notificationStatus === 'processing') return 'pending';
    if (notificationStatus === 'failed' || notificationStatus === 'error') return 'no';
    return 'unknown';
}

function getRecipientOpenedStatus(recipient = {}, notification = {}) {
    const stats = getRecipientStatsFromNotification(recipient, notification) || {};

    if (
        readTruthy(recipient.opened) || readTruthy(recipient.isOpened) || readTruthy(recipient.clicked) ||
        readTruthy(stats.opened) || readTruthy(stats.clicked)
    ) return 'yes';

    if (recipient.opened === false || recipient.isOpened === false || stats.opened === false) return 'no';

    const status = String(recipient.openStatus || recipient.clickStatus || stats.openStatus || stats.status || '').toLowerCase();
    if (['opened', 'clicked', 'open'].includes(status)) return 'yes';

    if (recipient.openedAt || recipient.opened_at || recipient.clickedAt || stats.openedAt || stats.clickedAt) {
        return 'yes';
    }

    if (isRecipientListed(recipient, notification.openedBy || notification.openedUsers || notification.clickedBy)) {
        return 'yes';
    }

    const recipients = getNotificationRecipients(notification);
    const aggregateStatus = inferRecipientStatusFromAggregate(
        recipient,
        notification,
        recipients,
        ['openedCount', 'opened_count', 'openCount', 'open_count', 'clickCount']
    );
    if (aggregateStatus) return aggregateStatus;

    const receivedStatus = getRecipientReceivedStatus(recipient, notification);
    if (receivedStatus === 'yes') return 'no';
    if (receivedStatus === 'pending') return 'pending';
    return 'unknown';
}

function getRecipientReturnedStatus(recipient = {}, notification = {}) {
    const stats = getRecipientStatsFromNotification(recipient, notification) || {};

    if (readTruthy(recipient.returned) || readTruthy(recipient.isReturned) || readTruthy(stats.returned)) return 'yes';
    if (recipient.returned === false || recipient.isReturned === false || stats.returned === false) return 'no';
    if (recipient.returnedAt || recipient.returned_at || stats.returnedAt) return 'yes';

    if (isRecipientListed(recipient, notification.returnedBy || notification.returnedUsers)) return 'yes';

    const sentAt = getNotificationSentAt(notification);
    if (!sentAt) return 'unknown';

    const user = findNotificationUser(recipient);
    if (!user) return 'unknown';

    const lastActivity = getLastActivityAt(user);
    if (lastActivity <= sentAt) return 'no';
    return lastActivity - sentAt <= NOTIFICATION_RETURN_WINDOW_MS ? 'yes' : 'no';
}

function countRecipientsByStatus(recipients = [], notification = {}, statusFn) {
    const counts = { yes: 0, no: 0, pending: 0, unknown: 0 };
    recipients.forEach(recipient => {
        const status = statusFn(recipient, notification);
        counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
}

function getNotificationAnalytics(notification = {}) {
    const recipients = getNotificationRecipients(notification);
    const targetCount = notification.recipientCount || recipients.length;
    const receivedCounts = countRecipientsByStatus(recipients, notification, getRecipientReceivedStatus);
    const openedCounts = countRecipientsByStatus(recipients, notification, getRecipientOpenedStatus);
    const returnedCounts = countRecipientsByStatus(recipients, notification, getRecipientReturnedStatus);

    const sentCount = readNotificationCount(notification, ['sentCount', 'sent_count', 'successCount'], 0) ||
        receivedCounts.yes + receivedCounts.no ||
        (isNotificationSent(notification) ? targetCount : 0);
    const deliveredCount = Math.max(
        readNotificationCount(notification, ['deliveredCount', 'delivered_count', 'receivedCount', 'received_count', 'successCount'], 0),
        receivedCounts.yes
    );
    const openedCount = Math.max(
        readNotificationCount(notification, ['openedCount', 'opened_count', 'openCount', 'open_count'], 0),
        openedCounts.yes
    );
    const returnedCount = Math.max(
        readNotificationCount(notification, ['returnedCount', 'returned_count'], 0),
        returnedCounts.yes
    );

    return {
        targetCount,
        sentCount,
        deliveredCount,
        notDeliveredCount: Math.max(0, targetCount - deliveredCount),
        openedCount,
        notOpenedCount: Math.max(0, deliveredCount - openedCount),
        returnedCount,
        receivedCounts,
        openedCounts,
        returnedCounts,
        sentAt: getNotificationSentAt(notification),
        deliveryRate: targetCount ? Math.round((deliveredCount / targetCount) * 100) : 0,
        openRate: deliveredCount ? Math.round((openedCount / deliveredCount) * 100) : 0,
        returnRate: targetCount ? Math.round((returnedCount / targetCount) * 100) : 0
    };
}

function renderNotificationStatusBadge(status = 'unknown', labels = {}) {
    const config = {
        yes: { text: labels.yes || 'نعم', className: 'success' },
        no: { text: labels.no || 'لا', className: 'danger' },
        pending: { text: labels.pending || 'بانتظار', className: 'pending' },
        unknown: { text: labels.unknown || 'غير متوفر', className: 'muted' }
    };
    const item = config[status] || config.unknown;
    return `<span class="notification-status-badge-new ${item.className}">${escapeHtml(item.text)}</span>`;
}

function getNotificationMetricIcon(type = '') {
    const icons = {
        sent: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>',
        delivered: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17L4 12"/></svg>',
        opened: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
        returned: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>'
    };
    return icons[type] || icons.sent;
}

function renderNotificationAnalyticsPanel(analytics = {}) {
    const metrics = [
        { type: 'sent', label: 'مُرسل', value: analytics.sentCount || analytics.targetCount, total: analytics.targetCount, tone: 'blue' },
        { type: 'delivered', label: 'تم استلامه', value: analytics.deliveredCount, total: analytics.targetCount, tone: 'green' },
        { type: 'opened', label: 'تم فتحه', value: analytics.openedCount, total: Math.max(analytics.deliveredCount, analytics.targetCount), tone: 'purple' },
        { type: 'returned', label: 'عاد للتطبيق', value: analytics.returnedCount, total: analytics.targetCount, tone: 'amber', hint: 'خلال 7 أيام' }
    ];

    return `
        <div class="notification-analytics-panel-new">
            <div class="notification-analytics-metrics-new">
                ${metrics.map(metric => {
                    const percent = metric.total ? Math.min(100, Math.round((metric.value / metric.total) * 100)) : 0;
                    return `
                        <div class="notification-analytics-metric-new tone-${metric.tone}">
                            <div class="notification-analytics-metric-top-new">
                                <span class="notification-analytics-icon-new">${getNotificationMetricIcon(metric.type)}</span>
                                <div>
                                    <span class="notification-analytics-label-new">${escapeHtml(metric.label)}</span>
                                    <div class="notification-analytics-value-new">
                                        <strong>${metric.value}</strong>
                                        <small>من ${metric.total}</small>
                                    </div>
                                </div>
                            </div>
                            <div class="notification-analytics-progress-new" aria-hidden="true">
                                <i style="width:${percent}%"></i>
                            </div>
                            ${metric.hint ? `<span class="notification-analytics-hint-new">${escapeHtml(metric.hint)}</span>` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="notification-analytics-rates-new">
                <div class="notification-analytics-rate-new">
                    <span>معدل الاستلام</span>
                    <strong>${analytics.deliveryRate}%</strong>
                </div>
                <div class="notification-analytics-rate-new">
                    <span>معدل الفتح</span>
                    <strong>${analytics.openRate}%</strong>
                </div>
                <div class="notification-analytics-rate-new">
                    <span>معدل العودة</span>
                    <strong>${analytics.returnRate}%</strong>
                </div>
            </div>
        </div>
    `;
}

function renderNotificationRecipientCard(recipient = {}, notification = {}) {
    const key = getRecipientKey(recipient);
    const name = recipient.name || key || 'مستخدم';
    const subtitle = recipient.email || key || 'لا يوجد معرف';
    const initial = escapeHtml(name.trim().charAt(0) || 'م');
    const receivedStatus = getRecipientReceivedStatus(recipient, notification);
    const openedStatus = getRecipientOpenedStatus(recipient, notification);
    const returnedStatus = getRecipientReturnedStatus(recipient, notification);

    return `
        <div class="notification-recipient-card-new">
            <div class="notification-recipient-head-new">
                <div class="notification-recipient-avatar-new">${initial}</div>
                <div class="notification-recipient-info-new">
                    <strong>${escapeHtml(name)}</strong>
                    <span>${escapeHtml(subtitle)}</span>
                    <small>${getRecipientTokensCount(recipient)} رمز FCM</small>
                </div>
            </div>
            <div class="notification-recipient-statuses-new">
                <div class="notification-recipient-status-item-new">
                    <span>استلام</span>
                    ${renderNotificationStatusBadge(receivedStatus, { yes: 'تم الاستلام', no: 'لم يُستلم', pending: 'بانتظار', unknown: 'غير معروف' })}
                </div>
                <div class="notification-recipient-status-item-new">
                    <span>فتح</span>
                    ${renderNotificationStatusBadge(openedStatus, { yes: 'تم الفتح', no: 'لم يُفتح', pending: 'بانتظار', unknown: 'غير معروف' })}
                </div>
                <div class="notification-recipient-status-item-new">
                    <span>عودة</span>
                    ${renderNotificationStatusBadge(returnedStatus, { yes: 'عاد', no: 'لم يعد', unknown: 'غير معروف' })}
                </div>
            </div>
        </div>
    `;
}

function getNotificationSearchText(notification = {}) {
    const recipientsText = getNotificationRecipients(notification)
        .map(recipient => `${recipient.name || ''} ${recipient.email || ''} ${getRecipientKey(recipient)}`)
        .join(' ');
    return `${notification.title || ''} ${notification.body || ''} ${notification.link || ''} ${notification.createdBy || ''} ${recipientsText}`.toLowerCase();
}

function getFilteredNotificationHistory() {
    const search = notificationsHistorySearchInput ? notificationsHistorySearchInput.value.trim().toLowerCase() : '';
    return notificationHistory.filter(item => getNotificationSearchText(item).includes(search));
}

function formatNotificationDate(value) {
    const timestamp = toMillis(value);
    if (!timestamp) return 'وقت غير متوفر';
    return new Date(timestamp).toLocaleString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getNotificationStatusText(status = '') {
    const value = String(status || '').toLowerCase();
    if (value === 'sent' || value === 'done' || value === 'completed') return 'تم الإرسال';
    if (value === 'failed' || value === 'error') return 'فشل';
    if (value === 'processing') return 'قيد المعالجة';
    return 'بانتظار الإرسال';
}

function safeNotificationHref(link = '') {
    const value = String(link || '').trim();
    if (!value) return '';
    if (/^https?:\/\//i.test(value) || value.startsWith('/')) return value;
    return '';
}

function renderNotificationHistory() {
    if (notificationsHistoryCount) notificationsHistoryCount.textContent = notificationHistory.length;
    if (!notificationsHistoryList) {
        renderNotificationHistoryDetails();
        return;
    }

    if (notificationHistoryLoadError) {
        notificationsHistoryList.innerHTML = `<div class="users-empty-new">${getNotificationHistoryErrorMessage(notificationHistoryLoadError)}</div>`;
        if (notificationHistoryDetails) {
            notificationHistoryDetails.innerHTML = '<div class="empty-user-details-new">تعذر تحميل تفاصيل الإشعارات.</div>';
        }
        return;
    }

    const history = getFilteredNotificationHistory();
    if (history.length === 0) {
        notificationsHistoryList.innerHTML = '<div class="users-empty-new">لا توجد إشعارات مطابقة</div>';
        updateNotificationHistorySelectionUI(history);
        if (notificationHistoryDetails) {
            notificationHistoryDetails.innerHTML = '<div class="empty-user-details-new">لا توجد تفاصيل لعرضها مع البحث الحالي.</div>';
        }
        return;
    }

    if (!history.some(item => item.id === selectedNotificationHistoryId)) {
        selectedNotificationHistoryId = history[0]?.id || null;
        watchSelectedNotification(selectedNotificationHistoryId);
    }

    renderNotificationHistoryListOnly();
    updateNotificationHistorySelectionUI(history);
    renderNotificationHistoryDetails();
}

function bindNotificationHistoryListEvents(history = []) {
    document.querySelectorAll('.notification-history-card-new').forEach(card => {
        card.addEventListener('click', () => {
            selectedNotificationHistoryId = card.dataset.notificationId;
            watchSelectedNotification(selectedNotificationHistoryId);
            renderNotificationHistory();
        });
    });

    document.querySelectorAll('.notification-history-checkbox-new').forEach(checkbox => {
        checkbox.addEventListener('click', event => event.stopPropagation());
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) selectedNotificationHistoryIds.add(checkbox.dataset.notificationId);
            else selectedNotificationHistoryIds.delete(checkbox.dataset.notificationId);
            renderNotificationHistory();
        });
    });

    document.querySelectorAll('.notification-history-check-new').forEach(label => {
        label.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            const checkbox = label.querySelector('.notification-history-checkbox-new');
            if (!checkbox) return;
            const id = checkbox.dataset.notificationId;
            if (selectedNotificationHistoryIds.has(id)) selectedNotificationHistoryIds.delete(id);
            else selectedNotificationHistoryIds.add(id);
            renderNotificationHistory();
        });
    });
}

function updateNotificationHistorySelectionUI(visibleHistory = null) {
    const visible = visibleHistory || getFilteredNotificationHistory();
    const visibleIds = visible.map(item => item.id);
    const selectedVisible = visibleIds.filter(id => selectedNotificationHistoryIds.has(id)).length;

    if (selectedNotificationsCount) selectedNotificationsCount.textContent = selectedNotificationHistoryIds.size;
    if (deleteSelectedNotificationsBtn) deleteSelectedNotificationsBtn.disabled = selectedNotificationHistoryIds.size === 0;
    if (selectAllNotificationHistory) {
        selectAllNotificationHistory.checked = visibleIds.length > 0 && selectedVisible === visibleIds.length;
        selectAllNotificationHistory.indeterminate = selectedVisible > 0 && selectedVisible < visibleIds.length;
    }
}

function toggleSelectAllNotificationHistory() {
    const visible = getFilteredNotificationHistory();
    const shouldSelect = selectAllNotificationHistory ? selectAllNotificationHistory.checked : false;

    visible.forEach(item => {
        if (shouldSelect) selectedNotificationHistoryIds.add(item.id);
        else selectedNotificationHistoryIds.delete(item.id);
    });

    renderNotificationHistory();
}

async function deleteSelectedNotifications() {
    const ids = [...selectedNotificationHistoryIds].filter(id => notificationHistory.some(item => item.id === id));
    await deleteNotificationsByIds(ids);
}

async function deleteNotificationsByIds(ids = []) {
    ids = [...new Set(ids)].filter(id => notificationHistory.some(item => item.id === id));
    if (ids.length === 0) return;

    const confirmed = confirm(`هل تريد حذف ${ids.length} إشعار نهائياً من سجل الإشعارات؟ لا يمكن التراجع عن هذا الإجراء.`);
    if (!confirmed) return;

    try {
        if (deleteSelectedNotificationsBtn) deleteSelectedNotificationsBtn.disabled = true;
        await Promise.all(ids.map(id => deleteDoc(doc(db(), NOTIFICATION_REQUESTS_COLLECTION, id))));

        ids.forEach(id => selectedNotificationHistoryIds.delete(id));
        if (selectedNotificationHistoryId && ids.includes(selectedNotificationHistoryId)) {
            selectedNotificationHistoryId = notificationHistory.find(item => !ids.includes(item.id))?.id || null;
        }

        notificationHistory = notificationHistory.filter(item => !ids.includes(item.id));
        renderNotificationHistory();
        showToast(`تم حذف ${ids.length} إشعار`);
    } catch (error) {
        console.error('خطأ في حذف الإشعارات:', error);
        showToast('فشل حذف بعض الإشعارات', true);
    } finally {
        updateNotificationHistorySelectionUI();
    }
}

function renderNotificationHistoryDetails() {
    if (!notificationHistoryDetails) return;

    const item = notificationHistory.find(notification => notification.id === selectedNotificationHistoryId);
    if (!item) {
        notificationHistoryDetails.innerHTML = '<div class="empty-user-details-new">اختر إشعارًا لعرض مستلميه وتفاصيله.</div>';
        return;
    }

    const recipients = getNotificationRecipients(item);
    const analytics = getNotificationAnalytics(item);
    const safeLink = safeNotificationHref(item.link);
    const recipientRows = recipients.length
        ? recipients.map(recipient => renderNotificationRecipientCard(recipient, item)).join('')
        : '<div class="users-empty-new">لا توجد قائمة مستلمين محفوظة لهذا الإشعار</div>';

    notificationHistoryDetails.innerHTML = `
        <div class="notification-history-detail-head-new">
            <span>${escapeHtml(getNotificationStatusText(item.status))}</span>
            <h3>${escapeHtml(item.title || 'إشعار بدون عنوان')}</h3>
            <p>${escapeHtml(formatNotificationDate(item.createdAt))}</p>
        </div>
        <div class="notification-history-body-new">${escapeHtml(item.body || 'لا يوجد نص محفوظ لهذا الإشعار')}</div>
        <div class="notification-history-analytics-new">
            <div class="notification-history-analytics-head-new">
                <strong>إحصائيات الإشعار</strong>
                <span>${analytics.targetCount} مستلم</span>
            </div>
            ${renderNotificationAnalyticsPanel(analytics)}
        </div>
        ${item.link ? (safeLink ? `<a class="notification-history-link-new" href="${escapeAttribute(safeLink)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.link)}</a>` : `<div class="notification-history-link-new">${escapeHtml(item.link)}</div>`) : ''}
        <div class="notification-history-actions-new">
            <button type="button" data-history-action="add" data-notification-id="${escapeAttribute(item.id)}">إضافة المستلمين للتحديد</button>
            <button type="button" data-history-action="exclude" data-notification-id="${escapeAttribute(item.id)}">استثناء المستلمين</button>
            <button type="button" data-history-action="replace" data-notification-id="${escapeAttribute(item.id)}">تحديدهم فقط</button>
            <button type="button" class="danger" data-history-action="delete" data-notification-id="${escapeAttribute(item.id)}">حذف هذا الإشعار نهائياً</button>
        </div>
        <div class="notification-recipients-head-new">
            <strong>تفاصيل المستلمين</strong>
            <span>${recipients.length}</span>
        </div>
        <div class="notification-recipients-list-new">${recipientRows}</div>
    `;

    notificationHistoryDetails.querySelectorAll('[data-history-action]').forEach(button => {
        button.addEventListener('click', () => {
            if (button.dataset.historyAction === 'delete') {
                deleteNotificationsByIds([button.dataset.notificationId]);
                return;
            }
            applyNotificationHistorySelection(button.dataset.notificationId, button.dataset.historyAction);
        });
    });
}

function applyNotificationHistorySelection(notificationId, action) {
    const item = notificationHistory.find(notification => notification.id === notificationId);
    if (!item) return;

    const keys = getNotificationRecipients(item).map(getRecipientKey).filter(Boolean);
    if (keys.length === 0) {
        showToast('لا توجد مستلمين محفوظين لهذا الإشعار', true);
        return;
    }

    if (action === 'replace') selectedNotificationUserIds.clear();
    keys.forEach(key => {
        if (action === 'exclude') selectedNotificationUserIds.delete(key);
        else selectedNotificationUserIds.add(key);
    });

    renderNotificationUsers();
    updateNotificationSelectionUI();
    const actionText = action === 'exclude' ? 'استثناء' : (action === 'replace' ? 'تحديد' : 'إضافة');
    showToast(`تم ${actionText} ${keys.length} مستلم`);
}

function renderUsersList() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const isArchiveView = conversationsList && conversationsList.dataset.archiveView === 'true';
    const filteredUsers = allUsers.filter(user => {
        const searchText = (user.userName || user.userEmail || user.userId || '').toLowerCase();
        const matchesSearch = searchText.includes(searchTerm);
        
        // Filter by archive status
        if (isArchiveView) {
            return matchesSearch && user.archived === true;
        } else {
            return matchesSearch && user.archived !== true;
        }
    });
    
    if (!conversationsList) return;
    
    if (filteredUsers.length === 0) {
        const emptyMessage = isArchiveView ? 'لا يوجد محادثات في الأرشيف' : 'لا يوجد مستخدمين';
        conversationsList.innerHTML = `<div class="loading-state"><p>${emptyMessage}</p></div>`;
        updateBulkActionsUI(filteredUsers);
        return;
    }
    
    conversationsList.innerHTML = filteredUsers.map(user => {
        const displayName = user.userName || user.userEmail || user.userId || 'مستخدم مجهول';
        const isActive = selectedUserId === user.id;
        const presence = getPresenceState(user);
        const isChecked = selectedConversationIds.has(user.id);
        return `
            <div class="conversation-item-new ${isActive ? 'active' : ''} ${isChecked ? 'selected' : ''}" data-user-id="${user.id}">
                <label class="conversation-select-new" title="تحديد المحادثة">
                    <input type="checkbox" class="conversation-checkbox-new" data-user-id="${user.id}" ${isChecked ? 'checked' : ''}>
                    <span></span>
                </label>
                <div class="conversation-avatar-new">
                    ${renderUserAvatar(user, displayName)}
                    <span class="avatar-status-dot ${presence.className}" title="${escapeHtml(presence.text)}"></span>
                </div>
                <div class="conversation-content-new">
                    <div class="conversation-name-new">${escapeHtml(displayName)}</div>
                    <div class="conversation-preview-new">${escapeHtml(user.lastMessageText.substring(0, 40))}</div>
                </div>
                <div class="conversation-meta-new">
                    <div class="conversation-time-new">${formatTime(user.lastMessageTime)}</div>
                    ${user.unreadCount > 0 ? `<div class="unread-dot">${user.unreadCount > 99 ? '99+' : user.unreadCount}</div>` : ''}
                </div>
            </div>
        `;
    }).join('');

    updateBulkActionsUI(filteredUsers);
    
    document.querySelectorAll('.conversation-item-new').forEach(item => {
        item.addEventListener('click', () => {
            const userId = item.dataset.userId;
            selectUser(userId);
        });
    });

    document.querySelectorAll('.conversation-checkbox-new').forEach(checkbox => {
        checkbox.addEventListener('click', (event) => {
            event.stopPropagation();
        });
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                selectedConversationIds.add(checkbox.dataset.userId);
            } else {
                selectedConversationIds.delete(checkbox.dataset.userId);
            }
            renderUsersList();
        });
    });

    document.querySelectorAll('.conversation-select-new').forEach(label => {
        label.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const checkbox = label.querySelector('.conversation-checkbox-new');
            if (!checkbox) return;
            const userId = checkbox.dataset.userId;
            if (selectedConversationIds.has(userId)) {
                selectedConversationIds.delete(userId);
            } else {
                selectedConversationIds.add(userId);
            }
            renderUsersList();
        });
    });
}

function getVisibleConversationIds() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const isArchiveView = conversationsList && conversationsList.dataset.archiveView === 'true';
    return allUsers
        .filter(user => {
            const searchText = (user.userName || user.userEmail || user.userId || '').toLowerCase();
            const matchesSearch = searchText.includes(searchTerm);
            
            // Filter by archive status
            if (isArchiveView) {
                return matchesSearch && user.archived === true;
            } else {
                return matchesSearch && user.archived !== true;
            }
        })
        .map(user => user.id);
}

function updateBulkActionsUI(visibleUsers = null) {
    const visibleIds = visibleUsers ? visibleUsers.map(user => user.id) : getVisibleConversationIds();
    const selectedVisibleCount = visibleIds.filter(id => selectedConversationIds.has(id)).length;
    const selectedTotal = selectedConversationIds.size;

    if (selectedChatsCount) selectedChatsCount.textContent = selectedTotal;
    if (archivedChatsCount) archivedChatsCount.textContent = selectedTotal;
    if (deleteSelectedChatsBtn) deleteSelectedChatsBtn.disabled = selectedTotal === 0;
    if (archiveSelectedChatsBtn) archiveSelectedChatsBtn.disabled = selectedTotal === 0;
    if (selectAllConversations) {
        selectAllConversations.checked = visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;
        selectAllConversations.indeterminate = selectedVisibleCount > 0 && selectedVisibleCount < visibleIds.length;
    }
}

function toggleSelectAllConversations() {
    const visibleIds = getVisibleConversationIds();
    const shouldSelect = selectAllConversations ? selectAllConversations.checked : false;

    visibleIds.forEach(id => {
        if (shouldSelect) {
            selectedConversationIds.add(id);
        } else {
            selectedConversationIds.delete(id);
        }
    });
    renderUsersList();
}

function updateNotificationSelectionUI(users = null) {
    const visibleUsers = users || getFilteredNotificationUsers();
    const visibleIds = visibleUsers.map(user => getUserKey(user));
    const selectedVisible = visibleIds.filter(id => selectedNotificationUserIds.has(id)).length;

    updateUsersPageStats();
    if (sendNotificationBtn) sendNotificationBtn.disabled = selectedNotificationUserIds.size === 0;
    if (deleteSelectedUsersBtn) deleteSelectedUsersBtn.disabled = selectedNotificationUserIds.size === 0;
    if (selectAllNotificationUsers) {
        selectAllNotificationUsers.checked = visibleIds.length > 0 && selectedVisible === visibleIds.length;
        selectAllNotificationUsers.indeterminate = selectedVisible > 0 && selectedVisible < visibleIds.length;
    }
}

function renderNotificationUsers() {
    if (!usersTableList) return;

    syncAppVersionFilterOptions();
    updateCustomInactivityVisibility();
    updateAdvancedFiltersUI();

    const users = getFilteredNotificationUsers();
    if (users.length === 0) {
        usersTableList.innerHTML = '<div class="users-empty-new">لا توجد بيانات مستخدمين بعد</div>';
        updateNotificationSelectionUI(users);
        return;
    }

    usersTableList.innerHTML = users.map(user => {
        const key = getUserKey(user);
        const usage = getUsageStats(user);
        const presence = getPresenceState(user);
        const appVersion = getAppVersion(user);
        const lastActivityAt = getLastActivityAt(user);
        const checked = selectedNotificationUserIds.has(key);
        const tokensCount = getFcmTokens(user).length;

        return `
            <div class="user-row-new ${selectedNotificationUserId === key ? 'active' : ''}" data-user-key="${escapeAttribute(key)}">
                <label class="user-row-check-new">
                    <input type="checkbox" class="notification-user-checkbox" data-user-key="${escapeAttribute(key)}" ${checked ? 'checked' : ''}>
                </label>
                <div class="user-row-profile-new">
                    <div class="user-row-avatar-new">${renderUserAvatar(user, getDisplayName(user))}</div>
                    <div>
                        <strong>${escapeHtml(getDisplayName(user))}</strong>
                        <span>${escapeHtml(getUserEmail(user) || key)}</span>
                    </div>
                </div>
                <div class="usage-pill-new" data-label="اليومي">${formatUsage(usage.daily)}</div>
                <div class="usage-pill-new" data-label="الأسبوعي">${formatUsage(usage.weekly)}</div>
                <div class="usage-pill-new" data-label="الشهري">${formatUsage(usage.monthly)}</div>
                <div class="usage-pill-new" data-label="الإصدار">${escapeHtml(appVersion || 'غير متوفر')}</div>
                <div class="usage-pill-new" data-label="آخر استخدام" title="${lastActivityAt ? escapeHtml(new Date(lastActivityAt).toLocaleString('ar-SA')) : ''}">${formatInactiveSince(lastActivityAt)}</div>
                <div class="user-status-pill-new ${presence.className} status-tooltip-target" data-label="الحالة" data-full-status="${escapeAttribute(presence.text)}" aria-label="${escapeAttribute(presence.text)}">${escapeHtml(presence.text)}</div>
            </div>
        `;
    }).join('');

    updateNotificationSelectionUI(users);

    document.querySelectorAll('.notification-user-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', event => event.stopPropagation());
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) selectedNotificationUserIds.add(checkbox.dataset.userKey);
            else selectedNotificationUserIds.delete(checkbox.dataset.userKey);
            renderNotificationUsers();
        });
    });

    document.querySelectorAll('.user-row-check-new').forEach(area => {
        area.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            const checkbox = area.querySelector('.notification-user-checkbox');
            if (!checkbox) return;
            const userKey = checkbox.dataset.userKey;
            if (selectedNotificationUserIds.has(userKey)) {
                selectedNotificationUserIds.delete(userKey);
            } else {
                selectedNotificationUserIds.add(userKey);
            }
            renderNotificationUsers();
        });
    });

    document.querySelectorAll('.user-row-new').forEach(row => {
        row.addEventListener('click', () => {
            selectedNotificationUserId = row.dataset.userKey;
            renderNotificationUsers();
            renderSelectedUserDetails();
        });
    });
}

function renderSelectedUserDetails() {
    if (!selectedUserDetails) return;

    const user = buildNotificationUsers().find(item => getUserKey(item) === selectedNotificationUserId);
    if (!user) {
        selectedUserDetails.innerHTML = '<div class="empty-user-details-new">اضغط على مستخدم لعرض تفاصيله الكاملة.</div>';
        return;
    }

    const usage = getUsageStats(user);
    const tokens = getFcmTokens(user);
    const appVersion = getAppVersion(user);
    const lastActivityAt = getLastActivityAt(user);
    const screenDimensions = getScreenDimensions(user);
    const screenSize = getScreenSizeInInches(user);
    const screenDPI = getScreenDPI(user);
    const screenDP = getScreenDP(user);
    const screenDensity = getScreenDensity(user);
    const androidVersion = getAndroidVersion(user);
    
    // تصحيح: استخراج البيانات مباشرة من user object
    const actualScreenResolution = user.screenResolution || user.screen_resolution || screenDimensions;
    const actualScreenInches = user.screenInches || user.screen_inches || screenSize;
    const actualScreenDPI = user.screenDPI || user.screen_dpi || screenDPI;
    const actualScreenDP = user.screenDP || user.screen_dp || screenDP;
    const actualScreenDensity = user.screenDensity || user.screen_density || screenDensity;
    const actualAndroidVersion = user.androidVersion || user.android_version || androidVersion;
    
    console.log('📱 بيانات المستخدم:', {
        screenResolution: actualScreenResolution,
        screenInches: actualScreenInches,
        screenDPI: actualScreenDPI,
        screenDP: actualScreenDP,
        screenDensity: actualScreenDensity,
        androidVersion: actualAndroidVersion
    });
    
    const detailRows = [
        ['الاسم', getDisplayName(user)],
        ['البريد', getUserEmail(user)],
        ['معرف المستخدم', user.userId || user.uid],
        ['رقم آخر بلاغ', user.reportId],
        ['الجهاز', user.device],
        ['الصفحة الحالية', getUserLocationText(user)],
        ['إصدار الأندرويد', actualAndroidVersion],
        ['إصدار التطبيق', appVersion],
        ['ابعاد الشاشة (بكسل)', actualScreenResolution],
        ['حجم الشاشة', actualScreenInches],
        ['كثافة البكسل DPI', actualScreenDPI],
        ['وحدات DP', actualScreenDP],
        ['فئة الكثافة', actualScreenDensity],
        ['آخر استخدام', lastActivityAt ? `${formatInactiveSince(lastActivityAt)} - ${new Date(lastActivityAt).toLocaleString('ar-SA')}` : 'غير متوفر'],
        ['رموز FCM', tokens.length ? `${tokens.length} محفوظ` : 'غير متوفر'],
        ['متوسط يومي', formatUsage(usage.daily)],
        ['متوسط أسبوعي', formatUsage(usage.weekly)],
        ['متوسط شهري', formatUsage(usage.monthly)]
    ].filter(([, value]) => value);

    selectedUserDetails.innerHTML = `
        <div class="selected-user-head-new">
            <div class="selected-user-avatar-new">${renderUserAvatar(user, getDisplayName(user))}</div>
            <div class="selected-user-title-new">
                <h3>${escapeHtml(getDisplayName(user))}</h3>
                <p>${escapeHtml(getUserEmail(user) || getUserKey(user))}</p>
            </div>
            <button type="button" class="edit-user-name-btn-new" id="editSelectedUserNameBtn">تعديل الاسم</button>
        </div>
        <div class="selected-user-usage-new">
            <div><strong>${formatUsage(usage.daily)}</strong><span>يومي</span></div>
            <div><strong>${formatUsage(usage.weekly)}</strong><span>أسبوعي</span></div>
            <div><strong>${formatUsage(usage.monthly)}</strong><span>شهري</span></div>
        </div>
        <div class="selected-user-details-grid-new">
            ${detailRows.map(([label, value]) => `
                <div><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>
            `).join('')}
        </div>
    `;

    const editNameBtn = document.getElementById('editSelectedUserNameBtn');
    if (editNameBtn) {
        editNameBtn.addEventListener('click', () => editUserName(getUserKey(user)));
    }
}

async function editUserName(userKey) {
    const user = buildNotificationUsers().find(item => getUserKey(item) === userKey);
    if (!user) return;

    const currentName = getDisplayName(user);
    const newName = prompt('اكتب اسم المستخدم الجديد:', currentName);
    if (newName === null) return;

    const cleanName = newName.trim();
    if (!cleanName) {
        showToast('لا يمكن ترك الاسم فارغاً', true);
        return;
    }

    try {
        const { reports, appUser } = findUsersByKey(userKey);
        const updates = [];

        if (appUser?.id) {
            updates.push(updateDoc(doc(db(), USERS_COLLECTION_NAME, appUser.id), {
                userName: cleanName,
                displayName: cleanName,
                nameUpdatedAt: Date.now()
            }));
        }

        reports.forEach(report => {
            updates.push(updateDoc(doc(db(), COLLECTION_NAME, report.id), {
                userName: cleanName,
                displayName: cleanName,
                nameUpdatedAt: Date.now()
            }));
        });

        await Promise.all(updates);

        appUsers = appUsers.map(item => getUserKey(item) === userKey ? { ...item, userName: cleanName, displayName: cleanName } : item);
        allUsers = allUsers.map(item => getUserKey(item) === userKey ? { ...item, userName: cleanName, displayName: cleanName } : item);

        if (selectedUserId) {
            const selected = allUsers.find(item => item.id === selectedUserId);
            if (selected && getUserKey(selected) === userKey) {
                const userNameElem = document.getElementById('userName');
                if (userNameElem) userNameElem.textContent = cleanName;
            }
        }

        renderNotificationUsers();
        renderSelectedUserDetails();
        renderUsersList();
        showToast('تم تحديث اسم المستخدم');
    } catch (error) {
        console.error('خطأ في تعديل اسم المستخدم:', error);
        showToast('فشل تعديل اسم المستخدم', true);
    }
}

function toggleSelectAllNotificationUsers() {
    const users = getFilteredNotificationUsers();
    const shouldSelect = selectAllNotificationUsers ? selectAllNotificationUsers.checked : false;

    users.forEach(user => {
        const key = getUserKey(user);
        if (shouldSelect) selectedNotificationUserIds.add(key);
        else selectedNotificationUserIds.delete(key);
    });

    renderNotificationUsers();
}

async function sendNotificationRequest() {
    const title = notificationTitleInput ? notificationTitleInput.value.trim() : '';
    const body = notificationBodyInput ? notificationBodyInput.value.trim() : '';
    
    let link = '';
    if (notificationLinkInput) {
        const val = notificationLinkInput.value.trim();
        if (val === 'custom_path') {
            link = notificationCustomLinkInput ? notificationCustomLinkInput.value.trim() : '';
        } else {
            link = val;
        }
    }

    const recipients = buildNotificationUsers().filter(user => selectedNotificationUserIds.has(getUserKey(user)));

    if (!title || !body || recipients.length === 0) {
        showToast('اكتب عنوان الإشعار ونصه وحدد مستخدماً واحداً على الأقل', true);
        return;
    }

    try {
        if (sendNotificationBtn) sendNotificationBtn.disabled = true;
        const docRef = await addDoc(collection(db(), NOTIFICATION_REQUESTS_COLLECTION), {
            title,
            body,
            link,
            status: 'pending',
            createdAt: Date.now(),
            createdBy: auth().currentUser?.email || '',
            recipientCount: recipients.length,
            recipients: recipients.map(user => ({
                userKey: getUserKey(user),
                userId: user.userId || user.uid || '',
                name: getDisplayName(user),
                email: getUserEmail(user),
                tokens: getFcmTokens(user)
            }))
        });

        selectedNotificationHistoryId = docRef.id;
        notificationHistoryLoadError = null;
        setUsersPanel('history');
        await refreshNotificationHistoryOnce();

        showToast(`تم حفظ الإشعار في السجل وإرساله لـ ${recipients.length} مستخدم`);
        if (notificationTitleInput) notificationTitleInput.value = '';
        if (notificationBodyInput) notificationBodyInput.value = '';
        if (notificationLinkInput) {
            notificationLinkInput.value = '';
            if (notificationCustomLinkInput) {
                notificationCustomLinkInput.value = '';
                notificationCustomLinkInput.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('خطأ في إنشاء طلب الإشعار:', error);
        const code = String(error?.code || '').toLowerCase();
        if (code.includes('permission-denied')) {
            showToast('فشل حفظ الإشعار — أضف صلاحية notificationRequests في Firestore Rules', true);
        } else {
            showToast(`فشل إنشاء طلب الإشعار: ${error?.message || 'خطأ غير معروف'}`, true);
        }
    } finally {
        updateNotificationSelectionUI();
    }
}

function openMobileSidebar() {
    const sidebar = document.querySelector('.sidebar-new');
    if (sidebar) sidebar.classList.add('open');
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) overlay.style.display = 'block';
}

function closeMobileSidebar() {
    const sidebar = document.querySelector('.sidebar-new');
    if (sidebar) {
        console.log('Closing sidebar - removing open class');
        // إزالة الـ open class لإغلاق القائمة الجانبية
        sidebar.classList.remove('open');
        // Force a reflow to ensure the transform is applied
        void sidebar.offsetHeight;
    }
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) {
        console.log('Hiding overlay');
        overlay.style.display = 'none';
    }
}

function updateUserPresenceUI(user) {
    if (!user) return;
    
    const userStatusDot = document.getElementById('userStatusDot');
    const userStatusElem = document.getElementById('userStatus');
    
    if (userStatusDot && userStatusElem) {
        userStatusDot.className = 'status-dot';
        const presence = getPresenceState(user);

        userStatusDot.classList.add(presence.className);
        userStatusElem.textContent = presence.text;
        userStatusElem.style.color = presence.color;
        userStatusElem.title = presence.text;
        if (userStatusToggle) {
            userStatusToggle.setAttribute('aria-label', `حالة المستخدم: ${presence.text}`);
            userStatusToggle.dataset.fullStatus = presence.text;
        }
        if (statusTooltipElement && statusTooltipElement.classList.contains('show')) {
            statusTooltipElement.textContent = presence.text;
        }
    }
}

function getStatusTooltipElement() {
    if (!statusTooltipElement) {
        statusTooltipElement = document.createElement('div');
        statusTooltipElement.className = 'status-tooltip-new';
        document.body.appendChild(statusTooltipElement);
    }
    return statusTooltipElement;
}

function positionStatusTooltip(target, tooltip) {
    const rect = target.getBoundingClientRect();
    const spacing = 8;
    tooltip.style.left = '0px';
    tooltip.style.top = '0px';
    tooltip.classList.add('show');

    const tooltipRect = tooltip.getBoundingClientRect();
    const maxLeft = window.innerWidth - tooltipRect.width - 8;
    const centeredLeft = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    const left = Math.max(8, Math.min(centeredLeft, maxLeft));
    const topAbove = rect.top - tooltipRect.height - spacing;
    const topBelow = rect.bottom + spacing;
    const top = topAbove >= 8 ? topAbove : Math.min(topBelow, window.innerHeight - tooltipRect.height - 8);

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

function showStatusTooltip(target) {
    if (!target) return;
    const text = target.dataset.fullStatus || target.getAttribute('aria-label') || target.getAttribute('title') || target.textContent || '';
    if (!text.trim()) return;

    const tooltip = getStatusTooltipElement();
    tooltip.textContent = text.trim();
    positionStatusTooltip(target, tooltip);
}

function hideStatusTooltip() {
    if (statusTooltipElement) statusTooltipElement.classList.remove('show');
}

function clearStatusTooltipLongPress() {
    if (statusTooltipLongPressTimer) {
        clearTimeout(statusTooltipLongPressTimer);
        statusTooltipLongPressTimer = null;
    }
}

function handleStatusTooltipPointerOver(event) {
    const target = event.target.closest('.status-tooltip-target');
    if (!target || event.pointerType === 'touch') return;
    showStatusTooltip(target);
}

function handleStatusTooltipPointerOut(event) {
    const target = event.target.closest('.status-tooltip-target');
    if (!target || event.pointerType === 'touch') return;
    if (event.relatedTarget && target.contains(event.relatedTarget)) return;
    hideStatusTooltip();
}

function handleStatusTooltipPointerDown(event) {
    const target = event.target.closest('.status-tooltip-target');
    if (!target) {
        hideStatusTooltip();
        return;
    }
    if (event.pointerType !== 'touch') return;

    clearStatusTooltipLongPress();
    statusTooltipLongPressTimer = setTimeout(() => {
        showStatusTooltip(target);
        setTimeout(hideStatusTooltip, 3500);
        statusTooltipLongPressTimer = null;
    }, 1000);
}

function handleStatusTooltipPointerEnd() {
    clearStatusTooltipLongPress();
}

function handleStatusTooltipContextMenu(event) {
    if (event.target.closest('.status-tooltip-target')) {
        event.preventDefault();
    }
}

async function selectUser(userId) {
    cancelEditMode();
    clearSelectedAttachment();
    hideStatusTooltip();
    closeMobileSidebar();
    
    // Hide mobileTopBar when in chat on mobile
    const mobileTopBar = document.getElementById('mobileTopBar');
    if (mobileTopBar) mobileTopBar.style.display = 'none';
    
    selectedUserId = userId;
    const user = allUsers.find(u => u.id === userId);
    
    if (!user) return;
    
    console.log("🔍 فتح البلاغ - بيانات المستند كاملة من Firestore:", user);
    
    renderUsersList();
    
    const displayName = user.userName || user.userEmail || user.userId || 'مستخدم مجهول';
    const userNameElem = document.getElementById('userName');
    const userAvatarElem = document.getElementById('userAvatar');
    
    if (userNameElem) userNameElem.textContent = displayName;
    if (userAvatarElem) userAvatarElem.innerHTML = renderUserAvatar(user, displayName);
    
    updateUserPresenceUI(user);
    
    if (chatHeader) chatHeader.style.display = 'flex';
    if (replyArea) replyArea.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
    
    const messages = user.messages || [];
    await resolveUserAttachmentUrls(user);
    currentMessages = messages;
    renderMessages(messages);
    
    updateUserReplyButtonUI(user);
    
    const status = user.status || 'Pending';
    if (statusDropdown) {
        statusDropdown.value = status;
        updateStatusDropdownClass(status);
    }
    
    const unreadMessages = getUnreadCount(user, messages);
    if (unreadMessages > 0) {
        await markMessagesAsRead(userId, messages);
    }
}

async function markMessagesAsRead(userId, messages) {
    const updatedMessages = messages.map(msg => 
        msg.sender === 'user' && !msg.read ? { ...msg, read: true } : msg
    );
    
    try {
        const userRef = doc(db(), COLLECTION_NAME, userId);
        await updateDoc(userRef, {
            messages: updatedMessages,
            reportRead: true,
            adminRead: true,
            seenByAdmin: true,
            readAt: Date.now()
        });
        
        const userIndex = allUsers.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            allUsers[userIndex].messages = updatedMessages;
            allUsers[userIndex].unreadCount = 0;
            allUsers[userIndex].reportRead = true;
            allUsers[userIndex].adminRead = true;
            allUsers[userIndex].seenByAdmin = true;
            allUsers[userIndex].readAt = Date.now();
            renderUsersList();
        }
    } catch (error) {
        console.error('خطأ في تعليم الرسائل كمقروءة:', error);
    }
}

function renderMessages(messages) {
    if (!messagesList) return;
    const shouldStickToBottom = !messagesContainer || (messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight < 120);
    
    let messagesHtml = '';
    const user = allUsers.find(u => u.id === selectedUserId);
    
    // 1. Render the ticket details block first (if user exists)
    if (user) {
        // Find the problem description from any common fields
        const problemDescription = getReportText(user);
        
        const reportAttachmentsHtml = renderReportAttachments(user);

        messagesHtml += `
            <div class="problem-details-new ${reportAttachmentsHtml ? 'has-report-attachments-new' : 'no-report-attachments-new'}">
                <div class="details-title-new">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                        <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="white" stroke-width="1.5"/>
                        <path d="M10 14V10M10 6H10.01" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    تفاصيل التذكرة والمشكلة
                </div>
                <div class="problem-content-layout-new">
                    <div class="problem-info-column-new">
                        <div class="details-grid-new">
                            ${user.userName ? `<div class="detail-item-new"><span class="detail-label-new">اسم المستخدم</span><span class="detail-value-new">${escapeHtml(user.userName)}</span></div>` : ''}
                            ${user.userEmail ? `<div class="detail-item-new"><span class="detail-label-new">البريد الإلكتروني</span><span class="detail-value-new">${escapeHtml(user.userEmail)}</span></div>` : ''}
                            ${user.userId ? `<div class="detail-item-new"><span class="detail-label-new">معرف المستخدم</span><span class="detail-value-new">${escapeHtml(user.userId)}</span></div>` : ''}
                            ${user.reportId ? `<div class="detail-item-new"><span class="detail-label-new">رقم التقرير</span><span class="detail-value-new">${escapeHtml(user.reportId)}</span></div>` : ''}
                            ${user.device ? `<div class="detail-item-new"><span class="detail-label-new">الجهاز</span><span class="detail-value-new">${escapeHtml(user.device)}</span></div>` : ''}
                            ${user.page ? `<div class="detail-item-new"><span class="detail-label-new">الصفحة</span><span class="detail-value-new">${escapeHtml(user.page)}</span></div>` : ''}
                            ${user.part ? `<div class="detail-item-new"><span class="detail-label-new">القسم</span><span class="detail-value-new">${escapeHtml(user.part)}</span></div>` : ''}
                            ${user.appVersion ? `<div class="detail-item-new"><span class="detail-label-new">إصدار التطبيق</span><span class="detail-value-new">${escapeHtml(user.appVersion)}</span></div>` : ''}
                            ${getAndroidVersion(user) ? `<div class="detail-item-new"><span class="detail-label-new">إصدار الأندرويد</span><span class="detail-value-new">${escapeHtml(getAndroidVersion(user))}</span></div>` : ''}
                            ${getScreenDimensions(user) ? `<div class="detail-item-new"><span class="detail-label-new">ابعاد الشاشة (بكسل)</span><span class="detail-value-new">${escapeHtml(getScreenDimensions(user))}</span></div>` : ''}
                            ${getScreenSizeInInches(user) ? `<div class="detail-item-new"><span class="detail-label-new">حجم الشاشة</span><span class="detail-value-new">${escapeHtml(getScreenSizeInInches(user))}</span></div>` : ''}
                            ${getScreenDPI(user) ? `<div class="detail-item-new"><span class="detail-label-new">كثافة البكسل DPI</span><span class="detail-value-new">${escapeHtml(getScreenDPI(user))}</span></div>` : ''}
                            ${getScreenDP(user) ? `<div class="detail-item-new"><span class="detail-label-new">وحدات DP</span><span class="detail-value-new">${escapeHtml(getScreenDP(user))}</span></div>` : ''}
                            ${getScreenDensity(user) ? `<div class="detail-item-new"><span class="detail-label-new">فئة الكثافة</span><span class="detail-value-new">${escapeHtml(getScreenDensity(user))}</span></div>` : ''}
                            ${user.status ? `<div class="detail-item-new"><span class="detail-label-new">الحالة</span><span class="detail-value-new">${escapeHtml(user.status)}</span></div>` : ''}
                            ${user.timestamp ? `<div class="detail-item-new"><span class="detail-label-new">تاريخ التقرير</span><span class="detail-value-new">${new Date(user.timestamp).toLocaleString('ar-SA')}</span></div>` : ''}
                        </div>
                        ${problemDescription ? `<div class="problem-message-new"><strong>📝 وصف المشكلة:</strong><br>${escapeHtml(problemDescription)}</div>` : ''}
                    </div>
                    ${reportAttachmentsHtml ? `<div class="problem-attachments-column-new">${reportAttachmentsHtml}</div>` : ''}
                </div>
            </div>
        `;
    }
    
    // 2. Render messages list or empty state placeholder
    if (!messages || messages.length === 0) {
        messagesHtml += '<div class="empty-state-new" style="padding: 40px; text-align: center;">📭 لا توجد رسائل بعد</div>';
    } else {
        messagesHtml += messages.map((msg, index) => `
            <div class="message-new ${msg.sender}" data-msg-id="${index}">
                <div class="message-bubble-new ${normalizeMessageAttachments(msg).length ? 'has-media-new' : ''}">
                    ${msg.text ? `<div class="message-text-new">${escapeHtml(msg.text)}</div>` : ''}
                    ${renderMessageAttachments(msg)}
                    <div class="message-meta-new">
                        <span>${formatTime(msg.timestamp)}</span>
                        ${msg.sender === 'admin' ? '<span>✓✓</span>' : ''}
                    </div>
                    ${msg.sender === 'admin' ? `
                        <div class="message-actions-new">
                            <button class="msg-btn-new edit-btn" data-msg-id="${index}" title="تعديل">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M12 20h9"></path>
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                </svg>
                            </button>
                            <button class="msg-btn-new delete-btn" data-msg-id="${index}" title="حذف">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
    
    messagesList.innerHTML = messagesHtml;
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const msgId = parseInt(btn.dataset.msgId);
            editMessage(msgId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const msgId = parseInt(btn.dataset.msgId);
            deleteMessage(msgId);
        });
    });

    bindMediaPreviewButtons();
    
    if (shouldStickToBottom) {
        setTimeout(() => {
            if (messagesEnd) messagesEnd.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
}

function editMessage(msgId) {
    if (!selectedUserId || !currentMessages[msgId]) return;
    
    editingMessageId = msgId;
    clearSelectedAttachment();
    const message = currentMessages[msgId];
    
    if (messageInput) {
        messageInput.value = message.text || '';
        messageInput.focus();
        messageInput.style.height = 'auto';
        messageInput.style.height = messageInput.scrollHeight + 'px';
    }
    
    updateSendButtonState();
    
    const editModeIndicator = document.getElementById('editModeIndicator');
    if (editModeIndicator) {
        editModeIndicator.style.display = 'flex';
    }
}

function cancelEditMode() {
    editingMessageId = null;
    if (messageInput) {
        messageInput.value = '';
        messageInput.style.height = 'auto';
    }
    const editModeIndicator = document.getElementById('editModeIndicator');
    if (editModeIndicator) {
        editModeIndicator.style.display = 'none';
    }
    updateSendButtonState();
}

function closeEditModal() {
    cancelEditMode();
}

async function saveMessageEdit() {
    if (editingMessageId === null || !selectedUserId) return;
    
    const newText = messageInput ? messageInput.value.trim() : '';
    if (newText) {
        currentMessages[editingMessageId].text = newText;
        currentMessages[editingMessageId].edited = true;
        currentMessages[editingMessageId].editedAt = Date.now();
        await updateMessagesInFirebase();
    }
    cancelEditMode();
}

function deleteMessage(msgId) {
    if (!selectedUserId || !currentMessages[msgId]) return;
    
    if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
        currentMessages.splice(msgId, 1);
        updateMessagesInFirebase();
    }
}

async function updateMessagesInFirebase() {
    try {
        const userRef = doc(db(), COLLECTION_NAME, selectedUserId);
        await updateDoc(userRef, { messages: currentMessages });
        
        renderMessages(currentMessages);
        
        const userIndex = allUsers.findIndex(u => u.id === selectedUserId);
        if (userIndex !== -1) {
            allUsers[userIndex].messages = currentMessages;
            const lastMessage = currentMessages[currentMessages.length - 1];
            allUsers[userIndex].lastMessageText = getReportPreview(allUsers[userIndex], lastMessage);
            allUsers[userIndex].lastMessageTime = lastMessage?.timestamp || 0;
            allUsers[userIndex].unreadCount = getUnreadCount(allUsers[userIndex], currentMessages);
            renderUsersList();
        }
        
        showToast('✅ تم تحديث الرسالة بنجاح');
    } catch (error) {
        console.error('خطأ في تحديث الرسالة:', error);
        showToast('❌ فشل تحديث الرسالة', true);
    }
}

async function sendReply() {
    const text = messageInput ? messageInput.value.trim() : '';
    if ((!text && !selectedAttachmentFile) || !selectedUserId || isSendingMessage) return;
    
    const user = allUsers.find(u => u.id === selectedUserId);
    if (!user) return;
    
    try {
        setComposerLoading(true);
        const attachments = selectedAttachmentFile
            ? [await uploadChatAttachment(selectedAttachmentFile, user)]
            : [];
        const notificationText = text || getAttachmentNotificationText(attachments);
        const attachmentFields = getAttachmentMessageFields(attachments);

        const newMessage = {
            sender: 'admin',
            text: text,
            caption: text,
            timestamp: Date.now(),
            read: true,
            ...(attachments.length ? attachmentFields : {}),
            ...(attachments.length ? { attachments } : {})
        };
        
        const updatedMessages = [...(user.messages || []), newMessage];
        const userRef = doc(db(), COLLECTION_NAME, selectedUserId);
        await updateDoc(userRef, { messages: updatedMessages });
        notifyUser(user.reportId || selectedUserId, notificationText);
        
        currentMessages = updatedMessages;
        renderMessages(updatedMessages);
        if (messageInput) messageInput.value = '';
        clearSelectedAttachment();
        
        const userIndex = allUsers.findIndex(u => u.id === selectedUserId);
        if (userIndex !== -1) {
            allUsers[userIndex].messages = updatedMessages;
            allUsers[userIndex].lastMessageText = getReportPreview(allUsers[userIndex], newMessage);
            allUsers[userIndex].lastMessageTime = Date.now();
            allUsers[userIndex].unreadCount = getUnreadCount(allUsers[userIndex], updatedMessages);
            renderUsersList();
        }
        
        showToast('✅ تم إرسال الرد بنجاح');
        await sendTelegramReply(user, notificationText);
        
    } catch (error) {
        console.error('فشل الإرسال:', error);
        showToast(getSendErrorMessage(error), true);
    } finally {
        setComposerLoading(false);
        updateSendButtonState();
    }
}

async function sendTelegramReply(user, message) {
    const BOT_TOKEN = '8874415978:AAFFA9AkQrEZczUXYvarf4L9c-MbYNEwA1s';
    const chatId = user.telegramChatId;
    
    if (!chatId || !BOT_TOKEN || BOT_TOKEN === '8874415978:AAFFA9AkQrEZczUXYvarf4L9c-MbYNEwA1s') {
        console.log('تيليجرام: لم يتم تكوين البوت بعد');
        return;
    }
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: `📩 *رد من الدعم الفني*\n\n${message}\n\n🆔 معرف التذكرة: ${user.reportId || 'غير محدد'}`,
                parse_mode: 'Markdown'
            })
        });
        
        if (response.ok) {
            console.log('تم إرسال الرد إلى تيليجرام');
        }
    } catch (error) {
        console.error('خطأ في إرسال تيليجرام:', error);
    }
}

function addAttachmentDeleteTarget(targets, attachment) {
    if (!attachment) return;

    if (attachment.path) targets.add(attachment.path);
    if (attachment.url && attachment.url.includes('firebasestorage.googleapis.com')) {
        targets.add(attachment.url);
    }
}

function collectRawStorageTargets(value, targets = new Set()) {
    if (!value) return targets;

    if (Array.isArray(value)) {
        value.forEach(item => collectRawStorageTargets(item, targets));
        return targets;
    }

    if (typeof value === 'string') {
        if (value.includes('firebasestorage.googleapis.com') || value.startsWith('gs://')) {
            targets.add(value);
        } else if (value.includes('/') && /\.(png|jpe?g|gif|webp|heic|mp4|mov|webm|m4v)$/i.test(value.split('?')[0])) {
            targets.add(value);
        }
        return targets;
    }

    if (typeof value === 'object') {
        const path = getAttachmentPath(value);
        if (path) targets.add(path);

        [
            'url',
            'downloadURL',
            'downloadUrl',
            'mediaUrl',
            'fileUrl',
            'attachmentUrl',
            'imageUrl',
            'videoUrl',
            'photoUrl',
            'pictureUrl',
            'screenshotUrl'
        ].forEach(key => {
            if (value[key]) collectRawStorageTargets(value[key], targets);
        });

        [
            'attachments',
            'reportAttachments',
            'problemAttachments',
            'media',
            'files',
            'images',
            'imageUrls',
            'photos',
            'photoUrls',
            'screenshots',
            'screenshotUrls',
            'videos',
            'videoUrls',
            'messages'
        ].forEach(key => {
            if (value[key]) collectRawStorageTargets(value[key], targets);
        });
    }

    return targets;
}

function getChatAttachmentTargets(user) {
    const targets = collectRawStorageTargets(user);

    normalizeReportAttachments(user).forEach(attachment => {
        addAttachmentDeleteTarget(targets, attachment);
    });

    (user?.messages || []).forEach(message => {
        normalizeMessageAttachments(message).forEach(attachment => {
            addAttachmentDeleteTarget(targets, attachment);
        });
    });

    return [...targets];
}

async function deleteChatAttachments(user) {
    const activeStorage = getActiveStorage();
    const targets = getChatAttachmentTargets(user);

    if (!activeStorage || targets.length === 0) return;

    const results = await Promise.allSettled(targets.map(target => deleteObject(ref(activeStorage, target))));
    const failed = results.filter(result => result.status === 'rejected');

    if (failed.length > 0) {
        console.warn('تعذر حذف بعض مرفقات Storage:', failed);
    }
}

async function deleteChatById(userId) {
    const user = allUsers.find(item => item.id === userId);
    if (user) await deleteChatAttachments(user);
    await deleteDoc(doc(db(), COLLECTION_NAME, userId));
}

function clearCurrentChatView() {
    selectedUserId = null;
    currentMessages = [];
    cancelEditMode();
    clearSelectedAttachment();

    if (messagesList) messagesList.innerHTML = '';
    if (chatHeader) chatHeader.style.display = 'none';
    if (replyArea) replyArea.style.display = 'none';
    if (infoPanel) infoPanel.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';

    const mobileTopBar = document.getElementById('mobileTopBar');
    if (mobileTopBar) mobileTopBar.style.display = '';
}

async function deleteCurrentChat() {
    if (!selectedUserId) return;

    const user = allUsers.find(u => u.id === selectedUserId);
    if (!user) return;

    const displayName = user.userName || user.userEmail || user.userId || 'هذه المحادثة';
    if (!confirm(`هل تريد حذف محادثة ${displayName} بالكامل؟ سيتم حذفها من Firebase ولا يمكن التراجع.`)) return;

    if (deleteChatBtn) deleteChatBtn.disabled = true;

    try {
        await deleteChatById(selectedUserId);

        allUsers = allUsers.filter(item => item.id !== selectedUserId);
        selectedConversationIds.delete(selectedUserId);
        clearCurrentChatView();
        renderUsersList();

        if (usersCountSpan) usersCountSpan.textContent = allUsers.length;
        if (totalTicketsSpan) totalTicketsSpan.textContent = allUsers.filter(u => u.status !== 'Solved').length;
        if (conversationsCountSpan) conversationsCountSpan.textContent = allUsers.filter(u => !u.archived).length;

        showToast('تم حذف الدردشة بالكامل');
    } catch (error) {
        console.error('خطأ في حذف الدردشة:', error);
        showToast('فشل حذف الدردشة', true);
    } finally {
        if (deleteChatBtn) deleteChatBtn.disabled = false;
    }
}

async function deleteSelectedChats() {
    const ids = [...selectedConversationIds].filter(id => allUsers.some(user => user.id === id));
    if (ids.length === 0) return;

    if (!confirm(`هل تريد حذف ${ids.length} محادثة محددة؟ سيتم حذفها من Firebase مع المرفقات ولا يمكن التراجع.`)) return;

    if (deleteSelectedChatsBtn) deleteSelectedChatsBtn.disabled = true;

    try {
        await Promise.all(ids.map(id => deleteChatById(id)));

        allUsers = allUsers.filter(user => !ids.includes(user.id));
        const deletedSelectedChat = selectedUserId && ids.includes(selectedUserId);
        selectedConversationIds.clear();
        if (deletedSelectedChat) clearCurrentChatView();
        renderUsersList();

        if (usersCountSpan) usersCountSpan.textContent = allUsers.length;
        if (totalTicketsSpan) totalTicketsSpan.textContent = allUsers.filter(u => u.status !== 'Solved').length;
        if (conversationsCountSpan) conversationsCountSpan.textContent = allUsers.filter(u => !u.archived).length;

        showToast(`تم حذف ${ids.length} محادثة`);
    } catch (error) {
        console.error('خطأ في حذف المحادثات المحددة:', error);
        showToast('فشل حذف بعض المحادثات المحددة', true);
    } finally {
        updateBulkActionsUI();
    }
}

async function archiveSelectedChats() {
    const ids = [...selectedConversationIds].filter(id => allUsers.some(user => user.id === id));
    if (ids.length === 0) return;

    if (!confirm(`هل تريد حفظ ${ids.length} محادثة محددة في الأرشيف؟`)) return;

    if (archiveSelectedChatsBtn) archiveSelectedChatsBtn.disabled = true;

    try {
        await Promise.all(ids.map(id => {
            const userRef = doc(db(), COLLECTION_NAME, id);
            return updateDoc(userRef, { archived: true });
        }));

        allUsers = allUsers.map(user => 
            ids.includes(user.id) ? { ...user, archived: true } : user
        );

        selectedConversationIds.clear();
        renderUsersList();

        if (conversationsCountSpan) conversationsCountSpan.textContent = allUsers.filter(u => !u.archived).length;

        showToast(`تم حفظ ${ids.length} محادثة في الأرشيف`);
    } catch (error) {
        console.error('خطأ في حفظ المحادثات في الأرشيف:', error);
        showToast('فشل حفظ بعض المحادثات في الأرشيف', true);
    } finally {
        updateBulkActionsUI();
    }
}

async function deleteSelectedGuests() {
    const ids = [...selectedGuestUserIds];
    if (ids.length === 0) return;

    const message = `هل تريد حذف ${ids.length} ضيف محدد من Firebase؟ سيتم حذف مستنداتهم من guestUsers.`;
    if (!confirm(message)) return;

    if (deleteSelectedGuestsBtn) deleteSelectedGuestsBtn.disabled = true;

    try {
        for (const guestKey of ids) {
            const guest = buildGuestUsersList().find(user => getGuestKey(user) === guestKey);
            const docId = String(guest?.id || guest?.anonymousUid || guestKey).trim();
            if (docId) {
                await deleteDoc(doc(db(), GUEST_USERS_COLLECTION_NAME, docId));
            }
        }

        guestUsers = guestUsers.filter(user => !ids.includes(getGuestKey(user)));
        if (selectedGuestUserId && ids.includes(selectedGuestUserId)) {
            selectedGuestUserId = null;
        }
        selectedGuestUserIds.clear();
        renderGuestUsers();
        showToast(`تم حذف ${ids.length} ضيف`);
    } catch (error) {
        console.error('خطأ في حذف الضيوف:', error);
        showToast('فشل حذف بعض الضيوف — تأكد من صلاحيات الحذف في Firestore Rules', true);
    } finally {
        updateGuestSelectionUI();
    }
}

async function deleteSelectedUsers() {
    const ids = [...selectedNotificationUserIds];
    if (ids.length === 0) return;

    const message = `هل تريد حذف ${ids.length} مستخدم محدد من Firebase؟ سيتم حذف مستنداتهم من users وحذف بلاغاتهم ومرفقاتها إن وجدت.`;
    if (!confirm(message)) return;

    if (deleteSelectedUsersBtn) deleteSelectedUsersBtn.disabled = true;

    try {
        for (const userKey of ids) {
            const relatedReports = allUsers.filter(user => getUserKey(user) === userKey);
            const mergedUser = buildNotificationUsers().find(user => getUserKey(user) === userKey) || {};
            for (const report of relatedReports) {
                await deleteChatById(report.id);
            }

            const appUser = appUsers.find(user => getUserKey(user) === userKey);
            if (appUser?.id) {
                await deleteDoc(doc(db(), USERS_COLLECTION_NAME, appUser.id));
            }

            const uid = getAuthUid({ ...mergedUser, ...appUser });
            if (uid) {
                await addDoc(collection(db(), USER_DELETION_REQUESTS_COLLECTION), {
                    uid,
                    userKey,
                    email: getUserEmail({ ...mergedUser, ...appUser }),
                    status: 'pending',
                    createdAt: Date.now(),
                    createdBy: auth?.currentUser?.email || ''
                });
            }
        }

        allUsers = allUsers.filter(user => !ids.includes(getUserKey(user)));
        appUsers = appUsers.filter(user => !ids.includes(getUserKey(user)));
        if (selectedNotificationUserId && ids.includes(selectedNotificationUserId)) {
            selectedNotificationUserId = null;
            renderSelectedUserDetails();
        }
        selectedNotificationUserIds.clear();
        renderNotificationUsers();
        renderUsersList();

        showToast(`تم حذف ${ids.length} مستخدم`);
    } catch (error) {
        console.error('خطأ في حذف المستخدمين:', error);
        showToast('فشل حذف بعض المستخدمين', true);
    } finally {
        updateNotificationSelectionUI();
    }
}

async function toggleUserReply() {
    if (!selectedUserId) return;
    
    const user = allUsers.find(u => u.id === selectedUserId);
    if (!user) return;
    
    user.canUserReply = user.canUserReply === undefined ? true : !user.canUserReply;
    
    try {
        const userRef = doc(db(), COLLECTION_NAME, selectedUserId);
        await updateDoc(userRef, { canUserReply: user.canUserReply });
        
        updateUserReplyButtonUI(user);
        
        const statusText = user.canUserReply 
            ? '🔓 تم فتح المحادثة للرد' 
            : '🔒 تم قفل المحادثة ومنع الرد';
        showToast(statusText);
    } catch (error) {
        console.error('خطأ في تحديث حالة الرد:', error);
        showToast('❌ فشل تحديث الحالة', true);
        user.canUserReply = user.canUserReply === undefined ? false : !user.canUserReply;
    }
}

function updateUserReplyButtonUI(user) {
    if (!toggleReplyBtn) return;
    
    const isReplyEnabled = user.canUserReply === undefined ? true : user.canUserReply;
    
    if (isReplyEnabled) {
        toggleReplyBtn.classList.add('enabled');
        toggleReplyBtn.title = 'المحادثة مفتوحة (الرد متاح)';
        toggleReplyBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
            </svg>
        `;
    } else {
        toggleReplyBtn.classList.remove('enabled');
        toggleReplyBtn.title = 'المحادثة مغلقة (الرد معطل)';
        toggleReplyBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
        `;
    }
}

async function updateReportStatus() {
    if (!selectedUserId) return;
    
    const user = allUsers.find(u => u.id === selectedUserId);
    if (!user || !statusDropdown) return;
    
    const newStatus = statusDropdown.value;
    
    try {
        const userRef = doc(db(), COLLECTION_NAME, selectedUserId);
        await updateDoc(userRef, { status: newStatus });
        
        user.status = newStatus;
        
        const statusMessages = {
            'Pending': '⏳ قيد الانتظار',
            'In Progress': '⚙️ قيد المعالجة',
            'Solved': '✅ تم الحل'
        };
        
        showToast(statusMessages[newStatus] || 'تم تحديث الحالة');
    } catch (error) {
        console.error('خطأ في تحديث حالة البلاغ:', error);
        showToast('❌ فشل تحديث الحالة', true);
        if (user.status && statusDropdown) {
            statusDropdown.value = user.status;
            updateStatusDropdownClass(user.status);
        }
    }
}

function showUserInfo() {
    const user = allUsers.find(u => u.id === selectedUserId);
    if (!user || !infoContent) return;

    if (infoPanel && infoPanel.style.display === 'block') {
        infoPanel.style.display = 'none';
        return;
    }
    
    // طباعة البيانات للتحقق
    console.log('👤 بيانات المستخدم المختار:', {
        userId: user.userId,
        userName: user.userName,
        androidVersion: user.androidVersion,
        screenResolution: user.screenResolution,
        screenInches: user.screenInches,
        screenDPI: user.screenDPI,
        screenDP: user.screenDP,
        screenDensity: user.screenDensity
    });
    
    const infoRows = [
        { label: 'اسم المستخدم', value: user.userName },
        { label: 'البريد الإلكتروني', value: user.userEmail },
        { label: 'معرف المستخدم', value: user.userId },
        { label: 'رقم التقرير', value: user.reportId },
        { label: 'الحالة', value: user.status },
        { label: 'الجهاز', value: user.device },
        { label: 'الصفحة', value: user.page },
        { label: 'القسم', value: user.part },
        { label: 'إصدار التطبيق', value: user.appVersion },
        { label: 'إصدار الأندرويد', value: user.androidVersion },
        { label: 'ابعاد الشاشة (بكسل)', value: user.screenResolution },
        { label: 'حجم الشاشة', value: user.screenInches },
        { label: 'كثافة البكسل DPI', value: user.screenDPI },
        { label: 'وحدات DP', value: user.screenDP },
        { label: 'فئة الكثافة', value: user.screenDensity },
        { label: 'تاريخ التقرير', value: user.timestamp ? new Date(user.timestamp).toLocaleString('ar-SA') : '' }
    ];
    
    console.log('📊 جميع الصفوف قبل الفلترة:', infoRows);
    
    let html = infoRows
        .filter(row => row.value)
        .map(row => `
            <div class="info-row-new">
                <div class="info-label-new">${row.label}</div>
                <div class="info-value-new">${escapeHtml(row.value)}</div>
            </div>
        `).join('');
    
    console.log('✅ الصفوف بعد الفلترة (المعروضة):', infoRows.filter(row => row.value));
    
    if (user.message) {
        html += `
            <div class="info-row-new" style="border-top: 1px solid var(--gray-200); margin-top: 12px; padding-top: 12px;">
                <div class="info-label-new">وصف المشكلة</div>
                <div class="info-value-new" style="white-space: pre-wrap;">${escapeHtml(user.message)}</div>
            </div>
        `;
    }
    
    if (infoContent) infoContent.innerHTML = html;
    if (infoPanel) infoPanel.style.display = 'block';
}

// ========== نظام الاختصارات السريعة للدردشة ==========
const SHORTCUTS_STORAGE_KEY = 'chat_shortcuts';
let shortcuts = [];
let editingShortcutIndex = null;
let shortcutSuggestionsActive = false;
let shortcutSuggestionsMatches = [];
let shortcutSuggestionsSelectedIndex = 0;
let shortcutActiveToken = '';
let shortcutTokenRange = { start: 0, end: 0 };

// عناصر DOM للمختصرات - سيتم تهيئتها بعد تحميل DOM (تم تعريفها في الجزء العلوي)

// ========== دوال المختصرات ==========

// تحميل المختصرات من التخزين
function loadShortcuts() {
    try {
        const stored = localStorage.getItem(SHORTCUTS_STORAGE_KEY);
        shortcuts = stored ? JSON.parse(stored) : [];
        console.log('✅ تم تحميل المختصرات:', shortcuts);
    } catch (error) {
        console.error('❌ خطأ في تحميل المختصرات:', error);
        shortcuts = [];
    }
}

// حفظ المختصرات في التخزين
function saveShortcuts() {
    try {
        localStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(shortcuts));
        console.log('✅ تم حفظ المختصرات');
    } catch (error) {
        console.error('❌ خطأ في حفظ المختصرات:', error);
        showToast('❌ خطأ في حفظ المختصرات', true);
    }
}

// عرض المختصرات في الـ Modal
function displayShortcuts() {
    if (!shortcutsList) return;
    
    if (shortcuts.length === 0) {
        shortcutsList.innerHTML = `
            <div class="empty-shortcuts-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <p>لا توجد اختصارات حتى الآن</p>
            </div>
        `;
        return;
    }
    
    shortcutsList.innerHTML = shortcuts.map((shortcut, index) => `
        <div class="shortcut-item">
            <div class="shortcut-info">
                <div class="shortcut-name">
                    <span class="shortcut-name-badge">${escapeHtml(shortcut.name)}</span>
                </div>
                <div class="shortcut-preview">${escapeHtml(shortcut.text)}</div>
            </div>
            <div class="shortcut-actions">
                <button class="shortcut-edit-btn" onclick="editShortcut(${index})" title="تعديل المختصر">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="shortcut-delete-btn" onclick="deleteShortcut(${index})" title="حذف المختصر">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"></path>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

// حذف مختصر
function deleteShortcut(index) {
    if (confirm('هل تريد حذف هذا المختصر؟')) {
        shortcuts.splice(index, 1);
        saveShortcuts();
        displayShortcuts();
        showToast('✅ تم حذف المختصر');
    }
}

function openShortcutForm(index = null) {
    editingShortcutIndex = index;
    const titleEl = document.getElementById('addShortcutModalTitle');
    const errorDiv = document.getElementById('addShortcutError');

    if (index !== null && shortcuts[index]) {
        if (shortcutName) shortcutName.value = shortcuts[index].name;
        if (shortcutText) shortcutText.value = shortcuts[index].text;
        if (titleEl) titleEl.textContent = 'تعديل الاختصار';
        if (saveShortcutBtn) saveShortcutBtn.textContent = 'حفظ التعديلات';
    } else {
        if (shortcutName) shortcutName.value = '';
        if (shortcutText) shortcutText.value = '';
        if (titleEl) titleEl.textContent = 'إضافة اختصار جديد';
        if (saveShortcutBtn) saveShortcutBtn.textContent = 'حفظ المختصر';
    }

    if (errorDiv) errorDiv.style.display = 'none';
    if (shortcutFormCard) {
        shortcutFormCard.style.display = 'block';
        shortcutFormCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (shortcutName) shortcutName.focus();
}

function editShortcut(index) {
    setSettingsPanel('shortcuts');
    openShortcutForm(index);
}

function saveShortcut() {
    const name = shortcutName.value.trim();
    const text = shortcutText.value.trim();
    const errorDiv = document.getElementById('addShortcutError');

    if (!name) {
        if (errorDiv) {
            errorDiv.textContent = '❌ يرجى إدخال اسم المختصر';
            errorDiv.style.display = 'block';
        }
        return;
    }

    if (!text) {
        if (errorDiv) {
            errorDiv.textContent = '❌ يرجى إدخال النص الكامل';
            errorDiv.style.display = 'block';
        }
        return;
    }

    const isDuplicate = shortcuts.some((s, i) => s.name === name && i !== editingShortcutIndex);
    if (isDuplicate) {
        if (errorDiv) {
            errorDiv.textContent = '❌ هذا الاختصار موجود بالفعل';
            errorDiv.style.display = 'block';
        }
        return;
    }

    if (editingShortcutIndex !== null) {
        shortcuts[editingShortcutIndex] = { name, text };
    } else {
        shortcuts.push({ name, text });
    }

    saveShortcuts();
    editingShortcutIndex = null;
    if (shortcutName) shortcutName.value = '';
    if (shortcutText) shortcutText.value = '';
    if (errorDiv) errorDiv.style.display = 'none';
    closeShortcutForm();
    displayShortcuts();
}

function isShortcutTokenDelimiter(char) {
    if (!char) return true;
    return /[\s\n\r\t.,;:!?()[\]{}«»،؛/\\|]/.test(char);
}

function getCurrentShortcutToken(input) {
    if (!input) return { token: '', start: 0, end: 0 };

    const value = input.value;
    const pos = typeof input.selectionStart === 'number' ? input.selectionStart : value.length;

    let start = pos;
    while (start > 0 && !isShortcutTokenDelimiter(value[start - 1])) {
        start--;
    }

    return {
        token: value.substring(start, pos),
        start,
        end: pos
    };
}

function getShortcutMatches(query) {
    const q = query.trim();
    if (!q || shortcuts.length === 0) return [];

    const exactMatches = shortcuts.filter(s => s.name === q);
    if (exactMatches.length > 0) return exactMatches;

    const startsWithMatches = shortcuts.filter(s => s.name.startsWith(q));
    if (startsWithMatches.length > 0) return startsWithMatches;

    return shortcuts.filter(s => s.name.includes(q));
}

function renderShortcutsSuggestions(matches, query) {
    const suggestionsDiv = document.getElementById('shortcutsSuggestions') || createSuggestionsDiv();
    const isExact = matches.some(s => s.name === query.trim());
    const headerText = isExact
        ? (matches.length === 1 ? 'هل تريد استخدام هذا المختصر؟' : 'هل تريد استخدام أحد هذه المختصرات؟')
        : 'اختر اختصاراً من القائمة:';

    suggestionsDiv.innerHTML = `
        <div class="suggestions-header">
            <span>${headerText}</span>
            <span class="suggestions-hint">Enter · ↑↓</span>
        </div>
        ${matches.map((shortcut, index) => `
            <div class="suggestion-item ${index === shortcutSuggestionsSelectedIndex ? 'selected' : ''}"
                 data-index="${index}"
                 onmousedown="event.preventDefault(); selectAndApplyShortcut(${index})">
                <strong>⚡ ${escapeHtml(shortcut.name)}</strong>
                <div class="suggestion-preview">${escapeHtml(shortcut.text.substring(0, 100))}${shortcut.text.length > 100 ? '...' : ''}</div>
            </div>
        `).join('')}
    `;
    suggestionsDiv.style.display = 'block';
}

function handleMessageInputShortcuts() {
    if (!messageInput) return;

    const { token, start, end } = getCurrentShortcutToken(messageInput);
    shortcutTokenRange = { start, end };
    shortcutActiveToken = token;
    const matches = getShortcutMatches(token);

    if (matches.length === 0) {
        hideShortcutsSuggestions();
        shortcutSuggestionsActive = false;
        shortcutSuggestionsMatches = [];
        shortcutSuggestionsSelectedIndex = 0;
        shortcutActiveToken = '';
        return;
    }

    shortcutSuggestionsActive = true;
    shortcutSuggestionsMatches = matches;
    if (shortcutSuggestionsSelectedIndex >= matches.length) {
        shortcutSuggestionsSelectedIndex = 0;
    }
    renderShortcutsSuggestions(matches, token);
}

function applySelectedShortcut() {
    const shortcut = shortcutSuggestionsMatches[shortcutSuggestionsSelectedIndex];
    if (!shortcut || !messageInput) return;

    const value = messageInput.value;
    const { start, end } = shortcutTokenRange;
    const before = value.substring(0, start);
    const after = value.substring(end);
    messageInput.value = before + shortcut.text + after;

    const cursorPos = before.length + shortcut.text.length;
    messageInput.setSelectionRange(cursorPos, cursorPos);
    messageInput.style.height = 'auto';
    messageInput.style.height = messageInput.scrollHeight + 'px';
    hideShortcutsSuggestions();
    shortcutSuggestionsActive = false;
    shortcutSuggestionsMatches = [];
    shortcutSuggestionsSelectedIndex = 0;
    shortcutActiveToken = '';
    updateSendButtonState();
    messageInput.focus();
}

function selectAndApplyShortcut(index) {
    shortcutSuggestionsSelectedIndex = index;
    applySelectedShortcut();
}

function handleShortcutSuggestionKeydown(e) {
    if (!shortcutSuggestionsActive || shortcutSuggestionsMatches.length === 0) return false;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        shortcutSuggestionsSelectedIndex = (shortcutSuggestionsSelectedIndex + 1) % shortcutSuggestionsMatches.length;
        renderShortcutsSuggestions(shortcutSuggestionsMatches, shortcutActiveToken);
        return true;
    }

    if (e.key === 'ArrowUp') {
        e.preventDefault();
        shortcutSuggestionsSelectedIndex = (shortcutSuggestionsSelectedIndex - 1 + shortcutSuggestionsMatches.length) % shortcutSuggestionsMatches.length;
        renderShortcutsSuggestions(shortcutSuggestionsMatches, shortcutActiveToken);
        return true;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        applySelectedShortcut();
        return true;
    }

    if (e.key === 'Escape') {
        e.preventDefault();
        hideShortcutsSuggestions();
        shortcutSuggestionsActive = false;
        shortcutSuggestionsMatches = [];
        shortcutSuggestionsSelectedIndex = 0;
        return true;
    }

    return false;
}

function createSuggestionsDiv() {
    const div = document.createElement('div');
    div.id = 'shortcutsSuggestions';
    div.className = 'shortcuts-suggestions';
    const replyWrapper = document.querySelector('.reply-wrapper');
    if (replyWrapper) {
        replyWrapper.style.position = 'relative';
        replyWrapper.appendChild(div);
    }
    return div;
}

function hideShortcutsSuggestions() {
    const suggestionsDiv = document.getElementById('shortcutsSuggestions');
    if (suggestionsDiv) {
        suggestionsDiv.style.display = 'none';
        suggestionsDiv.innerHTML = '';
    }
}

function closeShortcutForm() {
    editingShortcutIndex = null;
    const errorDiv = document.getElementById('addShortcutError');
    if (shortcutFormCard) shortcutFormCard.style.display = 'none';
    if (shortcutName) shortcutName.value = '';
    if (shortcutText) shortcutText.value = '';
    if (errorDiv) errorDiv.style.display = 'none';
}

function initSettingsEventListeners() {
    if (settingsToggleBtn) {
        settingsToggleBtn.addEventListener('click', () => openSettings('hub'));
    }

    if (settingsBackBtn) {
        settingsBackBtn.addEventListener('click', () => setActiveView('chat'));
    }

    if (settingsMenuToggleBtn) {
        settingsMenuToggleBtn.addEventListener('click', () => openMobileSidebar());
    }

    document.querySelectorAll('.settings-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const panel = item.dataset.panel;
            if (panel) setSettingsPanel(panel);
        });
    });

    document.querySelectorAll('.settings-hub-card').forEach(card => {
        card.addEventListener('click', () => {
            const panel = card.dataset.goto;
            if (panel) setSettingsPanel(panel);
        });
    });

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const user = auth().currentUser;
            if (user?.email) {
                navigator.clipboard.writeText(user.email).then(() => {
                    showToast('✅ تم نسخ البريد الإلكتروني');
                }).catch(() => {
                    showToast('⚠️ البريد: ' + user.email, false);
                });
            }
        });
    }

    if (resetPasswordFormBtn) {
        resetPasswordFormBtn.addEventListener('click', resetPasswordForm);
    }
}

// ========== Event Listeners - إضافة Listeners للمختصرات ==========
function addShortcutEventListeners() {
    if (openAddShortcutFromViewBtn) {
        openAddShortcutFromViewBtn.addEventListener('click', () => openShortcutForm());
    }

    if (saveShortcutBtn) {
        saveShortcutBtn.addEventListener('click', saveShortcut);
    }

    if (cancelShortcutFormBtn) {
        cancelShortcutFormBtn.addEventListener('click', closeShortcutForm);
    }

    if (shortcutName) {
        shortcutName.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (shortcutText) shortcutText.focus();
            }
        });
    }

    if (shortcutText) {
        shortcutText.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                saveShortcut();
            }
        });
    }
}

function listenToUserUpdates() {
    const q = query(collection(db(), COLLECTION_NAME));
    
    onSnapshot(q, async (snapshot) => {
        if (selectedUserId) {
            const updatedUser = snapshot.docs.find(doc => doc.id === selectedUserId);
            if (updatedUser) {
                const data = updatedUser.data();
                const messages = data.messages || [];
                
                // Update presence UI in real-time
                const userObj = { id: updatedUser.id, ...data };
                updateUserPresenceUI(userObj);
                
                // Sync status dropdown if updated externally
                if (statusDropdown && userObj.status && statusDropdown.value !== userObj.status) {
                    statusDropdown.value = userObj.status;
                    updateStatusDropdownClass(userObj.status);
                }
                
                if (JSON.stringify(messages) !== JSON.stringify(currentMessages)) {
                    await resolveUserAttachmentUrls(userObj);
                    currentMessages = messages;
                    renderMessages(messages);
                    
                    const newUserMessages = getUnreadCount(userObj, messages);
                    if (newUserMessages > 0) {
                        markMessagesAsRead(selectedUserId, messages);
                    }
                }
            } else {
                clearCurrentChatView();
            }
        }
        
        const updatedUsers = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            const messages = data.messages || [];
            const lastMessage = messages[messages.length - 1];
            
            updatedUsers.push({
                id: doc.id,
                ...data,
                lastMessageText: getReportPreview(data, lastMessage),
                lastMessageTime: lastMessage?.timestamp || data.timestamp || 0,
                unreadCount: getUnreadCount(data, messages)
            });
        });
        
        updatedUsers.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
        allUsers = updatedUsers;
        selectedConversationIds.forEach(id => {
            if (!allUsers.some(user => user.id === id)) selectedConversationIds.delete(id);
        });
        
        if (usersCountSpan) usersCountSpan.textContent = allUsers.length;
        if (totalTicketsSpan) totalTicketsSpan.textContent = allUsers.filter(u => u.status !== 'Solved').length;
        if (conversationsCountSpan) conversationsCountSpan.textContent = allUsers.filter(u => !u.archived).length;
        
        renderUsersList();
        if (activeView === 'users') {
            if (activeUsersPanel === 'guests') renderGuestUsers();
            else if (activeUsersPanel !== 'history') renderNotificationUsers();
        }
    });
}

// ========== مستمعي الأحداث ==========
function startPresenceRefresh() {
    if (presenceRefreshTimer) return;

    presenceRefreshTimer = setInterval(() => {
        if (allUsers.length > 0) renderUsersList();
        if (selectedUserId) {
            const user = allUsers.find(u => u.id === selectedUserId);
            if (user) updateUserPresenceUI(user);
        }
    }, PRESENCE_REFRESH_INTERVAL);
}

async function handleSendOrSave() {
    if (editingMessageId !== null) {
        await saveMessageEdit();
    } else {
        await sendReply();
    }
}

function initEventListeners() {
    if (messageInput) {
        messageInput.addEventListener('input', () => {
            updateSendButtonState();
            handleMessageInputShortcuts();
        });

        messageInput.addEventListener('click', () => {
            handleMessageInputShortcuts();
        });

        messageInput.addEventListener('keyup', (e) => {
            if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                handleMessageInputShortcuts();
            }
        });

        messageInput.addEventListener('keydown', (e) => {
            if (handleShortcutSuggestionKeydown(e)) return;

            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (sendBtn && !sendBtn.disabled) handleSendOrSave();
            }
        });

        messageInput.addEventListener('blur', () => {
            setTimeout(() => {
                hideShortcutsSuggestions();
                shortcutSuggestionsActive = false;
            }, 180);
        });
    }
    
    if (attachBtn && attachmentInput) {
        attachBtn.addEventListener('click', () => attachmentInput.click());
        attachmentInput.addEventListener('change', handleAttachmentSelection);
    }
    
    if (sendBtn) sendBtn.addEventListener('click', handleSendOrSave);
    document.addEventListener('pointerover', handleStatusTooltipPointerOver);
    document.addEventListener('pointerout', handleStatusTooltipPointerOut);
    document.addEventListener('pointerdown', handleStatusTooltipPointerDown);
    document.addEventListener('pointerup', handleStatusTooltipPointerEnd);
    document.addEventListener('pointercancel', handleStatusTooltipPointerEnd);
    document.addEventListener('scroll', hideStatusTooltip, true);
    document.addEventListener('contextmenu', handleStatusTooltipContextMenu);
    if (chatViewBtn) chatViewBtn.addEventListener('click', () => {
        closeMobileSidebar();
        setActiveView('chat');
    });
    if (usersViewBtn) usersViewBtn.addEventListener('click', () => {
        closeMobileSidebar();
        setActiveView('users');
    });
    if (dashboardViewBtn) dashboardViewBtn.addEventListener('click', () => {
        closeMobileSidebar();
        setActiveView('dashboard');
    });
    if (usersSearchInput) usersSearchInput.addEventListener('input', renderNotificationUsers);
    if (usersPresenceFilter) usersPresenceFilter.addEventListener('change', renderNotificationUsers);
    if (usersAppVersionFilter) usersAppVersionFilter.addEventListener('change', renderNotificationUsers);
    if (usersInactivityFilter) usersInactivityFilter.addEventListener('change', renderNotificationUsers);
    if (usersCustomInactivityValue) usersCustomInactivityValue.addEventListener('input', renderNotificationUsers);
    if (usersCustomInactivityUnit) usersCustomInactivityUnit.addEventListener('change', renderNotificationUsers);
    if (usersAdvancedFiltersBtn) usersAdvancedFiltersBtn.addEventListener('click', toggleAdvancedFilters);
    if (usersClearFiltersBtn) usersClearFiltersBtn.addEventListener('click', resetNotificationFilters);
    if (usersSelectionTabBtn) usersSelectionTabBtn.addEventListener('click', () => setUsersPanel('selection'));
    if (guestUsersTabBtn) guestUsersTabBtn.addEventListener('click', () => setUsersPanel('guests'));
    if (notificationsHistoryTabBtn) notificationsHistoryTabBtn.addEventListener('click', () => setUsersPanel('history'));
    if (guestsSearchInput) guestsSearchInput.addEventListener('input', renderGuestUsers);
    if (guestsPresenceFilter) guestsPresenceFilter.addEventListener('change', renderGuestUsers);
    if (guestsAppVersionFilter) guestsAppVersionFilter.addEventListener('change', renderGuestUsers);
    if (guestsInactivityFilter) guestsInactivityFilter.addEventListener('change', renderGuestUsers);
    if (guestsCustomInactivityValue) guestsCustomInactivityValue.addEventListener('input', renderGuestUsers);
    if (guestsCustomInactivityUnit) guestsCustomInactivityUnit.addEventListener('change', renderGuestUsers);
    if (guestsAdvancedFiltersBtn) guestsAdvancedFiltersBtn.addEventListener('click', toggleGuestAdvancedFilters);
    if (guestsClearFiltersBtn) guestsClearFiltersBtn.addEventListener('click', resetGuestFilters);
    if (selectAllGuestUsers) selectAllGuestUsers.addEventListener('change', toggleSelectAllGuestUsers);
    if (deleteSelectedGuestsBtn) deleteSelectedGuestsBtn.addEventListener('click', deleteSelectedGuests);
    if (notificationsHistorySearchInput) notificationsHistorySearchInput.addEventListener('input', renderNotificationHistory);
    disableBrowserAutofill(notificationsHistorySearchInput);
    disableBrowserAutofill(notificationTitleInput);
    disableBrowserAutofill(notificationBodyInput);
    disableBrowserAutofill(notificationCustomLinkInput);
    if (selectAllNotificationHistory) selectAllNotificationHistory.addEventListener('change', toggleSelectAllNotificationHistory);
    if (deleteSelectedNotificationsBtn) deleteSelectedNotificationsBtn.addEventListener('click', deleteSelectedNotifications);
    if (selectAllNotificationUsers) selectAllNotificationUsers.addEventListener('change', toggleSelectAllNotificationUsers);
    if (deleteSelectedUsersBtn) deleteSelectedUsersBtn.addEventListener('click', deleteSelectedUsers);
    if (sendNotificationBtn) sendNotificationBtn.addEventListener('click', sendNotificationRequest);
    if (notificationLinkInput) {
        notificationLinkInput.addEventListener('change', () => {
            if (notificationLinkInput.value === 'custom_path') {
                if (notificationCustomLinkInput) {
                    notificationCustomLinkInput.style.display = 'block';
                    notificationCustomLinkInput.focus();
                }
            } else {
                if (notificationCustomLinkInput) {
                    notificationCustomLinkInput.style.display = 'none';
                    notificationCustomLinkInput.value = '';
                }
            }
        });
    }
    if (showInfoBtn) showInfoBtn.addEventListener('click', showUserInfo);
    if (deleteChatBtn) deleteChatBtn.addEventListener('click', deleteCurrentChat);
    if (selectAllConversations) selectAllConversations.addEventListener('change', toggleSelectAllConversations);
    if (deleteSelectedChatsBtn) deleteSelectedChatsBtn.addEventListener('click', deleteSelectedChats);
    if (archiveSelectedChatsBtn) archiveSelectedChatsBtn.addEventListener('click', archiveSelectedChats);
    if (archiveViewBtn) archiveViewBtn.addEventListener('click', () => {
        // Toggle view between all conversations and archived conversations
        const isArchiveView = conversationsList.dataset.archiveView === 'true';
        conversationsList.dataset.archiveView = isArchiveView ? 'false' : 'true';
        archiveViewBtn.classList.toggle('active', !isArchiveView);
        renderUsersList();
    });
    if (mediaViewerCloseBtn) mediaViewerCloseBtn.addEventListener('click', closeMediaViewer);
    if (mediaViewerBackdrop) mediaViewerBackdrop.addEventListener('click', closeMediaViewer);
    if (closeInfoBtn) closeInfoBtn.addEventListener('click', () => {
        if (infoPanel) infoPanel.style.display = 'none';
    });
    if (toggleReplyBtn) toggleReplyBtn.addEventListener('click', toggleUserReply);
    if (statusDropdown) {
        statusDropdown.addEventListener('change', () => {
            updateReportStatus();
            updateStatusDropdownClass(statusDropdown);
        });
    }
    
    const cancelEditModeBtn = document.getElementById('cancelEditModeBtn');
    if (cancelEditModeBtn) {
        cancelEditModeBtn.addEventListener('click', cancelEditMode);
    }

    // Mobile Sidebar Drawer Toggles
    const mobileMenuToggleBtn = document.getElementById('mobileMenuToggleBtn');
    if (mobileMenuToggleBtn) {
        mobileMenuToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openMobileSidebar();
        });
    }

    const usersMenuToggleBtn = document.getElementById('usersMenuToggleBtn');
    if (usersMenuToggleBtn) {
        usersMenuToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const sidebar = document.querySelector('.sidebar-new');
            if (sidebar) sidebar.classList.remove('collapsed');
            document.body.classList.remove('sidebar-collapsed');
            openMobileSidebar();
        });
    }

    const dashboardMenuToggleBtn = document.getElementById('dashboardMenuToggleBtn');
    if (dashboardMenuToggleBtn) {
        dashboardMenuToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const sidebar = document.querySelector('.sidebar-new');
            if (sidebar) sidebar.classList.remove('collapsed');
            document.body.classList.remove('sidebar-collapsed');
            openMobileSidebar();
        });
    }

    // استقبال رسائل من iframe الـ dashboard للتحكم بالقائمة الجانبية
    window.addEventListener('message', (e) => {
        console.log('Message received in main window:', e.data);
        if (e.data && e.data.type === 'TOGGLE_SIDEBAR') {
            console.log('Opening sidebar from dashboard');
            const sidebar = document.querySelector('.sidebar-new');
            if (sidebar) {
                sidebar.classList.remove('collapsed');
            }
            document.body.classList.remove('sidebar-collapsed');
            openMobileSidebar();
        }
    });

    const headerMenuToggleBtn = document.getElementById('headerMenuToggleBtn');
    if (headerMenuToggleBtn) {
        headerMenuToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openMobileSidebar();
        });
    }

    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            closeMobileSidebar();
        });
    }

    // تهيئة القائمة المنسدلة المخصصة (Custom Dropdown)
    const dropdownContainer = document.getElementById('statusDropdownContainer');
    const dropdownTrigger = document.getElementById('statusDropdownTrigger');
    const dropdownMenu = document.getElementById('statusDropdownMenu');
    
    if (dropdownTrigger && dropdownContainer && dropdownMenu) {
        dropdownTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = dropdownContainer.classList.contains('open');
            if (isOpen) {
                dropdownContainer.classList.remove('open');
                dropdownMenu.style.display = 'none';
            } else {
                dropdownContainer.classList.add('open');
                dropdownMenu.style.display = 'block';
            }
        });
    }

    document.addEventListener('click', () => {
        if (dropdownContainer) {
            dropdownContainer.classList.remove('open');
        }
        if (dropdownMenu) {
            dropdownMenu.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMediaViewer();
    });

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = item.dataset.value;
            if (statusDropdown) {
                statusDropdown.value = value;
                statusDropdown.dispatchEvent(new Event('change'));
            }
            if (dropdownContainer) {
                dropdownContainer.classList.remove('open');
            }
            if (dropdownMenu) {
                dropdownMenu.style.display = 'none';
            }
        });
    });
    if (searchInput) searchInput.addEventListener('input', renderUsersList);
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar-new');
            if (sidebar) sidebar.classList.toggle('collapsed');
            document.body.classList.toggle('sidebar-collapsed', sidebar?.classList.contains('collapsed'));
        });
    }

    if (restoreSidebarBtn) {
        restoreSidebarBtn.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar-new');
            if (sidebar) sidebar.classList.remove('collapsed');
            document.body.classList.remove('sidebar-collapsed');
        });
    }
    
    if (closeEditModalBtn) closeEditModalBtn.addEventListener('click', closeEditModal);
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeEditModal);
    if (saveEditBtn) saveEditBtn.addEventListener('click', saveMessageEdit);
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';
            
            if (!email || !password) {
                if (loginError) {
                    loginError.textContent = '❌ يرجى ملء جميع الحقول';
                    loginError.style.display = 'block';
                }
                return;
            }
            
            handleLogin(email, password);
        });
    }
    
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (sidebarLogoutBtn) sidebarLogoutBtn.addEventListener('click', handleLogout);
    initSettingsEventListeners();

    if (savePasswordBtn) {
        savePasswordBtn.addEventListener('click', async () => {
            if (!currentPassword || !newPassword || !confirmNewPassword || !passwordChangeError) return;
            
            const currentPass = currentPassword.value.trim();
            const newPass = newPassword.value.trim();
            const confirmPass = confirmNewPassword.value.trim();
            
            // إعادة تعيين الخطأ
            passwordChangeError.style.display = 'none';
            
            // التحقق من صحة البيانات
            if (!currentPass || !newPass || !confirmPass) {
                passwordChangeError.textContent = '❌ يرجى ملء جميع الحقول';
                passwordChangeError.style.display = 'block';
                return;
            }
            
            if (newPass !== confirmPass) {
                passwordChangeError.textContent = '❌ كلمتا المرور الجديدة غير متطابقتين';
                passwordChangeError.style.display = 'block';
                return;
            }
            
            if (newPass.length < 6) {
                passwordChangeError.textContent = '❌ يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل';
                passwordChangeError.style.display = 'block';
                return;
            }
            
            try {
                const user = auth().currentUser;
                if (!user || !user.email) {
                    throw new Error('لم يتم تسجيل الدخول');
                }
                
                // إعادة المصادقة أولاً
                const credential = window.EmailAuthProvider.credential(user.email, currentPass);
                await window.reauthenticateWithCredential(user, credential);
                
                // تغيير كلمة المرور
                await window.updatePassword(user, newPass);
                
                showToast('✅ تم تغيير كلمة المرور بنجاح');
                resetPasswordForm();
                
            } catch (error) {
                console.error('خطأ في تغيير كلمة المرور:', error);
                let errorMsg = '❌ حدث خطأ أثناء تغيير كلمة المرور';
                if (error.code === 'auth/wrong-password') {
                    errorMsg = '❌ كلمة المرور الحالية غير صحيحة';
                } else if (error.code === 'auth/weak-password') {
                    errorMsg = '❌ كلمة المرور الجديدة ضعيفة جداً';
                } else if (error.code === 'auth/requires-recent-login') {
                    errorMsg = '❌ يرجى تسجيل الدخول مرة أخرى قبل تغيير كلمة المرور';
                }
                passwordChangeError.textContent = errorMsg;
                passwordChangeError.style.display = 'block';
            }
        });
    }
    
    // الاستماع لطلبات البيانات والثيم من الـ iframe
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'REQUEST_FIREBASE_DATA') {
            console.log('📨 الـ iframe يطلب البيانات، جاري الإرسال...');
            sendDataToDashboard();
        }
        if (event.data && event.data.type === 'REQUEST_THEME') {
            // إرسال الثيم الحالي للـ iframe عند الطلب
            const iframe = document.getElementById('dashboardIframe');
            if (iframe && iframe.contentWindow) {
                try { iframe.contentWindow.postMessage({ type: 'SET_THEME', theme: currentTheme || localStorage.getItem('theme') || 'light' }, '*'); } catch(e) {}
            }
        }
    });
}

// ========== تشغيل التطبيق ==========
function init() {
    console.log('🚀 جاري بدء تطبيق لوحة الدعم...');
    console.log('📦 Collection Name:', COLLECTION_NAME);

    if (!db()) {
        console.error('❌ خطأ: Firebase لم يتم تهيئته بشكل صحيح!');
        showToast('❌ خطأ في تهيئة Firebase!', true);
        return;
    }

    if (supportListenersStarted) {
        loadGuestUsers(true);
        return;
    }

    supportListenersStarted = true;

    loadUsers();
    loadAppUsers();
    loadGuestUsers();
    loadPageViews();
    loadNotificationHistory();
    listenToUserUpdates();
    startPresenceRefresh();
    showToast('✨ تم تشغيل لوحة التحكم بنجاح');
}

function initApp() {
    console.log('🚀 بدء تهيئة التطبيق...');
    initializeDOMElements();
    initTheme();
    initEventListeners();
    initializeShortcuts();
    checkAuthState();
}

// تهيئة نظام المختصرات بعد تحميل DOM
function initializeShortcuts() {
    console.log('initializeShortcuts() called');
    // الحصول على عناصر DOM - تم تعريفها في initializeDOMElements() من قبل!
    // تحميل المختصرات من localStorage
    loadShortcuts();
    displayShortcuts();
    addShortcutEventListeners();
    
    console.log('✅ تم تهيئة نظام المختصرات');
}

// تشغيل عند تحميل الصفحة
// جعل الدوال متاحة عالمياً
window.handleLogin = handleLogin;
window.checkAuthState = checkAuthState;
window.handleLogout = handleLogout;
window.initApp = initApp;
window.initializeDOMElements = initializeDOMElements;
window.deleteShortcut = deleteShortcut;
window.editShortcut = editShortcut;
window.selectAndApplyShortcut = selectAndApplyShortcut;
window.closeShortcutForm = closeShortcutForm;
window.openSettings = openSettings;
window.setSettingsPanel = setSettingsPanel;

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initApp);
} else {
    setTimeout(initApp, 100);
}

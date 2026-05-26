// استيراد Firebase
import { getFirestore, collection, query, onSnapshot, doc, updateDoc, addDoc, orderBy, limit, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';

// تهيئة Firestore
const db = window.db;
const auth = window.auth;
const storage = window.storage || (window.firebaseApp ? getStorage(window.firebaseApp) : null);
const COLLECTION_NAME = "reports";
const USERS_COLLECTION_NAME = "users";
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
let selectedUserId = null;
let activeView = 'chat';
let selectedNotificationUserId = null;
let currentMessages = [];
let messageListener = null;
let currentTheme = 'light';
let selectedAttachmentFile = null;
let selectedAttachmentKind = null;
let attachmentPreviewUrl = null;
let isSendingMessage = false;
let presenceRefreshTimer = null;
const selectedConversationIds = new Set();
const selectedNotificationUserIds = new Set();
const resolvedAttachmentUrls = new Map();

// عناصر DOM للتسجيل الدخول
const loginContainer = document.getElementById('loginContainer');
const appContainer = document.getElementById('appContainer');
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');

// عناصر DOM الجديدة (مطابقة للتصميم الجديد)
const conversationsList = document.getElementById('conversationsList');
const messagesList = document.getElementById('messagesList');
const messagesContainer = document.getElementById('messagesContainer');
const emptyState = document.getElementById('emptyState');
const replyArea = document.getElementById('replyArea');
const chatHeader = document.getElementById('chatHeader');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const attachBtn = document.getElementById('attachBtn');
const attachmentInput = document.getElementById('attachmentInput');
const attachmentPreview = document.getElementById('attachmentPreview');
const searchInput = document.getElementById('searchInput');
const usersCountSpan = document.getElementById('usersCount');
const totalTicketsSpan = document.getElementById('totalTickets');
const messagesEnd = document.getElementById('messagesEnd');
const showInfoBtn = document.getElementById('showInfoBtn');
const infoPanel = document.getElementById('infoPanel');
const closeInfoBtn = document.getElementById('closeInfoBtn');
const infoContent = document.getElementById('infoContent');
const logoutBtn = document.getElementById('logoutBtn');
const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');
const toggleReplyBtn = document.getElementById('toggleReplyBtn');
const toggleStatusBtn = document.getElementById('toggleStatusBtn');
const deleteChatBtn = document.getElementById('deleteChatBtn');
const statusDropdown = document.getElementById('statusDropdown');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const collapseBtn = document.getElementById('collapseSidebar');
const restoreSidebarBtn = document.getElementById('restoreSidebarBtn');
const conversationsCountSpan = document.getElementById('conversationsCount');
const selectAllConversations = document.getElementById('selectAllConversations');
const deleteSelectedChatsBtn = document.getElementById('deleteSelectedChatsBtn');
const selectedChatsCount = document.getElementById('selectedChatsCount');
const mediaViewer = document.getElementById('mediaViewer');
const mediaViewerBody = document.getElementById('mediaViewerBody');
const mediaViewerTitle = document.getElementById('mediaViewerTitle');
const mediaViewerOpenLink = document.getElementById('mediaViewerOpenLink');
const mediaViewerCloseBtn = document.getElementById('mediaViewerCloseBtn');
const mediaViewerBackdrop = document.getElementById('mediaViewerBackdrop');
const chatViewBtn = document.getElementById('chatViewBtn');
const usersViewBtn = document.getElementById('usersViewBtn');
const usersPage = document.getElementById('usersPage');
const usersTableList = document.getElementById('usersTableList');
const usersSearchInput = document.getElementById('usersSearchInput');
const usersPresenceFilter = document.getElementById('usersPresenceFilter');
const selectAllNotificationUsers = document.getElementById('selectAllNotificationUsers');
const deleteSelectedUsersBtn = document.getElementById('deleteSelectedUsersBtn');
const allUsersCount = document.getElementById('allUsersCount');
const notificationSelectedCount = document.getElementById('notificationSelectedCount');
const selectedUserDetails = document.getElementById('selectedUserDetails');
const notificationTitleInput = document.getElementById('notificationTitleInput');
const notificationBodyInput = document.getElementById('notificationBodyInput');
const notificationLinkInput = document.getElementById('notificationLinkInput');
const sendNotificationBtn = document.getElementById('sendNotificationBtn');

// عناصر الـ Modal المخصصة لتعديل الرسالة
let editingMessageId = null;
const editModal = document.getElementById('editModal');
const editMessageTextarea = document.getElementById('editMessageTextarea');
const saveEditBtn = document.getElementById('saveEditBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const closeEditModalBtn = document.getElementById('closeEditModalBtn');

// ========== دوال تسجيل الدخول ==========
function checkAuthState() {
    window.onAuthStateChanged(auth, (user) => {
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
        await window.signInWithEmailAndPassword(auth, email, password);
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
        await window.signOut(auth);
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

    if (isFreshOnline || explicitOnline) {
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

function formatUsage(minutes) {
    if (!minutes) return 'غير متوفر';
    if (minutes < 60) return `${Math.round(minutes)} د`;
    const hours = Math.floor(minutes / 60);
    const rest = Math.round(minutes % 60);
    return rest ? `${hours} س ${rest} د` : `${hours} س`;
}

function buildNotificationUsers() {
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

function getFilteredNotificationUsers() {
    const search = usersSearchInput ? usersSearchInput.value.trim().toLowerCase() : '';
    const presenceFilter = usersPresenceFilter ? usersPresenceFilter.value : 'all';
    return buildNotificationUsers().filter(user => {
        const text = `${getDisplayName(user)} ${getUserEmail(user)} ${getUserKey(user)}`.toLowerCase();
        const presence = getPresenceState(user);
        const matchesPresence =
            presenceFilter === 'all' ||
            (presenceFilter === 'online' && presence.className !== 'offline') ||
            (presenceFilter === 'offline' && presence.className === 'offline');
        return text.includes(search) && matchesPresence;
    });
}

function setActiveView(view) {
    activeView = view;
    const isUsers = view === 'users';

    if (usersPage) usersPage.style.display = isUsers ? 'flex' : 'none';
    const chatMain = document.querySelector('.chat-main');
    if (chatMain) chatMain.style.display = isUsers ? 'none' : 'flex';
    if (chatViewBtn) chatViewBtn.classList.toggle('active', !isUsers);
    if (usersViewBtn) usersViewBtn.classList.toggle('active', isUsers);
    if (isUsers) renderNotificationUsers();
}

function loadUsers() {
    const q = query(collection(db, COLLECTION_NAME));
    
    onSnapshot(q, async (snapshot) => {
        allUsers = [];
        console.log('📊 عدد التقارير:', snapshot.size);
        
        snapshot.forEach(doc => {
            const data = doc.data();
            const messages = data.messages || [];
            const lastMessage = messages[messages.length - 1];
            
            allUsers.push({
                id: doc.id,
                ...data,
                lastMessageText: getReportPreview(data, lastMessage),
                lastMessageTime: lastMessage?.timestamp || data.timestamp || 0,
                unreadCount: getUnreadCount(data, messages)
            });
        });
        
        allUsers.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
        selectedConversationIds.forEach(id => {
            if (!allUsers.some(user => user.id === id)) selectedConversationIds.delete(id);
        });
        
        if (usersCountSpan) usersCountSpan.textContent = allUsers.length;
        if (totalTicketsSpan) totalTicketsSpan.textContent = allUsers.filter(u => u.status !== 'Solved').length;
        if (conversationsCountSpan) conversationsCountSpan.textContent = allUsers.length;
        
        renderUsersList();
        if (activeView === 'users') renderNotificationUsers();
        
        if (allUsers.length === 0) {
            console.warn('⚠️ لا توجد بيانات في قاعدة البيانات بعد!');
        }
    }, (error) => {
        console.error('❌ خطأ في تحميل البيانات:', error);
        showToast('❌ خطأ في تحميل البيانات: ' + error.message, true);
    });
}

function loadAppUsers() {
    const q = query(collection(db, USERS_COLLECTION_NAME));

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

        if (activeView === 'users') renderNotificationUsers();
    }, (error) => {
        console.warn('تعذر تحميل مجموعة users، سيتم الاعتماد على بيانات البلاغات فقط:', error);
    });
}

function renderUsersList() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const filteredUsers = allUsers.filter(user => {
        const searchText = (user.userName || user.userEmail || user.userId || '').toLowerCase();
        return searchText.includes(searchTerm);
    });
    
    if (!conversationsList) return;
    
    if (filteredUsers.length === 0) {
        conversationsList.innerHTML = '<div class="loading-state"><p>لا يوجد مستخدمين</p></div>';
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
    return allUsers
        .filter(user => {
            const searchText = (user.userName || user.userEmail || user.userId || '').toLowerCase();
            return searchText.includes(searchTerm);
        })
        .map(user => user.id);
}

function updateBulkActionsUI(visibleUsers = null) {
    const visibleIds = visibleUsers ? visibleUsers.map(user => user.id) : getVisibleConversationIds();
    const selectedVisibleCount = visibleIds.filter(id => selectedConversationIds.has(id)).length;
    const selectedTotal = selectedConversationIds.size;

    if (selectedChatsCount) selectedChatsCount.textContent = selectedTotal;
    if (deleteSelectedChatsBtn) deleteSelectedChatsBtn.disabled = selectedTotal === 0;
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

    if (allUsersCount) allUsersCount.textContent = buildNotificationUsers().length;
    if (notificationSelectedCount) notificationSelectedCount.textContent = selectedNotificationUserIds.size;
    if (sendNotificationBtn) sendNotificationBtn.disabled = selectedNotificationUserIds.size === 0;
    if (deleteSelectedUsersBtn) deleteSelectedUsersBtn.disabled = selectedNotificationUserIds.size === 0;
    if (selectAllNotificationUsers) {
        selectAllNotificationUsers.checked = visibleIds.length > 0 && selectedVisible === visibleIds.length;
        selectAllNotificationUsers.indeterminate = selectedVisible > 0 && selectedVisible < visibleIds.length;
    }
}

function renderNotificationUsers() {
    if (!usersTableList) return;

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
        const checked = selectedNotificationUserIds.has(key);
        const tokensCount = getFcmTokens(user).length;

        return `
            <div class="user-row-new ${selectedNotificationUserId === key ? 'active' : ''}" data-user-key="${escapeHtml(key)}">
                <label class="user-row-check-new">
                    <input type="checkbox" class="notification-user-checkbox" data-user-key="${escapeHtml(key)}" ${checked ? 'checked' : ''}>
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
                <div class="user-status-pill-new ${presence.className}" data-label="الحالة" title="${escapeHtml(tokensCount ? `${tokensCount} رمز إشعار` : 'لا يوجد رمز إشعار محفوظ')}">${escapeHtml(presence.text)}</div>
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
    const detailRows = [
        ['الاسم', getDisplayName(user)],
        ['البريد', getUserEmail(user)],
        ['معرف المستخدم', user.userId || user.uid],
        ['رقم آخر بلاغ', user.reportId],
        ['الجهاز', user.device],
        ['الصفحة الحالية', getUserLocationText(user)],
        ['إصدار التطبيق', user.appVersion],
        ['رموز FCM', tokens.length ? `${tokens.length} محفوظ` : 'غير متوفر'],
        ['متوسط يومي', formatUsage(usage.daily)],
        ['متوسط أسبوعي', formatUsage(usage.weekly)],
        ['متوسط شهري', formatUsage(usage.monthly)]
    ].filter(([, value]) => value);

    selectedUserDetails.innerHTML = `
        <div class="selected-user-head-new">
            <div class="selected-user-avatar-new">${renderUserAvatar(user, getDisplayName(user))}</div>
            <div>
                <h3>${escapeHtml(getDisplayName(user))}</h3>
                <p>${escapeHtml(getUserEmail(user) || getUserKey(user))}</p>
            </div>
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
    const link = notificationLinkInput ? notificationLinkInput.value.trim() : '';
    const recipients = buildNotificationUsers().filter(user => selectedNotificationUserIds.has(getUserKey(user)));

    if (!title || !body || recipients.length === 0) {
        showToast('اكتب عنوان الإشعار ونصه وحدد مستخدماً واحداً على الأقل', true);
        return;
    }

    try {
        if (sendNotificationBtn) sendNotificationBtn.disabled = true;
        await addDoc(collection(db, NOTIFICATION_REQUESTS_COLLECTION), {
            title,
            body,
            link,
            status: 'pending',
            createdAt: Date.now(),
            createdBy: auth?.currentUser?.email || '',
            recipients: recipients.map(user => ({
                userKey: getUserKey(user),
                userId: user.userId || user.uid || '',
                name: getDisplayName(user),
                email: getUserEmail(user),
                tokens: getFcmTokens(user)
            }))
        });

        showToast(`تم إنشاء طلب إشعار لـ ${recipients.length} مستخدم`);
        if (notificationTitleInput) notificationTitleInput.value = '';
        if (notificationBodyInput) notificationBodyInput.value = '';
        if (notificationLinkInput) notificationLinkInput.value = '';
    } catch (error) {
        console.error('خطأ في إنشاء طلب الإشعار:', error);
        showToast('فشل إنشاء طلب الإشعار', true);
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
    if (sidebar) sidebar.classList.remove('open');
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) overlay.style.display = 'none';
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
    }
}

async function selectUser(userId) {
    cancelEditMode();
    clearSelectedAttachment();
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
        const userRef = doc(db, COLLECTION_NAME, userId);
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
        const userRef = doc(db, COLLECTION_NAME, selectedUserId);
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
        const userRef = doc(db, COLLECTION_NAME, selectedUserId);
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
    await deleteDoc(doc(db, COLLECTION_NAME, userId));
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
        if (conversationsCountSpan) conversationsCountSpan.textContent = allUsers.length;

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
        if (conversationsCountSpan) conversationsCountSpan.textContent = allUsers.length;

        showToast(`تم حذف ${ids.length} محادثة`);
    } catch (error) {
        console.error('خطأ في حذف المحادثات المحددة:', error);
        showToast('فشل حذف بعض المحادثات المحددة', true);
    } finally {
        updateBulkActionsUI();
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
                await deleteDoc(doc(db, USERS_COLLECTION_NAME, appUser.id));
            }

            const uid = getAuthUid({ ...mergedUser, ...appUser });
            if (uid) {
                await addDoc(collection(db, USER_DELETION_REQUESTS_COLLECTION), {
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
        const userRef = doc(db, COLLECTION_NAME, selectedUserId);
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
        const userRef = doc(db, COLLECTION_NAME, selectedUserId);
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
        { label: 'تاريخ التقرير', value: user.timestamp ? new Date(user.timestamp).toLocaleString('ar-SA') : '' }
    ];
    
    let html = infoRows
        .filter(row => row.value)
        .map(row => `
            <div class="info-row-new">
                <div class="info-label-new">${row.label}</div>
                <div class="info-value-new">${escapeHtml(row.value)}</div>
            </div>
        `).join('');
    
    if (user.message) {
        html += `
            <div class="info-row-new" style="border-top: 1px solid var(--gray-200); margin-top: 12px; padding-top: 12px;">
                <div class="info-label-new">وصف المشكلة</div>
                <div class="info-value-new" style="white-space: pre-wrap;">${escapeHtml(user.message)}</div>
            </div>
        `;
    }
    
    infoContent.innerHTML = html;
    if (infoPanel) infoPanel.style.display = 'block';
}

function listenToUserUpdates() {
    const q = query(collection(db, COLLECTION_NAME));
    
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
        if (conversationsCountSpan) conversationsCountSpan.textContent = allUsers.length;
        
        renderUsersList();
        if (activeView === 'users') renderNotificationUsers();
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
        });
        
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (sendBtn && !sendBtn.disabled) handleSendOrSave();
            }
        });
    }
    
    if (attachBtn && attachmentInput) {
        attachBtn.addEventListener('click', () => attachmentInput.click());
        attachmentInput.addEventListener('change', handleAttachmentSelection);
    }
    
    if (sendBtn) sendBtn.addEventListener('click', handleSendOrSave);
    if (chatViewBtn) chatViewBtn.addEventListener('click', () => setActiveView('chat'));
    if (usersViewBtn) usersViewBtn.addEventListener('click', () => setActiveView('users'));
    if (usersSearchInput) usersSearchInput.addEventListener('input', renderNotificationUsers);
    if (usersPresenceFilter) usersPresenceFilter.addEventListener('change', renderNotificationUsers);
    if (selectAllNotificationUsers) selectAllNotificationUsers.addEventListener('change', toggleSelectAllNotificationUsers);
    if (deleteSelectedUsersBtn) deleteSelectedUsersBtn.addEventListener('click', deleteSelectedUsers);
    if (sendNotificationBtn) sendNotificationBtn.addEventListener('click', sendNotificationRequest);
    if (showInfoBtn) showInfoBtn.addEventListener('click', showUserInfo);
    if (deleteChatBtn) deleteChatBtn.addEventListener('click', deleteCurrentChat);
    if (selectAllConversations) selectAllConversations.addEventListener('change', toggleSelectAllConversations);
    if (deleteSelectedChatsBtn) deleteSelectedChatsBtn.addEventListener('click', deleteSelectedChats);
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
}

// ========== تشغيل التطبيق ==========
function init() {
    console.log('🚀 جاري بدء تطبيق لوحة الدعم...');
    console.log('📦 Collection Name:', COLLECTION_NAME);
    
    if (!db) {
        console.error('❌ خطأ: Firebase لم يتم تهيئته بشكل صحيح!');
        showToast('❌ خطأ في تهيئة Firebase!', true);
        return;
    }
    
    loadUsers();
    loadAppUsers();
    listenToUserUpdates();
    startPresenceRefresh();
    showToast('✨ تم تشغيل لوحة التحكم بنجاح');
}

function initApp() {
    initTheme();
    initEventListeners();
    checkAuthState();
}

// تشغيل عند تحميل الصفحة
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initApp);
} else {
    setTimeout(initApp, 100);
}

/**
 * Vanstra Notification Module
 * Provides a reusable notification system with contact support options
 * Include this file in your HTML: <script src="notification-module.js"></script>
 */

(function() {
    'use strict';

    /**
     * Initialize the notification module
     * Call this function after the DOM is loaded
     */
    function initNotificationModule() {
        // Check if notification overlay already exists
        if (document.getElementById('notificationOverlay')) {
            return; // Already initialized
        }

        // Create the notification HTML structure
        const notificationHTML = `
            <div class="notification-overlay" id="notificationOverlay" onclick="closeNotification(event)">
                <div class="notification-box" onclick="event.stopPropagation()">
                    <div class="notification-header">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span id="notificationTitle">Notification</span>
                    </div>
                    <div class="notification-message" id="notificationMessage">Your action has been completed successfully.</div>
                    
                    <div class="notification-contact-section">
                        <div class="contact-title">Need Help? Contact Us</div>
                        <div class="contact-methods">
                            <a href="mailto:support@vanstra.bank" class="contact-method">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                <span>Email: support@vanstra.bank</span>
                            </a>
                            <a href="javascript:void(0)" class="contact-method" onclick="openLiveChat(event)">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                                </svg>
                                <span>Live Chat Support</span>
                            </a>
                        </div>
                    </div>

                    <div class="notification-buttons">
                        <button class="btn-close-notification" onclick="closeNotification()">OK</button>
                        <button class="btn-contact" onclick="openLiveChat(event)">Chat with Support</button>
                    </div>
                </div>
            </div>
        `;

        // Append to body
        document.body.insertAdjacentHTML('beforeend', notificationHTML);

        // Inject CSS into the page
        injectNotificationStyles();
    }

    /**
     * Inject notification CSS styles into the page
     */
    function injectNotificationStyles() {
        const styleId = 'vanstra-notification-styles';
        if (document.getElementById(styleId)) {
            return; // Already injected
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Notification Module Styles */
            :root {
                --notification-navy: #041225;
                --notification-slate: #0B2A3F;
                --notification-gold: #C89A3A;
                --notification-success: #10b981;
                --notification-danger: #ef4444;
            }

            .notification-overlay {
                display: none;
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.7);
                z-index: 999;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(4px);
            }

            .notification-overlay.active {
                display: flex;
            }

            .notification-box {
                background: linear-gradient(135deg, var(--notification-navy), var(--notification-slate));
                border: 1px solid rgba(200, 154, 58, 0.3);
                border-radius: 16px;
                padding: 40px;
                width: 90%;
                max-width: 500px;
                animation: slideUp 0.3s ease;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }

            @keyframes slideUp {
                from {
                    transform: translateY(20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            .notification-header {
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 16px;
                color: var(--notification-gold);
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .notification-header svg {
                width: 28px;
                height: 28px;
                stroke: var(--notification-gold);
            }

            .notification-message {
                font-size: 16px;
                color: #cbd5e1;
                margin-bottom: 32px;
                line-height: 1.6;
            }

            .notification-contact-section {
                margin-bottom: 32px;
                padding: 20px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                border: 1px solid rgba(200, 154, 58, 0.2);
            }

            .contact-title {
                font-size: 14px;
                font-weight: 600;
                color: var(--notification-gold);
                margin-bottom: 16px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .contact-methods {
                display: grid;
                gap: 12px;
            }

            .contact-method {
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(200, 154, 58, 0.2);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 12px;
                color: #e2e8f0;
                text-decoration: none;
                font-size: 14px;
                font-weight: 500;
            }

            .contact-method:hover {
                background: rgba(200, 154, 58, 0.1);
                border-color: var(--notification-gold);
                color: var(--notification-gold);
                transform: translateX(4px);
            }

            .contact-method svg {
                width: 20px;
                height: 20px;
                flex-shrink: 0;
                stroke: currentColor;
            }

            .notification-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
            }

            .btn-close-notification {
                padding: 12px 24px;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                color: #94a3b8;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.2s ease;
            }

            .btn-close-notification:hover {
                background: rgba(255, 255, 255, 0.12);
                color: white;
            }

            .btn-contact {
                padding: 12px 24px;
                background: rgba(200, 154, 58, 0.2);
                border: 1px solid var(--notification-gold);
                border-radius: 8px;
                color: var(--notification-gold);
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.2s ease;
            }

            .btn-contact:hover {
                background: rgba(200, 154, 58, 0.3);
                transform: translateY(-2px);
            }

            @media (max-width: 480px) {
                .notification-box {
                    width: 95%;
                    padding: 24px;
                }

                .notification-header {
                    font-size: 20px;
                }

                .notification-buttons {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Show a notification with title and message
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     */
    window.showNotification = function(title, message) {
        initNotificationModule();
        document.getElementById('notificationTitle').textContent = title;
        document.getElementById('notificationMessage').textContent = message;
        document.getElementById('notificationOverlay').classList.add('active');
    };

    /**
     * Close the notification
     * @param {Event} event - Optional click event
     */
    window.closeNotification = function(event) {
        if (event && event.target !== event.currentTarget) return;
        const overlay = document.getElementById('notificationOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    };

    /**
     * Show a feature coming soon notification
     * @param {string} featureName - Name of the feature
     */
    window.showComingSoon = function(featureName) {
        showNotification(
            'Feature Coming Soon',
            `${featureName} is currently under development. Our team is working hard to bring this feature to you. Please contact support for updates or assistance.`
        );
    };

    /**
     * Open live chat (placeholder for integration)
     * @param {Event} event - Click event
     */
    window.openLiveChat = function(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        // Placeholder for live chat integration
        // Replace this with your actual live chat implementation
        // Example integrations: Intercom, Drift, Zendesk, custom solution
        
        // For now, show a message
        alert('Live chat support will be available soon. Please email support@vanstra.bank for immediate assistance.');
        closeNotification();
    };

    /**
     * Initialize when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNotificationModule);
    } else {
        initNotificationModule();
    }
})();

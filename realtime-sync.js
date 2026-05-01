// Real-time Sync System for Vanstra Bank
// Enables bidirectional real-time updates between admin panel and user dashboards

const VanstraRealtimeSync = (function() {
    'use strict';

    const subscribers = {};
    const syncEvents = [];
    let syncInterval = null;
    let lastSyncTime = 0;

    // Subscribe to real-time events
    function subscribe(channel, callback) {
        if (!subscribers[channel]) {
            subscribers[channel] = [];
        }
        subscribers[channel].push(callback);
        return () => {
            subscribers[channel] = subscribers[channel].filter(cb => cb !== callback);
        };
    }

    // Emit event to all subscribers
    function emit(channel, data) {
        syncEvents.push({
            channel,
            data,
            timestamp: new Date().toISOString()
        });

        if (subscribers[channel]) {
            subscribers[channel].forEach(callback => {
                try {
                    callback(data);
                } catch (e) {
                    console.error(`Error in subscriber for ${channel}:`, e);
                }
            });
        }

        // Store in localStorage for cross-tab communication
        localStorage.setItem('realtimeSyncEvents', JSON.stringify(syncEvents.slice(-50)));
    }

    // Sync users from localhost
    function syncAllUsers() {
        try {
            const users = JSON.parse(localStorage.getItem('vanstraUsers') || '{}');
            emit('users:updated', { users: Object.values(users) });
            lastSyncTime = Date.now();
            return Object.values(users);
        } catch (e) {
            console.error('Sync error:', e);
            return [];
        }
    }

    // Watch for user balance changes
    function watchBalance(userId, callback) {
        return subscribe(`user:${userId}:balance`, callback);
    }

    // Watch for all user updates
    function watchAllUsers(callback) {
        return subscribe('users:updated', callback);
    }

    // Notify balance change
    function notifyBalanceChange(userId, newBalance, oldBalance) {
        try {
            const users = JSON.parse(localStorage.getItem('vanstraUsers') || '{}');
            const user = users[userId];
            
            if (user) {
                emit(`user:${userId}:balance`, {
                    userId,
                    newBalance,
                    oldBalance,
                    user: { ...user, balance: newBalance }
                });

                // Also notify global user update
                emit('users:updated', { users: Object.values(users) });
            }
        } catch (e) {
            console.error('Error notifying balance change:', e);
        }
    }

    // Watch for account status changes
    function watchAccountStatus(userId, callback) {
        return subscribe(`user:${userId}:status`, callback);
    }

    // Notify status change
    function notifyStatusChange(userId, newStatus, oldStatus) {
        try {
            const users = JSON.parse(localStorage.getItem('vanstraUsers') || '{}');
            const user = users[userId];
            
            if (user) {
                emit(`user:${userId}:status`, {
                    userId,
                    newStatus,
                    oldStatus,
                    user
                });

                emit('users:updated', { users: Object.values(users) });
            }
        } catch (e) {
            console.error('Error notifying status change:', e);
        }
    }

    // Start polling for changes
    function startPolling(interval = 1000) {
        if (syncInterval) clearInterval(syncInterval);
        
        syncInterval = setInterval(() => {
            syncAllUsers();
        }, interval);

        // Initial sync
        syncAllUsers();
    }

    // Stop polling
    function stopPolling() {
        if (syncInterval) {
            clearInterval(syncInterval);
            syncInterval = null;
        }
    }

    // Get sync status
    function getSyncStatus() {
        return {
            lastSyncTime,
            isPolling: !!syncInterval,
            subscribers: Object.keys(subscribers).length,
            events: syncEvents.length
        };
    }

    return {
        subscribe,
        emit,
        syncAllUsers,
        startPolling,
        stopPolling,
        watchBalance,
        watchAllUsers,
        watchAccountStatus,
        notifyBalanceChange,
        notifyStatusChange,
        getSyncStatus
    };
})();

// Make globally available
if (typeof window !== 'undefined') {
    window.VanstraRealtimeSync = VanstraRealtimeSync;
}

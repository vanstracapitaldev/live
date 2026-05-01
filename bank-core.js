// Vanstra Bank - Core Banking System
// Complete state management with localStorage persistence

const VanstraBank = (function() {
    'use strict';

    // Default user and account data
    const defaultState = {
        isAuthenticated: false,
        user: {
            id: 'USR-001',
            firstName: 'Alexander',
            lastName: 'Mitchell',
            email: 'alexander.mitchell@email.com',
            phone: '+49 170 123 4567',
            avatar: null,
            accountCreated: '2023-08-15T10:30:00Z'
        },
        accounts: {
            checking: {
                id: 'ACC-CHK-4567',
                name: 'Premium Checking',
                number: '****4567',
                balance: 127543.82,
                currency: 'EUR'
            },
            savings: {
                id: 'ACC-SAV-7890',
                name: 'High-Yield Savings',
                number: '****7890',
                balance: 45230.15,
                apy: 4.85,
                currency: 'EUR'
            },
            investment: {
                id: 'ACC-INV-1122',
                name: 'Investment Portfolio',
                number: '****1122',
                balance: 69466.00,
                ytdReturn: 7654.00,
                currency: 'EUR'
            }
        },
        transactions: [],
        pendingDeposits: [],
        supportTickets: [],
        billers: [],
        recipients: []
    };

    // Sample transactions for demo
    const sampleTransactions = [
        {
            id: 'TXN-' + Date.now(),
            date: new Date().toISOString(),
            type: 'transfer',
            subtype: 'internal',
            description: 'Transfer to Savings',
            amount: -1000.00,
            currency: 'EUR',
            fromAccount: 'checking',
            toAccount: 'savings',
            recipientName: 'Savings Account',
            recipientAccount: '****7890',
            status: 'completed',
            reference: 'REF-' + Math.random().toString(36).substr(2, 8).toUpperCase()
        },
        {
            id: 'TXN-' + (Date.now() - 86400000),
            date: new Date(Date.now() - 86400000).toISOString(),
            type: 'payment',
            subtype: 'bill',
            description: 'Electricity Bill',
            amount: -127.45,
            currency: 'EUR',
            fromAccount: 'checking',
            recipientName: 'E.ON Energy',
            recipientAccount: 'EON-12345678',
            status: 'completed',
            reference: 'REF-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
            category: 'Electricity'
        },
        {
            id: 'TXN-' + (Date.now() - 172800000),
            date: new Date(Date.now() - 172800000).toISOString(),
            type: 'deposit',
            subtype: 'direct',
            description: 'Salary Deposit',
            amount: 5240.00,
            currency: 'EUR',
            toAccount: 'checking',
            recipientName: 'Alexander Mitchell',
            senderName: 'Vanstra Capital Ltd.',
            status: 'completed',
            reference: 'REF-' + Math.random().toString(36).substr(2, 8).toUpperCase()
        },
        {
            id: 'TXN-' + (Date.now() - 259200000),
            date: new Date(Date.now() - 259200000).toISOString(),
            type: 'transfer',
            subtype: 'external',
            description: 'Transfer to Maria Schmidt',
            amount: -500.00,
            currency: 'EUR',
            fromAccount: 'checking',
            recipientName: 'Maria Schmidt',
            recipientBank: 'Deutsche Bank',
            recipientAccount: 'DE89 3704 0044 0532 0130 00',
            status: 'completed',
            reference: 'REF-' + Math.random().toString(36).substr(2, 8).toUpperCase()
        },
        {
            id: 'TXN-' + (Date.now() - 345600000),
            date: new Date(Date.now() - 345600000).toISOString(),
            type: 'payment',
            subtype: 'purchase',
            description: 'Amazon.de',
            amount: -89.99,
            currency: 'EUR',
            fromAccount: 'checking',
            recipientName: 'Amazon.de',
            status: 'completed',
            reference: 'REF-' + Math.random().toString(36).substr(2, 8).toUpperCase()
        }
    ];

    // Initialize state
    function initState() {
        const saved = localStorage.getItem('vanstraBankState');
        if (saved) {
            return JSON.parse(saved);
        }
        defaultState.transactions = sampleTransactions;
        saveState(defaultState);
        return defaultState;
    }

    // Save state to localStorage
    function saveState(state) {
        localStorage.setItem('vanstraBankState', JSON.stringify(state));
    }

    // Get current state
    function getState() {
        return initState();
    }

    // Authentication
    function login(email, password) {
        // Demo login - in real app would validate against server
        if (email === 'alexander.mitchell@email.com' && password === 'password123') {
            const state = getState();
            state.isAuthenticated = true;
            saveState(state);
            return { success: true, user: state.user };
        }
        return { success: false, error: 'Invalid email or password' };
    }

    function logout() {
        const state = getState();
        state.isAuthenticated = false;
        saveState(state);
        return { success: true };
    }

    function isAuthenticated() {
        return getState().isAuthenticated;
    }

    // Update user profile
    function updateProfile(updates) {
        const state = getState();
        state.user = { ...state.user, ...updates };
        saveState(state);
        return { success: true, user: state.user };
    }

    // Update avatar
    function updateAvatar(imageData) {
        const state = getState();
        state.user.avatar = imageData;
        saveState(state);
        return { success: true };
    }

    // Get total balance
    function getTotalBalance() {
        const state = getState();
        return state.accounts.checking.balance + 
               state.accounts.savings.balance + 
               state.accounts.investment.balance;
    }

    // Format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 86400000) return 'Today';
        if (diff < 172800000) return 'Yesterday';
        return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
    }

    function formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('de-DE', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Generate IDs
    function generateTransactionId() {
        return 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    }

    function generateReference() {
        return 'REF-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    }

    // Transfer money
    function transfer(data) {
        const state = getState();
        const fromAcc = state.accounts[data.fromAccount];
        
        if (data.amount > fromAcc.balance) {
            return { success: false, error: 'Insufficient funds' };
        }

        // Deduct from source
        fromAcc.balance -= data.amount;
        
        // Add to destination if internal
        if (data.transferType === 'internal' && data.toAccount) {
            state.accounts[data.toAccount].balance += data.amount;
        }

        const transaction = {
            id: generateTransactionId(),
            date: new Date().toISOString(),
            type: 'transfer',
            subtype: data.transferType,
            description: data.transferType === 'internal' 
                ? `Transfer to ${state.accounts[data.toAccount].name}`
                : `Transfer to ${data.recipientName}`,
            amount: -data.amount,
            currency: 'EUR',
            fromAccount: data.fromAccount,
            toAccount: data.toAccount,
            recipientName: data.transferType === 'internal' 
                ? state.accounts[data.toAccount].name 
                : data.recipientName,
            recipientBank: data.recipientBank,
            recipientAccount: data.recipientAccount,
            status: 'completed',
            reference: generateReference(),
            note: data.note || ''
        };

        state.transactions.unshift(transaction);
        saveState(state);
        return { success: true, transaction };
    }

    // Submit deposit
    function submitDeposit(data) {
        const state = getState();
        
        const deposit = {
            id: generateTransactionId(),
            date: new Date().toISOString(),
            type: 'deposit',
            subtype: 'check',
            description: 'Mobile Check Deposit',
            amount: data.amount,
            currency: 'EUR',
            toAccount: 'checking',
            frontImage: data.frontImage,
            backImage: data.backImage,
            status: 'pending',
            reference: generateReference(),
            estimatedClearance: new Date(Date.now() + 2 * 86400000).toISOString()
        };

        state.pendingDeposits.unshift(deposit);
        state.transactions.unshift(deposit);
        saveState(state);
        return { success: true, deposit };
    }

    // Pay bill
    function payBill(data) {
        const state = getState();
        
        if (data.amount > state.accounts.checking.balance) {
            return { success: false, error: 'Insufficient funds' };
        }

        state.accounts.checking.balance -= data.amount;

        const transaction = {
            id: generateTransactionId(),
            date: new Date().toISOString(),
            type: 'payment',
            subtype: 'bill',
            description: data.billerName,
            amount: -data.amount,
            currency: 'EUR',
            fromAccount: 'checking',
            recipientName: data.billerName,
            recipientAccount: data.referenceNumber,
            status: 'completed',
            reference: generateReference(),
            category: data.category
        };

        state.transactions.unshift(transaction);
        saveState(state);
        return { success: true, transaction };
    }

    // Get transaction by ID
    function getTransaction(id) {
        const state = getState();
        return state.transactions.find(t => t.id === id);
    }

    // Get all transactions
    function getTransactions(limit = 50) {
        return getState().transactions.slice(0, limit);
    }

    // Submit support ticket
    function submitTicket(data) {
        const state = getState();
        const ticket = {
            id: 'TKT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
            date: new Date().toISOString(),
            subject: data.subject,
            category: data.category,
            message: data.message,
            priority: data.priority || 'medium',
            status: 'open'
        };
        state.supportTickets.unshift(ticket);
        saveState(state);
        return { success: true, ticket };
    }

    // Get tickets
    function getTickets() {
        return getState().supportTickets;
    }

    // Reset to defaults (for testing)
    function reset() {
        defaultState.transactions = sampleTransactions;
        defaultState.isAuthenticated = false;
        defaultState.user.avatar = null;
        saveState(defaultState);
    }

    // Public API
    return {
        getState,
        saveState,
        login,
        logout,
        isAuthenticated,
        updateProfile,
        updateAvatar,
        getTotalBalance,
        formatCurrency,
        formatDate,
        formatDateTime,
        transfer,
        submitDeposit,
        payBill,
        getTransaction,
        getTransactions,
        submitTicket,
        getTickets,
        generateTransactionId,
        generateReference,
        reset
    };
})();

// Make available globally
window.VanstraBank = VanstraBank;

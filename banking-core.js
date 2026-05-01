// Vanstra Capital - Core Banking System
// State Management and Core Functions

const BankingSystem = (function() {
    'use strict';

    // Initial state
    const initialState = {
        account: {
            balance: 127543.82,
            accountNumber: '****4567',
            accountType: 'Premium Checking',
            currency: 'EUR'
        },
        savings: {
            balance: 45230.15,
            apy: 4.85,
            accountNumber: '****7890'
        },
        investments: {
            balance: 69466.00,
            ytdReturn: 7654.00
        },
        user: {
            firstName: 'Alexander',
            lastName: 'Mitchell',
            email: 'alexander.mitchell@email.com',
            phone: '+49 170 123 4567'
        },
        transactions: [],
        pendingDeposits: [],
        supportTickets: [],
        billers: [],
        recipients: []
    };

    // Initialize sample transactions
    const sampleTransactions = [
        {
            id: 'TXN-' + Date.now() + '-001',
            date: new Date().toISOString(),
            description: 'Direct Deposit - Salary',
            amount: 5240.00,
            type: 'credit',
            category: 'Income',
            status: 'completed',
            recipient: 'Vanstra Capital Ltd.',
            account: 'checking'
        },
        {
            id: 'TXN-' + (Date.now() - 86400000) + '-002',
            date: new Date(Date.now() - 86400000).toISOString(),
            description: 'Amazon Purchase',
            amount: -127.45,
            type: 'debit',
            category: 'Shopping',
            status: 'completed',
            recipient: 'Amazon.de',
            account: 'checking'
        },
        {
            id: 'TXN-' + (Date.now() - 172800000) + '-003',
            date: new Date(Date.now() - 172800000).toISOString(),
            description: 'Investment Transfer',
            amount: -1000.00,
            type: 'debit',
            category: 'Investment',
            status: 'completed',
            recipient: 'Investment Account',
            account: 'checking'
        },
        {
            id: 'TXN-' + (Date.now() - 259200000) + '-004',
            date: new Date(Date.now() - 259200000).toISOString(),
            description: 'Interest Payment',
            amount: 184.23,
            type: 'credit',
            category: 'Interest',
            status: 'completed',
            recipient: 'Savings Account',
            account: 'savings'
        },
        {
            id: 'TXN-' + (Date.now() - 345600000) + '-005',
            date: new Date(Date.now() - 345600000).toISOString(),
            description: 'ATM Withdrawal',
            amount: -200.00,
            type: 'debit',
            category: 'Cash',
            status: 'completed',
            recipient: 'ATM - Main St',
            account: 'checking'
        }
    ];

    // Initialize sample billers
    const sampleBillers = [
        { id: 1, name: 'E.ON Energy', category: 'Electricity', accountNumber: 'EON-12345678' },
        { id: 2, name: 'Vodafone', category: 'Internet', accountNumber: 'VOD-87654321' },
        { id: 3, name: 'Sky Deutschland', category: 'Cable', accountNumber: 'SKY-11223344' },
        { id: 4, name: 'Berliner Wasserbetriebe', category: 'Water', accountNumber: 'BWB-55667788' },
        { id: 5, name: 'Telekom', category: 'Phone', accountNumber: 'TK-99887766' }
    ];

    // Initialize sample recipients
    const sampleRecipients = [
        { id: 1, name: 'Maria Schmidt', bank: 'Deutsche Bank', accountNumber: 'DE89 3704 0044 0532 0130 00', type: 'external' },
        { id: 2, name: 'Hans Weber', bank: 'Commerzbank', accountNumber: 'DE15 1203 0000 0012 3456 7890', type: 'external' },
        { id: 3, name: 'Investment Account', bank: 'Vanstra Capital', accountNumber: '****7890', type: 'internal' }
    ];

    // Load state from localStorage or initialize
    function loadState() {
        const saved = localStorage.getItem('vanstraBankingState');
        if (saved) {
            return JSON.parse(saved);
        }
        // Initialize with sample data
        initialState.transactions = sampleTransactions;
        initialState.billers = sampleBillers;
        initialState.recipients = sampleRecipients;
        saveState(initialState);
        return initialState;
    }

    // Save state to localStorage
    function saveState(state) {
        localStorage.setItem('vanstraBankingState', JSON.stringify(state));
    }

    // Get current state
    function getState() {
        return loadState();
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
        
        if (diff < 86400000) {
            return 'Today';
        } else if (diff < 172800000) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' });
        }
    }

    // Generate transaction ID
    function generateTransactionId() {
        return 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    }

    // Generate ticket ID
    function generateTicketId() {
        return 'TKT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    }

    // Transfer Money
    function transferMoney(transferData) {
        const state = getState();
        
        // Validate balance
        if (transferData.amount > state.account.balance) {
            return { success: false, error: 'Insufficient funds' };
        }

        // Create transaction
        const transaction = {
            id: generateTransactionId(),
            date: new Date().toISOString(),
            description: `Transfer to ${transferData.recipientName}`,
            amount: -transferData.amount,
            type: 'debit',
            category: 'Transfer',
            status: 'completed',
            recipient: transferData.recipientName,
            recipientBank: transferData.recipientBank,
            recipientAccount: transferData.recipientAccount,
            transferType: transferData.transferType,
            description_note: transferData.description || '',
            account: 'checking'
        };

        // Update balance
        state.account.balance -= transferData.amount;
        
        // Add transaction
        state.transactions.unshift(transaction);
        
        // Save recipient if external and not existing
        if (transferData.transferType === 'external') {
            const exists = state.recipients.find(r => r.accountNumber === transferData.recipientAccount);
            if (!exists) {
                state.recipients.push({
                    id: Date.now(),
                    name: transferData.recipientName,
                    bank: transferData.recipientBank,
                    accountNumber: transferData.recipientAccount,
                    type: 'external'
                });
            }
        }

        saveState(state);
        return { success: true, transaction };
    }

    // Mobile Deposit
    function submitDeposit(depositData) {
        const state = getState();
        
        const deposit = {
            id: generateTransactionId(),
            date: new Date().toISOString(),
            amount: depositData.amount,
            frontImage: depositData.frontImage,
            backImage: depositData.backImage,
            status: 'pending',
            estimatedClearance: new Date(Date.now() + 2 * 86400000).toISOString()
        };

        // Create pending transaction
        const transaction = {
            id: deposit.id,
            date: deposit.date,
            description: 'Mobile Check Deposit',
            amount: depositData.amount,
            type: 'credit',
            category: 'Deposit',
            status: 'pending',
            recipient: 'Pending Clearance',
            account: 'checking'
        };

        state.pendingDeposits.unshift(deposit);
        state.transactions.unshift(transaction);
        
        saveState(state);
        return { success: true, deposit, transaction };
    }

    // Pay Bill
    function payBill(paymentData) {
        const state = getState();
        
        // Validate balance
        if (paymentData.amount > state.account.balance) {
            return { success: false, error: 'Insufficient funds' };
        }

        // Create transaction
        const transaction = {
            id: generateTransactionId(),
            date: new Date().toISOString(),
            description: `Bill Payment - ${paymentData.billerName}`,
            amount: -paymentData.amount,
            type: 'debit',
            category: 'Bills',
            status: 'completed',
            recipient: paymentData.billerName,
            billerCategory: paymentData.category,
            referenceNumber: paymentData.referenceNumber,
            account: 'checking'
        };

        // Update balance
        state.account.balance -= paymentData.amount;
        
        // Add transaction
        state.transactions.unshift(transaction);
        
        saveState(state);
        return { success: true, transaction };
    }

    // Add Biller
    function addBiller(billerData) {
        const state = getState();
        
        const biller = {
            id: Date.now(),
            name: billerData.name,
            category: billerData.category,
            accountNumber: billerData.accountNumber
        };

        state.billers.push(biller);
        saveState(state);
        return { success: true, biller };
    }

    // Submit Support Ticket
    function submitTicket(ticketData) {
        const state = getState();
        
        const ticket = {
            id: generateTicketId(),
            date: new Date().toISOString(),
            subject: ticketData.subject,
            category: ticketData.category,
            message: ticketData.message,
            status: 'open',
            priority: ticketData.priority || 'medium'
        };

        state.supportTickets.unshift(ticket);
        saveState(state);
        return { success: true, ticket };
    }

    // Get transactions
    function getTransactions(limit = 50) {
        const state = getState();
        return state.transactions.slice(0, limit);
    }

    // Get pending deposits
    function getPendingDeposits() {
        const state = getState();
        return state.pendingDeposits;
    }

    // Get billers
    function getBillers() {
        const state = getState();
        return state.billers;
    }

    // Get recipients
    function getRecipients() {
        const state = getState();
        return state.recipients;
    }

    // Get support tickets
    function getTickets() {
        const state = getState();
        return state.supportTickets;
    }

    // Reset state (for testing)
    function resetState() {
        initialState.transactions = sampleTransactions;
        initialState.billers = sampleBillers;
        initialState.recipients = sampleRecipients;
        initialState.pendingDeposits = [];
        initialState.supportTickets = [];
        saveState(initialState);
    }

    // Public API
    return {
        getState,
        formatCurrency,
        formatDate,
        transferMoney,
        submitDeposit,
        payBill,
        addBiller,
        submitTicket,
        getTransactions,
        getPendingDeposits,
        getBillers,
        getRecipients,
        getTickets,
        resetState,
        generateTransactionId,
        generateTicketId
    };
})();

// Export for global use
window.BankingSystem = BankingSystem;

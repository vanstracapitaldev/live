/**
 * Vanstra Capital Banking System - API-backed version
 * Provides same interface as bank-core-v2.js but uses backend API
 * 
 * This is the recommended version for new development.
 * Uses Express backend API for all operations.
 */

const VanstraBank = {
  // Store current user in memory
  currentUser: null,

  /**
   * Login user via API
   */
  login: async function (email, password) {
    try {
      const response = await bankAPI.login(email, password);
      this.currentUser = response.user;
      // Emit event for other components
      this.emit('login', response.user);
      return { success: true, user: response.user };
    } catch (error) {
      const message = bankAPI.getErrorMessage(error);
      console.error('Login failed:', message);
      this.emit('loginError', message);
      throw error;
    }
  },

  /**
   * Signup new user via API
   */
  createAccount: async function (userData) {
    try {
      const { fullName, email, password, phone } = userData;
      const response = await bankAPI.signup(fullName, email, password, phone);
      this.currentUser = response.user;
      this.emit('signup', response.user);
      return { success: true, user: response.user };
    } catch (error) {
      const message = bankAPI.getErrorMessage(error);
      console.error('Signup failed:', message);
      this.emit('signupError', message);
      throw error;
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async function () {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to fetch from API if token exists
    if (bankAPI.isAuthenticated()) {
      try {
        const response = await bankAPI.getCurrentUser();
        this.currentUser = response.user;
        return this.currentUser;
      } catch (error) {
        console.error('Failed to get current user:', error);
        return null;
      }
    }

    return null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: function () {
    return bankAPI.isAuthenticated();
  },

  /**
   * Logout user
   */
  logout: async function () {
    try {
      await bankAPI.logout();
      this.currentUser = null;
      this.emit('logout');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  /**
   * Get all users (ADMIN ONLY)
   */
  getAllUsers: async function () {
    try {
      const response = await bankAPI.getAllUsers();
      // Convert to object format like old system for compatibility
      const usersObj = {};
      if (response.users && Array.isArray(response.users)) {
        response.users.forEach((user) => {
          usersObj[user.id] = user;
        });
      }
      return usersObj;
    } catch (error) {
      console.error('Failed to get users:', error);
      return {};
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async function (fullName, phone, avatar) {
    try {
      const response = await bankAPI.updateUserProfile(fullName, phone, avatar);
      this.currentUser = response.user;
      this.emit('profileUpdated', response.user);
      return response;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  },

  /**
   * Get user transactions
   */
  getTransactions: async function () {
    try {
      const response = await bankAPI.getUserTransactions();
      return response.transactions || [];
    } catch (error) {
      console.error('Failed to get transactions:', error);
      return [];
    }
  },

  /**
   * Create a transaction
   */
  createTransaction: async function (type, amount, description, recipientId = null) {
    try {
      const response = await bankAPI.createTransaction(type, amount, description, recipientId);
      this.currentUser.accountBalance = response.newBalance;
      this.emit('transaction', response.transaction);
      return response;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  },

  /**
   * Admin: Update user balance
   */
  updateUserBalance: async function (userId, balance) {
    try {
      const response = await bankAPI.updateUserBalance(userId, balance);
      this.emit('userBalanceUpdated', { userId, balance });
      return response;
    } catch (error) {
      console.error('Balance update failed:', error);
      throw error;
    }
  },

  /**
   * Admin: Update user account status
   */
  updateUserStatus: async function (userId, status) {
    try {
      const response = await bankAPI.updateUserStatus(userId, status);
      this.emit('userStatusUpdated', { userId, status });
      return response;
    } catch (error) {
      console.error('Status update failed:', error);
      throw error;
    }
  },

  /**
   * Admin: Get dashboard statistics
   */
  getAdminStats: async function () {
    try {
      const response = await bankAPI.getAdminStats();
      return response.stats;
    } catch (error) {
      console.error('Failed to get stats:', error);
      return null;
    }
  },

  /**
   * Admin: Delete user
   */
  deleteUser: async function (userId) {
    try {
      const response = await bankAPI.deleteUser(userId);
      this.emit('userDeleted', userId);
      return response;
    } catch (error) {
      console.error('User deletion failed:', error);
      throw error;
    }
  },

  /**
   * Format currency
   */
  formatCurrency: function (amount) {
    return bankAPI.formatCurrency(amount);
  },

  /**
   * Format date
   */
  formatDate: function (date) {
    return bankAPI.formatDate(date);
  },

  /**
   * Event emitter system
   */
  events: {},

  on: function (eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  },

  off: function (eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter((cb) => cb !== callback);
    }
  },

  emit: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event handler for ${eventName}:`, error);
        }
      });
    }
  },
};

// Automatically load current user on page load if authenticated
document.addEventListener('DOMContentLoaded', async function () {
  if (bankAPI.isAuthenticated()) {
    try {
      const user = await VanstraBank.getCurrentUser();
      if (user) {
        console.log('Authenticated user loaded:', user.fullName);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  }
});

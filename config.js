// API Configuration
// Update this based on your environment

const API_CONFIG = {
  // Local development (backend server runs on port 5000)
  API_BASE_URL: 'http://localhost:5000/api',

  // Master OTPs for development/testing
  MASTER_OTPS: ['271839', '492716', '580317', '634928', '705231'],

  // If true, bypass API failures and use local mock login (dev only!)
  DEV_BYPASS_AUTH: false, // Set to false to show OTP form
  DEV_USER_EMAIL: 'dev@local.test',
  DEV_USER_NAME: 'Dev User',
  DEV_USER_ROLE: 'admin',
  DEV_USER_ID: 'dev-user-0001',
  DEV_USER_BALANCE: 5000,
  DEV_USER_ACCOUNT_NUMBER: 'DE000000001', // Updated: Unique account number for dev user
};

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_CONFIG.API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// Quick fix script - Run this in browser console to clear invalid session
// Open browser DevTools (F12) and paste this in the Console tab

console.log('🔧 Clearing invalid session data...');
localStorage.removeItem('userInfo');
sessionStorage.clear();
console.log('✅ Session cleared! Redirecting to login...');
window.location.href = '/login';

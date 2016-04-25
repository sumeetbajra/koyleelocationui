

module.exports = {
    isLoggedIn: function() {
        return localStorage.getItem('token');
    },

    isVerified: function() {
        return JSON.parse(localStorage.getItem('user')).userStatus == 0
    }
};
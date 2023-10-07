// checkUserStatusMiddleware.js
const User = require('../app/models/userModel'); // Import your User model

const checkUserStatusMiddleware = async (req, res, next) => {
    try {
        const userId = req.session.userId; // Assuming you store user's ID in session after login

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            // User not found, redirect to login page with an error message
            req.flash('error', 'Authentication required.');
            return res.redirect('/login');
        }

        // Check user status and proceed accordingly
        if (user.Status === 'Active') {
            // User is active, allow the request to proceed
            next();
        } else {
            // User is not active (blocked), redirect to the previous page with a message
            req.flash('error', 'Your account has been blocked by the admin.');
            return res.redirect('back');
        }
    } catch (error) {
        console.error(error);
        req.flash('error', 'Internal Server Error.');
        return res.redirect('/login');
    }
};

module.exports = checkUserStatusMiddleware;

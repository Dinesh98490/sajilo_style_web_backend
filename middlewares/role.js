// middlewares/role.js
module.exports = function roleCheck(requiredRole) {
    return function (req, res, next) {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (req.user.role !== requiredRole) {
            return res.status(403).json({ success: false, message: "Forbidden: Insufficient role" });
        }

        next();
    };
};
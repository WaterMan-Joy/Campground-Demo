module.exports.isLoggedIn = (req, res, next) => {
    console.log('REQ.USER...', req.user);
    if (!req.isAuthenticated()) {
        req.flash('error', '로그인이 필요합니다');
        return res.redirect('/login');
    }
    next();
}
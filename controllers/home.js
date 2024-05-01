module.exports = {
    getMenu: (req,res) => {
        res.render('menu', {user: req.user });
    }
};
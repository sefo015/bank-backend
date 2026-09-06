const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer')) {
        try {
            token = token.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sefo_bank_gizli_acar_2026');
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: "İcazə rədd edildi, token etibarsızdır." });
        }
    } else {
        res.status(401).json({ message: "İcazə rədd edildi, token yoxdur." });
    }
};

module.exports = { protect };
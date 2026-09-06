const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email və şifrə daxil edilməlidir." });
        }

        const user = await prisma.customer.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ message: "İstifadəçi tapılmadı." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Yanlış şifrə." });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'sefo_bank_gizli_acar_2026',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Uğurlu giriş",
            token,
            user: {
                id: user.id,
                fullName: `${user.firstName} ${user.lastName}`,
                email: user.email,
                balance: user.balance,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Sistem xətası", error: error.message });
    }
};

module.exports = { login };
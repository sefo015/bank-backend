const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkWorker = (req, res) => {
    if (req.user.role !== 'WORKER') {
        res.status(403).json({ message: "Bu əməliyyat üçün hüququnuz yoxdur." });
        return false;
    }
    return true;
};

const getAllCustomers = async (req, res) => {
    try {
        if (!checkWorker(req, res)) return;

        const customers = await prisma.customer.findMany({
            where: {
                email: { not: 'nazimaliyev10@sefobank.com' } // Yalnız işçi hesabını çıxarırıq
            },
            select: {
                id: true, firstName: true, lastName: true,
                email: true, balance: true, isActive: true,
                idNumber: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: "Müştəriləri gətirərkən xəta baş verdi", error: error.message });
    }
};

const getAllLoans = async (req, res) => {
    try {
        if (!checkWorker(req, res)) return;

        const loans = await prisma.credit.findMany({
            include: {
                customer: { select: { firstName: true, lastName: true, idNumber: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ message: "Kreditləri gətirərkən xəta", error: error.message });
    }
};

const updateLoanStatus = async (req, res) => {
    try {
        if (!checkWorker(req, res)) return;

        const { loanId, status } = req.body;

        const updatedLoan = await prisma.credit.update({
            where: { id: parseInt(loanId) },
            data: { status: parseInt(status) }
        });

        res.status(200).json({ message: "Kredit statusu yeniləndi", loan: updatedLoan });
    } catch (error) {
        res.status(500).json({ message: "Status yenilənmədi", error: error.message });
    }
};

module.exports = { getAllCustomers, getAllLoans, updateLoanStatus };
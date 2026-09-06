const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getBalanceAndTransactions = async (req, res) => {
    try {
        const customer = await prisma.customer.findUnique({
            where: { id: req.user.id },
            select: {
                balance: true,
                transactions: { orderBy: { date: 'desc' }, take: 10 }
            }
        });
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: "Məlumatları gətirərkən xəta baş verdi", error: error.message });
    }
};

const makeTransfer = async (req, res) => {
    try {
        const { amount, recipient } = req.body;
        const customerId = req.user.id;
        const numAmount = parseFloat(amount);

        const customer = await prisma.customer.findUnique({ where: { id: customerId } });

        if (customer.balance < numAmount) {
            return res.status(400).json({ message: "Balansda kifayət qədər vəsait yoxdur." });
        }

        const updatedCustomer = await prisma.customer.update({
            where: { id: customerId },
            data: {
                balance: { decrement: numAmount },
                transactions: {
                    create: { title: recipient, amount: numAmount, type: 'EXPENSE' }
                }
            }
        });

        res.status(200).json({ message: "Köçürmə uğurludur", balance: updatedCustomer.balance });
    } catch (error) {
        res.status(500).json({ message: "Transfer xətası", error: error.message });
    }
};

const applyForLoan = async (req, res) => {
    try {
        const { amount, interestRate, termMonths, currencyType } = req.body;
        const customerId = req.user.id;
        const numAmount = parseFloat(amount);

        const updatedCustomer = await prisma.customer.update({
            where: { id: customerId },
            data: {
                balance: { increment: numAmount },
                credits: {
                    create: { amount: numAmount, interestRate, termMonths, currencyType }
                },
                transactions: {
                    create: { title: `Kredit (${currencyType})`, amount: numAmount, type: 'INCOME' }
                }
            }
        });

        res.status(200).json({ message: "Kredit təsdiqləndi və balansa oturdu", balance: updatedCustomer.balance });
    } catch (error) {
        res.status(500).json({ message: "Kredit xətası", error: error.message });
    }
};

module.exports = { getBalanceAndTransactions, makeTransfer, applyForLoan };
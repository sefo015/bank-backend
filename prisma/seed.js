const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("123456", 10);

    await prisma.customer.upsert({
        where: { email: "tural.abbasov@gmail.com" },
        update: {},
        create: {
            pinCode: "7A3B9X1",
            idSerial: "AA",
            idNumber: "1234567",
            firstName: "Tural",
            lastName: "Abbasov",
            email: "tural.abbasov@gmail.com",
            password: hashedPassword,
            balance: 24500.00,
            sex: "M",
            incomes: { create: [{ monthlyIncome: 2500.00 }] },
            phones: { create: [{ phoneNumber: "+994501234567" }] },
            cards: { create: [{ cardNumber: "4169738800001111", cardType: "Black Elite Metal" }] }
        }
    });

    await prisma.customer.upsert({
        where: { email: "leyla.m@mail.ru" },
        update: {},
        create: {
            pinCode: "9K2M4P5",
            idSerial: "AA",
            idNumber: "7654321",
            firstName: "Leyla",
            lastName: "Məmmədova",
            email: "leyla.m@mail.ru",
            password: hashedPassword,
            balance: 15200.00,
            sex: "F",
            incomes: { create: [{ monthlyIncome: 1800.00 }] },
            phones: { create: [{ phoneNumber: "+994559876543" }] },
            cards: { create: [{ cardNumber: "4169738800002222", cardType: "Digital Standard" }] },
            credits: {
                create: [{
                    amount: 5000,
                    interestRate: 12.0,
                    termMonths: 12,
                    currencyType: "AZN",
                    status: 1
                }]
            }
        }
    });

    await prisma.customer.upsert({
        where: { email: "nazimaliyev10@sefobank.com" },
        update: {},
        create: {
            pinCode: "WRK9999",
            idSerial: "AA",
            idNumber: "0000000",
            firstName: "Nazim",
            lastName: "Əliyev",
            email: "nazimaliyev10@sefobank.com",
            password: hashedPassword,
            role: "WORKER",
            balance: 0,
            sex: "M"
        }
    });

    console.log(" Baza təsadüfi məlumatlarla uğurla dolduruldu!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
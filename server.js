const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const bankRoutes = require('./routes/bankRoutes');
const workerRoutes = require('./routes/workerRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/worker', workerRoutes);

app.use((err, req, res, next) => {
    console.error("Qlobal Xəta:", err.stack);
    res.status(500).json({ message: 'Daxili server xətası baş verdi!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server ${PORT} portunda işə düşdü`);
});
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json(beritaTerkini);
});

const beritaTerkini = {
    status: "ok",
    totalResults: 5,
    articles: [
        {
            id: 1,
            title: "CARA HEMAT BANGUN RUMAH SENDIRI",
            description: "CARA HEMAT BANGUN RUMAH SENDIRI",
            url: "https://www.youtube.com/watch?v=1XothSl9bPI",
            urlToImage: "https://img.youtube.com/vi/1XothSl9bPI/hqdefault.jpg"
        },
        {
            id: 2,
            title: "Mengenal Dan Menentukan Tipe Rumah",
            description: "Mengenal Dan Menentukan Tipe Rumah",
            url: "https://www.youtube.com/watch?v=Hb0b6Zgf3Lw",
            urlToImage: "https://img.youtube.com/vi/Hb0b6Zgf3Lw/hqdefault.jpg"
        },
        {
            id: 3,
            title: "Rumah Pertama Untuk Anak Muda",
            description: "Rumah Pertama Untuk Anak Muda",
            url: "https://www.youtube.com/watch?v=SaHo6QewrK4",
            urlToImage: "https://img.youtube.com/vi/SaHo6QewrK4/hqdefault.jpg"
        },
        {
            id: 4,
            title: "Tahapan Pembangunan Konstruksi RUMAH MINIMALIS MODERN",
            description: "Tahapan Pembangunan Konstruksi RUMAH MINIMALIS MODERN",
            url: "https://www.youtube.com/watch?v=gotG93D14uw",
            urlToImage: "https://img.youtube.com/vi/gotG93D14uw/hqdefault.jpg"
        },
        {
            id: 5,
            title: "Jangan Sampai Rugi Jutaan! Perhatikan Ini Saat Proses Membangun Rumah Sendiri",
            description: "Jangan Sampai Rugi Jutaan! Perhatikan Ini Saat Proses Membangun Rumah Sendiri",
            url: "https://www.youtube.com/watch?v=i2DHGOBtAm4",
            urlToImage: "https://img.youtube.com/vi/i2DHGOBtAm4/hqdefault.jpg"
        }
    ]
};

module.exports = router;

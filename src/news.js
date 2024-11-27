const express = require('express');
const router = express.Router();

const beriterkini = [
    {
        id : 1,
        title : "CARA HEMAT BANGUN RUMAH SENDIRI ",
        description: "CARA HEMAT BANGUN RUMAH SENDIRI ",
        ytlink : "https://www.youtube.com/watch?v=1XothSl9bPI" 
    },
    {
        id : 2,
        title : "Mengenal Dan Menentukan Tipe Rumah",
        description: "Mengenal Dan Menentukan Tipe Rumah",
        ytlink : "https://www.youtube.com/watch?v=Hb0b6Zgf3Lw"
 
    },
    {
        id : 3,
        title : "Rumah Pertama Untuk Anak Muda",
        description: "Rumah Pertama Untuk Anak Muda",
        ytlink : "https://www.youtube.com/watch?v=SaHo6QewrK4"
 
    },
    {
        id : 4,
        title : "Tahapan Pembangunan Konstruksi RUMAH MINIMALIS MODERN",
        description: "Tahapan Pembangunan Konstruksi RUMAH MINIMALIS MODERN",
        ytlink : "https://www.youtube.com/watch?v=gotG93D14uw"
    },
    {
        id : 5,
        title : " Jangan Sampai Rugi Jutaan! Perhatikan Ini Saat Proses Membangun Rumah Sendiri ",
        description: " Jangan Sampai Rugi Jutaan! Perhatikan Ini Saat Proses Membangun Rumah Sendiri ",
        ytlink : "https://www.youtube.com/watch?v=i2DHGOBtAm4"
    }
];

router.get('/:id', (req,res) => {
    const beritaId = parseInt(req.params.id);
    const berita = beriterkini.find(item => item.id === beritaId);


    if (!berita){
        return res.status(404).json({ error : 'berita tidak ditemukan'})
    };

    res.status(200).json({
        title: berita.title,
        description : berita.description,
        link : berita.ytlink,
     });
});

module.exports = router;




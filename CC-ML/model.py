import mysql.connector as mysql
import pandas as pd
import ast
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
import numpy as np

# Fungsi untuk membaca data dari MariaDB
def read_data_from_db():
    db = mysql.connect(
        host="34.101.96.71",
        user="root",
        password="123",  # Ganti dengan password database Anda
        database="ProjectMandor"
    )
    query = "SELECT * FROM Mandors"
    dataset = pd.read_sql(query, db)
    db.close()
    return dataset

# Fungsi untuk mengonversi string menjadi list dengan aman
def safe_eval(value):
    try:
        return ast.literal_eval(value)
    except (SyntaxError, ValueError):
        return []  # Jika format salah, kembalikan daftar kosong

# Fungsi untuk normalisasi input
def normalize_input(column, min_value, max_value):
    return (column - min_value) / (max_value - min_value)

# Fungsi untuk memproses data dari API dan mengembalikan hasil FilteredMandors
def process_data(data):
    # Baca data dari database
    dataset = read_data_from_db()
    
    # Proses kolom layanan_lain dan jangkauan
    dataset['layanan_lain'] = dataset['layanan_lain'].apply(safe_eval)
    dataset['jangkauan'] = dataset['jangkauan'].apply(safe_eval)
    
    # Ekstraksi nilai unik dari layanan_lain dan jangkauan
    unique_services = list(set([service.strip() for sublist in dataset['layanan_lain'] for service in sublist]))
    unique_locations = list(set([loc.strip() for sublist in dataset['jangkauan'] for loc in sublist]))
    
    # Mapping encoding
    service_to_idx = {service: idx for idx, service in enumerate(unique_services)}
    location_to_idx = {loc: idx for idx, loc in enumerate(unique_locations)}
    
    # Encode kolom menjadi indeks
    dataset['layanan_indices'] = dataset['layanan_lain'].apply(
        lambda x: [service_to_idx[service.strip()] for service in x]
    )
    dataset['location_indices'] = dataset['jangkauan'].apply(
        lambda x: [location_to_idx[loc.strip()] for loc in x]
    )
    
    # Normalisasi kolom numerik
    dataset['rating_user_norm'] = normalize_input(dataset['rating_user'], 1, 5)
    dataset['pengalaman_norm'] = normalize_input(dataset['pengalaman'], 1, 5)
    dataset['portofolio_norm'] = normalize_input(dataset['portofolio'], 1, 5)
    
    # Pad kolom layanan_indices dan location_indices
    X_services = pad_sequences(dataset['layanan_indices'], maxlen=10, padding='post')
    X_locations = pad_sequences(dataset['location_indices'], maxlen=10, padding='post')
    
    # Ambil fitur lainnya
    X_rating_user = dataset['rating_user_norm'].values
    X_pengalaman = dataset['pengalaman_norm'].values
    X_portofolio = dataset['portofolio_norm'].values
    
    # Ambil MandorID
    mandor_ids = dataset['MandorID'].values
    
    # Muat model
    model = load_model("model.h5")
    
    # Train the model (tanpa menyimpan model yang telah dilatih)
    history = model.fit(
        [X_services, X_locations, X_rating_user, X_pengalaman, X_portofolio],
        np.ones(X_services.shape[0]),  # Dummy relevance score for training
        epochs=10,
        batch_size=32,
        validation_data=([X_services, X_locations, X_rating_user, X_pengalaman, X_portofolio], np.ones(X_services.shape[0])),  # Dummy relevance score for validation
        verbose=1
    )

    # Prediksi relevansi untuk input pengguna (gunakan data input pengguna yang sudah diproses)
    prediksi_relevance = model.predict([X_services, X_locations, X_rating_user, X_pengalaman, X_portofolio])
    
    # Gabungkan MandorID dengan skor relevansi
    mandor_scores = list(zip(mandor_ids, prediksi_relevance.flatten()))
    
    # Urutkan berdasarkan skor relevansi tertinggi
    mandor_scores_sorted = sorted(mandor_scores, key=lambda x: x[1], reverse=True)
    
    # Ambil 10 mandor dengan relevansi tertinggi
    top_10_mandors = mandor_scores_sorted[:10]
    
    # Menghasilkan ID Mandor yang terpilih dalam format "id1,id2,id3,..."
    filtered_mandors = [str(mandor_id) for mandor_id, _ in top_10_mandors]
    
    return filtered_mandors

import mysql.connector as mysql
import pandas as pd
import ast
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
import numpy as np

def read_data_from_db():
    db = mysql.connect(
        host="34.101.86.126",
        user="root",
        password="cpmandoor",
        database="ProjectMandor"
    )
    query = "SELECT * FROM Mandors"
    dataset = pd.read_sql(query, db)
    db.close()
    return dataset

def safe_eval(value):
    try:
        return ast.literal_eval(value)
    except (SyntaxError, ValueError):
        return []

def normalize_input(column, min_value, max_value):
    return (column - min_value) / (max_value - min_value)

def process_data(data):
    dataset = read_data_from_db()

    dataset['layanan_lain'] = dataset['layanan_lain'].apply(safe_eval)
    dataset['jangkauan'] = dataset['jangkauan'].apply(safe_eval)

    unique_services = list(set([service.strip() for sublist in dataset['layanan_lain'] for service in sublist]))
    unique_locations = list(set([loc.strip() for sublist in dataset['jangkauan'] for loc in sublist]))

    service_to_idx = {service: idx for idx, service in enumerate(unique_services)}
    location_to_idx = {loc: idx for idx, loc in enumerate(unique_locations)}

    dataset['layanan_indices'] = dataset['layanan_lain'].apply(
        lambda x: [service_to_idx[service.strip()] for service in x]
    )
    dataset['location_indices'] = dataset['jangkauan'].apply(
        lambda x: [location_to_idx[loc.strip()] for loc in x]
    )

    dataset['rating_user_norm'] = normalize_input(dataset['rating_user'], 1, 5)
    dataset['pengalaman_norm'] = normalize_input(dataset['pengalaman'], 1, 5)
    dataset['portofolio_norm'] = normalize_input(dataset['portofolio'], 1, 5)
    
    X_services = pad_sequences(dataset['layanan_indices'], maxlen=10, padding='post')
    X_locations = pad_sequences(dataset['location_indices'], maxlen=10, padding='post')
    
    X_rating_user = dataset['rating_user_norm'].values
    X_pengalaman = dataset['pengalaman_norm'].values
    X_portofolio = dataset['portofolio_norm'].values

    mandor_ids = dataset['MandorID'].values
    
    model = load_model("model.h5")

    history = model.fit(
        [X_services, X_locations, X_rating_user, X_pengalaman, X_portofolio],
        np.ones(X_services.shape[0]),
        epochs=5,
        batch_size=32,
        validation_data=([X_services, X_locations, X_rating_user, X_pengalaman, X_portofolio], np.ones(X_services.shape[0])),
        verbose=1
    )

    prediksi_relevance = model.predict([X_services, X_locations, X_rating_user, X_pengalaman, X_portofolio])
    
    mandor_scores = list(zip(mandor_ids, prediksi_relevance.flatten()))

    mandor_scores_sorted = sorted(mandor_scores, key=lambda x: x[1], reverse=True)
    
    top_10_mandors = mandor_scores_sorted[:10]
    
    filtered_mandors = [str(mandor_id) for mandor_id, _ in top_10_mandors]
    
    return filtered_mandors

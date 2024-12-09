from flask import Flask, request, jsonify
import jwt
import datetime
from functools import wraps
from google.cloud import storage
import os
import mysql.connector
from model import process_data

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', '123456789')

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "auth.json" 
GCS_BUCKET_NAME = os.getenv('GCS_BUCKET_NAME', 'alkaa')

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv('DB_HOST', '34.101.96.71'),
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASSWORD', '123'),
        database=os.getenv('DB_NAME', 'ProjectMandor')
    )
    

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Token is missing!"}), 403
        try:
            token = token.split(" ")[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            request.userId = data['userId']  
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired!"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token!"}), 401
        return f(*args, **kwargs)
    return decorated_function

def upload_to_gcs(file):
    try:
        client = storage.Client()
        bucket = client.bucket(GCS_BUCKET_NAME)
        blob = bucket.blob(f"{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}-{file.filename}")

        blob.upload_from_file(file, content_type=file.content_type)
        return f"https://storage.googleapis.com/{GCS_BUCKET_NAME}/{blob.name}"
    except Exception as e:
        raise Exception(f"Failed to upload file: {e}")

@app.route('/survey', methods=['POST'])
@token_required
def create_or_update_survey():
    try:
        userId = request.userId
        Budget = request.form.get('Budget')
        Deskripsi = request.form.get('Deskripsi')
        Alamat = request.form.get('Alamat')  # Digunakan sebagai "jangkauan"
        Tanggal = request.form.get('Tanggal')
        Rating = request.form.get('Rating')
        Pengalaman = request.form.get('Pengalaman')
        Portofolio = request.form.get('Portofolio')
        layanan_lain = request.form.get('layanan_lain')  # Input layanan_lain untuk filtering
        file = request.files.get('image')

        # Validasi input
        if not all([Budget, Deskripsi, Alamat, Tanggal, Rating, Pengalaman, Portofolio]):
            return jsonify({"error": "Missing required fields"}), 400

        # Proses data untuk filtering mandor
        input_data = {
            "layanan_lain": layanan_lain,  # Hanya untuk filtering
            "jangkauan": Alamat,
            "rating_user": Rating,
            "pengalaman": Pengalaman,
            "portofolio": Portofolio,
        }
        filtered_mandors = process_data(input_data)  # Fungsi ini mengolah data untuk mendapatkan mandor yang sesuai
        filtered_mandors_str = ",".join(filtered_mandors)

        # Upload foto ke Google Cloud Storage jika ada
        foto_url = None
        if file:
            foto_url = upload_to_gcs(file)

        # Koneksi ke database
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Cek apakah survey untuk user ini sudah ada
        cursor.execute("SELECT * FROM Surveys WHERE UserID = %s", (userId,))
        existing_survey = cursor.fetchone()

        if existing_survey:
            # Update survey jika sudah ada
            cursor.execute("""
                UPDATE Surveys 
                SET Budget = %s, Deskripsi = %s, Alamat = %s, Tanggal = %s, 
                    FilteredMandors = %s, Foto = COALESCE(%s, Foto)
                WHERE UserID = %s
            """, (Budget, Deskripsi, Alamat, Tanggal, filtered_mandors_str, foto_url, userId))
            message = "Survey updated successfully"
        else:
            # Buat survey baru jika belum ada
            cursor.execute("""
                INSERT INTO Surveys (UserID, Budget, Deskripsi, Alamat, Tanggal, FilteredMandors, Foto)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (userId, Budget, Deskripsi, Alamat, Tanggal, filtered_mandors_str, foto_url))
            message = "Survey created successfully"

        # Commit perubahan
        conn.commit()
        cursor.close()
        conn.close()

        # Response berhasil
        return jsonify({"message": message, "FilteredMandors": filtered_mandors_str}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/survey', methods=['GET'])
@token_required
def get_surveys():
    try:
        userId = request.userId
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM Surveys WHERE UserID = %s", (userId,))
        surveys = cursor.fetchall()

        if not surveys:
            return jsonify({"error": "No surveys found for this user"}), 404

        return jsonify(surveys), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, threaded=True)

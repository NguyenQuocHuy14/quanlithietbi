from flask import Flask, request, jsonify
from sklearn.linear_model import LinearRegression
import numpy as np
from datetime import datetime, timedelta

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        usage_count = data.get('usageCount', 0)
        
        # --- LOGIC DỰ BÁO ĐƠN GIẢN (LINEAR REGRESSION) ---
        # Giả lập dữ liệu training: 
        # Cột 1: Số lần sử dụng. Cột 2: Số ngày bền còn lại
        X_train = np.array([[0], [50], [100], [200], [500]]) 
        y_train = np.array([180, 150, 120, 90, 30]) # Càng dùng nhiều, thời gian bảo trì càng rút ngắn

        model = LinearRegression()
        model.fit(X_train, y_train)

        # Dự báo số ngày còn lại dựa trên số lần dùng hiện tại
        days_left = model.predict(np.array([[usage_count]]))[0]
        
        # Đảm bảo không ra số âm, ít nhất là 7 ngày
        if days_left < 7: days_left = 7

        # Tính ngày cụ thể
        today = datetime.now()
        next_maintenance = today + timedelta(days=int(days_left))

        return jsonify({
            "success": True,
            "days_remaining": int(days_left),
            "predicted_date": next_maintenance.isoformat()
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    print("AI Service đang chạy tại cổng 5001...")
    app.run(port=5001, debug=True)
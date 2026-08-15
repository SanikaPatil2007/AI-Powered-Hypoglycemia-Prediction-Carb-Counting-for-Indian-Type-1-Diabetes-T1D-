
import joblib
import pandas as pd

# Load trained model
model = joblib.load("hypoglycemia_rf_model.pkl")

# Load feature names
features = joblib.load("model_features.pkl")

# Load prediction threshold
threshold = joblib.load("prediction_threshold.pkl")


def predict_hypoglycemia(
    glucose,
    glucose_5min_ago,
    glucose_15min_ago,
    glucose_30min_ago,
    glucose_change_5min,
    glucose_change_15min,
    glucose_change_30min,
    basal_rate,
    bolus_volume_delivered,
    carb_input,
    heart_rate,
    steps,
    calories,
    time_of_day
):

    input_data = pd.DataFrame([{
        "glucose": glucose,
        "glucose_5min_ago": glucose_5min_ago,
        "glucose_15min_ago": glucose_15min_ago,
        "glucose_30min_ago": glucose_30min_ago,
        "glucose_change_5min": glucose_change_5min,
        "glucose_change_15min": glucose_change_15min,
        "glucose_change_30min": glucose_change_30min,
        "basal_rate": basal_rate,
        "bolus_volume_delivered": bolus_volume_delivered,
        "carb_input": carb_input,
        "heart_rate": heart_rate,
        "steps": steps,
        "calories": calories,
        "time_of_day": time_of_day
    }])

    # Make sure feature order is exactly the same as during training
    input_data = input_data[features]

    # Get probability of hypoglycemia
    probability = model.predict_proba(input_data)[0][1]

    # Apply trained threshold
    prediction = int(probability >= threshold)

    # Determine risk level
    if probability >= 0.70:
        risk = "HIGH"
    elif probability >= 0.50:
        risk = "MODERATE"
    else:
        risk = "LOW"

    return {
        "prediction": prediction,
        "risk_probability": round(float(probability) * 100, 2),
        "risk": risk
    }


print("Hypoglycemia prediction module loaded successfully! ✅")

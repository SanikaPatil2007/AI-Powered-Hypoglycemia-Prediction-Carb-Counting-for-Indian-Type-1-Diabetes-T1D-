\# 🩺 AI-Powered Hypoglycemia Prediction \& Carb-Counting for Indian Type 1 Diabetes



\## 📌 About the Project



This project aims to develop an AI-powered system for predicting the risk of hypoglycemia in people with Type 1 Diabetes (T1D).



The system analyzes historical glucose measurements along with insulin, carbohydrate intake, physical activity, heart rate, calories, and time-of-day information to predict whether hypoglycemia may occur in the upcoming 30–60 minutes.



\---



\## 🎯 Problem Statement



Hypoglycemia is a serious challenge for people with Type 1 Diabetes. Detecting the risk early can help provide timely warnings and support better diabetes management.



Our system uses machine learning to identify patterns in glucose levels and related factors and estimate the probability of future hypoglycemia.



\---



\## 🤖 Machine Learning Model



For the hypoglycemia prediction module, we trained a:



\*\*Random Forest Classifier\*\*



The final model uses 14 features:



1\. Glucose

2\. Glucose 5 minutes ago

3\. Glucose 15 minutes ago

4\. Glucose 30 minutes ago

5\. Glucose change over 5 minutes

6\. Glucose change over 15 minutes

7\. Glucose change over 30 minutes

8\. Basal insulin rate

9\. Bolus insulin

10\. Carbohydrate input

11\. Heart rate

12\. Steps

13\. Calories

14\. Time of day



\---



\## 📊 Model Performance



\### Test Performance



| Metric | Result |

|---|---:|

| Accuracy | 90.71% |

| ROC-AUC | 92.57% |

| PR-AUC | 44.16% |

| Hypoglycemia Precision | 36.07% |

| Hypoglycemia Recall | 72.50% |

| Hypoglycemia F1-Score | 48.17% |



\### Confusion Matrix



| | Predicted Normal | Predicted Hypoglycemia |

|---|---:|---:|

| Actual Normal | 10020 | 888 |

| Actual Hypoglycemia | 190 | 501 |



\---






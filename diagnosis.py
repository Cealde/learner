import os
import joblib
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(ROOT, 'models', 'diagnosis_model_final.joblib')
_MODELS = None

def load_diagnosis_models():
    global _MODELS
    if _MODELS is None:
        _MODELS = joblib.load(MODEL_PATH)
    return _MODELS

def diagnose_answer(concept, question, student_answer):
    models = load_diagnosis_models()
    if concept not in models:
        raise ValueError(f'No trained model for concept: {concept}')
    bundle = models[concept]
    text = 'QUESTION: ' + str(question) + ' ANSWER: ' + str(student_answer)
    X = bundle['vectorizer'].transform([text])
    clf = bundle['classifier']
    probs = clf.predict_proba(X)[0]
    idx = int(np.argmax(probs))
    label = clf.classes_[idx]
    return {
        'concept': concept,
        'is_correct': label == 'CORRECT',
        'misconception_label': label,
        'confidence': round(float(probs[idx]), 4),
        'diagnosis_source': 'trained_ml_model'
    }
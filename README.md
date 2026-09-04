# AI-Based Multilingual Adaptive Python Tutor

Backend prototype for an adaptive introductory Python programming tutor.

## Runtime Architecture

Student Answer → Trained ML Diagnosis → Learner State → Adaptive Policy → Gemini Teaching

Runtime misconception diagnosis uses 65 concept-specific TF-IDF + Logistic Regression classifiers.

Gemini is NOT used for runtime misconception diagnosis.

Gemini is used only for multilingual adaptive teaching and context-aware doubt clarification.

## Dataset

- 2940 labeled records
- 65 concepts
- 131 misconception classes
- 196 concept-label groups

## Main Integration Functions

- diagnose_answer(...)
- process_student_answer(...)
- adaptive_tutor_step(...)
- answer_doubt(...)

## Setup

Install requirements:

    pip install -r requirements.txt

Set GEMINI_API_KEY before using teaching/chatbot generation.

Do not commit the API key.
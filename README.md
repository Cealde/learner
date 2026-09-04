# AI-Based Multilingual Adaptive Python Tutor

## Overview

The AI-Based Multilingual Adaptive Python Tutor is an adaptive learning backend designed to support introductory Python programming education. The system analyzes learner responses, identifies concept-specific misconceptions, maintains an evolving learner profile, and selects appropriate instructional interventions based on learner performance.

The system follows a hybrid architecture that combines machine learning for learner-response diagnosis with a Large Language Model (LLM) for curriculum-grounded multilingual instruction and context-aware doubt clarification.

## System Architecture

The adaptive tutoring pipeline consists of the following stages:

**Student Response → ML-Based Diagnosis → Learner Model → Adaptive Decision Engine → Personalized Teaching Response**

A separate context-aware doubt-clearing module supports learner queries using the current concept, learner state, misconception history, and curriculum context.

## Components

### 1. Misconception Diagnosis

Learner responses are analyzed using concept-specific machine-learning classifiers based on TF-IDF feature representations and Logistic Regression.

The diagnosis module determines whether a response is correct or corresponds to a known misconception associated with the current Python concept.

The current implementation contains:

- 65 concept-specific classifiers
- 65 Python concepts
- 131 misconception classes
- Confidence-aware prediction handling

Runtime misconception diagnosis is performed entirely by the trained machine-learning models.

### 2. Learner Model

The learner model maintains concept-level information for each learner, including:

- Mastery score
- Number of attempts
- Number of correct attempts
- Active misconceptions
- Resolved misconceptions

This representation enables the tutor to adapt independently to the learner's progress across different programming concepts.

### 3. Adaptive Decision Engine

The adaptive engine uses the learner state and diagnosis results to determine the next instructional action.

The supported actions are:

- **Remediation** – revisits the concept using simpler explanations and targeted practice.
- **Continue** – reinforces the current concept through additional explanation and practice.
- **Advance** – introduces intermediate-level reasoning, tracing, debugging, or problem-solving activities.

Confidence-aware handling is used to reduce the influence of uncertain misconception predictions on the learner state.

### 4. Multilingual Teaching Generation

Gemini 3.5 Flash Lite is used as the natural-language generation component for personalized instructional responses.

The generation module receives the adaptive decision, learner state, identified misconceptions, and relevant curriculum context before producing the teaching response.

The current implementation supports:

- English
- Malayalam
- Malayalam-English code-mixed interaction

Python syntax, keywords, and code are retained in English where appropriate.

### 5. Context-Aware Doubt Clarification

A separate doubt-clearing module handles learner questions during the learning process.

Responses are generated using:

- Current topic and concept
- Learner mastery state
- Active misconceptions
- Relevant curriculum content
- Selected language

This enables doubt clarification to remain consistent with both the curriculum and the learner's current learning state.

## Curriculum

The tutor is grounded in a researcher-prepared introductory Python curriculum containing Beginner and Intermediate learning levels.

The curriculum covers concepts including variables, data types, expressions, conditional statements, loops, functions, lists, and dictionaries.

Curriculum context is supplied to the teaching and doubt-clearing modules to maintain alignment between generated responses and the intended learning material.

## Dataset

The misconception diagnosis dataset contains:

- **2,940** labeled learner-response examples
- **65** Python concepts
- **131** misconception classes
- **196** concept-label groups

Synthetic learner-response examples were generated during dataset development using Gemini. These examples were subsequently used to train the concept-specific machine-learning classifiers.

Gemini is not used for runtime misconception classification.

## Main Integration Functions

The backend exposes the following primary functions:

```python
diagnose_answer(...)
process_student_answer(...)
adaptive_tutor_step(...)
answer_doubt(...)

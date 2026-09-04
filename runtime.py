import os
import re
import json
from google import genai
from .adaptive_engine import CONCEPT_TO_TOPIC, process_student_answer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_NAME = os.getenv('GEMINI_MODEL', 'gemini-3.5-flash-lite')
_client = None
_topic_sections = None

def get_client():
    global _client
    if _client is not None:
        return _client
    key = os.getenv('GEMINI_API_KEY')
    if not key:
        try:
            from kaggle_secrets import UserSecretsClient
            key = UserSecretsClient().get_secret('GEMINI_API_KEY')
        except Exception:
            pass
    if not key:
        raise RuntimeError('Set GEMINI_API_KEY')
    _client = genai.Client(api_key=key)
    return _client

def load_curriculum():
    global _topic_sections
    if _topic_sections is not None:
        return _topic_sections
    path = os.getenv('PYTHON_CURRICULUM_PATH', os.path.join(ROOT,'data','Python Curriculum.md'))
    _topic_sections = {}
    if not os.path.exists(path):
        return _topic_sections
    with open(path,'r',encoding='utf-8') as f:
        text = f.read()
    matches = list(re.finditer(r'(?m)^##\s+Topic\s+(\d+\.\d+):\s*(.+)$', text))
    for i,m in enumerate(matches):
        start = m.start()
        end = matches[i+1].start() if i+1 < len(matches) else len(text)
        _topic_sections[m.group(1)] = text[start:end].strip()
    return _topic_sections

def get_topic_context(topic_id):
    return load_curriculum().get(topic_id,'')[:7000]

def language_instruction(language):
    l = str(language).lower()
    if l in ('malayalam','ml'):
        return 'Respond mainly in natural Malayalam. Keep Python keywords and code in English.'
    if l in ('mixed','code-mixed','malayalam-english'):
        return 'Respond naturally in Malayalam-English code-mixed language. Keep Python terms and code in English.'
    return 'Respond in clear, friendly English.'

def generate_adaptive_teaching(concept, question, student_answer, adaptive_result, language='english'):
    topic_id = adaptive_result['topic_id']
    prompt = f'''You are an adaptive introductory Python tutor.
Use the ML diagnosis already provided. Do not override it.
Topic: {topic_id}
Concept: {concept}
Question: {question}
Student answer: {student_answer}
Diagnosis: {json.dumps(adaptive_result['diagnosis'], ensure_ascii=False)}
Learner state: {json.dumps(adaptive_result['learner_state'], ensure_ascii=False)}
Decision: {json.dumps(adaptive_result['adaptive_decision'], ensure_ascii=False)}
Curriculum: {get_topic_context(topic_id)}
{language_instruction(language)}
For remediation: explain simply, target misconception, give one tiny example, end with one easy question.
For continue: reinforce, give one example, end with one short practice question.
For advance: give tracing/debugging/challenge.
Return only the teaching response.'''
    r = get_client().models.generate_content(model=MODEL_NAME, contents=prompt)
    return {'concept':concept,'level':adaptive_result['adaptive_decision']['level'],'adaptive_action':adaptive_result['adaptive_decision']['action'],'language':language,'response':r.text.strip()}

def adaptive_tutor_step(concept, question, student_answer, profile, language='english'):
    result = process_student_answer(concept, question, student_answer, profile)
    teaching = generate_adaptive_teaching(concept, question, student_answer, result, language)
    return {'adaptive_result':result,'teaching':teaching}

def answer_doubt(concept, learner_doubt, profile, language='english'):
    topic_id = CONCEPT_TO_TOPIC[concept]
    state = profile['concept_mastery'][concept]
    mastery = state['mastery']
    level = 'beginner' if mastery < 0.40 else ('developing' if mastery < 0.75 else 'intermediate')
    prompt = f'''You are a context-aware doubt-clearing assistant for an introductory Python tutor.
Topic: {topic_id}
Concept: {concept}
Learner level: {level}
Active misconceptions: {json.dumps(state['active_misconceptions'], ensure_ascii=False)}
Doubt: {learner_doubt}
Curriculum: {get_topic_context(topic_id)}
{language_instruction(language)}
Answer the exact doubt, adapt to learner level, and stay within the curriculum.'''
    r = get_client().models.generate_content(model=MODEL_NAME, contents=prompt)
    return {'topic_id':topic_id,'concept':concept,'language':language,'response':r.text.strip()}

def translate_to_malayalam(text_content):
    """Translate educational text, HTML or JSON to Malayalam while keeping Python terms and code in English."""
    prompt = f'''You are an expert bilingual programming educator.
Translate the following introductory programming lesson text into clear, natural Malayalam.
Keep all Python keywords, code snippets, variables, functions, and HTML formatting tags unchanged in English.
Translate explanations, headings, questions, and descriptions into easy-to-understand Malayalam.

Content:
{text_content}

Return only the translated content.'''
    r = get_client().models.generate_content(model=MODEL_NAME, contents=prompt)
    return r.text.strip()
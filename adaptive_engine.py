import os
import json
from .diagnosis import diagnose_answer
from .learner_model import ensure_state_fields, update_mastery, update_misconceptions

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_json(path):
    with open(os.path.join(ROOT, path), 'r', encoding='utf-8') as f:
        return json.load(f)

CONCEPT_MAP = load_json('config/concept_map.json')
CONCEPT_TO_TOPIC = {c:t for t, cs in CONCEPT_MAP.items() for c in cs}

def create_learner_profile():
    p = {'concept_mastery':{}, 'topic_state':{}}
    for cs in CONCEPT_MAP.values():
        for c in cs:
            p['concept_mastery'][c] = {
                'mastery':0.0,
                'attempts':0,
                'correct_attempts':0,
                'active_misconceptions':[],
                'resolved_misconceptions':[],
                '_resolution_evidence':{}
            }
    for t in CONCEPT_MAP:
        p['topic_state'][t] = {'level':'beginner','status':'not_started','attempts':0}
    return p

def choose_adaptive_action(state):
    ensure_state_fields(state)
    if state['active_misconceptions']:
        return {'action':'remediation','level':'beginner','reason':'active_misconception'}
    if state['attempts'] >= 2 and state['mastery'] < 0.40:
        return {'action':'remediation','level':'beginner','reason':'low_mastery'}
    if state['mastery'] < 0.75:
        return {'action':'continue','level':'beginner','reason':'developing_mastery'}
    return {'action':'advance','level':'intermediate','reason':'high_mastery'}

def process_student_answer(concept, question, student_answer, profile):
    topic_id = CONCEPT_TO_TOPIC[concept]
    diagnosis = diagnose_answer(concept, question, student_answer)
    state = profile['concept_mastery'][concept]
    update_mastery(state, diagnosis['is_correct'], diagnosis['confidence'])
    event = update_misconceptions(state, diagnosis)
    decision = choose_adaptive_action(state)
    topic_state = profile['topic_state'][topic_id]
    topic_state['attempts'] += 1
    topic_state['status'] = 'in_progress'
    topic_state['level'] = decision['level']
    return {
        'topic_id': topic_id,
        'concept': concept,
        'diagnosis': diagnosis,
        'learner_state': {
            'mastery': round(state['mastery'],4),
            'attempts': state['attempts'],
            'correct_attempts': state['correct_attempts'],
            'active_misconceptions': list(state['active_misconceptions']),
            'resolved_misconceptions': list(state['resolved_misconceptions'])
        },
        'misconception_event': event,
        'adaptive_decision': decision
    }

def save_learner_profile(profile, path):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(profile, f, indent=2, ensure_ascii=False)

def load_learner_profile(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)
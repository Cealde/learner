MISCONCEPTION_CONFIDENCE = 0.45
LEARNING_RATE = 0.20
RESOLUTION_EVIDENCE = 2

def ensure_state_fields(state):
    state.setdefault('mastery', 0.0)
    state.setdefault('attempts', 0)
    state.setdefault('correct_attempts', 0)
    state.setdefault('active_misconceptions', [])
    state.setdefault('resolved_misconceptions', [])
    state.setdefault('_resolution_evidence', {})
    return state

def update_mastery(state, is_correct, confidence):
    ensure_state_fields(state)
    state['attempts'] += 1
    rate = LEARNING_RATE if confidence >= MISCONCEPTION_CONFIDENCE else LEARNING_RATE / 2
    if is_correct:
        state['correct_attempts'] += 1
        state['mastery'] = state['mastery'] + rate * (1 - state['mastery'])
    else:
        state['mastery'] = state['mastery'] * (1 - rate)
    state['mastery'] = max(0.0, min(1.0, state['mastery']))

def update_misconceptions(state, diagnosis):
    ensure_state_fields(state)
    label = diagnosis['misconception_label']
    confidence = diagnosis['confidence']
    if diagnosis['is_correct']:
        resolved = []
        for m in list(state['active_misconceptions']):
            e = state['_resolution_evidence'].get(m, 0) + 1
            state['_resolution_evidence'][m] = e
            if e >= RESOLUTION_EVIDENCE:
                state['active_misconceptions'].remove(m)
                if m not in state['resolved_misconceptions']:
                    state['resolved_misconceptions'].append(m)
                resolved.append(m)
        return {'event':'misconception_resolved','labels':resolved} if resolved else {'event':'correct_evidence'}
    if confidence < MISCONCEPTION_CONFIDENCE:
        return {'event':'uncertain_diagnosis'}
    if label and label != 'CORRECT':
        if label not in state['active_misconceptions']:
            state['active_misconceptions'].append(label)
        state['_resolution_evidence'][label] = 0
        return {'event':'misconception_activated','label':label}
    return {'event':'incorrect'}
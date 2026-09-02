% backend/app/knowledge_base/domains/medical.pl
% Medical emergency decision rules for CrisisGuard AI.
% Covers: Cardiac Arrest (CPR), Choking (Heimlich), Arterial Bleeding,
%         Stroke (FAST protocol), Severe Thermal/Chemical Burns,
%         Anaphylactic Shock, Opioid/Toxin Overdose, Hypothermia.

:- module(medical_kb, [medical_eval/5]).

% 1. CARDIAC ARREST — unconscious + no breathing -> CPR
medical_eval(Facts, begin_cpr_and_call_emergency, critical, Reasons, Prohibitions) :-
    member(unconscious(true), Facts),
    member(breathing(none), Facts),
    !,
    Reasons = [
        'Victim is unconscious and unresponsive with absent respiration.',
        'Immediate chest compressions (100-120 BPM) required.',
        'Request an AED immediately.'
    ],
    Prohibitions = [
        'Do not give oral fluids or medications.',
        'Do not delay CPR to search for a pulse if untrained.',
        'Do not leave victim unattended.'
    ].

% 2A. CHOKING (INFANT) — Back blows + Chest thrusts (NEVER Heimlich)
medical_eval(Facts, perform_infant_choking_protocol, critical, Reasons, Prohibitions) :-
    ( member(symptom(choking), Facts) ; member(choking(true), Facts) ; member(airway_pass(blocked), Facts) ),
    ( member(patient_type(infant), Facts) ; member(age_group(infant), Facts) ; member(age(infant), Facts) ),
    !,
    Reasons = [
        'Infant (< 1 year) experiencing acute foreign body airway obstruction.',
        'Deliver 5 gentle back blows with the heel of hand between shoulder blades, then flip face-up and deliver 5 two-finger chest thrusts.'
    ],
    Prohibitions = [
        'NEVER PERFORM ABDOMINAL THRUSTS (HEIMLICH) ON AN INFANT (high risk of fatal internal organ damage).',
        'Do not perform blind finger sweeps in infant airway.',
        'Do not shake the infant.'
    ].

% 2B. CHOKING (UNCONSCIOUS) — CPR with visual airway inspection
medical_eval(Facts, choking_unconscious_begin_cpr_with_airway_check, critical, Reasons, Prohibitions) :-
    ( member(symptom(choking), Facts) ; member(choking(true), Facts) ),
    member(unconscious(true), Facts),
    !,
    Reasons = [
        'Choking victim has lost consciousness due to acute severe hypoxia.',
        'Lower victim carefully to firm flat ground, call 199/191 immediately, and begin CPR (30 compressions, inspect mouth for visible dislodged foreign object before rescue breaths).'
    ],
    Prohibitions = [
        'Do not perform standing abdominal thrusts on an unconscious patient.',
        'Do not perform blind finger sweeps (only extract object if clearly visible and accessible).'
    ].

% 2C. CHOKING (COMPLETE OBSTRUCTION / ADULT & CHILD) — Heimlich
medical_eval(Facts, perform_heimlich_thrusts, critical, Reasons, Prohibitions) :-
    ( member(symptom(choking), Facts) ; member(choking(true), Facts) ),
    member(airway_pass(blocked), Facts),
    !,
    Reasons = [
        'Complete airway obstruction detected.',
        'Deliver 5 sharp back blows between shoulder blades followed by 5 abdominal thrusts (Heimlich maneuver).'
    ],
    Prohibitions = [
        'Do not perform blind finger sweeps in the mouth.',
        'Do not offer water or fluids while victim is choking.'
    ].

% 2D. CHOKING (PARTIAL OBSTRUCTION / MILD) — Encourage coughing
medical_eval(Facts, encourage_forceful_coughing_and_monitor, high, Reasons, Prohibitions) :-
    ( member(symptom(choking), Facts) ; member(choking(true), Facts) ),
    ( member(airway_pass(partial), Facts) ; member(coughing(forceful), Facts) ; member(coughing(true), Facts) ; member(airway_pass(mild), Facts) ),
    !,
    Reasons = [
        'Partial foreign body airway obstruction detected with intact coughing reflex and partial airflow.',
        'Encourage continuous forceful coughing to expel object spontaneously while monitoring closely for progression to complete obstruction.'
    ],
    Prohibitions = [
        'Do not deliver back blows or abdominal thrusts while the victim is coughing forcefully.',
        'Do not give liquids or fluids while patient is attempting to clear airway.'
    ].

% 3. ARTERIAL BLEEDING — severe pulsing bleeding -> Tourniquet / Direct Pressure
medical_eval(Facts, apply_direct_pressure_and_tourniquet, critical, Reasons, Prohibitions) :-
    ( member(bleeding(severe_pulsing), Facts) ; member(bleeding(arterial), Facts) ; member(bleeding(severe), Facts) ),
    !,
    Reasons = [
        'Pulsing or spurting blood indicates arterial laceration and life-threatening hemorrhage.',
        'Apply firm, continuous direct pressure with sterile gauze and apply a tourniquet 2-3 inches proximal to injury.'
    ],
    Prohibitions = [
        'Do not remove soaked dressings; apply additional layers directly on top.',
        'Do not place tourniquet directly over a joint (elbow/knee).'
    ].

% 4A. STROKE (HYPERACUTE / KNOWN ONSET WINDOW) — Emergency Dispatch & Record LKW
medical_eval(Facts, activate_hyperacute_stroke_protocol, critical, Reasons, Prohibitions) :-
    ( member(face_droop(true), Facts) ; member(arm_weakness(true), Facts) ; member(speech_difficulty(true), Facts) ; member(symptom(stroke), Facts) ; member(stroke(true), Facts) ),
    ( member(onset_time(under_4_hours), Facts) ; member(onset_time(recent), Facts) ; member(symptom_onset(under_3_hours), Facts) ; member(onset_window(acute), Facts) ),
    !,
    Reasons = [
        'Acute ischemic stroke suspected within hyperacute thrombolytic (IV tPA/TNK) and endovascular thrombectomy therapeutic window.',
        'Record exact Last Known Well (LKW) time and request priority pre-hospital stroke alert transport to comprehensive stroke center.'
    ],
    Prohibitions = [
        'NEVER ADMINISTER ASPIRIN, BLOOD THINNERS, FOOD, OR WATER PRIOR TO HOSPITAL CT SCAN.',
        'Do not attempt to rapidly lower elevated blood pressure without direct medical command.'
    ].

% 4B. STROKE (UNRESPONSIVE / AIRWAY COMPROMISE) — Lateral Recovery & Airway Protection
medical_eval(Facts, position_in_recovery_and_protect_airway_stroke, critical, Reasons, Prohibitions) :-
    ( member(face_droop(true), Facts) ; member(arm_weakness(true), Facts) ; member(speech_difficulty(true), Facts) ; member(symptom(stroke), Facts) ; member(stroke(true), Facts) ),
    ( member(unconscious(true), Facts) ; member(altered_mental_status(true), Facts) ; member(swallowing_difficulty(true), Facts) ),
    !,
    Reasons = [
        'Severe acute stroke with impaired consciousness and loss of airway protective reflexes.',
        'Place patient in lateral recovery position with head elevated 30 degrees to maintain airway patency and prevent fatal aspiration.'
    ],
    Prohibitions = [
        'Do not give any oral fluids, food, or aspirin.',
        'Do not leave patient supine (flat on back) due to high aspiration risk.'
    ].

% 4C. STROKE (F.A.S.T. STANDARD DISPATCH) — Immediate Stroke Center Transport
medical_eval(Facts, activate_stroke_emergency_dispatch, critical, Reasons, Prohibitions) :-
    ( member(face_droop(true), Facts) ; member(arm_weakness(true), Facts) ; member(speech_difficulty(true), Facts) ; member(symptom(stroke), Facts) ; member(stroke(true), Facts) ),
    !,
    Reasons = [
        'Positive F.A.S.T. stroke indicators observed (facial droop, arm weakness, or slurred speech).',
        'Time-critical brain ischemia suspected; immediate emergency transport to comprehensive stroke center required.'
    ],
    Prohibitions = [
        'Do not administer aspirin or other blood thinners without hospital CT scan.',
        'Do not allow patient to drive or walk unaided.'
    ].

% 4D. TRANSIENT ISCHEMIC ATTACK (TIA) — Urgent Neurovascular Evaluation
medical_eval(Facts, urgent_stroke_center_evaluation_tia, high, Reasons, Prohibitions) :-
    ( member(symptom(tia), Facts) ; member(transient_ischemic_attack(true), Facts) ; member(stroke_symptoms(resolved), Facts) ),
    !,
    Reasons = [
        'Transient Ischemic Attack (TIA) symptoms have temporarily resolved; represents critical warning indicator for imminent full-scale stroke (highest risk within 48 hours).',
        'Urgent emergency neurovascular evaluation and brain MRI/CT neuroimaging required.'
    ],
    Prohibitions = [
        'Do not ignore or dismiss resolved symptoms as non-emergent.',
        'Do not allow patient to drive self to medical facility.'
    ].

% 5. ANAPHYLAXIS — acute allergic airway compromise -> Epinephrine
medical_eval(Facts, administer_epinephrine_auto_injector, critical, Reasons, Prohibitions) :-
    ( member(symptom(anaphylaxis), Facts) ; member(allergic_reaction(severe), Facts) ),
    ( member(airway_pass(swelling), Facts) ; member(breathing(stridor), Facts) ; member(breathing(wheezing), Facts) ),
    !,
    Reasons = [
        'Severe acute anaphylaxis with impending airway compromise detected.',
        'Administer intramuscular epinephrine auto-injector into outer mid-thigh immediately and call 199/191.'
    ],
    Prohibitions = [
        'Do not delay epinephrine administration to give oral antihistamines.',
        'Do not have the patient stand or walk suddenly (risk of fatal hypotension).'
    ].

% 6. SEVERE CHEMICAL BURNS — immediate continuous irrigation
medical_eval(Facts, copius_water_flush_chemical_burn, critical, Reasons, Prohibitions) :-
    member(burn_type(chemical), Facts),
    !,
    Reasons = [
        'Corrosive chemical exposure to dermal tissue.',
        'Flush affected area immediately with continuous running tap water for at least 20 minutes and remove contaminated garments.'
    ],
    Prohibitions = [
        'Do not apply neutralizing chemical agents (causes exothermic tissue destruction).',
        'Do not rub contaminated skin aggressively.'
    ].

% 7. SEVERE THERMAL BURNS — Thermal large area
medical_eval(Facts, cool_water_rinse_and_sterile_cover, high, Reasons, Prohibitions) :-
    member(burn_type(thermal), Facts),
    ( member(burn_area(large), Facts) ; member(burn_area(major), Facts) ),
    !,
    Reasons = [
        'Extensive thermal burn injury detected.',
        'Cool the burn immediately under gentle cool running water for 10-20 minutes and cover with sterile dry dressing.'
    ],
    Prohibitions = [
        'Do not apply ice, iced water, butter, or greasy ointments to burns.',
        'Do not break intact blisters.'
    ].

% 8. OPIOID / TOXIN OVERDOSE — unresponsive + bradypnea -> Naloxone
medical_eval(Facts, administer_naloxone_and_rescue_breathing, critical, Reasons, Prohibitions) :-
    ( member(substance(opioid), Facts) ; member(toxin(overdose), Facts) ),
    ( member(unconscious(true), Facts) ; member(breathing(shallow), Facts) ),
    !,
    Reasons = [
        'Suspected opioid toxicity with respiratory depression.',
        'Administer nasal or intramuscular Naloxone (Narcan) immediately and support ventilation with rescue breaths.'
    ],
    Prohibitions = [
        'Do not leave patient alone after Naloxone (effect wears off before opioids in system).',
        'Do not place patient in cold bath.'
    ].

% 9. GENERAL MEDICAL FALLBACK
medical_eval(_Facts, call_emergency_services_immediately, critical, Reasons, Prohibitions) :-
    Reasons = ['Uncertain or high-risk medical condition. Immediate dispatch of paramedic services recommended.'],
    Prohibitions = ['Do not administer prescription medications without direct medical dispatch guidance.'].

% backend/app/knowledge_base/domains/medical.pl
% Medical emergency decision rules for CrisisGuard AI.
% Covers: Cardiac Arrest (CPR), Choking (Heimlich), Arterial Bleeding,
%         Stroke (FAST protocol), Severe Burns, Poisoning.

:- module(medical_kb, [medical_eval/5]).

% 1. CARDIAC ARREST — unconscious + no breathing -> CPR
medical_eval(Facts, begin_cpr_and_call_emergency, critical, Reasons, Prohibitions) :-
    member(unconscious(true), Facts),
    member(breathing(none), Facts),
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

% 2. CHOKING — blocked airway -> Heimlich
medical_eval(Facts, perform_heimlich_thrusts, critical, Reasons, Prohibitions) :-
    ( member(symptom(choking), Facts) ; member(choking(true), Facts) ),
    member(airway_pass(blocked), Facts),
    Reasons = [
        'Complete airway obstruction detected.',
        'Deliver 5 sharp back blows between shoulder blades followed by 5 abdominal thrusts (Heimlich maneuver).'
    ],
    Prohibitions = [
        'Do not perform blind finger sweeps in the mouth.',
        'Do not offer water or fluids while victim is choking.'
    ].

% 3. ARTERIAL BLEEDING — severe pulsing bleeding -> Tourniquet / Direct Pressure
medical_eval(Facts, apply_direct_pressure_and_tourniquet, critical, Reasons, Prohibitions) :-
    member(bleeding(severe_pulsing), Facts),
    Reasons = [
        'Pulsing or spurting blood indicates arterial laceration and life-threatening hemorrhage.',
        'Apply firm, continuous direct pressure with sterile gauze and apply a tourniquet 2-3 inches proximal to injury.'
    ],
    Prohibitions = [
        'Do not remove soaked dressings; apply additional layers directly on top.',
        'Do not place tourniquet directly over a joint (elbow/knee).'
    ].

% 4. STROKE — FAST symptoms -> Immediate transport
medical_eval(Facts, activate_stroke_emergency_dispatch, critical, Reasons, Prohibitions) :-
    ( member(face_droop(true), Facts) ; member(arm_weakness(true), Facts) ; member(speech_difficulty(true), Facts) ),
    Reasons = [
        'Positive F.A.S.T. stroke indicators observed (facial droop, arm weakness, or slurred speech).',
        'Time-critical brain ischemia suspected; immediate emergency transport to comprehensive stroke center required.'
    ],
    Prohibitions = [
        'Do not administer aspirin or other blood thinners without hospital CT scan.',
        'Do not allow patient to drive or walk unaided.'
    ].

% 5. SEVERE BURNS — Thermal large area
medical_eval(Facts, cool_water_rinse_and_sterile_cover, high, Reasons, Prohibitions) :-
    member(burn_type(thermal), Facts),
    member(burn_area(large), Facts),
    Reasons = [
        'Extensive thermal burn injury detected.',
        'Cool the burn immediately under gentle cool running water for 10-20 minutes and cover with sterile dry dressing.'
    ],
    Prohibitions = [
        'Do not apply ice, iced water, butter, or greasy ointments to burns.',
        'Do not break intact blisters.'
    ].

% 6. GENERAL MEDICAL FALLBACK
medical_eval(_Facts, call_emergency_services_immediately, critical, Reasons, Prohibitions) :-
    Reasons = ['Uncertain or high-risk medical condition. Immediate dispatch of paramedic services recommended.'],
    Prohibitions = ['Do not administer prescription medications without direct medical dispatch guidance.'].

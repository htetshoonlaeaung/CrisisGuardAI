% backend/app/knowledge_base/tests/test_medical.pl
% Prolog plunit test suite for medical.pl knowledge base.
% Tests that CPR, stroke, and bleeding rules fire correctly and
% that safety prohibitions are always present in critical outcomes.

:- begin_tests(medical_tests).
:- use_module('../domains/medical.pl').

test(cardiac_arrest_triggers_cpr) :-
    once(medical_eval([unconscious(true), breathing(none)], Action, Severity, Reasons, Prohibitions)),
    Action == begin_cpr_and_call_emergency,
    Severity == critical,
    member('Do not delay CPR to search for a pulse if untrained.', Prohibitions),
    member('Victim is unconscious and unresponsive with absent respiration.', Reasons).

test(choking_triggers_heimlich) :-
    once(medical_eval([symptom(choking), airway_pass(blocked)], Action, Severity, _Reasons, Prohibitions)),
    Action == perform_heimlich_thrusts,
    Severity == critical,
    member('Do not perform blind finger sweeps in the mouth.', Prohibitions).

test(bleeding_triggers_tourniquet) :-
    once(medical_eval([bleeding(severe_pulsing)], Action, Severity, _Reasons, Prohibitions)),
    Action == apply_direct_pressure_and_tourniquet,
    Severity == critical,
    member('Do not remove soaked dressings; apply additional layers directly on top.', Prohibitions).

test(tourniquet_temporal_escalation_second_tourniquet) :-
    once(medical_eval([bleeding(severe_pulsing), first_tourniquet_applied(true), elapsed_minutes(2)], Action, Severity, Reasons, Prohibitions)),
    Action == apply_second_proximal_tourniquet,
    Severity == critical,
    member('NEVER LOOSEN, UNTIE, OR REMOVE THE FIRST TOURNIQUET.', Prohibitions),
    member('Primary tourniquet failed to achieve arterial haemostasis after >= 2 minutes; active life-threatening hemorrhage persists.', Reasons).

test(tourniquet_temporal_escalation_atom_time) :-
    once(medical_eval([bleeding(severe_pulsing), first_tourniquet_applied(true), elapsed_minutes('>=2')], Action, Severity, _Reasons, Prohibitions)),
    Action == apply_second_proximal_tourniquet,
    Severity == critical,
    member('NEVER LOOSEN, UNTIE, OR REMOVE THE FIRST TOURNIQUET.', Prohibitions).

test(tourniquet_haemostasis_monitored) :-
    once(medical_eval([bleeding(severe_pulsing), first_tourniquet_applied(true), bleeding_stopped(true)], Action, Severity, Reasons, Prohibitions)),
    Action == monitor_tourniquet_time_and_prevent_shock,
    Severity == high,
    member('NEVER LOOSEN OR PERIODICALLY RELEASE TOURNIQUET TO RESTORE CIRCULATION (causes fatal bolus exsanguination and reperfusion shock).', Prohibitions),
    member('Arterial bleeding successfully arrested following tourniquet application.', Reasons).

test(stroke_fast_dispatches_correctly) :-
    once(medical_eval([face_droop(true), arm_weakness(true)], Action, Severity, _Reasons, Prohibitions)),
    Action == activate_stroke_emergency_dispatch,
    Severity == critical,
    member('Do not administer aspirin or other blood thinners without hospital CT scan.', Prohibitions).

test(burns_triggers_cool_water) :-
    once(medical_eval([burn_type(thermal), burn_area(large)], Action, Severity, _Reasons, Prohibitions)),
    Action == cool_water_rinse_and_sterile_cover,
    Severity == high,
    member('Do not apply ice, iced water, butter, or greasy ointments to burns.', Prohibitions).

test(anaphylaxis_triggers_epinephrine) :-
    once(medical_eval([symptom(anaphylaxis), airway_pass(swelling)], Action, Severity, _Reasons, Prohibitions)),
    Action == administer_epinephrine_auto_injector,
    Severity == critical,
    member('Do not delay epinephrine administration to give oral antihistamines.', Prohibitions).

test(chemical_burn_triggers_irrigation) :-
    once(medical_eval([burn_type(chemical)], Action, Severity, _Reasons, Prohibitions)),
    Action == copius_water_flush_chemical_burn,
    Severity == critical,
    member('Do not apply neutralizing chemical agents (causes exothermic tissue destruction).', Prohibitions).

test(overdose_triggers_naloxone) :-
    once(medical_eval([substance(opioid), unconscious(true)], Action, Severity, _Reasons, Prohibitions)),
    Action == administer_naloxone_and_rescue_breathing,
    Severity == critical,
    member('Do not leave patient alone after Naloxone (effect wears off before opioids in system).', Prohibitions).

test(choking_infant_protocol) :-
    once(medical_eval([symptom(choking), patient_type(infant)], Action, Severity, _Reasons, Prohibitions)),
    Action == perform_infant_choking_protocol,
    Severity == critical,
    member('NEVER PERFORM ABDOMINAL THRUSTS (HEIMLICH) ON AN INFANT (high risk of fatal internal organ damage).', Prohibitions).

test(choking_unconscious_cpr) :-
    once(medical_eval([symptom(choking), unconscious(true)], Action, Severity, _Reasons, Prohibitions)),
    Action == choking_unconscious_begin_cpr_with_airway_check,
    Severity == critical,
    member('Do not perform standing abdominal thrusts on an unconscious patient.', Prohibitions).

test(choking_partial_coughing) :-
    once(medical_eval([symptom(choking), airway_pass(partial)], Action, Severity, _Reasons, Prohibitions)),
    Action == encourage_forceful_coughing_and_monitor,
    Severity == high,
    member('Do not deliver back blows or abdominal thrusts while the victim is coughing forcefully.', Prohibitions).

test(stroke_hyperacute_protocol) :-
    once(medical_eval([face_droop(true), onset_time(under_4_hours)], Action, Severity, _Reasons, Prohibitions)),
    Action == activate_hyperacute_stroke_protocol,
    Severity == critical,
    member('NEVER ADMINISTER ASPIRIN, BLOOD THINNERS, FOOD, OR WATER PRIOR TO HOSPITAL CT SCAN.', Prohibitions).

test(stroke_airway_compromise_recovery) :-
    once(medical_eval([face_droop(true), swallowing_difficulty(true)], Action, Severity, _Reasons, Prohibitions)),
    Action == position_in_recovery_and_protect_airway_stroke,
    Severity == critical,
    member('Do not leave patient supine (flat on back) due to high aspiration risk.', Prohibitions).

test(stroke_tia_urgent_eval) :-
    once(medical_eval([symptom(tia), stroke_symptoms(resolved)], Action, Severity, _Reasons, Prohibitions)),
    Action == urgent_stroke_center_evaluation_tia,
    Severity == high,
    member('Do not allow patient to drive self to medical facility.', Prohibitions).

test(unknown_medical_fallback) :-
    once(medical_eval([symptom(unknown_case)], Action, Severity, _Reasons, _Prohibitions)),
    Action == call_emergency_services_immediately,
    Severity == critical.

:- end_tests(medical_tests).

% backend/app/knowledge_base/domains/medical.pl
% Medical emergency decision rules for CrisisGuard AI.
% Covers: Cardiac Arrest (CPR), Choking (Heimlich), Arterial Bleeding,
%         Stroke (FAST protocol), Severe Burns, Poisoning.

:- module(medical_kb, [medical_eval/5]).

% TODO: Rule 1 — Cardiac Arrest: unconscious(true) + breathing(none) -> begin_cpr_and_call_emergency
% TODO: Rule 2 — Choking: symptom(choking) + airway_pass(blocked) -> perform_heimlich_thrusts
% TODO: Rule 3 — Severe Bleeding: bleeding(severe_pulsing) -> apply_direct_pressure_and_tourniquet
% TODO: Rule 4 — Stroke (FAST): face_droop | arm_weakness | speech_difficulty -> activate_stroke_emergency_dispatch
% TODO: Rule 5 — Severe Burns: burn_type(thermal) + burn_area(large) -> cool_water_rinse_and_sterile_cover

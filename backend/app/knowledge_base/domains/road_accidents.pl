% backend/app/knowledge_base/domains/road_accidents.pl
% Road accident and vehicle crash emergency decision rules for CrisisGuard AI.
% Covers: Scene safety, unconscious victim extraction, multi-casualty triage,
%         CPR at accident scene, vehicle fire post-crash.

:- module(road_kb, [road_eval/5]).

% TODO: Rule 1 — Unconscious Victim + No Breathing at Crash Scene -> begin_cpr_do_not_move_spine
% TODO: Rule 2 — Vehicle Fire Post-Crash + Victim Trapped -> call_rescue_and_maintain_safe_distance
% TODO: Rule 3 — Multiple Casualties -> triage_by_severity_and_call_mass_casualty_dispatch
% TODO: Rule 4 — Traffic Hazard (active road) -> establish_safety_perimeter_before_aid

% backend/app/knowledge_base/domains/fire_hazards.pl
% Fire and hazard emergency decision rules for CrisisGuard AI.
% Covers: Electrical fire, Cooking oil/grease fire, Gas leak (indoors),
%         House fire (smoke/flames/blocked exits), Chemical spill.

:- module(hazards_kb, [hazard_eval/5]).

% TODO: Rule 1 — Electrical Fire: hazard(fire) + fire_source(electrical) -> isolate_main_power_and_use_co2_extinguisher
%                STRICT: NEVER water on electrical fire
% TODO: Rule 2 — Grease/Oil Fire: hazard(fire) + fire_source(cooking_oil) -> cover_with_metal_lid_and_turn_off_burner
%                STRICT: NEVER water on grease fire
% TODO: Rule 3 — Gas Leak Indoors: hazard(gas_leak) + location(indoors) -> evacuate_leave_doors_open_call_from_outside
%                STRICT: No switches, lighters, or phones inside
% TODO: Rule 4 — House Fire (Blocked Exit): hazard(fire) + exit_blocked(true) -> seal_door_and_signal_from_window

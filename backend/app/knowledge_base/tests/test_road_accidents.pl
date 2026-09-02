% backend/app/knowledge_base/tests/test_road_accidents.pl
% Prolog plunit test suite for road_accidents.pl knowledge base.

:- begin_tests(road_tests).
:- use_module('../domains/road_accidents.pl').

test(crash_cardiac_arrest_triggers_cpr_and_spine_protocol) :-
    once(road_eval([unconscious(true), breathing(none)], Action, Severity, _Reasons, Prohibitions)),
    Action == begin_cpr_do_not_move_spine,
    Severity == critical,
    member('Do not twist, flex, or hyper-extend victim\'s neck or spine unless required for airway/CPR.', Prohibitions).

test(vehicle_fire_trapped_occupant_triggers_rescue) :-
    once(road_eval([vehicle_fire(true), trapped(true)], Action, Severity, _Reasons, Prohibitions)),
    Action == call_rescue_and_maintain_safe_distance,
    Severity == critical,
    member('Do not enter burning passenger compartment without protective turnout gear.', Prohibitions).

test(mass_casualty_triggers_start_triage) :-
    once(road_eval([multiple_victims(true)], Action, Severity, _Reasons, Prohibitions)),
    Action == triage_by_severity_and_call_mass_casualty_dispatch,
    Severity == critical,
    member('Do not spend excessive time treating non-survivable injuries on single victim.', Prohibitions).

test(tanker_rollover_triggers_perimeter) :-
    once(road_eval([tanker_rollover(true)], Action, Severity, _Reasons, Prohibitions)),
    Action == isolate_tanker_hazard_perimeter,
    Severity == critical,
    member('Do not approach leaking cargo tankers to inspect fluids without SCBA gear.', Prohibitions).

test(submerged_vehicle_triggers_window_escape) :-
    once(road_eval([vehicle_submerged(true)], Action, Severity, _Reasons, Prohibitions)),
    Action == escape_submerged_vehicle_immediately,
    Severity == critical,
    member('Do not waste time attempting to open doors against hydrostatic pressure while submerged.', Prohibitions).

test(traffic_hazard_establishes_safety_perimeter) :-
    once(road_eval([hazard(traffic)], Action, Severity, _Reasons, Prohibitions)),
    Action == establish_safety_perimeter_before_aid,
    Severity == high,
    member('Do not turn your back to oncoming traffic.', Prohibitions).

test(unknown_road_accident_fallback) :-
    once(road_eval([hazard(unknown_road_case)], Action, Severity, _Reasons, Prohibitions)),
    Action == secure_scene_and_call_emergency_dispatch,
    Severity == critical,
    member('Do not move stable victims inside damaged vehicles unless vehicle is on fire or sinking.', Prohibitions).

:- end_tests(road_tests).

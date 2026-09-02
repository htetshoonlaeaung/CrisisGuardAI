% backend/app/knowledge_base/tests/test_composite_resolver.pl
% Prolog plunit test suite for cross-domain cascading emergency resolver.
% Tests priority conflict arbitration across multiple simultaneous hazard domains.

:- begin_tests(composite_resolver_tests).
:- use_module('../core/core_rules.pl').
:- use_module('../core/xai_explainer.pl').

test(single_medical_hazard_resolves_cpr) :-
    once(evaluate_composite_emergency([unconscious(true), breathing(none)], Action, Severity, Reasons, Prohibitions)),
    Action == begin_cpr_and_call_emergency,
    Severity == critical,
    member('Victim is unconscious and unresponsive with absent respiration.', Reasons),
    member('Do not delay CPR to search for a pulse if untrained.', Prohibitions).

test(earthquake_with_indoor_gas_leak_prioritizes_gas_evacuation) :-
    once(evaluate_composite_emergency([earthquake(true), shaking(active), hazard(gas_leak), location(indoors)], Action, Severity, Reasons, Prohibitions)),
    Action == evacuate_leave_doors_open_call_from_outside,
    Severity == critical,
    member('DO NOT OPERATE LIGHT SWITCHES, ELECTRICAL OUTLETS, OR PHONES INDOORS.', Prohibitions),
    member('Do not run outside during active ground shaking (falling facade hazard).', Prohibitions),
    once((member(R, Reasons), sub_atom(R, _, _, _, 'COMPOUND EMERGENCY RESOLUTION'))).

test(road_accident_with_flammable_chemical_spill_prioritizes_ignition_isolation) :-
    once(evaluate_composite_emergency([hazard(chemical_spill), chemical_type(flammable_vapor), accident(car_crash), tanker_rollover(true)], Action, Severity, _Reasons, Prohibitions)),
    Action == eliminate_all_ignition_sources_and_isolate_perimeter,
    Severity == critical,
    member('NEVER OPERATE ELECTRICAL SWITCHES, RADIOS, OR VEHICLES WITHIN VAPOR PLUME RADIUS.', Prohibitions),
    member('Do not approach leaking cargo tankers to inspect fluids without SCBA gear.', Prohibitions).

test(submerged_vehicle_with_unconscious_occupant_prioritizes_window_escape) :-
    once(evaluate_composite_emergency([vehicle_submerged(true), unconscious(true), breathing(none)], Action, Severity, _Reasons, Prohibitions)),
    Action == escape_submerged_vehicle_immediately,
    Severity == critical,
    member('Do not waste time attempting to open doors against hydrostatic pressure while submerged.', Prohibitions),
    member('Do not delay CPR to search for a pulse if untrained.', Prohibitions).

test(tsunami_with_severe_bleeding_prioritizes_inland_evacuation) :-
    once(evaluate_composite_emergency([disaster(tsunami), coastal(true), bleeding(severe_pulsing)], Action, Severity, Reasons, Prohibitions)),
    Action == evacuate_inland_immediately,
    Severity == critical,
    member('Do not go to the beach or harbor to observe incoming waves or receding water.', Prohibitions),
    member('Do not remove soaked dressings; apply additional layers directly on top.', Prohibitions),
    once((member(R, Reasons), sub_atom(R, _, _, _, 'COMPOUND EMERGENCY RESOLUTION'))).

test(unknown_composite_fallback) :-
    once(evaluate_composite_emergency([unknown_phenomenon(true)], Action, Severity, Reasons, Prohibitions)),
    Action == call_emergency_services_immediately,
    Severity == critical,
    member('Uncertain emergency domain. Immediate contact with municipal emergency dispatch is required.', Reasons),
    member('Do not delay contacting 199/191/192.', Prohibitions).

test(xai_composite_explainer_generates_proof_tree) :-
    collect_domain_evaluations([earthquake(true), shaking(active), hazard(gas_leak), location(indoors)], Evaluations),
    resolve_priority_conflicts(Evaluations, PrimaryAction, CombinedSeverity, _Reasons, _Prohibitions),
    explain_composite_triage(Evaluations, PrimaryAction, CombinedSeverity, ProofTree),
    ProofTree = proof_tree(
        'composite_rule_cross_domain: MULTI_HAZARD_CONFLICT_ARBITRATION',
        PrimaryAction,
        Evidences,
        _,
        _
    ),
    length(Evidences, EvCount),
    EvCount >= 2.

:- end_tests(composite_resolver_tests).

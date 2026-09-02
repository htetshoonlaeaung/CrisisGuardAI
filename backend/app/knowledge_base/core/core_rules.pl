% backend/app/knowledge_base/core/core_rules.pl
% Base inference engine and routing dispatcher.
% Delegates to domain-specific evaluation predicates and defines priority ranking.

:- module(core_rules, [
    evaluate_emergency/6,
<<<<<<< HEAD
    evaluate_composite_emergency/5,
    collect_domain_evaluations/2,
    resolve_priority_conflicts/5,
    action_tier/2,
    domain_precedence/2,
=======
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
    priority_rank/2,
    higher_urgency/2
]).

:- use_module('../domains/medical.pl').
:- use_module('../domains/fire_hazards.pl').
:- use_module('../domains/natural_disasters.pl').
:- use_module('../domains/road_accidents.pl').

<<<<<<< HEAD
% =============================================================================
% PRIORITY RANKINGS & ACTION TIERS
% =============================================================================

% Severity rankings: lower number = higher urgency
=======
% Priority ranks: lower number = higher urgency
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
priority_rank(critical, 1).
priority_rank(high, 2).
priority_rank(moderate, 3).
priority_rank(low, 4).
priority_rank(informational, 5).

higher_urgency(LevelA, LevelB) :-
    priority_rank(LevelA, RankA),
    priority_rank(LevelB, RankB),
    RankA < RankB.

<<<<<<< HEAD
% Domain precedence for tie-breaking when severities and tiers match
domain_precedence(fire_hazard, 1).
domain_precedence(natural_disaster, 2).
domain_precedence(medical, 3).
domain_precedence(road_accident, 4).
domain_precedence(unknown, 5).

% Action Tiers (1 = Immediate Catastrophic Hazard Evacuation/Isolation,
%               2 = Acute Life Threat & ABC Resuscitation,
%               3 = Perimeter & Structural Hazard Isolation,
%               4 = Localized Protective Sheltering / Sub-acute care,
%               5 = General fallback)
action_tier(Action, 1) :-
    member(Action, [
        evacuate_leave_doors_open_call_from_outside,
        eliminate_all_ignition_sources_and_isolate_perimeter,
        evacuate_upwind_uphill_and_shelter_in_place_downwind,
        isolate_corrosive_spill_and_prevent_water_reaction,
        evacuate_upwind_and_call_hazmat,
        seal_door_and_signal_from_window,
        execute_wildfire_evacuation_order,
        evacuate_and_shut_main_gas_valve,
        evacuate_inland_immediately,
        escape_submerged_vehicle_immediately,
        call_rescue_and_maintain_safe_distance,
        isolate_tanker_hazard_perimeter,
        evacuate_to_higher_ground_now,
        evacuate_perpendicular_to_landslide_path
    ]), !.

action_tier(Action, 2) :-
    member(Action, [
        begin_cpr_and_call_emergency,
        begin_cpr_do_not_move_spine,
        perform_infant_choking_protocol,
        choking_unconscious_begin_cpr_with_airway_check,
        perform_heimlich_thrusts,
        apply_second_proximal_tourniquet,
        apply_direct_pressure_and_tourniquet,
        administer_epinephrine_auto_injector,
        activate_hyperacute_stroke_protocol,
        position_in_recovery_and_protect_airway_stroke,
        copius_water_flush_chemical_burn,
        administer_naloxone_and_rescue_breathing,
        triage_by_severity_and_call_mass_casualty_dispatch
    ]), !.

action_tier(Action, 3) :-
    member(Action, [
        isolate_main_power_and_use_co2_extinguisher,
        cover_with_metal_lid_and_turn_off_burner,
        vertical_evacuation_to_upper_floors
    ]), !.

action_tier(Action, 4) :-
    member(Action, [
        drop_cover_and_hold_on,
        shelter_in_interior_windowless_room,
        establish_safety_perimeter_before_aid,
        encourage_forceful_coughing_and_monitor,
        cool_water_rinse_and_sterile_cover,
        urgent_stroke_center_evaluation_tia,
        monitor_tourniquet_time_and_prevent_shock,
        activate_stroke_emergency_dispatch
    ]), !.

action_tier(_Action, 5).

% =============================================================================
% SINGLE-DOMAIN EMERGENCY DISPATCHER
% =============================================================================

=======
% Master dispatcher routing by domain
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
evaluate_emergency(medical, Facts, Action, Severity, Reasons, Prohibitions) :-
    medical_eval(Facts, Action, Severity, Reasons, Prohibitions), !.

evaluate_emergency(fire_hazard, Facts, Action, Severity, Reasons, Prohibitions) :-
    hazard_eval(Facts, Action, Severity, Reasons, Prohibitions), !.

evaluate_emergency(natural_disaster, Facts, Action, Severity, Reasons, Prohibitions) :-
    disaster_eval(Facts, Action, Severity, Reasons, Prohibitions), !.

evaluate_emergency(road_accident, Facts, Action, Severity, Reasons, Prohibitions) :-
    road_eval(Facts, Action, Severity, Reasons, Prohibitions), !.

<<<<<<< HEAD
evaluate_emergency(_Domain, _Facts, call_emergency_services_immediately, critical, Reasons, Prohibitions) :-
    Reasons = ['Uncertain emergency domain. Immediate contact with municipal emergency dispatch is required.'],
    Prohibitions = ['Do not delay contacting 199/191/192.'].

% =============================================================================
% CROSS-DOMAIN CASCADING EMERGENCY RESOLVER
% =============================================================================

evaluate_composite_emergency(Facts, PrimaryAction, CombinedSeverity, CombinedReasons, CombinedProhibitions) :-
    collect_domain_evaluations(Facts, Evaluations),
    ( Evaluations == [] ->
        evaluate_emergency(unknown, Facts, PrimaryAction, CombinedSeverity, CombinedReasons, CombinedProhibitions)
    ; resolve_priority_conflicts(Evaluations, PrimaryAction, CombinedSeverity, CombinedReasons, CombinedProhibitions)
    ).

% Collects valid evaluations from all 4 domain knowledge bases
collect_domain_evaluations(Facts, ValidEvaluations) :-
    findall(eval(Domain, Act, Sev, Reasons, Prohibs), (
        member(Domain, [fire_hazard, natural_disaster, road_accident, medical]),
        evaluate_domain_non_fallback(Domain, Facts, Act, Sev, Reasons, Prohibs)
    ), ValidEvaluations).

evaluate_domain_non_fallback(medical, Facts, Act, Sev, Reasons, Prohibs) :-
    medical_eval(Facts, Act, Sev, Reasons, Prohibs),
    Act \== call_emergency_services_immediately.

evaluate_domain_non_fallback(fire_hazard, Facts, Act, Sev, Reasons, Prohibs) :-
    hazard_eval(Facts, Act, Sev, Reasons, Prohibs),
    Act \== evacuate_and_call_fire_department.

evaluate_domain_non_fallback(natural_disaster, Facts, Act, Sev, Reasons, Prohibs) :-
    disaster_eval(Facts, Act, Sev, Reasons, Prohibs),
    Act \== seek_safe_shelter_and_monitor_emergency_broadcasts.

evaluate_domain_non_fallback(road_accident, Facts, Act, Sev, Reasons, Prohibs) :-
    road_eval(Facts, Act, Sev, Reasons, Prohibs),
    Act \== secure_scene_and_call_emergency_dispatch.

% Compares two evaluations for prioritization
better_evaluation(eval(DomA, ActA, SevA, _, _), eval(DomB, ActB, SevB, _, _)) :-
    action_tier(ActA, TierA),
    action_tier(ActB, TierB),
    ( TierA < TierB -> true
    ; TierA > TierB -> fail
    ; priority_rank(SevA, SA), priority_rank(SevB, SB),
      ( SA < SB -> true
      ; SA > SB -> fail
      ; domain_precedence(DomA, DA), domain_precedence(DomB, DB),
        DA < DB
      )
    ).

% Resolves priority conflicts across multiple domain evaluations
resolve_priority_conflicts(Evaluations, PrimaryAction, CombinedSeverity, CombinedReasons, CombinedProhibitions) :-
    predsort(compare_evaluations, Evaluations, SortedEvaluations),
    SortedEvaluations = [eval(TopDomain, PrimaryAction, _TopSeverity, TopReasons, _) | SecondaryEvaluations],
    
    % Compute combined severity (highest severity among all evaluations)
    findall(S, member(eval(_, _, S, _, _), Evaluations), AllSeverities),
    highest_severity(AllSeverities, CombinedSeverity),
    
    % Aggregate prohibitions from all triggered domains (deduplicated)
    findall(P, (member(eval(_, _, _, _, Prohibs), Evaluations), member(P, Prohibs)), AllProhibitionsList),
    list_to_set(AllProhibitionsList, CombinedProhibitions),
    
    % Build compound explanatory reasons
    ( SecondaryEvaluations == [] ->
        CombinedReasons = TopReasons
    ; format_compound_reasons(TopDomain, PrimaryAction, SecondaryEvaluations, TopReasons, CombinedReasons)
    ).

compare_evaluations(Order, Eval1, Eval2) :-
    ( Eval1 == Eval2 -> Order = '='
    ; better_evaluation(Eval1, Eval2) -> Order = '<'
    ; Order = '>'
    ).

highest_severity(Severities, critical) :-
    member(critical, Severities), !.
highest_severity(Severities, high) :-
    member(high, Severities), !.
highest_severity(Severities, moderate) :-
    member(moderate, Severities), !.
highest_severity(Severities, low) :-
    member(low, Severities), !.
highest_severity(_, informational).

format_compound_reasons(TopDomain, PrimaryAction, SecondaryEvaluations, TopReasons, CombinedReasons) :-
    length(SecondaryEvaluations, SecCount),
    format(atom(Header), 'COMPOUND EMERGENCY RESOLUTION: Multiple hazard domains active (~w secondary threats identified). Primary action (~w from ~w) prioritized according to life-safety hierarchy.', [SecCount, PrimaryAction, TopDomain]),
    findall(SecNote, (
        member(eval(SecDom, SecAct, SecSev, _, _), SecondaryEvaluations),
        format(atom(SecNote), 'Concurrent Threat (~w, Severity: ~w): Subordinated directive is ~w. Ensure all aggregated safety prohibitions are observed.', [SecDom, SecSev, SecAct])
    ), SecondaryNotes),
    append([[Header | TopReasons], SecondaryNotes], CombinedReasons).
=======
% Global safe fallback if domain is unknown or reasoning encounters an unhandled case
evaluate_emergency(_Domain, _Facts, call_emergency_services_immediately, critical, Reasons, Prohibitions) :-
    Reasons = ['Uncertain emergency domain. Immediate contact with municipal emergency dispatch is required.'],
    Prohibitions = ['Do not delay contacting 199/191/192.'].
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9

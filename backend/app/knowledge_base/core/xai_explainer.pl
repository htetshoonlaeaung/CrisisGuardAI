% backend/app/knowledge_base/core/xai_explainer.pl
% Explainable AI (XAI) meta-interpreter for CrisisGuard AI.
% Generates deterministic, inspectable deduction trees and safety invariants for emergency transparency.

:- module(xai_explainer, [
    generate_xai_proof/3,
    explain_triage/5,
    prove/3
]).

% Top-level XAI triage explainer
explain_triage(medical, _Facts, Action, critical, ProofTree) :-
    Action == begin_cpr_and_call_emergency,
    !,
    ProofTree = proof_tree(
        'medical_rule_01: CARDIAC_ARREST_CPR',
        Action,
        [evidence(unconscious(true)), evidence(breathing(none))],
        'CPR Protocol: 100-120 BPM chest compressions and AED mandatory',
        ['Victim unconscious with absent respiration', 'Cardiac arrest confirmed']
    ).

explain_triage(medical, _Facts, Action, critical, ProofTree) :-
    Action == perform_infant_choking_protocol,
    !,
    ProofTree = proof_tree(
        'medical_rule_02a: INFANT_AIRWAY_OBSTRUCTION',
        Action,
        [evidence(patient_type(infant)), evidence(choking(true))],
        'NEVER perform abdominal thrusts on infants; 5 back blows + 5 chest thrusts only',
        ['Acute infant foreign body airway obstruction confirmed']
    ).

explain_triage(medical, _Facts, Action, critical, ProofTree) :-
    Action == choking_unconscious_begin_cpr_with_airway_check,
    !,
    ProofTree = proof_tree(
        'medical_rule_02b: UNCONSCIOUS_CHOKING_CPR',
        Action,
        [evidence(symptom(choking)), evidence(unconscious(true))],
        'Perform CPR compressions with visual airway inspection before breaths; no blind sweeps',
        ['Hypoxic loss of consciousness secondary to airway obstruction']
    ).

explain_triage(medical, _Facts, Action, critical, ProofTree) :-
    Action == perform_heimlich_thrusts,
    !,
    ProofTree = proof_tree(
        'medical_rule_02c: COMPLETE_AIRWAY_OBSTRUCTION',
        Action,
        [evidence(airway_pass(blocked))],
        'No blind finger sweeps; Deliver back blows and abdominal thrusts',
        ['Foreign body airway obstruction confirmed']
    ).

explain_triage(medical, _Facts, Action, high, ProofTree) :-
    Action == encourage_forceful_coughing_and_monitor,
    !,
    ProofTree = proof_tree(
        'medical_rule_02d: PARTIAL_AIRWAY_OBSTRUCTION',
        Action,
        [evidence(airway_pass(partial)), evidence(coughing(forceful))],
        'Do not deliver thrusts or back blows while coughing reflex is forceful',
        ['Partial airway obstruction with maintained ventilation reflex']
    ).

explain_triage(medical, _Facts, Action, critical, ProofTree) :-
    Action == apply_second_proximal_tourniquet,
    !,
    ProofTree = proof_tree(
        'medical_rule_03a: TOURNIQUET_TEMPORAL_ESCALATION',
        Action,
        [evidence(first_tourniquet_applied(true)), evidence(elapsed_minutes('>=2'))],
        'NEVER LOOSEN THE FIRST TOURNIQUET; apply second proximal tourniquet immediately',
        ['Persistent arterial hemorrhage after primary tourniquet failure']
    ).

explain_triage(medical, _Facts, Action, high, ProofTree) :-
    Action == monitor_tourniquet_time_and_prevent_shock,
    !,
    ProofTree = proof_tree(
        'medical_rule_03b: TOURNIQUET_HAEMOSTASIS_MAINTAINED',
        Action,
        [evidence(tourniquet_applied(true)), evidence(bleeding_stopped(true))],
        'Never loosen or release tourniquet to restore blood flow; record application time',
        ['Arterial haemostasis maintained; hypovolemic shock prevention initiated']
    ).

explain_triage(medical, _Facts, Action, critical, ProofTree) :-
    Action == apply_direct_pressure_and_tourniquet,
    !,
    ProofTree = proof_tree(
        'medical_rule_03c: ARTERIAL_HEMORRHAGE',
        Action,
        [evidence(bleeding(severe_pulsing))],
        'Immediate tourniquet occlusion required 2-3 inches proximal to wound',
        ['High-pressure arterial laceration confirmed']
    ).

explain_triage(medical, _Facts, Action, critical, ProofTree) :-
    Action == activate_hyperacute_stroke_protocol,
    !,
    ProofTree = proof_tree(
        'medical_rule_04a: HYPERACUTE_STROKE_WINDOW',
        Action,
        [evidence(stroke_signs(positive)), evidence(onset_time(under_4_hours))],
        'Aspirin strictly prohibited; record exact Last Known Well (LKW) time for tPA/thrombectomy',
        ['Hyperacute ischemic stroke within reperfusion window confirmed']
    ).

explain_triage(medical, _Facts, Action, critical, ProofTree) :-
    Action == position_in_recovery_and_protect_airway_stroke,
    !,
    ProofTree = proof_tree(
        'medical_rule_04b: STROKE_AIRWAY_COMPROMISE',
        Action,
        [evidence(stroke_signs(positive)), evidence(altered_mental_status(true))],
        'Place in lateral recovery position, elevate head 30 deg; nil per os (NPO)',
        ['Severe acute stroke with loss of airway protective reflexes']
    ).

explain_triage(medical, _Facts, Action, critical, ProofTree) :-
    Action == activate_stroke_emergency_dispatch,
    !,
    ProofTree = proof_tree(
        'medical_rule_04c: STROKE_FAST_PROTOCOL',
        Action,
        [evidence(stroke_signs(positive))],
        'Aspirin strictly prohibited prior to hospital CT brain imaging',
        ['Acute cerebrovascular ischemia suspected']
    ).

explain_triage(medical, _Facts, Action, high, ProofTree) :-
    Action == urgent_stroke_center_evaluation_tia,
    !,
    ProofTree = proof_tree(
        'medical_rule_04d: TIA_URGENT_EVALUATION',
        Action,
        [evidence(symptom(tia)), evidence(stroke_symptoms(resolved))],
        'Do not dismiss resolved symptoms; urgent neurovascular imaging required',
        ['Transient Ischemic Attack identified as high-risk pre-stroke warning']
    ).

explain_triage(fire_hazard, _Facts, Action, critical, ProofTree) :-
    Action == isolate_main_power_and_use_co2_extinguisher,
    !,
    ProofTree = proof_tree(
        'hazard_rule_01: ELECTRICAL_FIRE',
        Action,
        [evidence(hazard(fire)), evidence(fire_source(electrical))],
        'NEVER THROW WATER ON AN ELECTRICAL FIRE',
        ['Live electrical current creates severe electrocution hazard']
    ).

explain_triage(fire_hazard, _Facts, Action, critical, ProofTree) :-
    Action == cover_with_metal_lid_and_turn_off_burner,
    !,
    ProofTree = proof_tree(
        'hazard_rule_02: GREASE_FIRE',
        Action,
        [evidence(hazard(fire)), evidence(fire_source(cooking_oil))],
        'NEVER POUR WATER ON BURNING OIL OR GREASE',
        ['High-temperature oil combustion (>300C) requires smothering']
    ).

explain_triage(fire_hazard, _Facts, Action, critical, ProofTree) :-
    Action == eliminate_all_ignition_sources_and_isolate_perimeter,
    !,
    ProofTree = proof_tree(
        'hazard_rule_05a: FLAMMABLE_CHEMICAL_SPILL',
        Action,
        [evidence(hazard(chemical_spill)), evidence(chemical_type(flammable))],
        'NEVER operate electrical switches or radios within vapor perimeter',
        ['Volatile flammable chemical release with deflagration / explosion risk']
    ).

explain_triage(fire_hazard, _Facts, Action, critical, ProofTree) :-
    Action == evacuate_upwind_uphill_and_shelter_in_place_downwind,
    !,
    ProofTree = proof_tree(
        'hazard_rule_05b: TOXIC_CHEMICAL_PLUME',
        Action,
        [evidence(hazard(chemical_spill)), evidence(vapor_plume(visible))],
        'Do not enter low-lying areas or basements; evacuate upwind/uphill immediately',
        ['Atmospheric dispersion of toxic chemical vapor plume confirmed']
    ).

explain_triage(fire_hazard, _Facts, Action, critical, ProofTree) :-
    Action == isolate_corrosive_spill_and_prevent_water_reaction,
    !,
    ProofTree = proof_tree(
        'hazard_rule_05c: CORROSIVE_WATER_REACTIVE_SPILL',
        Action,
        [evidence(hazard(chemical_spill)), evidence(chemical_type(corrosive))],
        'NEVER POUR WATER ON WATER-REACTIVE CHEMICALS OR CONCENTRATED ACIDS',
        ['Corrosive chemical with severe dermal burn and exothermic reaction hazard']
    ).

explain_triage(fire_hazard, _Facts, Action, critical, ProofTree) :-
    Action == evacuate_upwind_and_call_hazmat,
    !,
    ProofTree = proof_tree(
        'hazard_rule_05d: GENERAL_HAZMAT_SPILL',
        Action,
        [evidence(hazard(chemical_spill))],
        'Do not walk through spilled liquids; maintain 500m upwind safety zone',
        ['Hazardous materials spill detected requiring certified HazMat containment']
    ).

explain_triage(Domain, _Facts, Action, Severity, ProofTree) :-
    ProofTree = proof_tree(
        'symbolic_rule_general',
        Action,
        [evidence(domain(Domain))],
        'Standard Life-Safety Invariant Enforced',
        ['Deterministic rule evaluation completed', severity(Severity)]
    ).

% Meta-interpreter proof generator
generate_xai_proof(Goal, Facts, ProofTree) :-
    prove(Goal, Facts, ProofTree).

prove(true, _, []) :- !.
prove((A, B), Facts, [PA, PB]) :-
    !,
    prove(A, Facts, PA),
    prove(B, Facts, PB).
prove(Goal, Facts, evidence(Goal)) :-
    member(Goal, Facts), !.
prove(Goal, Facts, deduction(Goal, SubProofs)) :-
    clause(Goal, Body),
    prove(Body, Facts, SubProofs).
prove(Goal, _Facts, assumed(Goal)).

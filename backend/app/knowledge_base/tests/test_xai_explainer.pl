% backend/app/knowledge_base/tests/test_xai_explainer.pl
% Prolog plunit test suite for xai_explainer.pl proof generator.

:- begin_tests(xai_tests).
:- use_module('../core/xai_explainer.pl').

test(cardiac_arrest_xai_proof_structure) :-
    once(explain_triage(medical, [unconscious(true), breathing(none)], begin_cpr_and_call_emergency, critical, ProofTree)),
    ProofTree = proof_tree(RuleLabel, Action, EvidenceList, SafetyInvariant, Deductions),
    Action == begin_cpr_and_call_emergency,
    sub_atom(RuleLabel, _, _, _, 'CARDIAC_ARREST'),
    member(evidence(unconscious(true)), EvidenceList),
    sub_atom(SafetyInvariant, _, _, _, '100-120 BPM').

test(electrical_fire_xai_proof_water_prohibition) :-
    once(explain_triage(fire_hazard, [hazard(fire), fire_source(electrical)], isolate_main_power_and_use_co2_extinguisher, critical, ProofTree)),
    ProofTree = proof_tree(_, Action, EvidenceList, SafetyInvariant, _),
    Action == isolate_main_power_and_use_co2_extinguisher,
    member(evidence(hazard(fire)), EvidenceList),
    sub_atom(SafetyInvariant, _, _, _, 'NEVER THROW WATER').

:- end_tests(xai_tests).

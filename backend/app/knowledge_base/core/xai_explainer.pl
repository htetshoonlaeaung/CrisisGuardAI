% backend/app/knowledge_base/core/xai_explainer.pl
% Explainable AI (XAI) meta-interpreter for CrisisGuard AI.
% Traces the Prolog proof tree for any evaluated goal and formats it
% into a human-readable, JSON-friendly deduction structure.

:- module(xai_explainer, [
    generate_xai_proof/3,
    prove/3
]).

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

% backend/app/knowledge_base/core/core_rules.pl
% Base inference engine and routing dispatcher.
% Delegates to domain-specific evaluation predicates and defines priority ranking.

:- module(core_rules, [
    evaluate_emergency/6,
    priority_rank/2,
    higher_urgency/2
]).

:- use_module('../domains/medical.pl').
:- use_module('../domains/fire_hazards.pl').
:- use_module('../domains/natural_disasters.pl').
:- use_module('../domains/road_accidents.pl').

% Priority ranks: lower number = higher urgency
priority_rank(critical, 1).
priority_rank(high, 2).
priority_rank(moderate, 3).
priority_rank(low, 4).
priority_rank(informational, 5).

higher_urgency(LevelA, LevelB) :-
    priority_rank(LevelA, RankA),
    priority_rank(LevelB, RankB),
    RankA < RankB.

% Master dispatcher routing by domain
evaluate_emergency(medical, Facts, Action, Severity, Reasons, Prohibitions) :-
    medical_eval(Facts, Action, Severity, Reasons, Prohibitions), !.

evaluate_emergency(fire_hazard, Facts, Action, Severity, Reasons, Prohibitions) :-
    hazard_eval(Facts, Action, Severity, Reasons, Prohibitions), !.

evaluate_emergency(natural_disaster, Facts, Action, Severity, Reasons, Prohibitions) :-
    disaster_eval(Facts, Action, Severity, Reasons, Prohibitions), !.

evaluate_emergency(road_accident, Facts, Action, Severity, Reasons, Prohibitions) :-
    road_eval(Facts, Action, Severity, Reasons, Prohibitions), !.

% Global safe fallback if domain is unknown or reasoning encounters an unhandled case
evaluate_emergency(_Domain, _Facts, call_emergency_services_immediately, critical, Reasons, Prohibitions) :-
    Reasons = ['Uncertain emergency domain. Immediate contact with municipal emergency dispatch is required.'],
    Prohibitions = ['Do not delay contacting 199/191/192.'].

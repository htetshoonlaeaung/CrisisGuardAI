% backend/app/knowledge_base/core/core_rules.pl
% Base inference engine and routing dispatcher.
% Delegates to domain-specific evaluation predicates and defines priority ranking.

:- module(core_rules, [
    evaluate_emergency/6,
    priority_rank/2,
    higher_urgency/2
]).

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

% TODO: Implement evaluate_emergency/6 dispatcher routing to domain modules
% TODO: Implement safe fallback rule for unrecognized fact combinations

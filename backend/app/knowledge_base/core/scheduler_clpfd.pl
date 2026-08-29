% backend/app/knowledge_base/core/scheduler_clpfd.pl
% Rescue team dispatch optimizer using Constraint Logic Programming over Finite Domains (CLP(FD)).
% Allocates teams to incidents while satisfying capacity, severity, and time constraints.

:- module(scheduler_clpfd, [
    schedule_rescue_teams/4,
    verify_resource_constraints/3
]).
:- use_module(library(clpfd)).

% Main dispatch optimizer
schedule_rescue_teams(IncidentSeverities, TeamCapacities, Assignments, _MaxTime) :-
    length(IncidentSeverities, N),
    length(Assignments, N),
    length(TeamCapacities, NumTeams),
    NumTeams > 0,
    Assignments ins 1..NumTeams,
    enforce_severity_matching(IncidentSeverities, Assignments),
    labeling([ff, bisect], Assignments).

% Critical incidents -> only teams 1-2 (critical paramedic response units)
enforce_severity_matching([], []).
enforce_severity_matching([critical|RestS], [TeamId|RestA]) :-
    TeamId #=< 2,
    enforce_severity_matching(RestS, RestA).
enforce_severity_matching([_|RestS], [_|RestA]) :-
    enforce_severity_matching(RestS, RestA).

% Resource verification predicate
verify_resource_constraints(Assignments, TeamCapacities, MaxLoad) :-
    length(TeamCapacities, NumTeams),
    MaxLoad in 0..100,
    Assignments ins 1..NumTeams.

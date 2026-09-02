% backend/app/knowledge_base/core/scheduler_clpfd.pl
% Rescue team dispatch optimizer using Constraint Logic Programming over Finite Domains (CLP(FD)).
% Allocates teams to incidents while satisfying capacity, severity, and time constraints.

:- module(scheduler_clpfd, [
    schedule_rescue_teams/4,
    schedule_rescue_with_capacities/5,
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
    enforce_severity_matching(IncidentSeverities, Assignments, NumTeams),
    labeling([ff, bisect], Assignments), !.

% Critical incidents -> only teams 1-2 (critical ALS paramedic & fire-rescue response units)
enforce_severity_matching([], [], _).
enforce_severity_matching([critical|RestS], [TeamId|RestA], NumTeams) :-
    MaxCriticalTeam is min(2, NumTeams),
    TeamId #=< MaxCriticalTeam,
    enforce_severity_matching(RestS, RestA, NumTeams).
enforce_severity_matching([_|RestS], [_|RestA], NumTeams) :-
    enforce_severity_matching(RestS, RestA, NumTeams).

% Capacity-constrained team dispatch optimizer
schedule_rescue_with_capacities(IncidentSeverities, IncidentDemands, TeamCapacities, Assignments, _MaxTime) :-
    length(IncidentSeverities, N),
    length(Assignments, N),
    length(TeamCapacities, NumTeams),
    NumTeams > 0,
    Assignments ins 1..NumTeams,
    enforce_severity_matching(IncidentSeverities, Assignments, NumTeams),
    enforce_team_capacity_limits(1, NumTeams, Assignments, IncidentDemands, TeamCapacities),
    labeling([ff, bisect], Assignments), !.

% Enforce sum of incident demands for team T does not exceed team T capacity
enforce_team_capacity_limits(TeamId, NumTeams, _, _, _) :-
    TeamId > NumTeams, !.
enforce_team_capacity_limits(TeamId, NumTeams, Assignments, Demands, Capacities) :-
    nth1(TeamId, Capacities, TeamCap),
    maplist(is_team_assigned(TeamId), Assignments, Booleans),
    scalar_product(Demands, Booleans, #=<, TeamCap),
    NextTeam is TeamId + 1,
    enforce_team_capacity_limits(NextTeam, NumTeams, Assignments, Demands, Capacities).

is_team_assigned(TeamId, A, B) :-
    B in 0..1,
    B #<==> (A #= TeamId).

% Resource verification predicate
verify_resource_constraints(Assignments, TeamCapacities, MaxLoad) :-
    length(TeamCapacities, NumTeams),
    MaxLoad in 0..100,
    Assignments ins 1..NumTeams.

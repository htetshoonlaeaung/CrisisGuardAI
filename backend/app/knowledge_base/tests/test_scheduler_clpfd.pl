% backend/app/knowledge_base/tests/test_scheduler_clpfd.pl
% Prolog plunit test suite for scheduler_clpfd.pl CLP(FD) constraint solver.

:- begin_tests(scheduler_tests).
:- use_module('../core/scheduler_clpfd.pl').
:- use_module(library(clpfd)).

test(critical_incidents_assigned_to_teams_1_or_2) :-
    schedule_rescue_teams([critical, high, moderate, critical], [10, 8, 6, 12], Assignments, 60),
    length(Assignments, 4),
    nth1(1, Assignments, Team1),
    nth1(4, Assignments, Team4),
    Team1 =< 2,
    Team4 =< 2.

test(capacity_constrained_scheduling_respects_limits) :-
    % 3 incidents needing 4, 3, 2 seats; 2 teams with capacities 5, 5
    schedule_rescue_with_capacities([critical, high, moderate], [4, 3, 2], [5, 5], Assignments, 60),
    length(Assignments, 3),
    nth1(1, Assignments, T1),
    T1 =< 2.

test(resource_constraints_verification) :-
    verify_resource_constraints([1, 2, 1], [4, 4], MaxLoad),
    MaxLoad in 0..100.

:- end_tests(scheduler_tests).

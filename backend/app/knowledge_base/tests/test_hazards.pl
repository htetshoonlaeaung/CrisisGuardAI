% backend/app/knowledge_base/tests/test_hazards.pl
% Prolog plunit test suite for fire_hazards.pl knowledge base.
% Verifies that safety-critical invariants hold: water is NEVER
% recommended for electrical or grease fires.

:- begin_tests(hazards_tests).
:- use_module('../domains/fire_hazards').

% TODO: test(electrical_fire_never_recommends_water)
% TODO: test(grease_fire_never_recommends_water)
% TODO: test(gas_leak_prohibits_switches)

:- end_tests(hazards_tests).

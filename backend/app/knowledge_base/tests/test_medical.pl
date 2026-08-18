% backend/app/knowledge_base/tests/test_medical.pl
% Prolog plunit test suite for medical.pl knowledge base.
% Tests that CPR, stroke, and bleeding rules fire correctly and
% that safety prohibitions are always present in critical outcomes.

:- begin_tests(medical_tests).
:- use_module('../domains/medical').

% TODO: test(cardiac_arrest_triggers_cpr)
% TODO: test(stroke_fast_dispatches_correctly)
% TODO: test(stroke_prohibits_aspirin)
% TODO: test(bleeding_triggers_tourniquet)

:- end_tests(medical_tests).

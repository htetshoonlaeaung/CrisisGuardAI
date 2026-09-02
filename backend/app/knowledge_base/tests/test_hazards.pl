% backend/app/knowledge_base/tests/test_hazards.pl
% Prolog plunit test suite for fire_hazards.pl knowledge base.
% Verifies that safety-critical invariants hold: water is NEVER
% recommended for electrical or grease fires.

:- begin_tests(hazards_tests).
:- use_module('../domains/fire_hazards.pl').

test(electrical_fire_never_recommends_water) :-
    once(hazard_eval([hazard(fire), fire_source(electrical)], Action, Severity, _Reasons, Prohibitions)),
    Action == isolate_main_power_and_use_co2_extinguisher,
    Severity == critical,
    member('NEVER THROW WATER ON AN ELECTRICAL FIRE.', Prohibitions).

test(grease_fire_never_recommends_water) :-
    once(hazard_eval([hazard(fire), fire_source(cooking_oil)], Action, Severity, _Reasons, Prohibitions)),
    Action == cover_with_metal_lid_and_turn_off_burner,
    Severity == critical,
    member('NEVER POUR WATER ON BURNING OIL OR GREASE.', Prohibitions).

test(gas_leak_prohibits_switches) :-
    once(hazard_eval([hazard(gas_leak), location(indoors)], Action, Severity, _Reasons, Prohibitions)),
    Action == evacuate_leave_doors_open_call_from_outside,
    Severity == critical,
    member('DO NOT OPERATE LIGHT SWITCHES, ELECTRICAL OUTLETS, OR PHONES INDOORS.', Prohibitions).

test(blocked_exit_fire_signals_window) :-
    once(hazard_eval([hazard(fire), exit_blocked(true)], Action, Severity, _Reasons, Prohibitions)),
    Action == seal_door_and_signal_from_window,
    Severity == critical,
    member('Do not attempt to push through dense hot toxic smoke.', Prohibitions).

test(chemical_spill_flammable_isolates_perimeter) :-
    once(hazard_eval([hazard(chemical_spill), chemical_type(flammable)], Action, Severity, _Reasons, Prohibitions)),
    Action == eliminate_all_ignition_sources_and_isolate_perimeter,
    Severity == critical,
    member('NEVER OPERATE ELECTRICAL SWITCHES, RADIOS, OR VEHICLES WITHIN VAPOR PLUME RADIUS.', Prohibitions).

test(chemical_spill_toxic_plume_evacuates_upwind) :-
    once(hazard_eval([hazard(chemical_spill), vapor_plume(visible)], Action, Severity, _Reasons, Prohibitions)),
    Action == evacuate_upwind_uphill_and_shelter_in_place_downwind,
    Severity == critical,
    member('Do not enter low-lying drainage ditches, culverts, or basements (dense chemical vapors pool in low areas).', Prohibitions).

test(chemical_spill_corrosive_prevents_water) :-
    once(hazard_eval([hazard(chemical_spill), chemical_type(corrosive)], Action, Severity, _Reasons, Prohibitions)),
    Action == isolate_corrosive_spill_and_prevent_water_reaction,
    Severity == critical,
    member('NEVER POUR WATER ON WATER-REACTIVE CHEMICALS OR CONCENTRATED ACIDS (causes violent exothermic boiling and acid splatter).', Prohibitions).

test(chemical_spill_general_hazmat_evacuation) :-
    once(hazard_eval([hazard(chemical_spill)], Action, Severity, _Reasons, Prohibitions)),
    Action == evacuate_upwind_and_call_hazmat,
    Severity == critical,
    member('Do not walk through spilled liquids or vapor clouds.', Prohibitions).

test(unknown_hazard_fallback) :-
    once(hazard_eval([hazard(unknown_case)], Action, Severity, _Reasons, Prohibitions)),
    Action == evacuate_and_call_fire_department,
    Severity == critical,
    member('Do not re-enter burning or hazardous structures under any circumstances.', Prohibitions).

:- end_tests(hazards_tests).

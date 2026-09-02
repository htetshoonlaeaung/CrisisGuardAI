% backend/app/knowledge_base/tests/test_disasters.pl
% Prolog plunit test suite for natural_disasters.pl knowledge base.

:- begin_tests(disasters_tests).
:- use_module('../domains/natural_disasters.pl').

test(flood_single_story_evacuates_higher_ground) :-
    once(disaster_eval([disaster(flood), water_rising(true), building(single_story)], Action, Severity, _Reasons, Prohibitions)),
    Action == evacuate_to_higher_ground_now,
    Severity == critical,
    member('Do not attempt to drive through flooded roads or swift water (Turn Around, Don\'t Drown).', Prohibitions).

test(flood_multi_story_vertical_evacuation) :-
    once(disaster_eval([disaster(flood), water_rising(true), building(multi_story)], Action, Severity, _Reasons, Prohibitions)),
    Action == vertical_evacuation_to_upper_floors,
    Severity == high,
    member('Do not take elevators during flooding or severe storm surges.', Prohibitions).

test(earthquake_active_drop_cover_hold) :-
    once(disaster_eval([disaster(earthquake), shaking(active)], Action, Severity, _Reasons, Prohibitions)),
    Action == drop_cover_and_hold_on,
    Severity == critical,
    member('Do not run outside during active ground shaking (falling facade hazard).', Prohibitions).

test(earthquake_post_gas_evacuate_shut_valve) :-
    once(disaster_eval([disaster(earthquake), shaking(stopped), smell_gas(true)], Action, Severity, _Reasons, Prohibitions)),
    Action == evacuate_and_shut_main_gas_valve,
    Severity == critical,
    member('Do not use matches, lighters, or electronic equipment near suspected gas leak.', Prohibitions).

test(tsunami_inland_evacuation) :-
    once(disaster_eval([disaster(tsunami), coastal(true)], Action, Severity, _Reasons, Prohibitions)),
    Action == evacuate_inland_immediately,
    Severity == critical,
    member('Do not go to the beach or harbor to observe incoming waves or receding water.', Prohibitions).

test(cyclone_interior_room_shelter) :-
    once(disaster_eval([disaster(cyclone), wind_speed(extreme)], Action, Severity, _Reasons, Prohibitions)),
    Action == shelter_in_interior_windowless_room,
    Severity == critical,
    member('Do not stay in rooms adjacent to exterior glass windows or skylights.', Prohibitions).

test(landslide_perpendicular_evacuation) :-
    once(disaster_eval([disaster(landslide)], Action, Severity, _Reasons, Prohibitions)),
    Action == evacuate_perpendicular_to_landslide_path,
    Severity == critical,
    member('Do not attempt to outrun a debris flow downhill.', Prohibitions).

test(unknown_disaster_fallback) :-
    once(disaster_eval([disaster(unknown_event)], Action, Severity, _Reasons, _Prohibitions)),
    Action == seek_safe_shelter_and_monitor_emergency_broadcasts,
    Severity == high.

:- end_tests(disasters_tests).

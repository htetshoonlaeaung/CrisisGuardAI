% backend/app/knowledge_base/domains/natural_disasters.pl
% Natural disaster emergency decision rules for CrisisGuard AI.
% Covers: Flood (rising water, single/multi-story), Earthquake (active shaking, post-quake gas leak),
%         Cyclone, Tsunami, Landslide.

:- module(disasters_kb, [disaster_eval/5]).

% TODO: Rule 1 — Flood / Single Story: disaster(flood) + water_rising(true) + building(single_story) -> evacuate_to_higher_ground_now
% TODO: Rule 2 — Flood / Multi Story: disaster(flood) + water_rising(true) + building(multi_story) -> vertical_evacuation_to_upper_floors
% TODO: Rule 3 — Earthquake (Active): disaster(earthquake) + shaking(active) + location(indoors) -> drop_cover_and_hold_on
% TODO: Rule 4 — Earthquake (Post / Gas): disaster(earthquake) + shaking(stopped) + smell_gas(true) -> evacuate_and_shut_main_gas_valve
% TODO: Rule 5 — Tsunami: disaster(tsunami) + coastal(true) -> evacuate_inland_immediately

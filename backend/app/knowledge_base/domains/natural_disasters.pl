% backend/app/knowledge_base/domains/natural_disasters.pl
% Natural disaster emergency decision rules for CrisisGuard AI.
% Covers: Flood (rising water, single/multi-story), Earthquake (active shaking, post-quake gas leak),
%         Cyclone, Tsunami, Landslide.

:- module(disasters_kb, [disaster_eval/5]).

% 1. FLOOD / SINGLE STORY — Evacuate to higher ground
disaster_eval(Facts, evacuate_to_higher_ground_now, critical, Reasons, Prohibitions) :-
    ( member(disaster(flood), Facts) ; member(flood(true), Facts) ),
    member(water_rising(true), Facts),
    member(building(single_story), Facts),
    Reasons = [
        'Rapidly rising floodwaters in single-story structure create severe entrapment and drowning risk.',
        'Evacuate immediately on foot to elevated ground or designated high-altitude emergency shelter.'
    ],
    Prohibitions = [
        'Do not attempt to drive through flooded roads or swift water (Turn Around, Don\'t Drown).',
        'Do not touch submerged electrical panels or downed power lines.'
    ].

% 2. FLOOD / MULTI STORY — Vertical evacuation
disaster_eval(Facts, vertical_evacuation_to_upper_floors, high, Reasons, Prohibitions) :-
    ( member(disaster(flood), Facts) ; member(flood(true), Facts) ),
    member(water_rising(true), Facts),
    ( member(building(multi_story), Facts) ; member(building(high_rise), Facts) ),
    Reasons = [
        'Floodwaters rising on ground level; upper structural floors remain dry and load-bearing.',
        'Move occupants, emergency supplies, and communications gear to second floor or roof access.'
    ],
    Prohibitions = [
        'Do not take elevators during flooding or severe storm surges.',
        'Do not shelter in enclosed attics without direct rooftop breakout access.'
    ].

% 3. EARTHQUAKE (ACTIVE SHAKING) — Drop, Cover, Hold On
disaster_eval(Facts, drop_cover_and_hold_on, critical, Reasons, Prohibitions) :-
    ( member(disaster(earthquake), Facts) ; member(earthquake(true), Facts) ),
    member(shaking(active), Facts),
    Reasons = [
        'Violent ground motion and risk of non-structural falling debris.',
        'Drop to hands and knees, take cover under a sturdy desk or table, and hold on until shaking stops.'
    ],
    Prohibitions = [
        'Do not run outside during active ground shaking (falling facade hazard).',
        'Do not stand in doorways or near unprotected glass windows.'
    ].

% 4. EARTHQUAKE (POST / GAS LEAK) — Evacuate and shut valve
disaster_eval(Facts, evacuate_and_shut_main_gas_valve, critical, Reasons, Prohibitions) :-
    ( member(disaster(earthquake), Facts) ; member(earthquake(true), Facts) ),
    member(shaking(stopped), Facts),
    member(smell_gas(true), Facts),
    Reasons = [
        'Post-earthquake gas pipe rupture detected.',
        'Shut off exterior master gas valve if safe to do so and evacuate immediately to open area.'
    ],
    Prohibitions = [
        'Do not use matches, lighters, or electronic equipment near suspected gas leak.',
        'Do not re-enter compromised buildings until cleared by structural engineers.'
    ].

% 5. TSUNAMI — Immediate coastal evacuation
disaster_eval(Facts, evacuate_inland_immediately, critical, Reasons, Prohibitions) :-
    ( member(disaster(tsunami), Facts) ; member(tsunami(true), Facts) ),
    ( member(coastal(true), Facts) ; member(proximity(coastal), Facts) ),
    Reasons = [
        'High-velocity tsunami wave train imminent following seismic event.',
        'Move immediately at least 2 miles inland or to high ground at least 100 feet above sea level.'
    ],
    Prohibitions = [
        'Do not go to the beach or harbor to observe incoming waves or receding water.',
        'Do not wait for visual confirmation before beginning evacuation.'
    ].

% 6. GENERAL DISASTER FALLBACK
disaster_eval(_Facts, seek_safe_shelter_and_monitor_emergency_broadcasts, high, Reasons, Prohibitions) :-
    Reasons = ['Natural disaster conditions detected. Seek certified storm/emergency shelter and monitor civil defense radio.'],
    Prohibitions = ['Do not travel on compromised bridges, coastal highways, or steep hillsides.'].

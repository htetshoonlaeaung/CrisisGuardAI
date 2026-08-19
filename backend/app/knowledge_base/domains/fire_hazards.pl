% backend/app/knowledge_base/domains/fire_hazards.pl
% Fire and hazard emergency decision rules for CrisisGuard AI.
% Covers: Electrical fire, Cooking oil/grease fire, Gas leak (indoors),
%         House fire (smoke/flames/blocked exits), Chemical spill.

:- module(hazards_kb, [hazard_eval/5]).

% 1. ELECTRICAL FIRE — STRICT: NEVER WATER
hazard_eval(Facts, isolate_main_power_and_use_co2_extinguisher, critical, Reasons, Prohibitions) :-
    ( member(hazard(fire), Facts) ; member(fire(true), Facts) ),
    member(fire_source(electrical), Facts),
    Reasons = [
        'Live electrical current creates severe electrocution and arc flash hazard.',
        'Cut main circuit breaker power if accessible and use Class C / CO2 fire extinguisher.'
    ],
    Prohibitions = [
        'NEVER THROW WATER ON AN ELECTRICAL FIRE.',
        'Do not touch exposed wires, burning appliances, or conductive surfaces.'
    ].

% 2. GREASE/COOKING OIL FIRE — STRICT: NEVER WATER
hazard_eval(Facts, cover_with_metal_lid_and_turn_off_burner, critical, Reasons, Prohibitions) :-
    ( member(hazard(fire), Facts) ; member(fire(true), Facts) ),
    ( member(fire_source(cooking_oil), Facts) ; member(fire_source(grease), Facts) ),
    Reasons = [
        'High-temperature oil combustion (>300C).',
        'Smother the flames by sliding a metal lid or fire blanket over the pan and switch off heat source.'
    ],
    Prohibitions = [
        'NEVER POUR WATER ON BURNING OIL OR GREASE.',
        'Do not attempt to move or carry the burning pan outside.'
    ].

% 3. GAS LEAK INDOORS — STRICT: NO IGNITION SOURCES
hazard_eval(Facts, evacuate_leave_doors_open_call_from_outside, critical, Reasons, Prohibitions) :-
    ( member(hazard(gas_leak), Facts) ; member(gas_leak(true), Facts) ; member(smell_gas(true), Facts) ),
    member(location(indoors), Facts),
    Reasons = [
        'Accumulated flammable gas presents severe explosion hazard.',
        'Evacuate all occupants immediately, leave entry doors open for ventilation, and call emergency services from at least 100 meters outside.'
    ],
    Prohibitions = [
        'DO NOT OPERATE LIGHT SWITCHES, ELECTRICAL OUTLETS, OR PHONES INDOORS.',
        'DO NOT LIGHT MATCHES, CANDLES, OR ANY FLAME.'
    ].

% 4. HOUSE FIRE — BLOCKED EXIT
hazard_eval(Facts, seal_door_and_signal_from_window, critical, Reasons, Prohibitions) :-
    ( member(hazard(fire), Facts) ; member(fire(true), Facts) ),
    member(exit_blocked(true), Facts),
    Reasons = [
        'Primary egress blocked by heavy smoke or flames.',
        'Retreat to room with external window, seal door cracks with wet towels/clothing, and signal emergency crews from window.'
    ],
    Prohibitions = [
        'Do not attempt to push through dense hot toxic smoke.',
        'Do not break windows unless instructed by firefighters (avoids feeding oxygen into backdraft).'
    ].

% 5. GENERAL FIRE / HAZARD FALLBACK
hazard_eval(_Facts, evacuate_and_call_fire_department, critical, Reasons, Prohibitions) :-
    Reasons = ['Active fire or hazardous materials condition. Immediate evacuation to safe perimeter required.'],
    Prohibitions = ['Do not re-enter burning or hazardous structures under any circumstances.'].

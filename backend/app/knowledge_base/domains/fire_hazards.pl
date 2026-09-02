% backend/app/knowledge_base/domains/fire_hazards.pl
% Fire and hazard emergency decision rules for CrisisGuard AI.
% Covers: Electrical fire, Cooking oil/grease fire, Gas leak (indoors),
%         House fire (smoke/flames/blocked exits), Chemical spill, Wildfire.

:- module(hazards_kb, [hazard_eval/5]).

% 1. ELECTRICAL FIRE — STRICT: NEVER WATER
hazard_eval(Facts, isolate_main_power_and_use_co2_extinguisher, critical, Reasons, Prohibitions) :-
    ( member(hazard(fire), Facts) ; member(fire(true), Facts) ),
    member(fire_source(electrical), Facts),
    !,
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
    ( member(fire_source(cooking_oil), Facts) ; member(fire_source(grease), Facts) ; member(fire_source(oil), Facts) ),
    !,
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
    !,
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
    !,
    Reasons = [
        'Primary egress blocked by heavy smoke or flames.',
        'Retreat to room with external window, seal door cracks with wet towels/clothing, and signal emergency crews from window.'
    ],
    Prohibitions = [
        'Do not attempt to push through dense hot toxic smoke.',
        'Do not break windows unless instructed by firefighters (avoids feeding oxygen into backdraft).'
    ].

% 5A. HAZARDOUS CHEMICAL SPILL (FLAMMABLE / EXPLOSIVE VAPORS)
hazard_eval(Facts, eliminate_all_ignition_sources_and_isolate_perimeter, critical, Reasons, Prohibitions) :-
    ( member(hazard(chemical_spill), Facts) ; member(chemical_leak(true), Facts) ),
    ( member(chemical_type(flammable), Facts) ; member(chemical_type(fuel), Facts) ; member(flammable_liquid(true), Facts) ),
    !,
    Reasons = [
        'Volatile flammable chemical liquid spill presents immediate ignition, deflagration, and BLEVE explosion risk.',
        'Establish 300-meter non-sparking exclusion perimeter, eliminate all ignition sources, and deploy HazMat Class B foam blanket.'
    ],
    Prohibitions = [
        'NEVER OPERATE ELECTRICAL SWITCHES, RADIOS, OR VEHICLES WITHIN VAPOR PLUME RADIUS.',
        'Do not wash flammable chemical liquids into public storm drains or sewer systems.',
        'Do not use water streams directly on burning hydrocarbons without specialized foam.'
    ].

% 5B. HAZARDOUS CHEMICAL SPILL (TOXIC GAS / AIRBORNE VAPOR PLUME)
hazard_eval(Facts, evacuate_upwind_uphill_and_shelter_in_place_downwind, critical, Reasons, Prohibitions) :-
    ( member(hazard(chemical_spill), Facts) ; member(chemical_leak(true), Facts) ; member(spill_type(toxic_gas), Facts) ),
    ( member(vapor_plume(visible), Facts) ; member(wind_direction(toward_population), Facts) ; member(fumes(toxic), Facts) ; member(spill_type(toxic_vapor), Facts) ),
    !,
    Reasons = [
        'Airborne toxic chemical plume migration poses acute inhalation toxicity and systemic atmospheric contamination hazard.',
        'Evacuate immediately perpendicular then upwind and uphill to at least 1,000 meters; order downwind populations to shelter in place (seal doors/windows and shut off HVAC).'
    ],
    Prohibitions = [
        'Do not enter low-lying drainage ditches, culverts, or basements (dense chemical vapors pool in low areas).',
        'Do not walk into or drive through visible chemical vapors or gas clouds.',
        'Do not operate exterior air ventilation or air conditioning units downwind.'
    ].

% 5C. HAZARDOUS CHEMICAL SPILL (CORROSIVE / WATER-REACTIVE)
hazard_eval(Facts, isolate_corrosive_spill_and_prevent_water_reaction, critical, Reasons, Prohibitions) :-
    ( member(hazard(chemical_spill), Facts) ; member(chemical_leak(true), Facts) ),
    ( member(chemical_type(corrosive), Facts) ; member(chemical_type(acid), Facts) ; member(chemical_type(caustic), Facts) ; member(water_reactive(true), Facts) ),
    !,
    Reasons = [
        'Corrosive chemical or concentrated acid/alkali spill creates severe dermal chemical burn and violent hydration reaction hazard.',
        'Isolate spill area with chemical-resistant containment barriers, identify UN placard / Safety Data Sheet (SDS) from distance, and await certified HazMat neutralization.'
    ],
    Prohibitions = [
        'NEVER POUR WATER ON WATER-REACTIVE CHEMICALS OR CONCENTRATED ACIDS (causes violent exothermic boiling and acid splatter).',
        'Do not touch spilled chemicals or contaminated packaging without level A/B HazMat suit.',
        'Do not inhale acidic or alkaline fuming vapors.'
    ].

% 5D. HAZARDOUS CHEMICAL SPILL / TOXIC GAS (GENERAL HAZMAT)
hazard_eval(Facts, evacuate_upwind_and_call_hazmat, critical, Reasons, Prohibitions) :-
    ( member(hazard(chemical_spill), Facts) ; member(chemical_leak(true), Facts) ; member(spill_type(toxic_gas), Facts) ),
    !,
    Reasons = [
        'Toxic industrial chemical or corrosive gas release detected.',
        'Evacuate immediately in an upwind and uphill direction to at least 500 meters safety radius.'
    ],
    Prohibitions = [
        'Do not walk through spilled liquids or vapor clouds.',
        'Do not attempt to contain chemical spills without certified HazMat PPE.'
    ].

% 6. WILDFIRE / BRUSHFIRE
hazard_eval(Facts, execute_wildfire_evacuation_order, critical, Reasons, Prohibitions) :-
    ( member(hazard(wildfire), Facts) ; member(wildfire(true), Facts) ; member(brushfire(true), Facts) ),
    !,
    Reasons = [
        'Rapidly propagating wildfire front threatens structure.',
        'Evacuate immediately via designated primary egress routes, turn on headlights, and close vehicle air intake vents.'
    ],
    Prohibitions = [
        'Do not delay evacuation to protect non-essential property.',
        'Do not shelter in combustible wooden structures if evacuation routes remain open.'
    ].

% 7. GENERAL FIRE / HAZARD FALLBACK
hazard_eval(_Facts, evacuate_and_call_fire_department, critical, Reasons, Prohibitions) :-
    Reasons = ['Active fire or hazardous materials condition. Immediate evacuation to safe perimeter required.'],
    Prohibitions = ['Do not re-enter burning or hazardous structures under any circumstances.'].

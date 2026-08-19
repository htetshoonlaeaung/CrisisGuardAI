% backend/app/knowledge_base/domains/road_accidents.pl
% Road accident and vehicle crash emergency decision rules for CrisisGuard AI.
% Covers: Scene safety, unconscious victim extraction, multi-casualty triage,
%         CPR at accident scene, vehicle fire post-crash.

:- module(road_kb, [road_eval/5]).

% 1. UNCONSCIOUS + NO BREATHING — CPR, preserve spine
road_eval(Facts, begin_cpr_do_not_move_spine, critical, Reasons, Prohibitions) :-
    member(unconscious(true), Facts),
    member(breathing(none), Facts),
    Reasons = [
        'Victim in vehicular crash is in respiratory/cardiac arrest.',
        'Begin chest compressions immediately while maintaining inline cervical spine stabilization.'
    ],
    Prohibitions = [
        'Do not twist, flex, or hyper-extend victim\'s neck or spine unless required for airway/CPR.',
        'Do not remove victim\'s motorcycle helmet unless airway is obstructed.'
    ].

% 2. VEHICLE FIRE POST-CRASH + TRAPPED VICTIM
road_eval(Facts, call_rescue_and_maintain_safe_distance, critical, Reasons, Prohibitions) :-
    ( member(vehicle_fire(true), Facts) ; member(fire(true), Facts) ),
    member(trapped(true), Facts),
    Reasons = [
        'Vehicle fire with entrapped occupant poses immediate explosion and thermal hazard.',
        'Call heavy hydraulic extrication units immediately and suppress perimeter if extinguisher is available.'
    ],
    Prohibitions = [
        'Do not enter burning passenger compartment without protective turnout gear.',
        'Do not cut vehicle structural pillars containing undeployed airbag inflator canisters.'
    ].

% 3. MULTIPLE CASUALTIES
road_eval(Facts, triage_by_severity_and_call_mass_casualty_dispatch, critical, Reasons, Prohibitions) :-
    ( member(multiple_victims(true), Facts) ; member(mass_casualty(true), Facts) ),
    Reasons = [
        'Multi-casualty vehicle collision overwhelms single responder capacity.',
        'Implement START triage protocol (Red: Immediate, Yellow: Delayed, Green: Minor, Black: Deceased) and call for multi-ambulance dispatch.'
    ],
    Prohibitions = [
        'Do not spend excessive time treating non-survivable injuries on single victim.',
        'Do not move walking wounded unless area is unsafe.'
    ].

% 4. TRAFFIC HAZARD (ACTIVE HIGHWAY)
road_eval(Facts, establish_safety_perimeter_before_aid, high, Reasons, Prohibitions) :-
    ( member(hazard(traffic), Facts) ; member(active_traffic(true), Facts) ),
    Reasons = [
        'High-speed passing vehicles create secondary collision hazard.',
        'Deploy warning triangles/flares 100 meters upstream and park response vehicle angled to block traffic.'
    ],
    Prohibitions = [
        'Do not step into live traffic lanes without high-visibility vests and perimeter markers.',
        'Do not turn your back to oncoming traffic.'
    ].

% 5. GENERAL ROAD ACCIDENT FALLBACK
road_eval(_Facts, secure_scene_and_call_emergency_dispatch, critical, Reasons, Prohibitions) :-
    Reasons = ['Motor vehicle collision reported. Secure scene safety and request police and paramedic dispatch.'],
    Prohibitions = ['Do not move stable victims inside damaged vehicles unless vehicle is on fire or sinking.'].

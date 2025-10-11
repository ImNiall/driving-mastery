import { Category, LearningModule } from "@/types";

export const LEARNING_MODULES: LearningModule[] = [
  {
    slug: "alertness",
    title: "Alertness: Staying Focused on the Road",
    category: Category.ALERTNESS,
    summary:
      "Master the core principles of observation, anticipation, and concentration to prevent accidents.",
    estimatedDuration: "15 min",
    difficulty: "Beginner",
    tags: ["observation", "anticipation", "concentration"],
    learningObjectives: [
      "Use mirror routines and scanning techniques to maintain 360° awareness",
      "Anticipate hazards by applying “what if” thinking to developing situations",
      "Identify and manage common distractions, fatigue, and impairment risks",
    ],
    lastReviewed: "2025-09-01",
    sourceVersion: "Highway Code 2024 update",
    content: `
## Overview
Alertness is actively paying attention to your surroundings. Observation, anticipation, and concentration work together to keep you ahead of hazards.

## Observation and Scanning
Good observation is a continuous process of gathering information and interpreting it quickly.

### Effective Scanning Technique
* **Scan constantly:** Move your eyes every few seconds. Look far ahead, then near, then mirrors.
* **Mirror routine:** Use **Mirror-Signal-Manoeuvre (MSM)** before every change of speed or direction.
* **Blind spot check:** Always perform a lifesaver shoulder glance before moving off, lane changes, and turns.

## Anticipation
Anticipation means reading clues and predicting what might happen next.
* **Ask "What if?":** Imagine doors opening, children chasing balls, or sudden braking. Have a response ready.
* **Read the road:** Watch brake lights, indicators, pedestrian behaviour, and road furniture that signal hidden hazards.

## Concentration and Distractions
> **Highway Code, Rule 148:** "Safe driving and riding needs concentration. Avoid distractions..."
* **Tiredness:** Build in breaks of **15 minutes every 2 hours** on longer trips. Micro-sleeps can occur without warning.
* **Distractions:** Phones, infotainment systems, eating, or conversations divert focus.
>W Using a hand-held phone while driving is illegal and dangerously distracting; even hands-free can impair judgement.
* **Alcohol & drugs:** Slow reactions and narrow vision. Check medication labels for drowsiness warnings.

## Key Takeaways
- Keep eyes moving and mirrors checked to maintain full awareness.
- Always plan for unexpected behaviour from others.
- Remove or minimise distractions before setting off; rest if fatigue appears.

## Practice Prompt
>! On your next drive, count how many times you perform MSM checks in a 10-minute period. Aim to increase the frequency while keeping movements smooth before taking the quiz.
`,
  },
  {
    slug: "attitude",
    title: "Attitude: Responsible and Safe Driving",
    category: Category.ATTITUDE,
    summary:
      "Understand the mindset required for safe driving, including patience, consideration, and avoiding road rage.",
    estimatedDuration: "15 min",
    difficulty: "Beginner",
    tags: ["road rage", "patience", "sharing the road"],
    learningObjectives: [
      "Demonstrate courteous behaviour toward vulnerable road users and emergency vehicles",
      "Maintain safe following distances in varied conditions",
      "De-escalate stressful driving encounters without breaking traffic laws",
    ],
    lastReviewed: "2025-09-01",
    sourceVersion: "Highway Code 2024 update",
    content: `
## Overview
Your attitude underpins every decision on the road. Patience, consideration, and rule-following prevent conflict and keep traffic safe.

## Key Attitude Principles
* **Plan time:** Allow enough travel time to remove pressure to rush.
* **Consider others:** Vulnerable users and professional drivers need space and respect.
* **Follow rules:** Speed limits, signals, and markings exist for everyone’s safety.

### Tailgating and Safe Distances
>W Tailgating intimidates others and shortens your reaction window—it is a traffic offence.
* Maintain a **two-second gap** in dry weather, **four seconds** in rain, up to **ten seconds** on ice.
* If someone tailgates you, ease off the accelerator to increase the gap ahead and give them space to pass safely.

## Responding to Other Road Users
* **Emergency vehicles:** Indicate, check mirrors, and move aside when safe without breaking laws or entering bus lanes illegally.
* **Buses and HGVs:** Allow them to pull out or turn; they often need extra space.
* **Headlight flashing & horn:** Flash only to let others know you are there. Use the horn as a warning, not an expression of frustration.

## Managing Stress and Road Rage
* Breathe and count to three before reacting to another driver’s mistake.
* Avoid eye contact with aggressive drivers; stay in your vehicle with doors locked if threatened.
* Pull over safely for a short break if emotions are running high.

## Key Takeaways
- Patience and respect reduce risky behaviour.
- Safe gaps buy you reaction time in all conditions.
- Stay calm and lawful when others make mistakes.

## Practice Prompt
>! On your next drive, note three moments where you showed consideration (e.g., giving way, holding back). Reflect on how it influenced the situation before attempting the quiz.
`,
  },
  {
    slug: "safety-and-your-vehicle",
    title: "Safety and Your Vehicle",
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    summary:
      "Learn essential vehicle safety checks and understand the features that keep you safe on the road.",
    estimatedDuration: "18 min",
    difficulty: "Beginner",
    tags: ["vehicle checks", "maintenance", "safety systems"],
    learningObjectives: [
      "Complete the POWERS pre-drive safety routine",
      "Identify legal tyre, light, and fluid requirements",
      "Recognise warning signs that require professional inspection",
    ],
    lastReviewed: "2025-09-01",
    sourceVersion: "Highway Code 2024 update",
    content: `
## Overview
Keeping your vehicle roadworthy is a legal requirement and a foundation for safe driving. Weekly checks catch problems before they become dangerous.

## Pre-Drive Checks (POWERS)
> **Highway Code, Annex 6:** You MUST ensure your vehicle complies with construction and lighting regulations.
* **P – Petrol:** Ensure you have enough fuel for the journey; running dry is hazardous and may cause obstruction.
* **O – Oil:** Check levels on level ground with the engine cold. Low oil risks engine failure.
* **W – Water:** Top up washer fluid and verify coolant sits between min/max marks.
* **E – Electrics:** Test lights, indicators, horn, and wipers. Ask someone to confirm brake lights.
* **R – Rubber:** Inspect tyre tread and pressures when cold; look for damage or embedded objects.

## Tyres and Safety Components
* **Tread depth:** Minimum **1.6 mm** across the central three-quarters of the tyre. Less grip means longer stopping distances.
>W Driving on defective tyres is illegal and can attract fines and penalty points.
* **Pressures:** Check manufacturer values (door pillar or handbook). Under-inflation affects braking; over-inflation reduces grip.
* **Brakes & steering:** Spongy pedals or pulling to one side needs immediate inspection. ABS lights should extinguish shortly after start-up.
* **Head restraints:** Align with the top of your ears and close to the head to reduce whiplash.

## Lights and Visibility
* Use dipped headlights in darkness or poor weather. Switch to main beam only on unlit roads when no one is ahead.
* Fog lights are for visibility below **100 metres**; turn them off as conditions improve.
* Keep windscreens clean inside and out; remove stickers that block sight lines.

## Key Takeaways
- Run the POWERS checklist weekly and before long journeys.
- Tyre condition and fluid levels directly influence safety and legal compliance.
- Treat dashboard warning lights as urgent investigations.

## Practice Prompt
>! Schedule a calendar reminder for a weekly POWERS check. Record any issues you discover before taking the quiz.
`,
  },
  {
    slug: "safety-margins",
    title: "Safety Margins: Keeping Your Distance",
    category: Category.SAFETY_MARGINS,
    summary:
      "Learn how to maintain safe distances from other vehicles in various conditions to ensure you have time to react.",
    estimatedDuration: "17 min",
    difficulty: "Beginner",
    tags: ["following distance", "braking", "stopping distances"],
    learningObjectives: [
      "Maintain appropriate following gaps in dry, wet, and icy conditions",
      "Calculate stopping distances using thinking and braking components",
      "Recognise factors that increase stopping distance and adjust speed accordingly",
    ],
    lastReviewed: "2025-09-01",
    sourceVersion: "Highway Code 2024 update",
    content: `
## Overview
Safety margins create space to react. Adjusting your gap to conditions prevents rear-end collisions and keeps you out of the danger zone.

## Following Distance: The Two-Second Rule
>! In good, dry conditions, keep at least a **two-second** gap.
Choose a roadside marker. When the vehicle ahead passes it, say "Only a fool breaks the two-second rule." If you arrive before finishing, drop back.

## Adjusting for Conditions
* **Wet roads:** Double the gap to **four seconds**; tyres need more time to clear water.
* **Snow/ice:** Leave up to **ten seconds**; braking distance can increase tenfold.
* **Large vehicles:** Hang back to see past them and avoid spray.
* **Night/tunnels:** Depth perception drops—add extra space.

## Stopping Distances Explained
* **Thinking distance:** Time from spotting a hazard to pressing the brake.
* **Braking distance:** Time from brake application to a full stop.
**Overall stopping distance = thinking + braking.**
> **Highway Code, Rule 126:** "Drive at a speed that will allow you to stop well within the distance you can see to be clear."

### Factors Affecting Stopping Distance
* **Speed:** Braking distance increases with the square of speed—double speed, quadruple braking distance.
* **Driver state:** Fatigue, alcohol, or distractions slow reactions.
* **Vehicle condition:** Worn tyres or brakes, heavy loads, or towing increase stopping distances.
* **Road gradient and weather:** Downhill grades and slippery surfaces both extend stopping.

## Key Takeaways
- Count time-based gaps, not car lengths.
- Reduce speed and increase following distance as grip drops.
- Understand how thinking distance adds to braking—plan for the total.

## Practice Prompt
>! On your next journey, time the gap to the vehicle ahead in dry, then wet conditions. Note the difference and adjust before taking the quiz.
`,
  },
  {
    slug: "hazard-awareness",
    title: "Hazard Awareness: Spotting Dangers Early",
    category: Category.HAZARD_AWARENESS,
    summary:
      "Develop the skill of spotting developing hazards and learn how to react safely and in good time.",
    estimatedDuration: "20 min",
    difficulty: "Intermediate",
    tags: ["hazard perception", "defensive driving"],
    learningObjectives: [
      "Classify hazards as static, developing, or changing conditions",
      "Apply MSM and PSL routines to manage emerging risks",
      "Adapt hazard perception to urban, rural, and night scenarios",
    ],
    lastReviewed: "2025-09-01",
    sourceVersion: "Highway Code 2024 update",
    content: `
## Overview
Hazard awareness means spotting dangers early and responding smoothly. Defensive driving is seeing, understanding, and acting in good time.

## Types of Hazards
* **Static:** Fixed features—junctions, roundabouts, parked cars, roadworks.
* **Developing:** Moving users—pedestrians, cyclists, vehicles changing lanes.
* **Changing conditions:** Weather, road surface, lighting.

## Using MSM & PSL Routines
* **MSM (Mirror-Signal-Manoeuvre):** Check mirrors, signal intentions, then manoeuvre.
* **PSL (Position-Speed-Look):** Position your car, adjust speed, and look again before committing.
These routines ensure hazards are considered before every action.

## Common Hazards and Responses
* **Pedestrians:** Children near buses or ice cream vans may emerge suddenly—cover the brake.
* **Cyclists:** Give at least **1.5 metres** clearance; watch for swerves around potholes.
* **Junctions:** Treat limited-visibility junctions with caution—creep forward while scanning.
* **Parked vehicles:** Look for brake lights or driver movement indicating departure.
>W Rural roads may hide animals, mud, or sharp bends. Reduce speed and extend your observation distance.

### Night and Weather Adjustments
* Reduce speed in rain or fog; reflections and glare hide hazards.
* Use dipped headlights and clear windscreens to maximise visibility.

## Key Takeaways
- Categorise hazards quickly to choose the right response.
- Run MSM/PSL automatically before every manoeuvre.
- Adapt to environment—urban clutter, rural blind bends, or night glare all demand tailored speed and observation.

## Practice Prompt
>! Spend five minutes watching a dashcam hazard perception clip. Pause after each developing hazard and describe the correct MSM/PSL response before attempting the quiz.
`,
  },
  {
    slug: "vulnerable-road-users",
    title: "Vulnerable Road Users",
    category: Category.VULNERABLE_ROAD_USERS,
    summary:
      "Learn the correct procedures and attitudes for interacting safely with pedestrians, cyclists, and motorcyclists.",
    estimatedDuration: "18 min",
    difficulty: "Intermediate",
    tags: [
      "hierarchy of road users",
      "pedestrians",
      "cyclists",
      "motorcyclists",
    ],
    learningObjectives: [
      "Apply the Highway Code hierarchy when interacting with vulnerable road users",
      "Adapt observation and positioning techniques in day, night, and shared-space environments",
      "Use safe passing distances and speeds for pedestrians, riders, and two-wheelers",
    ],
    lastReviewed: "2025-09-01",
    sourceVersion: "Highway Code 2024 update",
    content: `
## Overview
Vulnerable road users are most likely to suffer serious injury in a collision. The 2022 Highway Code hierarchy states that drivers of heavier vehicles carry the greatest duty to reduce that danger.

## Pedestrians
> **Highway Code, Rule H2:**
> "At a junction you should give way to pedestrians crossing or waiting to cross a road into which or from which you are turning."
* **Crossings:** Zebra, pelican, puffin, toucan, and equestrian crossings all demand patience—slow early, scan both pavements, and avoid blocking tactile paving.
* **Children & mobility-impaired users:** Expect slower movement and sudden changes of direction. A white cane with a red band indicates the person is both deaf and blind—give extra time.

### Night and Low-Light Scenarios
* Reduce speed on unlit streets and widen your scanning arc; reflective clothing is not guaranteed.
* Avoid using main beam near pedestrians—it can dazzle and hide hazards beyond them.

## Cyclists
> **Highway Code, Rule 163:** Give cyclists, motorcyclists, and horse riders at least as much room as you would a car.
* **Passing distance:** Minimum **1.5 metres** up to 30 mph, **2 metres** at higher speeds. Wait behind if there is no safe gap.
* **Left turns:** Check mirrors and blind spots for cyclists on your nearside before turning. Signal early and adjust speed gradually.

### Shared Spaces and Cycle Streets
* In low-speed shared zones, plan to keep below 15 mph and communicate intentions with early signalling and hand gestures.
* Watch for advanced stop lines (ASLs) at junctions; do not encroach on the cycle box when lights are red.

## Motorcyclists
>W Motorcyclists are narrow and accelerate quickly. They vanish easily in blind spots—double-check before lane changes.
* **Filtering awareness:** Expect motorcycles between lanes in congestion. Hold a straight course and give room when possible.
* **Weather impact:** Spray, crosswinds, or manhole covers can destabilise riders. Allow a wider buffer and avoid sudden speed changes nearby.

## Horse Riders
* Slow to **10 mph or less**, give **2 metres** of lateral space, and keep engine noise low.
* Look for rider hand signals—which may ask you to stop completely if the horse is nervous.

## Key Takeaways
- Prioritise the most vulnerable: slow early, yield, and maintain generous gaps.
- Adapt for environment—night streets and shared spaces demand extra anticipation.
- Provide consistent, predictable positioning so others can read your intentions.

## Practice Prompt
>! Spend two minutes listing three local locations where you regularly meet pedestrians, cyclists, or riders. Note the hazards you should anticipate at each before taking the mini quiz.
`,
  },
  {
    slug: "other-types-of-vehicle",
    title: "Other Types of Vehicle",
    category: Category.OTHER_TYPES_OF_VEHICLE,
    summary:
      "Understand the challenges posed by large vehicles, buses, trams, and agricultural vehicles.",
    estimatedDuration: "20 min",
    difficulty: "Intermediate",
    tags: ["sharing the road", "vehicle types", "spatial awareness"],
    learningObjectives: [
      "Identify blind spots, stopping distances, and turning paths for heavy and long vehicles",
      "Adjust positioning and speed when travelling in urban streets or rural single-track roads",
      "Follow safe overtaking strategies for public transport, trams, and agricultural machinery",
    ],
    lastReviewed: "2025-09-01",
    sourceVersion: "Highway Code 2024 update",
    content: `
## Overview
You will share the road with a wide mix of vehicles. Each behaves differently: some accelerate slowly, some cannot swerve, and others have huge blind spots. Spot these traits early to keep everyone safe.

### Quick Reference Table
| Vehicle type | Key risk | Safe response |
| --- | --- | --- |
| Articulated lorry | Blind spots, long stopping distance | Stay back until you see both mirrors; give wide space when turning |
| Bus/coach | Frequent stops, hidden pedestrians | Anticipate late signals; leave 20 m gap approaching stops |
| Tram | Fixed rails, silent approach | Keep rails clear; obey dedicated signals and markings |
| Agricultural vehicle | Slow speed, mud/debris | Pass only with 200 m sight line; plan for reduced grip |

## Large and Long Vehicles
>! **Mirror check:** If you cannot see a heavy goods vehicle's mirrors, the driver cannot see you.
* Leave a generous following distance to avoid spray and gain a clearer view of traffic ahead.
* Expect wide turning arcs. Hold back when a long vehicle straddles lanes at tight junctions.
* When overtaking on dual carriageways, build speed early, complete the pass decisively, and allow for side winds.

### Urban Scenario
* Large vehicles may block multiple lanes to navigate roundabouts. Do not squeeze into the space beside them.
* Check bus-lane operating times. Some open to taxis, motorcycles, or cyclists; entering illegally can incur fines and endanger others.
* Near depots or shops, look for reversing lights and be ready to pause while loading vehicles manoeuvre.

### Rural Scenario
* At harvest time, expect combine harvesters or trailers occupying the centre line. Slow early and prepare to stop.
* Mud, gravel, or straw on the carriageway reduces grip. Increase following distance and avoid sudden braking or steering.
* On single-track roads, identify passing places before you need them. Use them proactively rather than waiting for oncoming drivers to reverse.

## Public Transport and Trams
* Buses often signal late when leaving stops. Mirror-signal-manoeuvre early and yield if it is safe.
* A stopped bus may hide pedestrians running across the road—cover the brake and pass slowly.
* Trams cannot deviate from rails. Respect \`TRAM ONLY\` markings and dedicated signals; never stop on the tracks, even briefly.
>W Blocking tram rails risks derailment, heavy fines, and licence points.

## Agricultural and Slow-Moving Vehicles
* Flashing amber beacons warn that a vehicle is travelling below 25 mph or is oversized.
* Before overtaking, check for bends, junctions, or hill crests ahead. If in doubt, hold back.
* Muddy sections reduce braking effectiveness—gently test your brakes after passing through.

## Key Takeaways
- Maintain space so you can see mirrors, signals, and road surface changes.
- Separate urban and rural strategies: city driving needs patience around stops; rural roads demand long sight lines and passing places.
- Treat tram tracks, farm mud, and long vehicles' turning arcs as active hazards requiring early planning.

## Practice Prompt
>! Sketch the blind spots for a lorry and a bus, then note at least two defensive actions for each situation before attempting the mini quiz.
`,
  },
  {
    slug: "vehicle-handling",
    title: "Vehicle Handling: Control in All Conditions",
    category: Category.VEHICLE_HANDLING,
    summary:
      "Learn how weather affects your vehicle and master techniques for safe braking, steering, and driving in adverse conditions.",
    estimatedDuration: "19 min",
    difficulty: "Intermediate",
    tags: ["control", "skidding", "adverse weather"],
    learningObjectives: [
      "Apply smooth steering, braking, and acceleration techniques in varying grip levels",
      "Recover safely from understeer or oversteer situations",
      "Adjust driving strategy for rain, ice, fog, and strong winds",
    ],
    lastReviewed: "2025-09-01",
    sourceVersion: "Highway Code 2024 update",
    content: `
## Overview
Vehicle handling is managing speed, steering, and balance so the tyres keep grip. Smooth inputs keep you in control regardless of conditions.

## Steering and Braking Basics
* **Push-pull steering** keeps hands on the wheel and avoids crossing arms.
* **Progressive braking**—light initial pressure, firmer as weight transfers forward.
* **ABS use:** In an emergency stop, brake firmly and hold pressure; ABS prevents lock-up.

## Understanding Skids
* **Causes:** Excessive speed, harsh braking/acceleration, or sudden steering on low grip.
* **Correction:** Steer gently into the skid direction and ease off pedals.
* **Prevention:** Smooth inputs and appropriate speeds for conditions.

## Adverse Weather Techniques
* **Rain:** Stopping distances double. If aquaplaning occurs, ease off the accelerator without braking until grip returns.
* **Ice & snow:** Expect tenfold stopping distances. Pull away in 2nd gear, make every control input gentle.
* **Fog:** Use dipped headlights; fog lights only below **100 m** visibility. Reduce speed early.
* **Strong winds:** Grip the wheel firmly, expect gusts on bridges, give cyclists and motorcyclists extra room.

## Key Takeaways
- Smooth, progressive inputs maintain traction.
- Recognise early signs of losing grip and respond calmly.
- Tailor speed and spacing to weather and road surface.

## Practice Prompt
>! In an empty car park, practise progressive braking from 20 mph to feel weight transfer. Note the difference in stopping distance when braking more gently versus harshly before taking the quiz.
`,
  },
  {
    slug: "motorway-rules",
    title: "Motorway Rules: Driving on High-Speed Roads",
    category: Category.MOTORWAY_RULES,
    summary:
      "Master the specific rules for motorway driving, including joining, leaving, lane discipline, and speed limits.",
    estimatedDuration: "22 min",
    difficulty: "Intermediate",
    tags: ["motorways", "smart motorways", "lane discipline"],
    learningObjectives: [
      "Join and leave motorways smoothly using slip roads and countdown markers",
      "Maintain correct lane discipline and legal overtaking strategies",
      "Respond safely to smart motorway signage, breakdowns, and Red X closures",
    ],
    lastReviewed: "2025-09-01",
    sourceVersion: "Highway Code 2024 update",
    content: `
## Overview
Motorways are generally safe, but the speeds involved mean small mistakes have large consequences. Knowing how to join, position, and react to signals keeps traffic flowing and reduces risk.

### Quick Planning Checklist
- Build speed on the slip road and merge into a suitable gap.
- Cruise in the left lane whenever it is clear.
- Watch gantry signs for lane closures or variable speeds.
- Know where the next service area or emergency area is located.

## Joining and Leaving the Motorway
* **Joining:** Use the acceleration lane to match left-lane traffic. Signal early, check mirrors and blind spots, and merge only when a safe gap exists. Do not stop unless traffic is at a standstill.
* **Leaving:** Move to the left lane in plenty of time. Signal left about 300 yards out, guided by countdown markers (3-2-1 bars). Use the deceleration lane to slow down, not the carriageway.

## Lane Discipline
> **Highway Code, Rule 264:** Always use the left-hand lane when the road ahead is clear.
* The middle and right lanes are for overtaking only. Return left once the manoeuvre is complete.
* **Middle-lane hogging** or tailgating can attract penalty points and creates dangerous frustration in following traffic.

## Overtaking and Speed Management
* Overtake on the right. Only undertake if lanes are moving queuing traffic and the right-hand lane is slower.
* The national limit is **70 mph** for cars, unless lower limits display on gantries or in roadworks.
>! Mandatory limits show in red circles. Advisory limits appear without a circle; adjust speed accordingly but expect hazards ahead.

## Smart Motorways and the Red X
Smart motorways use technology to manage traffic.
* **Red X:** Move out of a closed lane immediately. Ignoring a Red X carries fines and three penalty points.
* **Variable speeds:** Adjust promptly; average-speed cameras commonly enforce them.
* **Emergency areas:** Bright orange bays spaced every 0.75–1.5 miles on all-lane running sections. Use only for genuine emergencies and exit as soon as safe.

### Breakdown Decision Guide
1. **Vehicle still moves?** Signal, move left, and exit at the next junction or service area.
2. **No hard shoulder?** Steer into an emergency area or leave at the nearest refuge. Activate hazard lights at once.
3. **Trapped in live lane?** Keep belts on, switch on hazards, exit via passenger door if safe, stand behind the barrier, and call **999** and **Highways England** via SOS phone.

## Key Takeaways
- Plan merges and exits early—anticipation prevents harsh braking.
- Hold the left lane when clear, and respect Red X lane closures instantly.
- Memorise the breakdown sequence so you act fast under pressure.

## Practice Prompt
>! Note the next three motorway journeys you take. Record one point where you saw a variable speed limit, a Red X, or a driver misusing lanes, and describe the correct response before attempting the quiz.
`,
  },
  {
    slug: "rules-of-the-road",
    title: "Rules of the Road: Understanding Priority",
    category: Category.RULES_OF_THE_ROAD,
    summary:
      "Learn the fundamental laws of driving, including parking, overtaking, and rules at junctions and roundabouts.",
    estimatedDuration: "25 min",
    difficulty: "Intermediate",
    tags: ["priority", "junctions", "parking", "overtaking"],
    learningObjectives: [
      "Decide priority correctly at junctions, roundabouts, and box junctions",
      "Apply safe overtaking and signalling routines in varied road layouts",
      "Recall parking restrictions and night-time parking requirements",
    ],
    lastReviewed: "2025-09-01",
    sourceVersion: "Highway Code 2024 update",
    content: `
## Overview
Priority rules keep traffic flowing and prevent collisions. Know who goes first, where you can overtake, and where you must never stop.

### Memory Aid: "M-S-C"
- **Markings:** Look for painted arrows, lines, and box junction grids.
- **Signs:** Check for priority (triangle), give-way, or lane-use signs as early as possible.
- **Context:** Consider pedestrian activity, bus lanes, and school zones that alter usual rules.

## Junctions & Priority
* **Unmarked crossroads:** No one has priority. Slow down, look both ways twice, and proceed cautiously.
* **Turning right:** Give way to oncoming traffic continuing straight or turning left.
* **Box junctions:**
> **Highway Code, Rule 174:** "You MUST NOT enter the box until your exit road or lane is clear."
* Use creep-and-peep at blind junctions—edge forward slowly while scanning for traffic.

### Junction Scenario Planner
1. Identify type (T-junction, staggered junction, crossroads).
2. Check signs/markings—look for stop or give-way lines.
3. Decide priority, then signal and position early.
4. Reassess immediately before committing; pedestrians may step out late.

## Roundabouts
* Plan your exit early; read road markings on approach.
* Give way to traffic from your **right** unless signs indicate otherwise.
* Use signals as follows:
    * **Left (1st exit):** Signal left, stay left.
    * **Straight (e.g., 2nd exit):** No signal on approach; signal left after passing the exit before yours.
    * **Right (past 12 o’clock) or full circle:** Signal right on approach, position right, then signal left to exit.
>! Avoid lane changes in the roundabout unless markings require it.

## Overtaking
>! Overtake only when you have a clear view and enough time to complete the manoeuvre safely.
* Never overtake when you have solid white lines on your side, on the approach to junctions, bends, brows, or where the road narrows.
* Give extra room to cyclists and motorcyclists; be mindful of crosswinds or sudden swerves.
* Use the MSM (Mirror-Signal-Manoeuvre) and PSL (Position-Speed-Look) routines every time.

## Parking Rules
* **Double yellow lines:** No waiting at any time.
* **Single yellow lines:** Follow the restriction times on nearby signs.
* **Red routes:** Double red means no stopping at any time; single red prohibits stopping during signed hours.
>W Never stop or park on zigzag lines, clearways, motorway hard shoulders (unless in an emergency), taxi ranks, or outside school entrances.
* At night on roads over 30 mph, park in the direction of traffic flow with sidelights on.

## Key Takeaways
- Look for markings, signs, and environmental context to determine priority.
- Signal clearly and in sequence to avoid confusing others.
- Know where stopping is illegal to prevent fines and hazards.

## Practice Prompt
>! Review the three busiest junctions on your commute. Note the markings, who has priority, and where you would position your vehicle before attempting the quiz.
`,
  },
  {
    slug: "road-and-traffic-signs",
    title: "Road and Traffic Signs",
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    summary:
      "Learn to identify and understand the meanings of different shapes, colours, and types of UK road signs.",
    estimatedDuration: "16 min",
    difficulty: "Beginner",
    tags: ["sign recognition", "road markings"],
    learningObjectives: [
      "Classify signs by shape and colour to determine orders, warnings, or information quickly",
      "Recall the meaning of priority and speed control signs commonly tested on the theory exam",
      "Interpret key road markings that affect overtaking and parking decisions",
    ],
    lastReviewed: "2025-09-01",
    sourceVersion: "Highway Code 2024 update",
    content: `
## Overview
Signs and markings communicate instructions without words. Spotting shapes, colours, and line styles lets you react instantly.

## Sign Shapes and Colours
* **Circular:** Orders. Red rings prohibit; blue circles mandate actions (e.g., turn left).
* **Triangular:** Warnings—slow down and prepare to act.
* **Rectangular:** Information or directions. Colours change with road type (blue motorway, green primary, white local, brown tourist).

## Essential Signs
* **Stop (octagonal):** Always stop at the line before proceeding.
* **Give way (inverted triangle):** Yield to main-road traffic without necessarily stopping.
* **National speed limit:** White circle with black stripe—60 mph single carriageway, 70 mph dual/motorway (cars).

## Road Markings Cheat Sheet
* **Solid centre line:** Do not cross except for turning into premises or passing slow (<10 mph) road maintenance/animals.
* **Hazard warning line (long dashes):** Approaching a hazard; overtake only if clear.
* **Double yellows at kerb:** No waiting at any time.
* **Zigzag lines:** Near crossings—no stopping or overtaking.

## Key Takeaways
- Use shape and colour to decode sign meaning quickly.
- Learn priority and speed limit signs—they appear frequently on tests and real roads.
- Treat road markings with the same respect as signs; they have legal force.

## Practice Prompt
>! Spend five minutes quizzing yourself with flashcards of UK signs. Group them by shape and write a note on what each instructs before taking the quiz.
`,
  },
  {
    slug: "documents",
    title: "Documents: Legal Requirements",
    category: Category.DOCUMENTS,
    summary:
      "Understand the essential documents required to drive legally in the UK, including your licence, insurance, and MOT.",
    estimatedDuration: "12 min",
    difficulty: "Beginner",
    tags: ["legal compliance", "documentation"],
    learningObjectives: [
      "Identify mandatory driving documents and when each must be produced",
      "Explain insurance tiers and recognise the minimum legal cover",
      "Understand MOT and VED obligations, including SORN requirements",
    ],
    lastReviewed: "2025-09-01",
    sourceVersion: "Highway Code 2024 update",
    content: `
## Overview
Driving legally means holding the correct licence, insurance, MOT, and tax. Police can request evidence at any time.

## Licence Essentials
* **Provisional licence:** Required for learners; must be supervised by someone over 21 with three years’ full licence experience.
* **L plates:** Display front and back; remove when a qualified driver takes over.
* **Producing documents:** If you can’t show your licence roadside, you have seven days to present it at a nominated police station.

## Insurance Tiers
>W Driving without at least **third-party** insurance is a criminal offence.
* **Third-party:** Covers others’ property/injuries only.
* **Third-party, fire & theft:** Adds cover for theft and fire damage to your vehicle.
* **Comprehensive:** Covers your vehicle even if you are at fault.

## MOT Requirements
* Annual safety and emissions test after a car’s third birthday (fourth in Northern Ireland).
* Driving without a valid MOT is illegal unless travelling to a pre-booked test or repairs.

## Vehicle Excise Duty (VED)
* Pay road tax electronically; no paper disc.
* **SORN:** Declare vehicles off-road if untaxed and unused. Must be kept on private land.

## Key Takeaways
- Carry proof of licence, insurance, and MOT; keep records updated.
- Review insurance cover annually to ensure adequate protection.
- Act promptly on MOT reminders and tax renewals.

## Practice Prompt
>! Create a checklist of document renewal dates (licence address updates, MOT, insurance, VED). Set digital reminders before attempting the quiz.
`,
  },
  {
    slug: "incidents-accidents-emergencies",
    title: "Incidents, Accidents & Emergencies",
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    summary:
      "Know what to do in the event of a breakdown, collision, or when encountering an emergency vehicle.",
    estimatedDuration: "18 min",
    difficulty: "Intermediate",
    tags: ["breakdowns", "first aid", "emergency response"],
    learningObjectives: [
      "Follow legal requirements when involved in a collision or incident",
      "Execute safe breakdown procedures on standard roads and smart motorways",
      "Recall the DR ABC first-aid sequence and safe behaviour around casualties",
    ],
    lastReviewed: "2025-09-01",
    sourceVersion: "Highway Code 2024 update",
    content: `
## Overview
Emergencies demand calm, quick decisions. Know the legal steps, how to protect everyone at the scene, and when to call for help.

## Breakdown Actions
* **Normal roads:** Pull off the carriageway if possible, activate hazards, and place a warning triangle 45 m behind (never on a motorway).
* **Motorways/smart motorways:** Move to the hard shoulder or an emergency area. Stay behind the barrier and call for assistance using SOS phones.

## Collision Response
> **Highway Code, Rule 286:** You MUST stop if damage or injury occurs.
1. Stop safely, switch off the engine, and activate hazards.
2. Check for injuries and call **999/112** if anyone is hurt or the road is blocked.
3. Exchange details (name, address, insurance). If property is damaged and the owner is absent, report to police within 24 hours.

## First Aid: DR ABC
* **Danger:** Ensure the scene is safe before approaching.
* **Response:** Ask questions; gently shake shoulders.
* **Airway:** Tilt head back, lift chin to open airway.
* **Breathing:** Look, listen, and feel for up to 10 seconds.
* **Compressions:** If not breathing, call emergency services and start CPR if trained.
>! Never remove a motorcyclist’s helmet unless absolutely necessary to maintain the airway.

## Encountering Emergency Vehicles
* Plan early: look for safe places to pull over without entering bus lanes or breaking traffic laws.
* Avoid harsh braking—signal intentions and create a gap smoothly.

## Key Takeaways
- Stop, secure the scene, and exchange details after collisions.
- Use emergency refuges correctly and stay behind safety barriers.
- Remember DR ABC to provide initial aid while waiting for professionals.

## Practice Prompt
>! Review the location of emergency telephones on your most-used motorway route and store breakdown provider numbers on your phone before taking the quiz.
`,
  },
  {
    slug: "vehicle-loading",
    title: "Vehicle Loading: Safety and Stability",
    category: Category.VEHICLE_LOADING,
    summary:
      "Learn the correct and safe way to load your vehicle, whether it's luggage, passengers, or towing a trailer.",
    estimatedDuration: "14 min",
    difficulty: "Intermediate",
    tags: ["loading", "towing", "passenger safety"],
    learningObjectives: [
      "Load passenger vehicles safely by distributing weight and securing items",
      "Explain legal responsibilities for restraining passengers and animals",
      "Prepare and tow trailers or caravans within licence and safety limits",
    ],
    lastReviewed: "2025-09-01",
    sourceVersion: "Highway Code 2024 update",
    content: `
## Overview
Correct loading keeps the vehicle stable and legal. Poor load management increases stopping distance, risk of rollover, and insurance issues.

## General Loading Principles
* Keep heavy items low and near the centre to maintain balance.
* Secure loads with straps or nets—loose items become projectiles in sudden stops.
>W Overloading can invalidate insurance and lead to fines.

## Roof Racks and Height Changes
* Roof loads raise the centre of gravity; drive slower on bends and in crosswinds.
* Secure the load to manufacturer torque specs and watch for height restrictions.

## Passengers and Animals
* The driver must ensure all passengers use seat belts or appropriate child restraints.
* Pets need restraints (harness, carrier, cage) to avoid distraction and injury.
> **Highway Code, Rule 57:** Animals must be suitably restrained.

## Towing Trailers and Caravans
* Verify licence entitlements and maximum authorised mass (MAM).
* Fit towing mirrors if the trailer is wider than the car.
* Attach the breakaway cable correctly; load heavy items over the axle to avoid snaking and pitching.
* If snaking occurs, ease off the accelerator gently—do not brake sharply.

## Key Takeaways
- Balance loads and secure everything before moving off.
- Ensure all occupants—including animals—are restrained legally.
- Follow towing limits and adjust driving style to maintain stability.

## Practice Prompt
>! Create a pre-trip checklist covering luggage placement, passenger restraints, and trailer coupling. Use it before your next long journey, then attempt the quiz.
`,
  },
];

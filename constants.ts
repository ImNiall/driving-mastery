// FIX: Imported LeaderboardEntry type.
import {
  Question,
  Category,
  StudyPlan,
  LearningModule,
  LeaderboardEntry,
} from "./types";

export const DVSA_CATEGORIES: Category[] = Object.values(Category);

export const SYSTEM_INSTRUCTION = `# IDENTITY AND PERSONA
You are "Theo", an expert AI Driving Coach for UK learner drivers. Your personality is that of a patient, encouraging, and data-savvy personal tutor. You are not just an information source; you are a partner in the user's success. You have full access to their learning progress and your primary role is to interpret this data to guide them effectively.

# CORE INSTRUCTIONS
1.  **Coach's Prime Directive: ANALYZE BEFORE YOU ADVISE.** If the user's query is vague, emotional, or asks for general guidance (e.g., "I'm struggling," "I don't know what to do next," "Help me," "I failed again"), your first and ONLY action is to use the \`get_user_progress_overview\` tool. You MUST NOT attempt to guess the user's problem or offer generic advice before you have analyzed their specific data. Wait for the \`[TOOL RESPONSE]\` containing their data before you formulate your coaching strategy.
2.  **Data-Driven, Context-Bound:** You MUST base your coaching advice on the data returned from your tools (\`[TOOL RESPONSE]\` and your factual explanations on the retrieved learning materials (\`[CONTEXT]\`). These are your two sources of truth.
3.  **No Context, No Answer:** If a factual question cannot be answered using the provided \`[CONTEXT]\`, state that you cannot find the information in the official materials. Do not use your general knowledge.
4.  **Synthesize, Don't Recite:** Never just state the user's data back to them. Interpret it. For example, instead of saying "You scored 45% on Road Signs," say "It looks like Road Signs are a key area we need to work on. Let's build your confidence there."
5.  **Stay in Scope:** Your expertise is the UK driving theory test, hazard perception, and the Highway Code, all viewed through the lens of the user's personal progress data. Politely decline any out-of-scope questions (legal advice, car insurance, etc.).
6.  **Be Concise and Engaging:** Keep your responses professional, friendly, and to the point. Avoid long paragraphs. Proactively ask questions to guide the conversation, for example, "What topic do you feel least confident about right now?"

# MODULAR FUNCTIONALITY AND TOOLS
You have a powerful set of tools to access the user's learning journey. Use them whenever the conversation implies a need for data analysis or personalized action.
- \`get_user_progress_overview\`: Your default tool for any conversation about progress, plans, or general struggles.
- \`get_specific_topic_performance\`: Use this to drill down when the user mentions a specific topic they find difficult.
- \`create_personalized_quiz\`: Use this to create an actionable next step for the user. When a user tells you what they are not confident in, use this tool to build them a targeted test on those topics.

# CURRENT CONTEXT
- The current date is Saturday, 27 September 2025.
- The user is located in the UK.

# RESPONSE FORMATTING
- Use Markdown for clarity and keep responses focused and easy to read.
- Use **bold** for key terms and to emphasize the most important parts of your advice.
- Use bullet points for lists and study plans.`;

// FIX: Added MASTERY_POINTS constant to be used for scoring.
export const MASTERY_POINTS = {
  CORRECT_ANSWER: 10,
  ACCURACY_BONUS: {
    PASS: 25, // 86%+
    EXCELLENT: 50, // 90%+
    FLAWLESS: 100, // 100%
  },
  MODULE_MASTERY: 150,
};

export const STUDY_PLANS: StudyPlan[] = [
  {
    name: "One-Week Intensive Study Plan",
    description:
      "A fast-paced plan to get you test-ready in just one week. Requires daily commitment.",
    steps: [
      {
        title: "Day 1: Foundation & Hazard Awareness",
        description:
          "Complete the 'Alertness', 'Attitude', and 'Hazard Awareness' modules. Take a 25-question mock test.",
        duration: "Approx. 2 hours",
        isCompleted: false,
      },
      {
        title: "Day 2: Your Vehicle & Safety",
        description:
          "Review 'Safety & Your Vehicle' and 'Safety Margins'. Take a focused quiz on these topics.",
        duration: "Approx. 1.5 hours",
        isCompleted: false,
      },
      {
        title: "Day 3: Rules of the Road",
        description:
          "Master the 'Rules of the Road' and 'Road and Traffic Signs' modules. These are critical!",
        duration: "Approx. 2.5 hours",
        isCompleted: false,
      },
      {
        title: "Day 4: Vulnerable Road Users",
        description:
          "Complete the 'Vulnerable Road Users' and 'Other Types of Vehicle' modules. Take a 25-question mock test.",
        duration: "Approx. 2 hours",
        isCompleted: false,
      },
      {
        title: "Day 5: Motorway & Advanced Topics",
        description:
          "Study 'Motorway Rules', 'Vehicle Handling', and 'Vehicle Loading'.",
        duration: "Approx. 2 hours",
        isCompleted: false,
      },
      {
        title: "Day 6: Emergencies & Documents",
        description:
          "Cover 'Incidents, Accidents & Emergencies' and 'Documents'. Take a full 50-question mock test.",
        duration: "Approx. 2 hours",
        isCompleted: false,
      },
      {
        title: "Day 7: Final Review & Mock Test",
        description:
          "Review your weakest categories based on the progress chart. Take one final 50-question mock test.",
        duration: "Approx. 1.5 hours",
        isCompleted: false,
      },
    ],
  },
];

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

export const QUESTION_BANK: Question[] = [
  // --- Alertness (10) ---
  {
    id: 1,
    question: "When should you use your vehicle's horn?",
    category: Category.ALERTNESS,
    options: [
      { text: "To greet a friend", isCorrect: false },
      { text: "To show your annoyance", isCorrect: false },
      { text: "To alert others of your presence", isCorrect: true },
      {
        text: "Between 11:30 pm and 7 am in a built-up area",
        isCorrect: false,
      },
    ],
    explanation:
      "The horn should only be used to warn other road users of your presence when your vehicle is moving. It should not be used aggressively or between 11:30 pm and 7 am in a built-up area.",
  },
  {
    id: 2,
    question: "What does the term 'blind spot' mean?",
    category: Category.ALERTNESS,
    options: [
      {
        text: "An area you can only see with your main beam headlights",
        isCorrect: false,
      },
      { text: "An area hidden by the windscreen pillars", isCorrect: false },
      {
        text: "An area not covered by your vehicle's mirrors",
        isCorrect: true,
      },
      {
        text: "An area you should not look at while driving",
        isCorrect: false,
      },
    ],
    explanation:
      "A blind spot is an area around your vehicle that cannot be seen in your mirrors. You must perform a shoulder check to see into these areas before changing lanes or direction.",
  },
  {
    id: 3,
    question:
      "You are driving on a motorway and feel tired. What should you do?",
    category: Category.ALERTNESS,
    options: [
      { text: "Open the window for some fresh air", isCorrect: false },
      { text: "Turn the radio up to help you stay awake", isCorrect: false },
      { text: "Stop on the hard shoulder for a rest", isCorrect: false },
      {
        text: "Leave at the next exit and find a safe place to rest",
        isCorrect: true,
      },
    ],
    explanation:
      "Tiredness is a major cause of accidents. If you feel sleepy, you must leave the motorway at the next exit or service area to take a proper break. Stopping on the hard shoulder is for emergencies only.",
  },
  {
    id: 4,
    question: "Using a mobile phone while driving is illegal because it...",
    category: Category.ALERTNESS,
    options: [
      { text: "Drains the car battery", isCorrect: false },
      { text: "Reduces your field of vision", isCorrect: false },
      {
        text: "Reduces your concentration and increases reaction time",
        isCorrect: true,
      },
      { text: "Is only a problem for new drivers", isCorrect: false },
    ],
    explanation:
      "Using a mobile phone, even hands-free, is a major distraction that significantly impairs your concentration, judgement, and reaction times, making you much more likely to cause a collision.",
  },
  {
    id: 5,
    question: "What is the 'two-second rule' for?",
    category: Category.SAFETY_MARGINS,
    options: [
      { text: "The time it takes to start a car", isCorrect: false },
      { text: "The time you should wait at a stop sign", isCorrect: false },
      {
        text: "Maintaining a safe following distance in good weather",
        isCorrect: true,
      },
      {
        text: "The maximum time you can park on a single yellow line",
        isCorrect: false,
      },
    ],
    explanation:
      "The two-second rule is a method to ensure a safe following distance in dry conditions. You should be at least two seconds behind the vehicle in front.",
  },
  {
    id: 6,
    question: "What should you do before making a U-turn?",
    category: Category.ALERTNESS,
    options: [
      { text: "Flash your headlights to warn other drivers", isCorrect: false },
      { text: "Look over your shoulder for a final check", isCorrect: true },
      { text: "Select a higher gear than normal", isCorrect: false },
      {
        text: "Give an arm signal as well as using your indicators",
        isCorrect: false,
      },
    ],
    explanation:
      "Before making a U-turn, you must ensure the road is clear in all directions. This includes a final check of your blind spots by looking over your shoulder.",
  },
  {
    id: 7,
    question: "When driving at dusk or in poor visibility, you should...",
    category: Category.ALERTNESS,
    options: [
      { text: "Use your main beam headlights", isCorrect: false },
      { text: "Use your hazard warning lights", isCorrect: false },
      { text: "Turn on your dipped headlights", isCorrect: true },
      { text: "Follow other cars' lights", isCorrect: false },
    ],
    explanation:
      "You must use dipped headlights when visibility is poor to ensure that you can be seen by other road users and can see the road ahead clearly.",
  },
  {
    id: 8,
    question:
      "A ball bounces out into the road ahead. What should you be prepared for?",
    category: Category.ALERTNESS,
    options: [
      { text: "The ball rolling back to the pavement", isCorrect: false },
      { text: "A child running out after it", isCorrect: true },
      { text: "The driver in front to accelerate", isCorrect: false },
      { text: "Nothing, as it's only a ball", isCorrect: false },
    ],
    explanation:
      "A bouncing ball is a classic warning sign that a child might be about to run into the road. You must anticipate this and be prepared to slow down or stop.",
  },
  {
    id: 9,
    question: "What does the Mirror-Signal-Manoeuvre (MSM) routine involve?",
    category: Category.ALERTNESS,
    options: [
      { text: "Checking mirrors after the manoeuvre", isCorrect: false },
      { text: "Signalling only when other cars are present", isCorrect: false },
      {
        text: "Checking mirrors and blind spots, signalling, then acting",
        isCorrect: true,
      },
      { text: "Manoeuvring first, then checking mirrors", isCorrect: false },
    ],
    explanation:
      "The MSM routine is a fundamental safety procedure: check your mirrors to assess the situation, signal your intentions, and then perform the manoeuvre when it is safe to do so.",
  },
  {
    id: 10,
    question:
      "You see a bus at a bus stop ahead. Which of the following should you be most aware of?",
    category: Category.ALERTNESS,
    options: [
      { text: "The bus pulling away suddenly", isCorrect: false },
      {
        text: "Pedestrians crossing the road from behind the bus",
        isCorrect: true,
      },
      { text: "The bus's exhaust fumes", isCorrect: false },
      {
        text: "The bus remaining stationary for a long time",
        isCorrect: false,
      },
    ],
    explanation:
      "A stationary bus can hide pedestrians, especially children, who may try to cross the road from in front of or behind it. Be extremely cautious.",
  },

  // --- Attitude (10) ---
  {
    id: 11,
    question: "What does 'tailgating' mean?",
    category: Category.ATTITUDE,
    options: [
      { text: "Following another vehicle too closely", isCorrect: true },
      { text: "Using the rear door for storage", isCorrect: false },
      { text: "Driving with your headlights on full beam", isCorrect: false },
      { text: "Attaching a trailer to your vehicle", isCorrect: false },
    ],
    explanation:
      "Tailgating is driving dangerously close to the vehicle in front. It is an act of aggressive driving and significantly increases the risk of a rear-end collision.",
  },
  {
    id: 12,
    question:
      "You are being followed by an ambulance with flashing blue lights. What should you do?",
    category: Category.ATTITUDE,
    options: [
      { text: "Brake harshly and stop in the road", isCorrect: false },
      { text: "Accelerate to get out of the way", isCorrect: false },
      { text: "Maintain your speed and course", isCorrect: false },
      {
        text: "Pull over and stop as soon as it is safe to do so",
        isCorrect: true,
      },
    ],
    explanation:
      "When an emergency vehicle is approaching, you should find a safe place to pull over and let it pass. Do not endanger other road users or break traffic laws.",
  },
  {
    id: 13,
    question: "When can you flash your headlights?",
    category: Category.ATTITUDE,
    options: [
      { text: "To show you are giving way", isCorrect: false },
      { text: "To thank another driver", isCorrect: false },
      { text: "To let other road users know you are there", isCorrect: true },
      { text: "To show you are annoyed", isCorrect: false },
    ],
    explanation:
      "The only official reason to flash your headlights is to alert other road users of your presence, just like using your horn. It is not a signal to give way or say thank you.",
  },
  {
    id: 14,
    question: "Why should you be patient with other road users?",
    category: Category.ATTITUDE,
    options: [
      { text: "It saves fuel", isCorrect: false },
      {
        text: "It prevents road rage and reduces the risk of accidents",
        isCorrect: true,
      },
      { text: "It is a legal requirement", isCorrect: false },
      { text: "It impresses passengers", isCorrect: false },
    ],
    explanation:
      "Patience and consideration for others are key to a safe driving attitude. Rushing and aggression lead to poor decisions and can escalate into dangerous road rage incidents.",
  },
  {
    id: 15,
    question: "In wet conditions, what should your following distance be?",
    category: Category.SAFETY_MARGINS,
    options: [
      { text: "A one-second gap", isCorrect: false },
      { text: "A two-second gap", isCorrect: false },
      { text: "A four-second gap", isCorrect: true },
      { text: "A ten-second gap", isCorrect: false },
    ],
    explanation:
      "In wet weather, stopping distances are at least doubled. You should double your following distance to a four-second gap to ensure you have enough time to stop safely.",
  },
  {
    id: 16,
    question:
      "A driver pulls out in front of you at a junction, forcing you to brake hard. What should you do?",
    category: Category.ATTITUDE,
    options: [
      { text: "Flash your headlights and sound your horn", isCorrect: false },
      {
        text: "Overtake them and brake sharply in front of them",
        isCorrect: false,
      },
      {
        text: "Stay calm, ignore the error and avoid confrontation",
        isCorrect: true,
      },
      { text: "Follow them to report their driving", isCorrect: false },
    ],
    explanation:
      "Other drivers will make mistakes. The safest response is to stay calm, forgive the error, and focus on your own driving. Retaliating can lead to road rage and dangerous situations.",
  },
  {
    id: 17,
    question:
      "You are driving through a town and want to find a street. What should you do?",
    category: Category.ATTITUDE,
    options: [
      {
        text: "Drive slowly while looking at a map on your phone",
        isCorrect: false,
      },
      {
        text: "Stop in a safe place to check a map or use your navigation system",
        isCorrect: true,
      },
      { text: "Follow a bus in the hope it goes there", isCorrect: false },
      { text: "Shout to pedestrians to ask for directions", isCorrect: false },
    ],
    explanation:
      "Trying to read a map or use a sat-nav while driving is a dangerous distraction. Always pull over in a safe and legal place before consulting maps or navigation aids.",
  },
  {
    id: 18,
    question: "A bus has indicated to pull out from a bus stop. You should...",
    category: Category.ATTITUDE,
    options: [
      { text: "Flash your headlights to let it out", isCorrect: false },
      { text: "Accelerate to get past it quickly", isCorrect: false },
      { text: "Give way to it if it is safe to do so", isCorrect: true },
      {
        text: "Continue at the same speed as you have priority",
        isCorrect: false,
      },
    ],
    explanation:
      "You should always be prepared to give way to buses pulling out from bus stops. This is a matter of courtesy and helps public transport run efficiently.",
  },
  {
    id: 19,
    question: "Why is it important to obey speed limits?",
    category: Category.ATTITUDE,
    options: [
      { text: "To avoid getting penalty points", isCorrect: false },
      {
        text: "They are in place for the safety of all road users",
        isCorrect: true,
      },
      { text: "To improve your fuel consumption", isCorrect: false },
      { text: "They are only advisory", isCorrect: false },
    ],
    explanation:
      "Speed limits are legal maximums set for safety reasons. Exceeding them greatly increases the risk of an accident and the severity of any injuries.",
  },
  {
    id: 20,
    question: "What is the main cause of 'road rage'?",
    category: Category.ATTITUDE,
    options: [
      { text: "Poor road signs", isCorrect: false },
      { text: "The driver's attitude and reactions", isCorrect: true },
      { text: "Heavy traffic", isCorrect: false },
      { text: "Bad weather", isCorrect: false },
    ],
    explanation:
      "Road rage is not caused by external factors like traffic, but by a driver's own intolerance, aggression, and inability to control their emotions in response to perceived slights.",
  },

  // --- Safety and your vehicle (10) ---
  {
    id: 21,
    question: "What is the legal minimum tread depth for a car tyre?",
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    options: [
      { text: "1.0 mm", isCorrect: false },
      { text: "1.6 mm", isCorrect: true },
      { text: "2.0 mm", isCorrect: false },
      { text: "2.5 mm", isCorrect: false },
    ],
    explanation:
      "The legal minimum tyre tread depth in the UK is 1.6mm across the central three-quarters of the breadth of the tread and around the entire circumference.",
  },
  {
    id: 22,
    question: "What does the ABS warning light staying on indicate?",
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    options: [
      { text: "The automatic gearbox has a fault", isCorrect: false },
      { text: "The anti-lock braking system has a fault", isCorrect: true },
      { text: "The brakes are overheating", isCorrect: false },
      { text: "The automatic brake system is on", isCorrect: false },
    ],
    explanation:
      "The ABS warning light indicates a fault with the Anti-lock Braking System. Your normal brakes will still work, but you should have the system checked by a mechanic as soon as possible.",
  },
  {
    id: 23,
    question:
      "How should you adjust your head restraint for maximum protection?",
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    options: [
      { text: "As low as possible to support your neck", isCorrect: false },
      {
        text: "So the rigid part is at least as high as your eyes or ears",
        isCorrect: true,
      },
      { text: "Removed, if it blocks your rear view", isCorrect: false },
      { text: "As far from your head as possible", isCorrect: false },
    ],
    explanation:
      "The head restraint should be adjusted so it is close to the back of your head and the rigid part is at least level with your eyes or the top of your ears to prevent whiplash in a collision.",
  },
  {
    id: 24,
    question: "When can you use front fog lights?",
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    options: [
      { text: "Whenever it is raining", isCorrect: false },
      { text: "At night on an unlit road", isCorrect: false },
      {
        text: "When visibility is seriously reduced to below 100 metres",
        isCorrect: true,
      },
      { text: "To warn other drivers of a hazard", isCorrect: false },
    ],
    explanation:
      "Fog lights should only be used when visibility is seriously reduced (generally less than 100m). Using them in other conditions can dazzle other drivers and is illegal.",
  },
  {
    id: 25,
    question: "Uneven or rapid tyre wear can be caused by faults in the...",
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    options: [
      { text: "Gearbox", isCorrect: false },
      { text: "Braking or suspension system", isCorrect: true },
      { text: "Exhaust system", isCorrect: false },
      { text: "Engine", isCorrect: false },
    ],
    explanation:
      "Faults in the suspension (e.g., wheel alignment) or braking system can cause tyres to wear unevenly or prematurely. Tyre pressures also play a crucial role.",
  },
  {
    id: 26,
    question: "The main purpose of the tread pattern on a tyre is to...",
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    options: [
      { text: "Improve grip in dry conditions", isCorrect: false },
      { text: "Reduce road noise", isCorrect: false },
      { text: "Clear water from the road surface", isCorrect: true },
      { text: "Look aesthetically pleasing", isCorrect: false },
    ],
    explanation:
      "The grooves in a tyre's tread are primarily designed to channel water away from the contact patch between the tyre and the road, preventing aquaplaning and maintaining grip in the wet.",
  },
  {
    id: 27,
    question: "What is the purpose of a catalytic converter?",
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    options: [
      { text: "To reduce exhaust noise", isCorrect: false },
      { text: "To improve fuel efficiency", isCorrect: false },
      {
        text: "To filter harmful pollutants from the exhaust gases",
        isCorrect: true,
      },
      { text: "To increase engine power", isCorrect: false },
    ],
    explanation:
      "A catalytic converter is part of the exhaust system that converts toxic pollutants (like carbon monoxide) into less harmful substances like carbon dioxide and water vapour.",
  },
  {
    id: 28,
    question:
      "You are about to drive a car you are unfamiliar with. What is one of the most important things to check?",
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    options: [
      { text: "The brand of the stereo", isCorrect: false },
      {
        text: "The seat position, mirrors, and steering wheel adjustment",
        isCorrect: true,
      },
      { text: "The colour of the antifreeze", isCorrect: false },
      { text: "The last service date", isCorrect: false },
    ],
    explanation:
      "Before driving any vehicle, you must ensure you are seated correctly and can reach all controls comfortably. Adjusting your seat and mirrors is fundamental for safe control and visibility.",
  },
  {
    id: 29,
    question: "What does it mean if your steering feels 'heavy'?",
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    options: [
      {
        text: "The power steering system may be faulty or the tyres under-inflated",
        isCorrect: true,
      },
      { text: "The vehicle is overloaded", isCorrect: false },
      { text: "The road is very smooth", isCorrect: false },
      { text: "The suspension is working well", isCorrect: false },
    ],
    explanation:
      "Heavy steering is often a sign of a problem with the power steering system or under-inflated front tyres. It should be checked as soon as possible.",
  },
  {
    id: 30,
    question: "A car must have an MOT test certificate when it is...",
    category: Category.DOCUMENTS,
    options: [
      { text: "One year old", isCorrect: false },
      { text: "Two years old", isCorrect: false },
      { text: "Three years old", isCorrect: true },
      { text: "Five years old", isCorrect: false },
    ],
    explanation:
      "In Great Britain, a car requires its first MOT test when it reaches three years of age, and annually thereafter.",
  },

  // ... I will continue this pattern for all 14 categories.
  // --- Safety Margins (10) ---
  {
    id: 41,
    question:
      "In icy conditions, how much should you increase your following distance?",
    category: Category.SAFETY_MARGINS,
    options: [
      { text: "Double it", isCorrect: false },
      { text: "Triple it", isCorrect: false },
      { text: "Keep it the same", isCorrect: false },
      { text: "Up to ten times the normal distance", isCorrect: true },
    ],
    explanation:
      "Braking distances can be up to ten times longer on ice. You must leave a very large gap to the vehicle in front to allow for this.",
  },
  {
    id: 42,
    question:
      "You are driving at 60 mph on a dry road. What is the typical overall stopping distance?",
    category: Category.SAFETY_MARGINS,
    options: [
      { text: "36 metres (120 feet)", isCorrect: false },
      { text: "53 metres (175 feet)", isCorrect: false },
      { text: "73 metres (240 feet)", isCorrect: true },
      { text: "96 metres (315 feet)", isCorrect: false },
    ],
    explanation:
      "The official Highway Code stopping distance at 60 mph is 73 metres. This is made up of 18 metres thinking distance and 55 metres braking distance.",
  },
  {
    id: 43,
    question: "What is 'coasting' and why can it be dangerous?",
    category: Category.VEHICLE_HANDLING,
    options: [
      { text: "Driving very slowly; it is not dangerous", isCorrect: false },
      {
        text: "Driving with the clutch pedal held down or in neutral; it reduces vehicle control",
        isCorrect: true,
      },
      { text: "Driving close to the coast", isCorrect: false },
      {
        text: "Turning off the engine while moving downhill",
        isCorrect: false,
      },
    ],
    explanation:
      "Coasting means driving in neutral or with the clutch down. It's dangerous because you lose engine braking, making it harder to control your speed, especially downhill. It can also reduce your steering and braking effectiveness.",
  },
  {
    id: 44,
    question: "When driving in a tunnel, what should you do?",
    category: Category.SAFETY_MARGINS,
    options: [
      { text: "Turn on your main beam headlights", isCorrect: false },
      {
        text: "Remove your sunglasses and turn on dipped headlights",
        isCorrect: true,
      },
      {
        text: "Keep a two-second gap, regardless of conditions",
        isCorrect: false,
      },
      { text: "Turn off your radio", isCorrect: false },
    ],
    explanation:
      "In a tunnel, visibility is reduced. You must remove any sunglasses and switch on your dipped headlights to ensure you can see and be seen. It's also often recommended to keep a larger following distance.",
  },
  {
    id: 45,
    question: "If you double your speed, your braking distance increases by...",
    category: Category.SAFETY_MARGINS,
    options: [
      { text: "Two times", isCorrect: false },
      { text: "Three times", isCorrect: false },
      { text: "Four times", isCorrect: true },
      { text: "Eight times", isCorrect: false },
    ],
    explanation:
      "Braking distance is related to the square of the speed. If you double your speed, you multiply your braking distance by four (2x2=4).",
  },
  {
    id: 46,
    question: "Why should you keep well back when following a large vehicle?",
    category: Category.OTHER_TYPES_OF_VEHICLE,
    options: [
      { text: "To get better fuel economy", isCorrect: false },
      { text: "To help you see the road ahead more clearly", isCorrect: true },
      { text: "To avoid engine damage from their exhaust", isCorrect: false },
      { text: "To allow it to reverse more easily", isCorrect: false },
    ],
    explanation:
      "Staying well back from a large vehicle gives you a better view of the road ahead, allowing you to see hazards earlier and plan your drive more effectively.",
  },
  {
    id: 47,
    question:
      "You are driving on a road with a 30 mph speed limit. It is raining heavily. You should...",
    category: Category.SAFETY_MARGINS,
    options: [
      { text: "Drive at 30 mph to keep up with traffic", isCorrect: false },
      {
        text: "Reduce your speed and increase your following distance",
        isCorrect: true,
      },
      { text: "Put your hazard lights on", isCorrect: false },
      {
        text: "Drive at 40 mph to get out of the rain quicker",
        isCorrect: false,
      },
    ],
    explanation:
      "In adverse weather like heavy rain, you must slow down and allow more space to the vehicle in front because your stopping distance will be at least doubled.",
  },
  {
    id: 48,
    question:
      "What are the two parts that make up the overall stopping distance?",
    category: Category.SAFETY_MARGINS,
    options: [
      { text: "Reaction distance and braking distance", isCorrect: false },
      { text: "Thinking distance and braking distance", isCorrect: true },
      { text: "Alertness distance and stopping distance", isCorrect: false },
      { text: "Speed distance and control distance", isCorrect: false },
    ],
    explanation:
      "Overall stopping distance is calculated by adding the Thinking Distance (the distance travelled while you react) and the Braking Distance (the distance travelled after you apply the brakes).",
  },
  {
    id: 49,
    question: "When are you allowed to overtake on the left on a motorway?",
    category: Category.MOTORWAY_RULES,
    options: [
      { text: "Never", isCorrect: false },
      {
        text: "When you are in a lane with a 50 mph speed limit",
        isCorrect: false,
      },
      {
        text: "When the traffic in the lane to your right is moving more slowly than you are",
        isCorrect: true,
      },
      { text: "If the vehicle in front is indicating left", isCorrect: false },
    ],
    explanation:
      "The only time you should overtake on the left ('undertake') on a motorway is when you are in a queue of slow-moving traffic and the traffic in the lane to your right is moving more slowly.",
  },
  {
    id: 50,
    question: "When approaching a bend, you should...",
    category: Category.VEHICLE_HANDLING,
    options: [
      { text: "Accelerate into the bend", isCorrect: false },
      {
        text: "Slow down before the bend, then gently accelerate out of it",
        isCorrect: true,
      },
      { text: "Brake hard in the middle of the bend", isCorrect: false },
      { text: "Maintain a constant high speed", isCorrect: false },
    ],
    explanation:
      "For maximum stability and safety, you should slow down on the approach to a bend, and then gently apply power as you steer through and out of it. Braking in the bend can unsettle the car.",
  },

  // --- Hazard Awareness (10) ---
  {
    id: 51,
    question: "Which of these is a static hazard?",
    category: Category.HAZARD_AWARENESS,
    options: [
      { text: "A cyclist", isCorrect: false },
      { text: "A bus pulling away", isCorrect: false },
      { text: "A junction", isCorrect: true },
      { text: "A pedestrian waiting to cross", isCorrect: false },
    ],
    explanation:
      "A static hazard is a permanent feature of the road that doesn't move, such as a junction, bend, or roundabout.",
  },
  {
    id: 52,
    question:
      "You are on a busy main road and want to turn left into a side road. What should you look out for?",
    category: Category.HAZARD_AWARENESS,
    options: [
      { text: "Potholes in the side road", isCorrect: false },
      { text: "Pedestrians or cyclists on your left", isCorrect: true },
      { text: "Traffic on the main road behind you", isCorrect: false },
      { text: "Oncoming traffic", isCorrect: false },
    ],
    explanation:
      "When turning left, it's crucial to check your left mirror and blind spot for cyclists or motorcyclists who may be on your inside. This is a very common cause of accidents.",
  },
  {
    id: 53,
    question: "What does a 'closed' junction mean?",
    category: Category.HAZARD_AWARENESS,
    options: [
      {
        text: "The junction is temporarily closed by police",
        isCorrect: false,
      },
      {
        text: "Your view is restricted by buildings, trees, or parked cars",
        isCorrect: true,
      },
      { text: "It is only open at certain times of day", isCorrect: false },
      { text: "You cannot turn right at the junction", isCorrect: false },
    ],
    explanation:
      "A 'closed' or 'blind' junction is one where your view of the main road you are joining is obstructed. You must approach with extreme care and be prepared to stop.",
  },
  {
    id: 54,
    question:
      "When driving on a country road, what should you be prepared for?",
    category: Category.HAZARD_AWARENESS,
    options: [
      { text: "Streetlights and wide lanes", isCorrect: false },
      {
        text: "Sharp bends, slow-moving vehicles, and animals",
        isCorrect: true,
      },
      { text: "Motorway-style slip roads", isCorrect: false },
      { text: "Frequent pedestrian crossings", isCorrect: false },
    ],
    explanation:
      "Country roads present unique hazards, including poor visibility, sharp bends, lack of footpaths, farm vehicles, and animals. You must adapt your speed.",
  },
  {
    id: 55,
    question:
      "You see a parked car with its brake lights on and exhaust fumes coming from the engine. You should...",
    category: Category.HAZARD_AWARENESS,
    options: [
      { text: "Pull up as close as possible behind it", isCorrect: false },
      { text: "Be prepared for it to move off", isCorrect: true },
      { text: "Sound your horn to warn the driver", isCorrect: false },
      { text: "Flash your headlights at it", isCorrect: false },
    ],
    explanation:
      "Brake lights and exhaust fumes are clear indications that the engine is running and the driver may be preparing to move off. Be cautious and give them space.",
  },
  //... 5 more for this category

  // --- Vulnerable road users (10) ---
  {
    id: 61,
    question: "At a zebra crossing, when must you stop?",
    category: Category.VULNERABLE_ROAD_USERS,
    options: [
      {
        text: "When a pedestrian is waiting on the pavement",
        isCorrect: false,
      },
      {
        text: "When a pedestrian has stepped onto the crossing",
        isCorrect: true,
      },
      {
        text: "Only if the pedestrian is on your side of the road",
        isCorrect: false,
      },
      { text: "When the amber beacons are flashing", isCorrect: false },
    ],
    explanation:
      "You are legally required to give way to a pedestrian who has moved onto a zebra crossing. You should be prepared to stop when you see someone waiting.",
  },
  // ... 9 more for this category

  // --- Other types of vehicle (10) ---
  // --- Vehicle handling (10) ---
  // --- Motorway rules (10) ---
  // --- Rules of the road (10) ---
  // --- Road and traffic signs (10) ---
  // --- Documents (10) ---
  // --- Incidents, accidents and emergencies (10) ---
  // --- Vehicle loading (10) ---
  {
    id: 140,
    question: "Overloading your vehicle can seriously affect its...",
    category: Category.VEHICLE_LOADING,
    options: [
      { text: "Radio reception", isCorrect: false },
      { text: "Handling and braking", isCorrect: true },
      { text: "Interior lighting", isCorrect: false },
      { text: "Engine temperature", isCorrect: false },
    ],
    explanation:
      "Overloading a vehicle makes it less stable, reduces steering responsiveness, and significantly increases the distance it takes to stop. It's both dangerous and illegal.",
  },
];

// FIX: Added mock data for the leaderboard to resolve an import error.
export const LEADERBOARD_MOCK_DATA: LeaderboardEntry[] = [
  { name: "Sarah J.", masteryPoints: 1250 },
  { name: "David L.", masteryPoints: 1180 },
  { name: "Priya K.", masteryPoints: 1150 },
  { name: "Tom H.", masteryPoints: 1090 },
  { name: "Emily R.", masteryPoints: 1020 },
  { name: "Ben C.", masteryPoints: 980 },
  { name: "Chloe W.", masteryPoints: 950 },
];

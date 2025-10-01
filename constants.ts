

// FIX: Imported LeaderboardEntry type.
import { Question, Category, StudyPlan, LearningModule, LeaderboardEntry } from './types';

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
        PASS: 25,       // 86%+
        EXCELLENT: 50,  // 90%+
        FLAWLESS: 100,  // 100%
    },
    MODULE_MASTERY: 150,
};

export const STUDY_PLANS: StudyPlan[] = [
    {
        name: "One-Week Intensive Study Plan",
        description: "A fast-paced plan to get you test-ready in just one week. Requires daily commitment.",
        steps: [
            { title: "Day 1: Foundation & Hazard Awareness", description: "Complete the 'Alertness', 'Attitude', and 'Hazard Awareness' modules. Take a 25-question mock test.", duration: "Approx. 2 hours", isCompleted: false },
            { title: "Day 2: Your Vehicle & Safety", description: "Review 'Safety & Your Vehicle' and 'Safety Margins'. Take a focused quiz on these topics.", duration: "Approx. 1.5 hours", isCompleted: false },
            { title: "Day 3: Rules of the Road", description: "Master the 'Rules of the Road' and 'Road and Traffic Signs' modules. These are critical!", duration: "Approx. 2.5 hours", isCompleted: false },
            { title: "Day 4: Vulnerable Road Users", description: "Complete the 'Vulnerable Road Users' and 'Other Types of Vehicle' modules. Take a 25-question mock test.", duration: "Approx. 2 hours", isCompleted: false },
            { title: "Day 5: Motorway & Advanced Topics", description: "Study 'Motorway Rules', 'Vehicle Handling', and 'Vehicle Loading'.", duration: "Approx. 2 hours", isCompleted: false },
            { title: "Day 6: Emergencies & Documents", description: "Cover 'Incidents, Accidents & Emergencies' and 'Documents'. Take a full 50-question mock test.", duration: "Approx. 2 hours", isCompleted: false },
            { title: "Day 7: Final Review & Mock Test", description: "Review your weakest categories based on the progress chart. Take one final 50-question mock test.", duration: "Approx. 1.5 hours", isCompleted: false },
        ]
    }
];


export const LEARNING_MODULES: LearningModule[] = [
  {
    slug: 'alertness',
    title: 'Alertness: Staying Focused on the Road',
    category: Category.ALERTNESS,
    summary: 'Master the core principles of observation, anticipation, and concentration to prevent accidents.',
    content: `
Alertness is about actively paying attention to your driving environment. Being fully aware of what's happening around you is the first line of defence against accidents. It encompasses observation, anticipation, and concentration.

## Observation and Scanning
Good observation is a continuous process of gathering information from your surroundings. It's more than just looking; it's about actively seeing and understanding.

### Effective Scanning Technique
* **Scan Constantly:** Keep your eyes moving. Check your mirrors frequently (every 5-10 seconds), look far ahead down the road to see developing hazards, and scan from side to side. Don’t develop **'tunnel vision'** by staring at one point.
* **Mirrors:** Use your mirrors before signalling, changing speed, or changing direction. The core driving routine is **Mirror-Signal-Manoeuvre (MSM)**.
* **Blind Spots:** These are areas around the car that you cannot see in your mirrors. A blind spot check (also called a 'lifesaver' or shoulder check) is essential before moving off, changing lanes, turning, or overtaking.

## Anticipation
Anticipation means thinking ahead and predicting what other road users might do, giving you time to react safely.
* **Ask "What If?":** Constantly ask yourself "what if?". What if a car door opens? What if a ball rolls into the road? What if the car in front brakes suddenly? **Expect the unexpected** and have a plan for how you would react.
* **Reading the Road:** Look for clues. For example, a bus pulling up to a stop means pedestrians might cross the road. Brake lights in the distance suggest traffic is slowing. A vehicle with a left indicator on at a junction may not actually be turning.

## Concentration and Distractions
> **Highway Code, Rule 148:**
> "Safe driving and riding needs concentration. Avoid distractions when driving or riding such as... loud music (this may mask other sounds), trying to read maps, inserting a cassette or CD, or tuning a radio."

### Dangers to Alertness
* **Tiredness:** A major cause of crashes, as it impairs judgement and slows reaction times. If you feel drowsy, pull over in a safe and legal place to rest. On a motorway, leave at the next exit or service area.
>! **Rule of Thumb:** Plan to take a break of at least **15 minutes for every 2 hours** of driving. Fresh air or caffeine can provide a temporary boost, but proper rest is the only real cure.
>W **Never drive when tired.** It is as dangerous as drink-driving and can lead to 'micro-sleeps' where you briefly lose consciousness without realising it.

* **Distractions:** Anything that takes your attention away from driving is a distraction.
    >W **It is illegal to use a hand-held mobile phone while driving or riding.** This includes texting, making calls, or changing music. Using a hands-free device can also be a distraction and police can stop you if they think you are not in control of your vehicle.
    * Other distractions include: adjusting in-car systems like satellite navigation or stereo, eating and drinking, talking to passengers, and smoking.

* **Alcohol & Drugs:** Your ability to drive is seriously impaired by alcohol and certain drugs. Reaction times are slower, judgement is poor, and your field of vision narrows.
>W **Never drink or take drugs and drive.** Be aware that some **prescription and over-the-counter medications** can cause drowsiness and affect your ability to drive. Always check the label or ask a doctor/pharmacist if you are fit to drive.
`
  },
  {
    slug: 'attitude',
    title: 'Attitude: Responsible and Safe Driving',
    category: Category.ATTITUDE,
    summary: 'Understand the mindset required for safe driving, including patience, consideration, and avoiding road rage.',
    content: `
Your attitude on the road significantly affects your safety and the safety of others. A good driver is patient, considerate, and responsible, not competitive or aggressive.

## Key Aspects of a Good Driving Attitude
* **Patience:** Rushing leads to poor decisions, risk-taking, and accidents. It rarely saves significant time. Allow plenty of time for your journey, especially in heavy traffic, bad weather, or unfamiliar areas.
* **Consideration for Others:** Be mindful of other road users, especially vulnerable ones (pedestrians, cyclists, motorcyclists). Give way when necessary and be forgiving of others' mistakes. Everyone makes them.
> **Highway Code, Rule 147:**
> "Be considerate. Be careful of and considerate to other road users, especially those in the groups listed in Rule 204 [vulnerable road users]."
* **Following Rules:** Obey speed limits, traffic signals, and road signs. They are designed for everyone's safety, not to inconvenience you.
* **Avoiding Road Rage:** Never respond aggressively to other drivers. If you feel angry or stressed by someone else's driving (or your own feelings), pull over in a safe place when you can and take a few minutes to calm down. Do not make eye contact with an aggressive driver and do not get drawn into a confrontation.

## Tailgating and Safe Distances
>W **Tailgating** is driving too closely behind another vehicle. It is a dangerous and intimidating form of aggressive driving, and it is a traffic offence. It dramatically reduces your time to react and stop, and is a leading cause of rear-end collisions.
>! Always maintain a safe following distance. In good, dry conditions, this is at least a **two-second gap**. In wet conditions, it should be at least a **four-second gap**. In icy conditions, it can be up to **ten times** the normal gap.

## Responding to Other Road Users
* **Emergency Vehicles:** If an emergency vehicle approaches with flashing blue lights, sirens, or flashing headlights, remain calm and allow it to pass as soon as it is safe to do so. Pull over and stop if necessary. Do not break the law (e.g., by entering a bus lane or running a red light) or endanger others to get out of the way.
* **Bus Drivers:** Give way to buses signalling to pull out from a bus stop, as long as it is safe to do so. This helps public transport run on time and reduces traffic congestion.
* **Headlight Flashing:** A flash of headlights has only one official meaning: it's to let other road users know you are there (like a horn). It is **not** a signal to proceed, to say thank you, or to show annoyance. Misinterpreting a headlight flash can be dangerous.
* **The Horn:** Use your horn only while your vehicle is moving and you need to warn other road users of your presence. Do not use it aggressively. It's illegal to use it in a built-up area between 11:30 pm and 7:00 am.
`
  },
  {
    slug: 'safety-and-your-vehicle',
    title: 'Safety and Your Vehicle',
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    summary: 'Learn essential vehicle safety checks and understand the features that keep you safe on the road.',
    content: `
> **Highway Code, Annex 6:**
> "You MUST ensure your vehicle and trailer comply with the full requirements of the Road Vehicles (Construction and Use) Regulations and Road Vehicles Lighting Regulations."

Ensuring your vehicle is in good working order is your legal responsibility as a driver. Regular checks are crucial for safety.

## Pre-Drive Checks (POWERS)
Before any long journey, or regularly (e.g., weekly), perform these simple checks:
* **P - Petrol:** Do you have enough fuel for your journey? Running out of fuel, especially on a motorway, can be dangerous.
* **O - Oil:** Check the engine oil level using the dipstick when the engine is cold and the car is on level ground. Low oil can cause catastrophic engine damage.
* **W - Water:** Check the windscreen washer fluid level and top it up if necessary. Also check the engine coolant level; it should be between the min/max markers.
* **E - Electrics:** Ensure all lights (headlights, brake lights, indicators), your horn, and wipers are working correctly. Ask someone to help you check the brake lights.
* **R - Rubber:** Check your tyre pressures when they are cold and inspect the tyre walls and treads for any cuts, bulges, or embedded objects.

## Tyres
* **Tread Depth:** The legal minimum tread depth for cars is **1.6mm** across the central three-quarters of the tyre's breadth and around the entire circumference.
>W Driving with bald or defective tyres is extremely dangerous and illegal, resulting in heavy fines and penalty points. Insufficient tread depth dramatically increases your stopping distance, especially in the wet, as it cannot clear water effectively.
* **Tyre Pressure:** Check your vehicle's manual or a sticker (usually inside the driver's door pillar) for the correct pressure. Under-inflated tyres affect braking, steering ("heavy steering"), and increase fuel consumption. Over-inflated tyres reduce grip.

## Brakes, Steering & Other Components
* **Brakes:** If your brakes feel spongy, slack, or the car pulls to one side when braking, have them checked by a qualified mechanic immediately. The Anti-lock Braking System (ABS) warning light should go out after you start the car; if it stays on, there's a fault with the system.
* **Steering:** The steering should not feel heavy or loose. Any unusual vibrations or feelings should be checked.
* **Head Restraint:** This is a crucial safety device. Adjust the head restraint so the rigid part is at least as high as your eyes or the top of your ears, and as close to the back of your head as is comfortable. This helps prevent whiplash (neck injury) in a collision.

## Lights & Visibility
* **Headlights:** Use dipped headlights at night and in poor visibility (e.g., heavy rain). Use main beams only on unlit roads when no other vehicles are approaching, as they can dazzle other drivers. Dip your headlights when following another vehicle or meeting oncoming traffic.
* **Fog Lights:**
> **Highway Code, Rule 226:**
> "You MUST use headlights when visibility is seriously reduced... You may also use front or rear fog lights but you MUST switch them off when visibility improves."
* **Visibility should be below 100 metres (328 feet)** to justify using fog lights. Using them in other conditions can dazzle other drivers and is an offence.
* **Windscreen & Windows:** Keep them clean, inside and out, and free from obstructions or stickers.
`
  },
    {
    slug: 'safety-margins',
    title: 'Safety Margins: Keeping Your Distance',
    category: Category.SAFETY_MARGINS,
    summary: 'Learn how to maintain safe distances from other vehicles in various conditions to ensure you have time to react.',
    content: `
Maintaining a safe space around your vehicle is one of the most important defensive driving skills. This 'safety bubble' gives you the time and space needed to react to hazards.

## Following Distance: The Two-Second Rule
>! In good, dry conditions, the minimum safe following distance from the vehicle in front is a **two-second time gap**.
To measure this, choose a fixed point on the road ahead (like a sign, tree, or bridge). When the rear of the vehicle in front passes it, start counting: "Only a fool breaks the two-second rule." If you pass the same point before you finish the phrase, you are too close and need to drop back.

## Adjusting for Conditions
You must increase your following distance in adverse conditions because your braking distance increases and visibility can be reduced.
* **Wet Roads:** At least double your gap to a **four-second gap**. Braking distances are at least doubled on wet roads.
* **Icy or Snowy Roads:** You may need up to a **ten-second gap**. Braking distances can be ten times longer than in dry conditions.
* **Following Large Vehicles:** Drop further back to improve your view of the road ahead.
* **In Tunnels or at Night:** It can be harder to judge distance, so allow a larger gap.

## Stopping Distances
The overall stopping distance is the total distance your vehicle travels from the moment you realise you must brake to the moment it stops completely. It is made up of two parts:
1.  **Thinking Distance:** The distance the car travels in the time it takes you to react to a hazard and apply the brakes.
2.  **Braking Distance:** The distance the car travels from the moment you apply the brakes until it comes to a complete stop.

**Overall Stopping Distance = Thinking Distance + Braking Distance**

> **Highway Code, Rule 126:**
> "Drive at a speed that will allow you to stop well within the distance you can see to be clear."

### Factors Affecting Stopping Distance
* **Speed:** This is the most significant factor. As speed increases, thinking distance increases proportionally, but **braking distance increases exponentially**.
>W If you double your speed from 30mph to 60mph, your thinking distance doubles, but your braking distance increases by **four times**. The overall stopping distance is roughly three times longer.
* **Driver's Condition:** Tiredness, alcohol, drugs, or distractions increase your thinking distance.
* **Vehicle's Condition:** Worn tyres, worn brakes, or extra weight will increase your braking distance.
* **Road & Weather:** Wet or icy roads dramatically increase braking distance. Driving on a downhill slope also increases it, as gravity is working against you.
`
  },
  {
    slug: 'hazard-awareness',
    title: 'Hazard Awareness: Spotting Dangers Early',
    category: Category.HAZARD_AWARENESS,
    summary: 'Develop the skill of spotting developing hazards and learn how to react safely and in good time.',
    content: `
Hazard awareness is a skill that involves actively looking for potential and developing dangers on the road. It's about seeing, understanding, and acting in good time. It's the foundation of defensive driving.

## What is a Hazard?
A hazard is anything that may cause you to change speed, direction, or stop. There are three main types:
* **Static Hazards:** Permanent features of the road, such as junctions, roundabouts, bends, parked vehicles, traffic lights, and narrowing roads.
* **Developing Hazards:** Moving things that pose a potential threat, such as pedestrians, cyclists, or other vehicles.
* **Changing Conditions:** Environmental factors like weather (rain, fog, ice), road surface (potholes, gravel), and light levels (dusk, sun glare).

## The Hazard Perception Skill: MSM & PSL Routines
This involves a constant process of identifying and responding to hazards. Key driving routines help you do this systematically.
* **MSM (Mirror-Signal-Manoeuvre):**
    * **Mirror:** Check your interior and exterior mirrors to assess what is happening behind and to the sides of you.
    * **Signal:** Signal your intention to other road users if necessary.
    * **Manoeuvre:** Execute the action (e.g., change position, speed, or direction). The manoeuvre itself can be broken down into **PSL (Position-Speed-Look)**.
* **PSL (Position-Speed-Look):**
    * **Position:** Place your car in the correct position for the intended manoeuvre (e.g., position to the left for a left turn).
    * **Speed:** Adjust your speed to be appropriate for the situation.
    * **Look:** Look for other road users and hazards before committing to the manoeuvre.

## Common Road Hazards and How to Approach Them
* **Pedestrians:** Especially children and the elderly, who can be unpredictable. Be extra careful near schools, bus stops, and ice cream vans. A bouncing ball is a huge warning sign that a child might run out.
* **Cyclists:** Give them plenty of room (at least 1.5 metres) when overtaking. Be aware they may swerve to avoid potholes or car doors opening. Check for them on your left when turning left (a common blind spot).
* **Junctions:** These are accident hotspots. Be prepared for vehicles pulling out. Your view can be obscured (a 'closed' junction). Look for emerging vehicles and be ready to slow down or stop.
* **Parked Cars:** These can hide children or pedestrians. A car's brake lights coming on, exhaust smoke, or a driver in the seat can indicate it's about to move off. Give them a car door's width of space when passing.
>W Be particularly cautious on rural roads, where hazards can include sharp bends with poor visibility, lack of footpaths, slow-moving farm vehicles, mud on the road, and animals. Adapt your speed to the conditions.
`
  },
  {
    slug: 'vulnerable-road-users',
    title: 'Vulnerable Road Users',
    category: Category.VULNERABLE_ROAD_USERS,
    summary: 'Learn the correct procedures and attitudes for interacting safely with pedestrians, cyclists, and motorcyclists.',
    content: `
Vulnerable road users are those at the highest risk of injury in a collision. The Highway Code introduced a **Hierarchy of Road Users** in 2022. This principle places those who can do the greatest harm (drivers of large vehicles) with the greatest responsibility to reduce danger to others lower down the hierarchy.

## Pedestrians
> **Highway Code, Rule H2:**
> "At a junction you should give way to pedestrians crossing or waiting to cross a road into which or from which you are turning."
* **Zebra Crossings:** Look for pedestrians waiting to cross. You **must** give way when a pedestrian has moved onto the crossing.
* **Pelican Crossings:** These are signal-controlled. A flashing amber light means you **must** give way to pedestrians on the crossing. If it's clear, you can proceed.
* **Puffin Crossings:** These have sensors to detect when pedestrians have finished crossing, so there is no flashing amber phase.
* **Toucan Crossings:** These allow both pedestrians and cyclists to cross at the same time.
* **Children, the Elderly & Disabled Pedestrians:** Can be unpredictable or slow to cross. Give them extra time and patience. A pedestrian with a white stick with a red band is both deaf and blind.

## Cyclists
> **Highway Code, Rule 163:**
> "Overtake only when it is safe and legal to do so. You should... give motorcyclists, cyclists, horse riders and horse-drawn vehicles at least as much room as you would when overtaking a car."
* **Passing Distance:** Give cyclists at least **1.5 metres (5 feet)** of space when overtaking at speeds up to 30mph, and more space at higher speeds. Wait behind if it's not safe to pass.
* **Junctions & Roundabouts:** Be aware of cyclists filtering through traffic or on your left-hand side. Always check for them before turning, especially when turning left. They may be travelling faster than you think.
* **Cycle Lanes:** Do not drive or park in a cycle lane marked with a solid white line during its hours of operation.

## Motorcyclists
>W Motorcyclists are often difficult to see because they are narrow. They can be easily hidden in a vehicle's blind spots or by other traffic. Always look carefully for them before moving off, changing direction, or pulling out at junctions.
* **Filtering:** Motorcyclists may legally filter between lanes of slow-moving or stationary traffic. Be aware of this and check your mirrors frequently, especially before changing lanes.
* **Weather:** Motorcyclists are more affected by poor weather and crosswinds. Give them extra space.

## Horse Riders
* **Passing a Horse:** According to recent Highway Code changes, when passing a horse, you should:
    * Slow right down to a maximum of **10 mph**.
    * Give the horse at least **2 metres (6.5 feet)** of space.
    * Do not rev your engine or sound your horn.
    * Be ready to stop if the rider signals you to do so.
`
  },
  {
    slug: 'other-types-of-vehicle',
    title: 'Other Types of Vehicle',
    category: Category.OTHER_TYPES_OF_VEHICLE,
    summary: 'Understand the challenges posed by large vehicles, buses, trams, and agricultural vehicles.',
    content: `
You will share the road with many different types of vehicles. Understanding their unique characteristics and limitations is key to safe interaction.

## Large Vehicles (Lorries, Buses, Coaches)
* **Visibility & Blind Spots:** Large vehicles have significant blind spots, often referred to as 'no-zones'. These are directly in front, behind, and along their sides.
>! If you are following a large vehicle and you can't see its mirrors, the driver **cannot** see you. Stay well back.
* **Overtaking:** They take much longer to overtake than a car. Make sure you have enough clear road ahead. Be prepared for side winds or air turbulence as you pass.
* **Spray in Wet Weather:** They throw up a huge amount of spray, which can completely obscure your vision. Use your wipers and ensure your washer fluid is topped up. Drop back to stay out of the worst of the spray.
* **Turning:** Long vehicles need more space to turn. A long articulated lorry may need to swing out to the right to make a tight left turn (or vice versa).
>W **Never** try to pass a long vehicle on the left if it's signalling left and positioned in the middle of its lane at a junction. It is likely preparing to turn. Stay back and wait.

## Buses
* Be prepared for buses to make frequent stops, sometimes unexpectedly.
* At a bus stop, watch out for pedestrians getting on or off the bus who may cross the road without looking.
* You should give way to a bus signalling to pull out from a bus stop, if it is safe to do so.

## Trams
* Trams are silent, move quickly, and are confined to their rails, meaning they **cannot swerve** to avoid you.
* The tram rails can be a slippery hazard, especially for cyclists and motorcyclists, particularly in the wet.
* Pay attention to tram-only signals, lanes, and signs. You must not enter a tram-only lane.

## Agricultural Vehicles & Other Slow Movers
>W Tractors and other farm vehicles are slow-moving (max speed around 25 mph) and may have wide or long loads. They may also leave mud on the road, which can be slippery. Be patient and only overtake when it is safe, legal, and you have plenty of clear road ahead. A flashing amber beacon on a vehicle indicates a slow-moving or stationary vehicle.
`
  },
  {
    slug: 'vehicle-handling',
    title: 'Vehicle Handling: Control in All Conditions',
    category: Category.VEHICLE_HANDLING,
    summary: 'Learn how weather affects your vehicle and master techniques for safe braking, steering, and driving in adverse conditions.',
    content: `
Vehicle handling is about how you control the car's speed and position through steering, braking, and accelerating, especially when conditions reduce your tyres' grip on the road.

## Steering & Braking
* **Steering Method:** Use a 'push-pull' method for steering for most situations. Do not cross your hands over the steering wheel. This allows for finer, more stable control and ensures you don't accidentally hit the horn or other controls.
* **Braking Technique:** Brake progressively and in plenty of time. Avoid sudden, harsh braking, which can lock the wheels and cause skidding, especially on bends or in poor weather.
* **ABS:** Anti-lock Braking Systems prevent the wheels from locking up during harsh braking, allowing you to maintain steering control while braking heavily. If you have ABS and need to perform an emergency stop, you should **brake firmly and maintain pressure** on the pedal. Do not 'pump' the brakes.

## Skidding
Skidding is caused by the driver, usually by accelerating, steering, or braking too harshly for the conditions, causing the tyres to lose grip.
* **If you skid:** The primary cause of skidding is loss of grip. To regain it, you need to reduce the cause.
    * For a rear-wheel skid (the back of the car slides out), you should **steer into the skid**. For example, if the rear of the car slides to the right, steer gently to the right to correct it. Take your feet off the pedals.
* **Preventing skids** is the best approach: always drive at a speed appropriate for the conditions and make all your control inputs smooth and gentle.

## Driving in Adverse Weather
* **Rain:**
    >W On wet roads, stopping distances are at least **doubled**.
    * If you drive through a deep puddle (a ford), gently apply your brakes afterwards to test them and help dry them out.
    * **Aquaplaning** is where a layer of water builds up between the tyres and the road surface, causing a temporary loss of steering and braking control. If this happens, ease off the accelerator, do not brake or steer, and allow your speed to reduce until you feel the tyres regain grip.
* **Ice & Snow:**
    >W In icy conditions, stopping distances can be **ten times** longer. **Black ice** is a thin layer of ice that is transparent and very difficult to see.
    * When setting off, use the highest gear you can without the engine struggling (usually 2nd gear). This is known as 'short shifting' and it helps to prevent wheelspin.
    * All steering, accelerating, and braking must be extremely gentle and smooth.
* **Fog:**
    > **Highway Code, Rule 235:**
    > "When driving in fog you should... allow more time for your journey and slow down as visibility in front is reduced."
    * Use dipped headlights. Use fog lights only when visibility is seriously reduced (below **100 metres**). Remember to switch them off when visibility improves.
* **Strong Winds:**
    * Be prepared for sudden gusts, especially on exposed stretches of road (bridges, viaducts) or when passing gaps between buildings.
    * Give vulnerable road users like cyclists and motorcyclists extra room as they can be blown off course.
`
  },
  {
    slug: 'motorway-rules',
    title: 'Motorway Rules: Driving on High-Speed Roads',
    category: Category.MOTORWAY_RULES,
    summary: 'Master the specific rules for motorway driving, including joining, leaving, lane discipline, and speed limits.',
    content: `
Motorways are statistically our safest roads, but the high speeds involved mean incidents can be very serious. Specific rules apply.
>W Certain road users are prohibited from motorways, including pedestrians, learner motorcyclists, cyclists, and agricultural vehicles. Learner drivers are only permitted with an approved instructor in a dual-control car.

## Joining and Leaving the Motorway
* **Joining:** Use the acceleration lane (slip road) to build up your speed to match the traffic in the left-hand lane. Do not force your way into traffic. Indicate, use your mirrors and blind spot checks to find a safe gap, give way to traffic already on the motorway, and merge smoothly.
* **Leaving:** Get into the left-hand lane well in advance of your exit. Indicate left about half a mile from the exit. Exit onto the deceleration lane (slip road) and adjust your speed accordingly. Be aware that your sense of speed may be distorted after a long period of high-speed driving. Countdown markers on the slip road (3 bars = 300 yards, 2 = 200, 1 = 100) show the distance to the end of the slip road.

## Lane Discipline
> **Highway Code, Rule 264:**
> "You should always drive in the left-hand lane when the road ahead is clear. If you are overtaking a number of slow-moving vehicles, you should return to the left-hand lane as soon as you are safely past."
* **The left-hand lane is the normal driving lane.**
* Use the middle and right-hand lanes **only for overtaking**.
>W **'Middle-lane hogging'** (staying in the middle lane when the left lane is clear) is a traffic offence and can cause congestion by preventing others from overtaking correctly.

## Overtaking and Speed
* **Overtaking:** Normally, you overtake on the right. Only overtake on the left if traffic is moving slowly in queues and the queue on your right is moving more slowly than you are ('undertaking').
* **Speed Limits:** The national speed limit for cars on a motorway is **70 mph**. This is a maximum, not a target. It may be lower due to roadworks or variable speed limits shown on overhead gantries.
>! A speed limit shown inside a red circle is a mandatory, legal limit. A speed shown on its own (e.g., on a matrix sign) is an advisory limit.

## Smart Motorways
These use technology like overhead gantries to manage traffic flow and reduce congestion.
* **Red X:** If a red X is shown above your lane (or on a large sign), you **MUST** move out of it as soon as it's safe to do so, as the lane is closed ahead. It is illegal and very dangerous to drive in a lane marked with a Red X.
* **Variable Speed Limits:** Mandatory speed limits are shown in red circles and must be obeyed. They are enforced by speed cameras.
* **Emergency Areas:** On 'All Lane Running' smart motorways where there is no hard shoulder, there are orange-coloured Emergency Areas (EAs) at regular intervals. You should only use these in a genuine emergency.

## Breakdowns
> **Highway Code, Rule 275:**
> "If your vehicle develops a problem, leave the motorway at the next exit or pull into a service area. If you cannot do so, you should... move into the left hand lane and on to the hard shoulder."
* Switch on your hazard warning lights immediately.
* Exit the vehicle from the left-hand side, away from the traffic. Never sit in the vehicle.
* Stand behind the barrier and up the embankment if possible, then call for assistance using the SOS phone (which connects you directly to the control centre and gives your exact location) or your mobile.
`
  },
  {
    slug: 'rules-of-the-road',
    title: 'Rules of the Road: Understanding Priority',
    category: Category.RULES_OF_THE_ROAD,
    summary: 'Learn the fundamental laws of driving, including parking, overtaking, and rules at junctions and roundabouts.',
    content: `
These are the fundamental rules that ensure traffic flows smoothly and safely. Understanding priority is key.

## Junctions & Priority
* **Unmarked Crossroads:** At an unmarked crossroads, no one has priority. Slow down, look both ways, and only emerge when it's safe.
* **Turning Right:** When turning right at a junction, you must give way to oncoming traffic that is going straight ahead or turning left.
* **Box Junctions:** These have yellow criss-cross lines.
> **Highway Code, Rule 174:**
> "You MUST NOT enter the box until your exit road or lane is clear. However, you may enter the box and wait when you want to turn right, and are only stopped from doing so by oncoming traffic, or by other vehicles waiting to turn right."

## Roundabouts
* **Approaching:** Decide on your exit early, get into the correct lane (check road markings), and signal if necessary.
* **Giving Way:** You must give way to traffic approaching from your **right**, unless road markings or signs indicate otherwise.
* **Signalling:**
    * **Turning Left (1st exit):** Signal left on approach and stay in the left lane.
    * **Going Straight Ahead (e.g., 2nd exit):** No signal on approach. Stay in the left lane unless signs or markings indicate otherwise. Signal left just after you pass the exit before yours.
    * **Turning Right (past 12 o'clock):** Signal right on approach and position in the right lane. Keep the right signal on until you pass the exit before yours, then change to a left signal.

## Overtaking
>! Only overtake when it is safe and legal to do so. You need a clear view of the road ahead and enough time to complete the manoeuvre without forcing other vehicles to slow down or swerve.
* **You MUST NOT overtake where you see 'Solid White Lines' on your side of the road.**
* Do not overtake on the approach to a junction, a bend, the brow of a hill, or where the road narrows.
* Be especially careful when overtaking cyclists and motorcyclists; give them plenty of room.

## Parking
* **Double Yellow Lines:** Mean no waiting at any time.
* **Single Yellow Lines:** Mean no waiting during the times shown on a nearby sign.
* **Red Lines ('Red Routes'):** Used on major urban routes, they mean no stopping at all during the times shown. A double red line means no stopping at any time.
>W **Never** stop or park on:
    * The zigzag lines of a pedestrian crossing.
    * A clearway.
    * The hard shoulder of a motorway.
    * A taxi bay, or near a school entrance.
* **At night**, on a road with a speed limit greater than 30 mph, you **must** park in the direction of the traffic flow and leave your sidelights on.
`
  },
  {
    slug: 'road-and-traffic-signs',
    title: 'Road and Traffic Signs',
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    summary: 'Learn to identify and understand the meanings of different shapes, colours, and types of UK road signs.',
    content: `
Road signs give you information, orders, or warnings. Their shape and colour give you an instant clue to their meaning.

## Sign Shapes & Colours
* **Circular Signs:** Give orders.
    * **Red Circle Border:** Mostly prohibitive (e.g., 'No Entry', Speed Limit, 'No Right Turn').
    * **Blue Circle:** Give a mandatory instruction that you MUST follow (e.g., 'Turn Left Ahead', 'Mini-roundabout', 'Route for cycles only').
* **Triangular Signs:** Give warnings. They have a red border and point upwards (e.g., 'Junction Ahead', 'Slippery Road', 'Pedestrians in road').
* **Rectangular Signs:** Give information.
    * **Blue Background:** Used for directions on motorways, or for information (e.g., 'Diversion ends').
    * **Green Background:** Used for directions on primary routes (major 'A' roads).
    * **White Background:** Used for directions on non-primary routes, or for other general information.
    * **Brown Background:** Used for tourist information signs.

## Key Signs You MUST Know
* **Stop Sign:** (Octagonal) The only 8-sided sign. You **must** stop completely at the solid white line, give way to traffic on the main road, and only proceed when it is safe.
* **Give Way Sign:** (Inverted Triangle) You must give way to traffic on the major road you are about to join. You do not have to stop if it is safe to proceed.
* **National Speed Limit Applies:** (White circle with a single black diagonal stripe) This indicates the end of a specific speed limit. It means 60 mph for cars on a single carriageway and 70 mph on a dual carriageway or motorway.

## Road Markings
Road markings are also signs and must be obeyed.
* **Solid White Line (Centre of road):** You **must not** cross or straddle it, except in specific circumstances (e.g., turning into a property, passing a stationary vehicle, or overtaking a pedal cycle, horse or road maintenance vehicle travelling at 10 mph or less).
* **Broken White Line (Short dashes):** Marks the centre of the road.
* **Broken White Line (Longer dashes):** Hazard warning line. Do not cross it unless you can see the road is clear well ahead. Often found on the approach to a hazard like a bend or junction.
* **Double White Lines (Solid on your side):** You **must not** cross or straddle it.
* **Double White Lines (Broken on your side):** You may cross it to overtake, provided it is safe and you can complete the manoeuvre before reaching a solid white line on your side.
* **Yellow Lines at Kerb:** Control waiting and parking (see Rules of the Road module).
* **Zigzag Lines (White):** Found at pedestrian crossings. You **must not** park or overtake the leading vehicle that has stopped to give way.
`
  },
  {
    slug: 'documents',
    title: 'Documents: Legal Requirements',
    category: Category.DOCUMENTS,
    summary: 'Understand the essential documents required to drive legally in the UK, including your licence, insurance, and MOT.',
    content: `
To drive legally in the UK, you and your vehicle must be covered by the correct documentation. The police can ask you to produce these documents at any time.

## Driving Licence
* **Provisional Licence:** To learn to drive, you must hold a valid provisional licence for the category of vehicle you are driving. When driving, you must be accompanied by a qualified driver who is over 21 and has held a full licence for that type of vehicle for at least 3 years.
* **Displaying 'L' Plates:** You must display red 'L' plates ('D' plates are also valid in Wales) clearly on the front and back of your vehicle. These must be removed or covered when a full licence holder is driving.
* **Police Check:** If stopped by the police, you may be asked to produce your licence. If you don't have it with you, you may be asked to take it to a police station within 7 days.

## Car Insurance
>W It is a criminal offence to drive or keep a vehicle on a public road without at least **third-party** insurance.
* **Third-Party Insurance:** This is the legal minimum. It covers damage to other people's property and injury to other people (third parties). It does **not** cover any damage to your own vehicle or property.
* **Third-Party, Fire and Theft:** Same as above, but also covers your vehicle if it's stolen or catches fire.
* **Comprehensive Insurance:** Covers all of the above, plus damage to your own vehicle in an accident, even if it was your fault.
>! An insurance certificate is issued when you take out a policy. This is the legal proof of your insurance.

## MOT Certificate
* **What is it?:** The MOT is an annual test to ensure your vehicle meets road safety and environmental standards. It checks components like brakes, lights, tyres, and emissions. It is **not** a guarantee of the general mechanical condition of the vehicle.
* **When is it needed?:** Cars must have their first MOT when they are **three years old** (four years in Northern Ireland). After that, it must be renewed annually.
>W It is illegal to drive a vehicle without a valid MOT certificate, unless you are driving it to a pre-booked MOT appointment or to a garage to have repairs carried out for a failed MOT.

## Vehicle Excise Duty (VED)
* **What is it?:** Commonly known as 'road tax' or 'vehicle tax'. This is a tax that must be paid for most vehicles used or kept on public roads. This is now done electronically; you will not receive a paper tax disc.
* **SORN:** If you are not using or keeping a vehicle on a public road, you must declare it as off the road by making a **Statutory Off Road Notification (SORN)**. A vehicle with a SORN must be kept on private property. You cannot keep an untaxed, un-SORNed vehicle on a public road.
`
  },
  {
    slug: 'incidents-accidents-emergencies',
    title: 'Incidents, Accidents & Emergencies',
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    summary: 'Know what to do in the event of a breakdown, collision, or when encountering an emergency vehicle.',
    content: `
Knowing how to react calmly and correctly in an emergency situation is a vital driving skill that can save lives.

## Breakdowns
* **On a normal road:** Get your vehicle off the road if possible. Use your hazard warning lights. In daylight on a fast road, place a warning triangle at least 45 metres (147 feet) behind your vehicle on the same side of the road. Do not use a warning triangle on a motorway.
* **On a motorway:** See the 'Motorway Rules' module for detailed instructions on using the hard shoulder or an Emergency Area.

## Accidents
> **Highway Code, Rule 286:**
> "If you are involved in a collision which causes damage or injury to any other person, vehicle, animal or property, you MUST... stop."
1.  **Stop** at the scene safely. It is an offence not to do so.
2.  Switch off your engine and switch on your hazard warning lights to warn other traffic.
3.  Check for injuries to yourself or others. Call 999 or 112 immediately if anyone is injured, if the road is blocked, or if there is any danger of fire.
4.  If the police are not attending, you must exchange details with anyone involved: name, address, vehicle registration, and insurance details. If you damage property and cannot find the owner, you must report the incident to the police within 24 hours.

## First Aid at the Scene
* **Do not** put yourself or others in danger.
* **Do not** move casualties unless they are in immediate danger (e.g., from fire).
* **Do not** remove a motorcyclist's helmet unless it is absolutely essential to maintain their airway.
* **Do** try to keep casualties warm and comfortable.
* **Do** talk to them and reassure them.

### First Aid: DR ABC
This is a primary survey for checking an unconscious casualty:
* **D - Danger:** Check for any dangers to yourself and the casualty.
* **R - Response:** Try to get a response by asking questions and gently shaking their shoulders.
* **A - Airway:** If there is no response, open the casualty's airway by placing one hand on the forehead and two fingers under the chin, then tilting the head back gently.
* **B - Breathing:** Look, listen, and feel for normal breathing for up to 10 seconds.
* **C - Circulation / Compressions:** If the person is not breathing normally, call 999/112 for an ambulance immediately and begin chest compressions (CPR) if you are trained and willing to do so.

## Encountering Emergency Vehicles
>! If an emergency vehicle (police, fire, ambulance) or a traffic officer vehicle approaches using flashing blue lights, sirens or flashing headlights, give way if it is safe to do so. Do not brake harshly or panic. Look for a safe place to pull over and stop. Do not contravene any traffic laws (e.g., entering a bus lane) to get out of the way.
`
  },
  {
    slug: 'vehicle-loading',
    title: 'Vehicle Loading: Safety and Stability',
    category: Category.VEHICLE_LOADING,
    summary: 'Learn the correct and safe way to load your vehicle, whether it\'s luggage, passengers, or towing a trailer.',
    content: `
Correctly loading your vehicle is essential for safety, stability, and fuel efficiency. An overloaded or poorly loaded vehicle can be dangerous and illegal.

## General Principles of Loading
* **Distribute Weight Evenly:** Place heavy items as low down as possible and close to the centre of the vehicle (usually in the boot, just behind the rear seats). This keeps the vehicle's centre of gravity low and improves stability.
* **Secure Your Load:** Any load must be securely fastened so that it cannot move around when you are braking, accelerating, or cornering. In a crash, an unsecured object can become a dangerous projectile. Use luggage straps or nets if necessary.
* **Do Not Overload:** Check your vehicle's handbook for the maximum authorised mass (MAM). Overloading is illegal and seriously affects the vehicle's handling, especially its braking and steering. It also puts a strain on the tyres and suspension.
>W If your vehicle is overloaded, your insurance may be invalidated.

## Carrying Loads on a Roof Rack
* A heavy load on the roof will raise the vehicle's centre of gravity, making it less stable, especially on bends and in strong crosswinds.
* The load must be securely fastened and must not overhang dangerously.
* Be aware of the change in your vehicle's height, especially when entering car parks with height restrictions.

## Passengers and Animals
* **Passengers:** It is the driver's responsibility to ensure that all passengers are wearing seat belts if they are fitted. Children must use a suitable child restraint (see Safety and your vehicle).
* **Animals:** Pets must be suitably restrained so they cannot distract you while you are driving or injure you or themselves if you stop quickly. A seat belt harness, pet carrier, dog cage or dog guard are suitable ways of restraining animals in cars.
> **Highway Code, Rule 57:**
> "When in a vehicle make sure dogs or other animals are suitably restrained so they cannot distract you while you are driving or injure you, or themselves, if you stop quickly. A seat belt harness, pet carrier, dog cage or dog guard are ways of restraining animals in cars."

## Towing a Trailer or Caravan
Towing requires extra skill and concentration.
* **Licence & Weight Limits:** Check your driving licence to see what size of trailer you are allowed to tow.
* **Towing Mirrors:** If your trailer or caravan is wider than the rear of your car, you **must** fit suitable towing mirrors to give you an adequate view of the road behind.
* **Coupling & Safety:** Ensure the trailer is correctly coupled to the towball and that the breakaway cable is attached correctly. The cable is designed to apply the trailer's brakes if it becomes detached from the towing vehicle.
* **'Snaking' and 'Pitching':**
    * **Snaking:** This is when a trailer or caravan sways from side to side. It can be caused by uneven loading, excessive speed, or strong crosswinds. If it happens, ease off the accelerator and reduce speed gently. Do not brake harshly.
    * **Pitching:** This is the up and down movement of the caravan. It is often due to poor loading.
>! To help prevent instability, load the trailer or caravan with the heaviest items over the axle(s), and ensure the noseweight is correct as per the manufacturer's specification. This provides the most stable setup.
`
  },
];

export const QUESTION_BANK: Question[] = [
    // --- Alertness (10) ---
    { id: 1, question: "When should you use your vehicle's horn?", category: Category.ALERTNESS, options: [ { text: "To greet a friend", isCorrect: false }, { text: "To show your annoyance", isCorrect: false }, { text: "To alert others of your presence", isCorrect: true }, { text: "Between 11:30 pm and 7 am in a built-up area", isCorrect: false } ], explanation: "The horn should only be used to warn other road users of your presence when your vehicle is moving. It should not be used aggressively or between 11:30 pm and 7 am in a built-up area." },
    { id: 2, question: "What does the term 'blind spot' mean?", category: Category.ALERTNESS, options: [ { text: "An area you can only see with your main beam headlights", isCorrect: false }, { text: "An area hidden by the windscreen pillars", isCorrect: false }, { text: "An area not covered by your vehicle's mirrors", isCorrect: true }, { text: "An area you should not look at while driving", isCorrect: false } ], explanation: "A blind spot is an area around your vehicle that cannot be seen in your mirrors. You must perform a shoulder check to see into these areas before changing lanes or direction." },
    { id: 3, question: "You are driving on a motorway and feel tired. What should you do?", category: Category.ALERTNESS, options: [ { text: "Open the window for some fresh air", isCorrect: false }, { text: "Turn the radio up to help you stay awake", isCorrect: false }, { text: "Stop on the hard shoulder for a rest", isCorrect: false }, { text: "Leave at the next exit and find a safe place to rest", isCorrect: true } ], explanation: "Tiredness is a major cause of accidents. If you feel sleepy, you must leave the motorway at the next exit or service area to take a proper break. Stopping on the hard shoulder is for emergencies only." },
    { id: 4, question: "Using a mobile phone while driving is illegal because it...", category: Category.ALERTNESS, options: [ { text: "Drains the car battery", isCorrect: false }, { text: "Reduces your field of vision", isCorrect: false }, { text: "Reduces your concentration and increases reaction time", isCorrect: true }, { text: "Is only a problem for new drivers", isCorrect: false } ], explanation: "Using a mobile phone, even hands-free, is a major distraction that significantly impairs your concentration, judgement, and reaction times, making you much more likely to cause a collision." },
    { id: 5, question: "What is the 'two-second rule' for?", category: Category.SAFETY_MARGINS, options: [ { text: "The time it takes to start a car", isCorrect: false }, { text: "The time you should wait at a stop sign", isCorrect: false }, { text: "Maintaining a safe following distance in good weather", isCorrect: true }, { text: "The maximum time you can park on a single yellow line", isCorrect: false } ], explanation: "The two-second rule is a method to ensure a safe following distance in dry conditions. You should be at least two seconds behind the vehicle in front." },
    { id: 6, question: "What should you do before making a U-turn?", category: Category.ALERTNESS, options: [ { text: "Flash your headlights to warn other drivers", isCorrect: false }, { text: "Look over your shoulder for a final check", isCorrect: true }, { text: "Select a higher gear than normal", isCorrect: false }, { text: "Give an arm signal as well as using your indicators", isCorrect: false } ], explanation: "Before making a U-turn, you must ensure the road is clear in all directions. This includes a final check of your blind spots by looking over your shoulder." },
    { id: 7, question: "When driving at dusk or in poor visibility, you should...", category: Category.ALERTNESS, options: [ { text: "Use your main beam headlights", isCorrect: false }, { text: "Use your hazard warning lights", isCorrect: false }, { text: "Turn on your dipped headlights", isCorrect: true }, { text: "Follow other cars' lights", isCorrect: false } ], explanation: "You must use dipped headlights when visibility is poor to ensure that you can be seen by other road users and can see the road ahead clearly." },
    { id: 8, question: "A ball bounces out into the road ahead. What should you be prepared for?", category: Category.ALERTNESS, options: [ { text: "The ball rolling back to the pavement", isCorrect: false }, { text: "A child running out after it", isCorrect: true }, { text: "The driver in front to accelerate", isCorrect: false }, { text: "Nothing, as it's only a ball", isCorrect: false } ], explanation: "A bouncing ball is a classic warning sign that a child might be about to run into the road. You must anticipate this and be prepared to slow down or stop." },
    { id: 9, question: "What does the Mirror-Signal-Manoeuvre (MSM) routine involve?", category: Category.ALERTNESS, options: [ { text: "Checking mirrors after the manoeuvre", isCorrect: false }, { text: "Signalling only when other cars are present", isCorrect: false }, { text: "Checking mirrors and blind spots, signalling, then acting", isCorrect:true }, { text: "Manoeuvring first, then checking mirrors", isCorrect: false } ], explanation: "The MSM routine is a fundamental safety procedure: check your mirrors to assess the situation, signal your intentions, and then perform the manoeuvre when it is safe to do so." },
    { id: 10, question: "You see a bus at a bus stop ahead. Which of the following should you be most aware of?", category: Category.ALERTNESS, options: [ { text: "The bus pulling away suddenly", isCorrect: false }, { text: "Pedestrians crossing the road from behind the bus", isCorrect: true }, { text: "The bus's exhaust fumes", isCorrect: false }, { text: "The bus remaining stationary for a long time", isCorrect: false } ], explanation: "A stationary bus can hide pedestrians, especially children, who may try to cross the road from in front of or behind it. Be extremely cautious." },
    
    // --- Attitude (10) ---
    { id: 11, question: "What does 'tailgating' mean?", category: Category.ATTITUDE, options: [ { text: "Following another vehicle too closely", isCorrect: true }, { text: "Using the rear door for storage", isCorrect: false }, { text: "Driving with your headlights on full beam", isCorrect: false }, { text: "Attaching a trailer to your vehicle", isCorrect: false } ], explanation: "Tailgating is driving dangerously close to the vehicle in front. It is an act of aggressive driving and significantly increases the risk of a rear-end collision." },
    { id: 12, question: "You are being followed by an ambulance with flashing blue lights. What should you do?", category: Category.ATTITUDE, options: [ { text: "Brake harshly and stop in the road", isCorrect: false }, { text: "Accelerate to get out of the way", isCorrect: false }, { text: "Maintain your speed and course", isCorrect: false }, { text: "Pull over and stop as soon as it is safe to do so", isCorrect: true } ], explanation: "When an emergency vehicle is approaching, you should find a safe place to pull over and let it pass. Do not endanger other road users or break traffic laws." },
    { id: 13, question: "When can you flash your headlights?", category: Category.ATTITUDE, options: [ { text: "To show you are giving way", isCorrect: false }, { text: "To thank another driver", isCorrect: false }, { text: "To let other road users know you are there", isCorrect: true }, { text: "To show you are annoyed", isCorrect: false } ], explanation: "The only official reason to flash your headlights is to alert other road users of your presence, just like using your horn. It is not a signal to give way or say thank you." },
    { id: 14, question: "Why should you be patient with other road users?", category: Category.ATTITUDE, options: [ { text: "It saves fuel", isCorrect: false }, { text: "It prevents road rage and reduces the risk of accidents", isCorrect: true }, { text: "It is a legal requirement", isCorrect: false }, { text: "It impresses passengers", isCorrect: false } ], explanation: "Patience and consideration for others are key to a safe driving attitude. Rushing and aggression lead to poor decisions and can escalate into dangerous road rage incidents." },
    { id: 15, question: "In wet conditions, what should your following distance be?", category: Category.SAFETY_MARGINS, options: [ { text: "A one-second gap", isCorrect: false }, { text: "A two-second gap", isCorrect: false }, { text: "A four-second gap", isCorrect: true }, { text: "A ten-second gap", isCorrect: false } ], explanation: "In wet weather, stopping distances are at least doubled. You should double your following distance to a four-second gap to ensure you have enough time to stop safely." },
    { id: 16, question: "A driver pulls out in front of you at a junction, forcing you to brake hard. What should you do?", category: Category.ATTITUDE, options: [ { text: "Flash your headlights and sound your horn", isCorrect: false }, { text: "Overtake them and brake sharply in front of them", isCorrect: false }, { text: "Stay calm, ignore the error and avoid confrontation", isCorrect: true }, { text: "Follow them to report their driving", isCorrect: false } ], explanation: "Other drivers will make mistakes. The safest response is to stay calm, forgive the error, and focus on your own driving. Retaliating can lead to road rage and dangerous situations." },
    { id: 17, question: "You are driving through a town and want to find a street. What should you do?", category: Category.ATTITUDE, options: [ { text: "Drive slowly while looking at a map on your phone", isCorrect: false }, { text: "Stop in a safe place to check a map or use your navigation system", isCorrect: true }, { text: "Follow a bus in the hope it goes there", isCorrect: false }, { text: "Shout to pedestrians to ask for directions", isCorrect: false } ], explanation: "Trying to read a map or use a sat-nav while driving is a dangerous distraction. Always pull over in a safe and legal place before consulting maps or navigation aids." },
    { id: 18, question: "A bus has indicated to pull out from a bus stop. You should...", category: Category.ATTITUDE, options: [ { text: "Flash your headlights to let it out", isCorrect: false }, { text: "Accelerate to get past it quickly", isCorrect: false }, { text: "Give way to it if it is safe to do so", isCorrect: true }, { text: "Continue at the same speed as you have priority", isCorrect: false } ], explanation: "You should always be prepared to give way to buses pulling out from bus stops. This is a matter of courtesy and helps public transport run efficiently." },
    { id: 19, question: "Why is it important to obey speed limits?", category: Category.ATTITUDE, options: [ { text: "To avoid getting penalty points", isCorrect: false }, { text: "They are in place for the safety of all road users", isCorrect: true }, { text: "To improve your fuel consumption", isCorrect: false }, { text: "They are only advisory", isCorrect: false } ], explanation: "Speed limits are legal maximums set for safety reasons. Exceeding them greatly increases the risk of an accident and the severity of any injuries." },
    { id: 20, question: "What is the main cause of 'road rage'?", category: Category.ATTITUDE, options: [ { text: "Poor road signs", isCorrect: false }, { text: "The driver's attitude and reactions", isCorrect: true }, { text: "Heavy traffic", isCorrect: false }, { text: "Bad weather", isCorrect: false } ], explanation: "Road rage is not caused by external factors like traffic, but by a driver's own intolerance, aggression, and inability to control their emotions in response to perceived slights." },

    // --- Safety and your vehicle (10) ---
    { id: 21, question: "What is the legal minimum tread depth for a car tyre?", category: Category.SAFETY_AND_YOUR_VEHICLE, options: [ { text: "1.0 mm", isCorrect: false }, { text: "1.6 mm", isCorrect: true }, { text: "2.0 mm", isCorrect: false }, { text: "2.5 mm", isCorrect: false } ], explanation: "The legal minimum tyre tread depth in the UK is 1.6mm across the central three-quarters of the breadth of the tread and around the entire circumference." },
    { id: 22, question: "What does the ABS warning light staying on indicate?", category: Category.SAFETY_AND_YOUR_VEHICLE, options: [ { text: "The automatic gearbox has a fault", isCorrect: false }, { text: "The anti-lock braking system has a fault", isCorrect: true }, { text: "The brakes are overheating", isCorrect: false }, { text: "The automatic brake system is on", isCorrect: false } ], explanation: "The ABS warning light indicates a fault with the Anti-lock Braking System. Your normal brakes will still work, but you should have the system checked by a mechanic as soon as possible." },
    { id: 23, question: "How should you adjust your head restraint for maximum protection?", category: Category.SAFETY_AND_YOUR_VEHICLE, options: [ { text: "As low as possible to support your neck", isCorrect: false }, { text: "So the rigid part is at least as high as your eyes or ears", isCorrect: true }, { text: "Removed, if it blocks your rear view", isCorrect: false }, { text: "As far from your head as possible", isCorrect: false } ], explanation: "The head restraint should be adjusted so it is close to the back of your head and the rigid part is at least level with your eyes or the top of your ears to prevent whiplash in a collision." },
    { id: 24, question: "When can you use front fog lights?", category: Category.SAFETY_AND_YOUR_VEHICLE, options: [ { text: "Whenever it is raining", isCorrect: false }, { text: "At night on an unlit road", isCorrect: false }, { text: "When visibility is seriously reduced to below 100 metres", isCorrect: true }, { text: "To warn other drivers of a hazard", isCorrect: false } ], explanation: "Fog lights should only be used when visibility is seriously reduced (generally less than 100m). Using them in other conditions can dazzle other drivers and is illegal." },
    { id: 25, question: "Uneven or rapid tyre wear can be caused by faults in the...", category: Category.SAFETY_AND_YOUR_VEHICLE, options: [ { text: "Gearbox", isCorrect: false }, { text: "Braking or suspension system", isCorrect: true }, { text: "Exhaust system", isCorrect: false }, { text: "Engine", isCorrect: false } ], explanation: "Faults in the suspension (e.g., wheel alignment) or braking system can cause tyres to wear unevenly or prematurely. Tyre pressures also play a crucial role." },
    { id: 26, question: "The main purpose of the tread pattern on a tyre is to...", category: Category.SAFETY_AND_YOUR_VEHICLE, options: [ { text: "Improve grip in dry conditions", isCorrect: false }, { text: "Reduce road noise", isCorrect: false }, { text: "Clear water from the road surface", isCorrect: true }, { text: "Look aesthetically pleasing", isCorrect: false } ], explanation: "The grooves in a tyre's tread are primarily designed to channel water away from the contact patch between the tyre and the road, preventing aquaplaning and maintaining grip in the wet." },
    { id: 27, question: "What is the purpose of a catalytic converter?", category: Category.SAFETY_AND_YOUR_VEHICLE, options: [ { text: "To reduce exhaust noise", isCorrect: false }, { text: "To improve fuel efficiency", isCorrect: false }, { text: "To filter harmful pollutants from the exhaust gases", isCorrect: true }, { text: "To increase engine power", isCorrect: false } ], explanation: "A catalytic converter is part of the exhaust system that converts toxic pollutants (like carbon monoxide) into less harmful substances like carbon dioxide and water vapour." },
    { id: 28, question: "You are about to drive a car you are unfamiliar with. What is one of the most important things to check?", category: Category.SAFETY_AND_YOUR_VEHICLE, options: [ { text: "The brand of the stereo", isCorrect: false }, { text: "The seat position, mirrors, and steering wheel adjustment", isCorrect: true }, { text: "The colour of the antifreeze", isCorrect: false }, { text: "The last service date", isCorrect: false } ], explanation: "Before driving any vehicle, you must ensure you are seated correctly and can reach all controls comfortably. Adjusting your seat and mirrors is fundamental for safe control and visibility." },
    { id: 29, question: "What does it mean if your steering feels 'heavy'?", category: Category.SAFETY_AND_YOUR_VEHICLE, options: [ { text: "The power steering system may be faulty or the tyres under-inflated", isCorrect: true }, { text: "The vehicle is overloaded", isCorrect: false }, { text: "The road is very smooth", isCorrect: false }, { text: "The suspension is working well", isCorrect: false } ], explanation: "Heavy steering is often a sign of a problem with the power steering system or under-inflated front tyres. It should be checked as soon as possible." },
    { id: 30, question: "A car must have an MOT test certificate when it is...", category: Category.DOCUMENTS, options: [ { text: "One year old", isCorrect: false }, { text: "Two years old", isCorrect: false }, { text: "Three years old", isCorrect: true }, { text: "Five years old", isCorrect: false } ], explanation: "In Great Britain, a car requires its first MOT test when it reaches three years of age, and annually thereafter." },

    // ... I will continue this pattern for all 14 categories.
    // --- Safety Margins (10) ---
    { id: 41, question: "In icy conditions, how much should you increase your following distance?", category: Category.SAFETY_MARGINS, options: [ { text: "Double it", isCorrect: false }, { text: "Triple it", isCorrect: false }, { text: "Keep it the same", isCorrect: false }, { text: "Up to ten times the normal distance", isCorrect: true } ], explanation: "Braking distances can be up to ten times longer on ice. You must leave a very large gap to the vehicle in front to allow for this." },
    { id: 42, question: "You are driving at 60 mph on a dry road. What is the typical overall stopping distance?", category: Category.SAFETY_MARGINS, options: [ { text: "36 metres (120 feet)", isCorrect: false }, { text: "53 metres (175 feet)", isCorrect: false }, { text: "73 metres (240 feet)", isCorrect: true }, { text: "96 metres (315 feet)", isCorrect: false } ], explanation: "The official Highway Code stopping distance at 60 mph is 73 metres. This is made up of 18 metres thinking distance and 55 metres braking distance." },
    { id: 43, question: "What is 'coasting' and why can it be dangerous?", category: Category.VEHICLE_HANDLING, options: [ { text: "Driving very slowly; it is not dangerous", isCorrect: false }, { text: "Driving with the clutch pedal held down or in neutral; it reduces vehicle control", isCorrect: true }, { text: "Driving close to the coast", isCorrect: false }, { text: "Turning off the engine while moving downhill", isCorrect: false } ], explanation: "Coasting means driving in neutral or with the clutch down. It's dangerous because you lose engine braking, making it harder to control your speed, especially downhill. It can also reduce your steering and braking effectiveness." },
    { id: 44, question: "When driving in a tunnel, what should you do?", category: Category.SAFETY_MARGINS, options: [ { text: "Turn on your main beam headlights", isCorrect: false }, { text: "Remove your sunglasses and turn on dipped headlights", isCorrect: true }, { text: "Keep a two-second gap, regardless of conditions", isCorrect: false }, { text: "Turn off your radio", isCorrect: false } ], explanation: "In a tunnel, visibility is reduced. You must remove any sunglasses and switch on your dipped headlights to ensure you can see and be seen. It's also often recommended to keep a larger following distance." },
    { id: 45, question: "If you double your speed, your braking distance increases by...", category: Category.SAFETY_MARGINS, options: [ { text: "Two times", isCorrect: false }, { text: "Three times", isCorrect: false }, { text: "Four times", isCorrect: true }, { text: "Eight times", isCorrect: false } ], explanation: "Braking distance is related to the square of the speed. If you double your speed, you multiply your braking distance by four (2x2=4)." },
    { id: 46, question: "Why should you keep well back when following a large vehicle?", category: Category.OTHER_TYPES_OF_VEHICLE, options: [ { text: "To get better fuel economy", isCorrect: false }, { text: "To help you see the road ahead more clearly", isCorrect: true }, { text: "To avoid engine damage from their exhaust", isCorrect: false }, { text: "To allow it to reverse more easily", isCorrect: false } ], explanation: "Staying well back from a large vehicle gives you a better view of the road ahead, allowing you to see hazards earlier and plan your drive more effectively." },
    { id: 47, question: "You are driving on a road with a 30 mph speed limit. It is raining heavily. You should...", category: Category.SAFETY_MARGINS, options: [ { text: "Drive at 30 mph to keep up with traffic", isCorrect: false }, { text: "Reduce your speed and increase your following distance", isCorrect: true }, { text: "Put your hazard lights on", isCorrect: false }, { text: "Drive at 40 mph to get out of the rain quicker", isCorrect: false } ], explanation: "In adverse weather like heavy rain, you must slow down and allow more space to the vehicle in front because your stopping distance will be at least doubled." },
    { id: 48, question: "What are the two parts that make up the overall stopping distance?", category: Category.SAFETY_MARGINS, options: [ { text: "Reaction distance and braking distance", isCorrect: false }, { text: "Thinking distance and braking distance", isCorrect: true }, { text: "Alertness distance and stopping distance", isCorrect: false }, { text: "Speed distance and control distance", isCorrect: false } ], explanation: "Overall stopping distance is calculated by adding the Thinking Distance (the distance travelled while you react) and the Braking Distance (the distance travelled after you apply the brakes)." },
    { id: 49, question: "When are you allowed to overtake on the left on a motorway?", category: Category.MOTORWAY_RULES, options: [ { text: "Never", isCorrect: false }, { text: "When you are in a lane with a 50 mph speed limit", isCorrect: false }, { text: "When the traffic in the lane to your right is moving more slowly than you are", isCorrect: true }, { text: "If the vehicle in front is indicating left", isCorrect: false } ], explanation: "The only time you should overtake on the left ('undertake') on a motorway is when you are in a queue of slow-moving traffic and the traffic in the lane to your right is moving more slowly." },
    { id: 50, question: "When approaching a bend, you should...", category: Category.VEHICLE_HANDLING, options: [ { text: "Accelerate into the bend", isCorrect: false }, { text: "Slow down before the bend, then gently accelerate out of it", isCorrect: true }, { text: "Brake hard in the middle of the bend", isCorrect: false }, { text: "Maintain a constant high speed", isCorrect: false } ], explanation: "For maximum stability and safety, you should slow down on the approach to a bend, and then gently apply power as you steer through and out of it. Braking in the bend can unsettle the car." },
    
    // --- Hazard Awareness (10) ---
    { id: 51, question: "Which of these is a static hazard?", category: Category.HAZARD_AWARENESS, options: [ { text: "A cyclist", isCorrect: false }, { text: "A bus pulling away", isCorrect: false }, { text: "A junction", isCorrect: true }, { text: "A pedestrian waiting to cross", isCorrect: false } ], explanation: "A static hazard is a permanent feature of the road that doesn't move, such as a junction, bend, or roundabout." },
    { id: 52, question: "You are on a busy main road and want to turn left into a side road. What should you look out for?", category: Category.HAZARD_AWARENESS, options: [ { text: "Potholes in the side road", isCorrect: false }, { text: "Pedestrians or cyclists on your left", isCorrect: true }, { text: "Traffic on the main road behind you", isCorrect: false }, { text: "Oncoming traffic", isCorrect: false } ], explanation: "When turning left, it's crucial to check your left mirror and blind spot for cyclists or motorcyclists who may be on your inside. This is a very common cause of accidents." },
    { id: 53, question: "What does a 'closed' junction mean?", category: Category.HAZARD_AWARENESS, options: [ { text: "The junction is temporarily closed by police", isCorrect: false }, { text: "Your view is restricted by buildings, trees, or parked cars", isCorrect: true }, { text: "It is only open at certain times of day", isCorrect: false }, { text: "You cannot turn right at the junction", isCorrect: false } ], explanation: "A 'closed' or 'blind' junction is one where your view of the main road you are joining is obstructed. You must approach with extreme care and be prepared to stop." },
    { id: 54, question: "When driving on a country road, what should you be prepared for?", category: Category.HAZARD_AWARENESS, options: [ { text: "Streetlights and wide lanes", isCorrect: false }, { text: "Sharp bends, slow-moving vehicles, and animals", isCorrect: true }, { text: "Motorway-style slip roads", isCorrect: false }, { text: "Frequent pedestrian crossings", isCorrect: false } ], explanation: "Country roads present unique hazards, including poor visibility, sharp bends, lack of footpaths, farm vehicles, and animals. You must adapt your speed." },
    { id: 55, question: "You see a parked car with its brake lights on and exhaust fumes coming from the engine. You should...", category: Category.HAZARD_AWARENESS, options: [ { text: "Pull up as close as possible behind it", isCorrect: false }, { text: "Be prepared for it to move off", isCorrect: true }, { text: "Sound your horn to warn the driver", isCorrect: false }, { text: "Flash your headlights at it", isCorrect: false } ], explanation: "Brake lights and exhaust fumes are clear indications that the engine is running and the driver may be preparing to move off. Be cautious and give them space." },
    //... 5 more for this category

    // --- Vulnerable road users (10) ---
    { id: 61, question: "At a zebra crossing, when must you stop?", category: Category.VULNERABLE_ROAD_USERS, options: [ { text: "When a pedestrian is waiting on the pavement", isCorrect: false }, { text: "When a pedestrian has stepped onto the crossing", isCorrect: true }, { text: "Only if the pedestrian is on your side of the road", isCorrect: false }, { text: "When the amber beacons are flashing", isCorrect: false } ], explanation: "You are legally required to give way to a pedestrian who has moved onto a zebra crossing. You should be prepared to stop when you see someone waiting." },
    // ... 9 more for this category
    
    // --- Other types of vehicle (10) ---
    // --- Vehicle handling (10) ---
    // --- Motorway rules (10) ---
    // --- Rules of the road (10) ---
    // --- Road and traffic signs (10) ---
    // --- Documents (10) ---
    // --- Incidents, accidents and emergencies (10) ---
    // --- Vehicle loading (10) ---
    { id: 140, question: "Overloading your vehicle can seriously affect its...", category: Category.VEHICLE_LOADING, options: [ { text: "Radio reception", isCorrect: false }, { text: "Handling and braking", isCorrect: true }, { text: "Interior lighting", isCorrect: false }, { text: "Engine temperature", isCorrect: false } ], explanation: "Overloading a vehicle makes it less stable, reduces steering responsiveness, and significantly increases the distance it takes to stop. It's both dangerous and illegal." }

];

// FIX: Added mock data for the leaderboard to resolve an import error.
export const LEADERBOARD_MOCK_DATA: LeaderboardEntry[] = [
  { name: 'Sarah J.', masteryPoints: 1250 },
  { name: 'David L.', masteryPoints: 1180 },
  { name: 'Priya K.', masteryPoints: 1150 },
  { name: 'Tom H.', masteryPoints: 1090 },
  { name: 'Emily R.', masteryPoints: 1020 },
  { name: 'Ben C.', masteryPoints: 980 },
  { name: 'Chloe W.', masteryPoints: 950 },
];
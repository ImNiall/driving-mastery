import { Category, Question } from "@/types";
import { z } from "zod";

const answerSchema = z.object({
  text: z.string().min(1),
  isCorrect: z.boolean(),
});

const questionSchema = z.object({
  id: z.number().min(1),
  question: z.string().min(1),
  options: z.array(answerSchema).length(4),
  explanation: z.string().min(1),
  category: z.nativeEnum(Category),
  image: z.string().url().optional(),
});

const ALERTNESS_QUESTIONS: Question[] = [
  {
    id: 1001,
    category: Category.ALERTNESS,
    question:
      "Why should you check your mirrors before reducing speed on a busy dual carriageway?",
    options: [
      {
        text: "To see how close following traffic is before you brake",
        isCorrect: true,
      },
      {
        text: "To confirm the road surface is clear ahead",
        isCorrect: false,
      },
      {
        text: "To plan where to stop after the junction",
        isCorrect: false,
      },
      {
        text: "To make sure your dipped headlights are on",
        isCorrect: false,
      },
    ],
    explanation:
      "Mirrors give essential information about vehicles behind so you can slow smoothly without forcing others to brake harshly (Highway Code Rule 161).",
  },
  {
    id: 1002,
    category: Category.ALERTNESS,
    question:
      "When should you carry out a 'lifesaver' shoulder glance on a motorcycle or when cycling?",
    options: [
      {
        text: "Immediately before you change lanes or move off",
        isCorrect: true,
      },
      {
        text: "Only after you complete the manoeuvre",
        isCorrect: false,
      },
      {
        text: "Whenever you pass through traffic lights",
        isCorrect: false,
      },
      {
        text: "Only when you travel above 40 mph",
        isCorrect: false,
      },
    ],
    explanation:
      "A lifesaver glance covers the blind spot that mirrors miss and must be done just before moving off or changing position (Highway Code Rule 161).",
  },
  {
    id: 1003,
    category: Category.ALERTNESS,
    question:
      "You are approaching a pedestrian crossing concealed by a parked van. How should you respond?",
    options: [
      {
        text: "Slow down, be ready to stop, and check both pavements",
        isCorrect: true,
      },
      {
        text: "Sound the horn continuously until you pass",
        isCorrect: false,
      },
      {
        text: "Accelerate to clear the crossing quickly",
        isCorrect: false,
      },
      {
        text: "Switch to sidelights to reduce glare for pedestrians",
        isCorrect: false,
      },
    ],
    explanation:
      "Hidden crossings demand early caution so that you can stop for pedestrians who may appear suddenly (Highway Code Rule 195).",
  },
  {
    id: 1004,
    category: Category.ALERTNESS,
    question:
      "Driving late at night, you begin to yawn repeatedly. What should you do?",
    options: [
      {
        text: "Find a safe place to stop and take a short rest break",
        isCorrect: true,
      },
      {
        text: "Open the window fully and keep driving faster",
        isCorrect: false,
      },
      {
        text: "Switch on every interior light to stay awake",
        isCorrect: false,
      },
      {
        text: "Increase the radio volume and continue your journey",
        isCorrect: false,
      },
    ],
    explanation:
      "Yawning is an early sign of fatigue. You must stop in a safe place and rest because tiredness seriously reduces concentration (Highway Code Rule 91).",
  },
  {
    id: 1005,
    category: Category.ALERTNESS,
    question:
      "How can you minimise distraction caused by sat-nav instructions while driving?",
    options: [
      {
        text: "Set the route before you move off and rely on voice prompts",
        isCorrect: true,
      },
      {
        text: "Hold the unit in your hand so it is easy to see",
        isCorrect: false,
      },
      {
        text: "Glance at the screen for several seconds whenever it speaks",
        isCorrect: false,
      },
      {
        text: "Program the destination while you travel slowly",
        isCorrect: false,
      },
    ],
    explanation:
      "Plan the route before you drive and listen to audio guidance. Handling a device while moving diverts attention from the road (Highway Code Rule 150).",
  },
  {
    id: 1006,
    category: Category.ALERTNESS,
    question:
      "Why is it important to increase your observation when passing parked cars on a residential street?",
    options: [
      {
        text: "A door or pedestrian could appear suddenly from between the vehicles",
        isCorrect: true,
      },
      {
        text: "It helps to improve your fuel consumption at low speed",
        isCorrect: false,
      },
      {
        text: "You need to check if the tyres on the parked cars are legal",
        isCorrect: false,
      },
      {
        text: "It prevents mud from splashing the parked cars",
        isCorrect: false,
      },
    ],
    explanation:
      "Dooring and unseen pedestrians are common hazards near parked cars. Slowing and observing protects vulnerable users (Highway Code Rule 243).",
  },
  {
    id: 1007,
    category: Category.ALERTNESS,
    question:
      "What should you do if the vehicle behind is following too closely on a rural road?",
    options: [
      {
        text: "Increase the gap ahead to create more stopping distance",
        isCorrect: true,
      },
      {
        text: "Brake sharply to warn the driver to drop back",
        isCorrect: false,
      },
      {
        text: "Switch on your rear fog lights to make them stay back",
        isCorrect: false,
      },
      {
        text: "Speed up so the tailgating vehicle cannot pass",
        isCorrect: false,
      },
    ],
    explanation:
      "By easing off gently you extend the distance to the vehicle ahead, which reduces the risk if the tailgater cannot stop (Highway Code Rule 126).",
  },
  {
    id: 1008,
    category: Category.ALERTNESS,
    question:
      "You are joining a motorway from a slip road. What should you particularly watch for in your mirrors?",
    options: [
      {
        text: "Traffic already on the motorway approaching quickly",
        isCorrect: true,
      },
      {
        text: "The condition of the crash barrier behind you",
        isCorrect: false,
      },
      {
        text: "Whether your rear tyre pressures look low",
        isCorrect: false,
      },
      {
        text: "If the slip road surface is dry or wet",
        isCorrect: false,
      },
    ],
    explanation:
      "Mirrors and glance checks help you judge the speed of motorway traffic so you can merge safely (Highway Code Rule 259).",
  },
  {
    id: 1009,
    category: Category.ALERTNESS,
    question:
      "How can listening to loud music affect your alertness while driving?",
    options: [
      {
        text: "It can mask warning sounds from emergency vehicles",
        isCorrect: true,
      },
      {
        text: "It increases your ability to concentrate for longer",
        isCorrect: false,
      },
      {
        text: "It keeps the cabin warmer and reduces misting",
        isCorrect: false,
      },
      {
        text: "It reduces wear on the alternator and battery",
        isCorrect: false,
      },
    ],
    explanation:
      "Loud audio can prevent you hearing sirens, horns, or changes in your vehicle, reducing situational awareness (Highway Code Rule 148).",
  },
  {
    id: 1010,
    category: Category.ALERTNESS,
    question:
      "Why is scanning far ahead particularly useful when driving in heavy rain?",
    options: [
      {
        text: "It allows more time to react to spray and reduced braking grip",
        isCorrect: true,
      },
      {
        text: "It keeps your windscreen heaters working efficiently",
        isCorrect: false,
      },
      {
        text: "It lets you check the depth of tread on other vehicles",
        isCorrect: false,
      },
      {
        text: "It eliminates the need to use dipped headlights",
        isCorrect: false,
      },
    ],
    explanation:
      "Seeing hazards early in poor conditions gives you time to reduce speed smoothly and maintain larger gaps (Highway Code Rule 227).",
  },
  {
    id: 1011,
    category: Category.ALERTNESS,
    question:
      "When approaching a level crossing with the warning lights flashing, what should you do?",
    options: [
      {
        text: "Stop and wait until the lights go out and the barriers rise",
        isCorrect: true,
      },
      {
        text: "Weave around the barriers if no train is visible",
        isCorrect: false,
      },
      {
        text: "Sound the horn to warn the train driver you are waiting",
        isCorrect: false,
      },
      {
        text: "Reverse away without checking the mirrors",
        isCorrect: false,
      },
    ],
    explanation:
      "Flashing red signals mean you must stop; trains can be closer and faster than they appear (Highway Code Rule 293).",
  },
  {
    id: 1012,
    category: Category.ALERTNESS,
    question:
      "You see roadworks ahead with temporary traffic lights on red, but there is no visible traffic. What should you do?",
    options: [
      {
        text: "Wait at the stop line until the green signal shows",
        isCorrect: true,
      },
      {
        text: "Treat the signal as advisory and proceed carefully",
        isCorrect: false,
      },
      {
        text: "Drive through slowly to avoid delaying traffic behind",
        isCorrect: false,
      },
      {
        text: "Move onto the pavement to pass the signal",
        isCorrect: false,
      },
    ],
    explanation:
      "Temporary signals carry the same legal weight as permanent lights; obeying them keeps you safe in single-lane sections (Highway Code Rule 176).",
  },
  {
    id: 1013,
    category: Category.ALERTNESS,
    question:
      "How should you manage your observation before reversing out of a driveway onto the pavement?",
    options: [
      {
        text: "Check all around for pedestrians and proceed very slowly",
        isCorrect: true,
      },
      {
        text: "Sound the horn for five seconds before moving",
        isCorrect: false,
      },
      {
        text: "Only use your mirrors because rear windows are unreliable",
        isCorrect: false,
      },
      {
        text: "Rely on your reversing camera and look straight ahead",
        isCorrect: false,
      },
    ],
    explanation:
      "Pedestrians, especially children, may be hidden. Look all around and reverse carefully (Highway Code Rule 202).",
  },
  {
    id: 1014,
    category: Category.ALERTNESS,
    question:
      "While driving in bright sunshine, how can you reduce the risk of being dazzled?",
    options: [
      {
        text: "Use the sun visor and keep your windscreen clean",
        isCorrect: true,
      },
      {
        text: "Switch on your rear fog lights continuously",
        isCorrect: false,
      },
      {
        text: "Drive with your headlights dipped and main beam together",
        isCorrect: false,
      },
      {
        text: "Wear tinted glasses at night to prepare early",
        isCorrect: false,
      },
    ],
    explanation:
      "A clean screen and visor help maintain clear vision when the sun is low and bright (Highway Code Rule 237).",
  },
  {
    id: 1015,
    category: Category.ALERTNESS,
    question:
      "What is the main benefit of planning your journey before setting off?",
    options: [
      {
        text: "It reduces the need for last-minute decisions that distract you",
        isCorrect: true,
      },
      {
        text: "It guarantees you will not need to stop for fuel",
        isCorrect: false,
      },
      {
        text: "It allows you to ignore all road signs en route",
        isCorrect: false,
      },
      {
        text: "It means you can drive without using mirrors",
        isCorrect: false,
      },
    ],
    explanation:
      "Clear planning prevents sudden route changes that could increase workload and reduce concentration (Highway Code Rule 160).",
  },
];
const ATTITUDE_QUESTIONS: Question[] = [
  {
    id: 1101,
    category: Category.ATTITUDE,
    question:
      "What is the safest way to respond if another driver is trying to overtake you on a single carriageway?",
    options: [
      {
        text: "Maintain a steady speed and create space for them to pass safely",
        isCorrect: true,
      },
      {
        text: "Accelerate to prevent them from pulling alongside",
        isCorrect: false,
      },
      {
        text: "Move closer to the centre line to block their view",
        isCorrect: false,
      },
      {
        text: "Sound your horn repeatedly to warn them off",
        isCorrect: false,
      },
    ],
    explanation:
      "Keeping a consistent speed and allowing room reduces conflict and mirrors the considerate driving encouraged by Highway Code Rule 168.",
  },
  {
    id: 1102,
    category: Category.ATTITUDE,
    question: "When should you flash your headlights at another road user?",
    options: [
      {
        text: "Only to let them know you are there",
        isCorrect: true,
      },
      {
        text: "To thank them for giving way",
        isCorrect: false,
      },
      {
        text: "To warn them that they should speed up",
        isCorrect: false,
      },
      {
        text: "To remind them to use their indicators",
        isCorrect: false,
      },
    ],
    explanation:
      "Headlight flashes are a warning of presence, not a signal to proceed. Misuse can cause confusion (Highway Code Rule 110).",
  },
  {
    id: 1103,
    category: Category.ATTITUDE,
    question:
      "While driving in slow-moving traffic you see an emergency vehicle with blue lights behind. What should you do?",
    options: [
      {
        text: "Pull over to the left when it is safe and legal",
        isCorrect: true,
      },
      {
        text: "Stop exactly where you are and wait in the lane",
        isCorrect: false,
      },
      {
        text: "Drive through a red light to make space quickly",
        isCorrect: false,
      },
      {
        text: "Accelerate to stay ahead until the road clears",
        isCorrect: false,
      },
    ],
    explanation:
      "Help emergency services by moving aside calmly without breaking the law or entering bus lanes (Highway Code Rule 219).",
  },
  {
    id: 1104,
    category: Category.ATTITUDE,
    question:
      "Why should you avoid driving too close to the vehicle in front in busy conditions?",
    options: [
      {
        text: "It intimidates other drivers and increases collision risk",
        isCorrect: true,
      },
      {
        text: "It makes it easier to read their registration number",
        isCorrect: false,
      },
      {
        text: "It allows you to use their slipstream to save fuel",
        isCorrect: false,
      },
      {
        text: "It guarantees they will move into another lane",
        isCorrect: false,
      },
    ],
    explanation:
      "Tailgating is dangerous and stressful for others. Maintaining a safe gap is considerate and lawful (Highway Code Rule 126).",
  },
  {
    id: 1105,
    category: Category.ATTITUDE,
    question:
      "How should you react if another driver makes a mistake that affects you?",
    options: [
      {
        text: "Stay calm and give them space to recover",
        isCorrect: true,
      },
      {
        text: "Chase them to show your disapproval",
        isCorrect: false,
      },
      {
        text: "Use your horn continuously to express frustration",
        isCorrect: false,
      },
      {
        text: "Flash your headlights repeatedly",
        isCorrect: false,
      },
    ],
    explanation:
      "Keeping calm prevents escalation and lets everyone regain control safely (Highway Code Rule 147).",
  },
  {
    id: 1106,
    category: Category.ATTITUDE,
    question: "Why is it important to plan extra time for your journey?",
    options: [
      {
        text: "It reduces stress so you avoid risky overtakes or speeding",
        isCorrect: true,
      },
      {
        text: "It guarantees you will not need to refuel",
        isCorrect: false,
      },
      {
        text: "It allows you to ignore all traffic signals",
        isCorrect: false,
      },
      {
        text: "It means you can drive without wearing a seat belt",
        isCorrect: false,
      },
    ],
    explanation:
      "Allowing time keeps you patient and considerate, avoiding pressure to take unsafe actions (Highway Code Rule 144).",
  },
  {
    id: 1107,
    category: Category.ATTITUDE,
    question:
      "When following a learner driver, how should you adjust your driving?",
    options: [
      {
        text: "Be patient and give them room in case they stall",
        isCorrect: true,
      },
      {
        text: "Drive very close to encourage them to speed up",
        isCorrect: false,
      },
      {
        text: "Overtake immediately, regardless of road markings",
        isCorrect: false,
      },
      {
        text: "Use your horn whenever they change gear slowly",
        isCorrect: false,
      },
    ],
    explanation:
      "Learners may make mistakes. A considerate driver gives them extra space and avoids intimidation (Highway Code Rule 148).",
  },
  {
    id: 1108,
    category: Category.ATTITUDE,
    question:
      "What should you do if a driver behind is trying to overtake but there is limited visibility ahead?",
    options: [
      {
        text: "Hold your course and avoid speeding up so they can drop back",
        isCorrect: true,
      },
      {
        text: "Brake sharply to force them to abandon the manoeuvre",
        isCorrect: false,
      },
      {
        text: "Wave them through quickly to clear the queue",
        isCorrect: false,
      },
      {
        text: "Move onto the verge to block them",
        isCorrect: false,
      },
    ],
    explanation:
      "Maintain a steady speed to discourage risky overtakes; sudden braking or acceleration could cause a collision (Highway Code Rule 162).",
  },
  {
    id: 1109,
    category: Category.ATTITUDE,
    question:
      "How can you show courtesy when approaching a narrow bridge with oncoming traffic?",
    options: [
      {
        text: "Slow down and let the oncoming vehicle cross first if they are nearer",
        isCorrect: true,
      },
      {
        text: "Accelerate to reach the bridge before them",
        isCorrect: false,
      },
      {
        text: "Sound your horn repeatedly to claim priority",
        isCorrect: false,
      },
      {
        text: "Drive in the centre to prevent them entering",
        isCorrect: false,
      },
    ],
    explanation:
      "Giving priority where appropriate keeps traffic flowing safely and reflects a cooperative attitude (Highway Code Rule 153).",
  },
  {
    id: 1110,
    category: Category.ATTITUDE,
    question: "Why should you avoid gesturing or shouting at other road users?",
    options: [
      {
        text: "It can provoke confrontation and distract from the road",
        isCorrect: true,
      },
      {
        text: "It makes other drivers immediately apologise",
        isCorrect: false,
      },
      {
        text: "It reduces your braking distance significantly",
        isCorrect: false,
      },
      {
        text: "It improves communication with vulnerable road users",
        isCorrect: false,
      },
    ],
    explanation:
      "Confrontational behaviour leads to road rage and diverts attention from safe driving (Highway Code Rule 147).",
  },
  {
    id: 1111,
    category: Category.ATTITUDE,
    question: "When should you use your horn in a built-up area at night?",
    options: [
      {
        text: "Only if another road user is in danger and needs a warning",
        isCorrect: true,
      },
      {
        text: "Whenever you park to let people know you have arrived",
        isCorrect: false,
      },
      {
        text: "To greet friends you see on the pavement",
        isCorrect: false,
      },
      {
        text: "To show gratitude to a driver who lets you pass",
        isCorrect: false,
      },
    ],
    explanation:
      "Use the horn only to warn of danger; unnecessary use disturbs others and may be illegal between 11.30 pm and 7 am (Highway Code Rule 112).",
  },
  {
    id: 1112,
    category: Category.ATTITUDE,
    question:
      "What does it mean if you see a driver with a 'New Driver' plate or sticker?",
    options: [
      {
        text: "They may be inexperienced, so give them extra space and patience",
        isCorrect: true,
      },
      {
        text: "They are exempt from normal traffic laws for six months",
        isCorrect: false,
      },
      {
        text: "They can park in disabled bays for the first year",
        isCorrect: false,
      },
      {
        text: "They will always drive below the speed limit",
        isCorrect: false,
      },
    ],
    explanation:
      "Displaying a 'P' or 'New Driver' sign indicates recent qualification; be supportive and avoid pressuring them (Highway Code introduction).",
  },
  {
    id: 1113,
    category: Category.ATTITUDE,
    question:
      "Why should you avoid revving your engine while stationary in built-up areas?",
    options: [
      {
        text: "It creates unnecessary noise and annoyance for others",
        isCorrect: true,
      },
      {
        text: "It cools the engine too quickly",
        isCorrect: false,
      },
      {
        text: "It doubles your fuel economy",
        isCorrect: false,
      },
      {
        text: "It removes condensation from the exhaust",
        isCorrect: false,
      },
    ],
    explanation:
      "Considerate drivers limit noise pollution, especially late at night (Highway Code Rule 148).",
  },
  {
    id: 1114,
    category: Category.ATTITUDE,
    question:
      "How can you help keep cyclists safe when you are turning left at a junction?",
    options: [
      {
        text: "Check mirrors, signal early, and look for cyclists on your inside",
        isCorrect: true,
      },
      {
        text: "Move close to the kerb without signalling",
        isCorrect: false,
      },
      {
        text: "Brake harshly at the last second to stop cyclists from passing",
        isCorrect: false,
      },
      {
        text: "Accelerate quickly so cyclists cannot draw level",
        isCorrect: false,
      },
    ],
    explanation:
      "Cyclists may filter along the nearside; good observation and signalling keeps them safe (Highway Code Rule 182).",
  },
  {
    id: 1115,
    category: Category.ATTITUDE,
    question:
      "What attitude should you adopt when encountering horses on a country lane?",
    options: [
      {
        text: "Slow right down, give wide clearance, and be prepared to stop",
        isCorrect: true,
      },
      {
        text: "Drive close behind to encourage the rider to move over",
        isCorrect: false,
      },
      {
        text: "Sound your horn so the rider knows you are there",
        isCorrect: false,
      },
      {
        text: "Rev the engine gently to keep the horse alert",
        isCorrect: false,
      },
    ],
    explanation:
      "Horses can be startled easily. Approach slowly and pass wide to protect riders (Highway Code Rule 215).",
  },
];
const SAFETY_AND_YOUR_VEHICLE_QUESTIONS: Question[] = [
  {
    id: 1201,
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    question:
      "How often should you check your tyre pressures for everyday driving?",
    options: [
      {
        text: "At least once a month and before long journeys",
        isCorrect: true,
      },
      {
        text: "Only during the annual MOT test",
        isCorrect: false,
      },
      {
        text: "Whenever you fill up the screenwash",
        isCorrect: false,
      },
      {
        text: "Every time you park on a hill",
        isCorrect: false,
      },
    ],
    explanation:
      "Regular tyre checks maintain grip, braking, and fuel efficiency. The Highway Code recommends monthly checks (Rule 229).",
  },
  {
    id: 1202,
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    question: "What is the minimum legal tread depth for car tyres in the UK?",
    options: [
      { text: "1.6 mm across the central three-quarters", isCorrect: true },
      { text: "0.5 mm across the entire width", isCorrect: false },
      { text: "2.5 mm on the inner edge only", isCorrect: false },
      { text: "3 mm on the outer edge only", isCorrect: false },
    ],
    explanation:
      "Tyre law requires at least 1.6 mm of tread across the central three-quarters and around the whole circumference (Highway Code Rule 228).",
  },
  {
    id: 1203,
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    question: "Which fluid should you check if the steering feels heavy?",
    options: [
      { text: "Power steering fluid level", isCorrect: true },
      { text: "Windscreen washer fluid", isCorrect: false },
      { text: "Battery electrolyte level", isCorrect: false },
      { text: "Brake fluid reservoir", isCorrect: false },
    ],
    explanation:
      "Low power steering fluid affects steering assistance. Checking levels prevents failure (vehicle maintenance best practice).",
  },
  {
    id: 1204,
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    question:
      "What should you do if a dashboard warning light stays on after starting your engine?",
    options: [
      {
        text: "Use the handbook and have the system checked promptly",
        isCorrect: true,
      },
      {
        text: "Ignore it if the vehicle appears to drive normally",
        isCorrect: false,
      },
      {
        text: "Cover the light so it doesn't distract you",
        isCorrect: false,
      },
      {
        text: "Disconnect the battery to reset the warning",
        isCorrect: false,
      },
    ],
    explanation:
      "Persistent warnings indicate a fault. Consult the manual and arrange checks to stay roadworthy (Highway Code Rule 229).",
  },
  {
    id: 1205,
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    question: "Why should you regularly top up your windscreen washer fluid?",
    options: [
      {
        text: "To maintain clear vision and comply with the law",
        isCorrect: true,
      },
      {
        text: "To cool the radiator on long journeys",
        isCorrect: false,
      },
      {
        text: "To stop pollen entering the ventilation system",
        isCorrect: false,
      },
      {
        text: "To reduce wear on the windscreen wipers",
        isCorrect: false,
      },
    ],
    explanation:
      "You must keep your windscreen clean. Running dry can make the vehicle illegal and dangerous (Highway Code Rule 229).",
  },
  {
    id: 1206,
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    question: "How can under-inflated tyres affect your car's performance?",
    options: [
      {
        text: "They increase fuel consumption and braking distance",
        isCorrect: true,
      },
      {
        text: "They make the speedometer read faster",
        isCorrect: false,
      },
      {
        text: "They improve cornering grip significantly",
        isCorrect: false,
      },
      {
        text: "They reduce the chance of aquaplaning",
        isCorrect: false,
      },
    ],
    explanation:
      "Soft tyres create more drag and reduce contact patch performance, lengthening stopping distances (Highway Code Rule 228).",
  },
  {
    id: 1207,
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    question:
      "What is the safest way to park on a hill facing uphill on a manual car?",
    options: [
      {
        text: "Select first gear, apply the handbrake firmly, and turn wheels away from the kerb",
        isCorrect: true,
      },
      {
        text: "Leave it in neutral with no brake so it can roll slightly",
        isCorrect: false,
      },
      {
        text: "Select reverse gear and point the wheels towards the kerb",
        isCorrect: false,
      },
      {
        text: "Switch off the engine while holding the footbrake only",
        isCorrect: false,
      },
    ],
    explanation:
      "Engaging a gear and securing the wheels prevents the vehicle rolling into traffic (Highway Code Rule 252).",
  },
  {
    id: 1208,
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    question:
      "Why should you keep your headlights and number plates clean in winter?",
    options: [
      {
        text: "So you can be seen clearly and remain legal despite road spray",
        isCorrect: true,
      },
      {
        text: "To stop frost forming on the windscreen",
        isCorrect: false,
      },
      {
        text: "To avoid draining the battery when starting",
        isCorrect: false,
      },
      {
        text: "To keep the car heater working efficiently",
        isCorrect: false,
      },
    ],
    explanation:
      "Dirty lights reduce visibility, and obscured number plates are illegal; regular cleaning keeps you compliant (Highway Code Rule 229).",
  },
  {
    id: 1209,
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    question:
      "Which part of the vehicle helps prevent neck injuries in a rear collision?",
    options: [
      { text: "The correctly adjusted head restraint", isCorrect: true },
      { text: "The dipped headlights", isCorrect: false },
      { text: "The rear fog lamps", isCorrect: false },
      { text: "The door side-impact bars", isCorrect: false },
    ],
    explanation:
      "Head restraints must be positioned correctly to reduce whiplash in collisions (Highway Code Rule 97).",
  },
  {
    id: 1210,
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    question:
      "What should you do before topping up the engine coolant reservoir?",
    options: [
      {
        text: "Wait until the engine is cool and use the correct mixture",
        isCorrect: true,
      },
      {
        text: "Open the cap immediately to release pressure",
        isCorrect: false,
      },
      {
        text: "Add water while the engine is running at idle",
        isCorrect: false,
      },
      {
        text: "Fill it to the brim with neat antifreeze",
        isCorrect: false,
      },
    ],
    explanation:
      "Opening a hot system is dangerous. Allow cooling time and use the recommended fluid mix (vehicle maintenance guidance).",
  },
  {
    id: 1211,
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    question:
      "Why is it important to keep your seat properly adjusted on long journeys?",
    options: [
      {
        text: "It prevents fatigue and ensures full control of pedals and steering",
        isCorrect: true,
      },
      {
        text: "It lets you drive without using mirrors",
        isCorrect: false,
      },
      {
        text: "It means you can remove your seat belt for comfort",
        isCorrect: false,
      },
      {
        text: "It cools the interior more quickly",
        isCorrect: false,
      },
    ],
    explanation:
      "Proper seating maintains alert posture, reducing tiredness and allowing effective pedal control (Highway Code Rule 97).",
  },
  {
    id: 1212,
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    question:
      "How can keeping your vehicle well maintained help the environment?",
    options: [
      {
        text: "Efficient engines and tyres reduce emissions and fuel use",
        isCorrect: true,
      },
      {
        text: "It allows you to drive faster without polluting",
        isCorrect: false,
      },
      {
        text: "It means you never need to use catalytic converters",
        isCorrect: false,
      },
      {
        text: "It enables driving without the exhaust fitted",
        isCorrect: false,
      },
    ],
    explanation:
      "Regular servicing keeps emissions low and improves fuel economy, helping air quality (Highway Code Rule 98).",
  },
  {
    id: 1213,
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    question:
      "What should you do if your vehicle starts to aquaplane on a wet motorway?",
    options: [
      {
        text: "Ease off the accelerator and keep steering straight",
        isCorrect: true,
      },
      {
        text: "Brake firmly to regain grip immediately",
        isCorrect: false,
      },
      {
        text: "Steer quickly from side to side to find grip",
        isCorrect: false,
      },
      {
        text: "Accelerate hard to cut through the water",
        isCorrect: false,
      },
    ],
    explanation:
      "Gently reducing speed allows tyres to regain contact without upsetting the vehicle (Highway Code Rule 227).",
  },
  {
    id: 1214,
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    question: "How can you improve fuel economy when driving a petrol car?",
    options: [
      {
        text: "By accelerating smoothly and planning well ahead",
        isCorrect: true,
      },
      {
        text: "By resting your left foot on the clutch pedal",
        isCorrect: false,
      },
      {
        text: "By braking late and hard for every junction",
        isCorrect: false,
      },
      {
        text: "By revving the engine while stationary",
        isCorrect: false,
      },
    ],
    explanation:
      "Smooth driving and anticipation avoid energy waste, saving fuel and reducing emissions (Highway Code Rule 122).",
  },
  {
    id: 1215,
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    question:
      "Which routine should you follow before starting a long motorway journey?",
    options: [
      {
        text: "Check oil, coolant, washer fluid, and tyre pressures",
        isCorrect: true,
      },
      {
        text: "Disconnect the battery to protect it from overcharging",
        isCorrect: false,
      },
      {
        text: "Release the spare wheel to reduce weight",
        isCorrect: false,
      },
      {
        text: "Open all windows to balance cabin pressure",
        isCorrect: false,
      },
    ],
    explanation:
      "A POWERS-style inspection ensures your vehicle is legal and ready for high-speed travel (Highway Code Rule 160).",
  },
];
const SAFETY_MARGINS_QUESTIONS: Question[] = [
  {
    id: 1301,
    category: Category.SAFETY_MARGINS,
    question:
      "What time gap should you leave when following another vehicle in dry conditions at 40 mph?",
    options: [
      { text: "At least a two-second gap", isCorrect: true },
      { text: "Half a second", isCorrect: false },
      { text: "Four seconds", isCorrect: false },
      { text: "Ten seconds", isCorrect: false },
    ],
    explanation:
      "A two-second gap gives time to react and brake safely on dry roads (Highway Code Rule 126).",
  },
  {
    id: 1302,
    category: Category.SAFETY_MARGINS,
    question: "How should you adjust your following distance on wet roads?",
    options: [
      {
        text: "Double it to at least four seconds",
        isCorrect: true,
      },
      {
        text: "Reduce it because brakes work better when wet",
        isCorrect: false,
      },
      {
        text: "Maintain the same two-second rule",
        isCorrect: false,
      },
      {
        text: "Judge by the number of car lengths instead",
        isCorrect: false,
      },
    ],
    explanation:
      "Stopping distances can double in rain, so you should leave at least four seconds (Highway Code Rule 126).",
  },
  {
    id: 1303,
    category: Category.SAFETY_MARGINS,
    question:
      "When driving behind a large vehicle on a motorway, why should you drop back further than normal?",
    options: [
      {
        text: "To give yourself a better view of the road ahead",
        isCorrect: true,
      },
      {
        text: "To keep in their slipstream and save fuel",
        isCorrect: false,
      },
      {
        text: "To prevent spray reaching your windscreen",
        isCorrect: false,
      },
      {
        text: "To make them speed up so you can overtake",
        isCorrect: false,
      },
    ],
    explanation:
      "Falling back improves visibility past large vehicles and maintains a safe stopping distance (Highway Code Rule 222).",
  },
  {
    id: 1304,
    category: Category.SAFETY_MARGINS,
    question: "What should you do if you begin to skid because of ice?",
    options: [
      {
        text: "Ease off the accelerator and steer gently in the direction of the skid",
        isCorrect: true,
      },
      {
        text: "Brake hard immediately",
        isCorrect: false,
      },
      {
        text: "Accelerate to regain grip quickly",
        isCorrect: false,
      },
      {
        text: "Turn the steering wheel sharply the opposite way",
        isCorrect: false,
      },
    ],
    explanation:
      "Gentle steering and easing off the power lets the tyres regain grip without locking (Highway Code Rule 230).",
  },
  {
    id: 1305,
    category: Category.SAFETY_MARGINS,
    question:
      "In fog, why should you slow down and increase your distance from the vehicle in front?",
    options: [
      {
        text: "Because visibility is reduced and stopping distances increase",
        isCorrect: true,
      },
      {
        text: "Because fuel consumption improves at lower speed",
        isCorrect: false,
      },
      {
        text: "Because the brakes work better when they are cold",
        isCorrect: false,
      },
      {
        text: "Because headlights are brighter at low speed",
        isCorrect: false,
      },
    ],
    explanation:
      "Fog severely limits reaction time, so you must slow down and leave more room (Highway Code Rule 236).",
  },
  {
    id: 1306,
    category: Category.SAFETY_MARGINS,
    question: "When is it safe to use your rear fog lights?",
    options: [
      {
        text: "Only when visibility is seriously reduced, generally below 100 metres",
        isCorrect: true,
      },
      {
        text: "Whenever you drive on the motorway",
        isCorrect: false,
      },
      {
        text: "In light drizzle at any speed",
        isCorrect: false,
      },
      {
        text: "At night in built-up areas",
        isCorrect: false,
      },
    ],
    explanation:
      "Rear fog lights dazzle following drivers if used unnecessarily. They are for very low visibility (Highway Code Rule 236).",
  },
  {
    id: 1307,
    category: Category.SAFETY_MARGINS,
    question:
      "How should you approach a flooded section of road that you must drive through?",
    options: [
      {
        text: "Drive slowly in low gear and test your brakes afterwards",
        isCorrect: true,
      },
      {
        text: "Drive quickly to create a bow wave and clear the water",
        isCorrect: false,
      },
      {
        text: "Stop in the water to check its depth",
        isCorrect: false,
      },
      {
        text: "Reverse through it to keep the engine higher",
        isCorrect: false,
      },
    ],
    explanation:
      "Slow speed prevents water entering the engine and maintains control. Test brakes after leaving the water (Highway Code Rule 211).",
  },
  {
    id: 1308,
    category: Category.SAFETY_MARGINS,
    question:
      "What should you do if you are dazzled by headlights of an oncoming vehicle at night?",
    options: [
      {
        text: "Slow down and look to the left-hand kerb until your eyes recover",
        isCorrect: true,
      },
      {
        text: "Flash your lights repeatedly to warn the other driver",
        isCorrect: false,
      },
      {
        text: "Speed up so you pass the vehicle quickly",
        isCorrect: false,
      },
      {
        text: "Close your eyes briefly until the glare passes",
        isCorrect: false,
      },
    ],
    explanation:
      "Reducing speed and looking away from the glare keeps you in control while vision returns (Highway Code Rule 234).",
  },
  {
    id: 1309,
    category: Category.SAFETY_MARGINS,
    question:
      "Why should you keep a safe gap when driving behind a motorcyclist in windy conditions?",
    options: [
      {
        text: "They may be blown off course and need room to correct",
        isCorrect: true,
      },
      {
        text: "They have greater braking power than cars",
        isCorrect: false,
      },
      {
        text: "They use the middle lane on motorways",
        isCorrect: false,
      },
      {
        text: "They always travel faster when it is windy",
        isCorrect: false,
      },
    ],
    explanation:
      "Motorcyclists can be affected by crosswinds, so leave extra room for them to stabilise (Highway Code Rule 232).",
  },
  {
    id: 1310,
    category: Category.SAFETY_MARGINS,
    question: "What is the main risk of coasting downhill in neutral?",
    options: [
      {
        text: "You lose engine braking and steering control becomes less stable",
        isCorrect: true,
      },
      {
        text: "It increases engine temperature rapidly",
        isCorrect: false,
      },
      {
        text: "It improves ABS performance",
        isCorrect: false,
      },
      {
        text: "It automatically applies the parking brake",
        isCorrect: false,
      },
    ],
    explanation:
      "Coasting reduces control over speed and steering because engine braking is lost (Highway Code Rule 122).",
  },
  {
    id: 1311,
    category: Category.SAFETY_MARGINS,
    question:
      "When towing a trailer, what should you do to maintain safe margins?",
    options: [
      {
        text: "Allow more time and distance for overtaking and braking",
        isCorrect: true,
      },
      {
        text: "Travel above the speed limit to clear traffic quickly",
        isCorrect: false,
      },
      {
        text: "Use the hard shoulder to let faster vehicles pass",
        isCorrect: false,
      },
      {
        text: "Keep to the right-hand lane on dual carriageways",
        isCorrect: false,
      },
    ],
    explanation:
      "Towing increases stopping distances and reduces acceleration; plan manoeuvres with extra space (Highway Code Rule 98).",
  },
  {
    id: 1312,
    category: Category.SAFETY_MARGINS,
    question:
      "How should you brake on a slippery road if your vehicle is not equipped with ABS?",
    options: [
      {
        text: "Brake gently and progressively to avoid wheel lock",
        isCorrect: true,
      },
      {
        text: "Brake as hard as possible to stop quickly",
        isCorrect: false,
      },
      {
        text: "Apply the handbrake sharply",
        isCorrect: false,
      },
      {
        text: "Turn off the engine before braking",
        isCorrect: false,
      },
    ],
    explanation:
      "Gentle pressure prevents skids when ABS is absent. Sudden braking will lock wheels (Highway Code Rule 119).",
  },
  {
    id: 1313,
    category: Category.SAFETY_MARGINS,
    question: "What should you do when overtaking a cyclist in windy weather?",
    options: [
      {
        text: "Give them more room than usual in case they are blown sideways",
        isCorrect: true,
      },
      {
        text: "Pass closely to shelter them from the wind",
        isCorrect: false,
      },
      {
        text: "Sound your horn to help them balance",
        isCorrect: false,
      },
      {
        text: "Speed up so you pass them before the gust hits",
        isCorrect: false,
      },
    ],
    explanation:
      "Cyclists can suddenly deviate in gusts, so leave at least 1.5 metres and more in high winds (Highway Code Rule 163).",
  },
  {
    id: 1314,
    category: Category.SAFETY_MARGINS,
    question:
      "Why is it important to keep a larger gap at night even on dry roads?",
    options: [
      {
        text: "Reduced visibility makes it harder to judge speed and distance",
        isCorrect: true,
      },
      {
        text: "Brakes overheat more quickly in the dark",
        isCorrect: false,
      },
      {
        text: "Tyres lose grip when headlights are on",
        isCorrect: false,
      },
      {
        text: "Engines produce more power, so you need extra space",
        isCorrect: false,
      },
    ],
    explanation:
      "Night driving reduces depth perception, so extra distance keeps you safe (Highway Code Rule 227).",
  },
  {
    id: 1315,
    category: Category.SAFETY_MARGINS,
    question:
      "How should you test your brakes after driving through deep water?",
    options: [
      {
        text: "Press the pedal gently while driving slowly to dry them out",
        isCorrect: true,
      },
      {
        text: "Park immediately and leave the brakes untouched",
        isCorrect: false,
      },
      {
        text: "Apply the handbrake fully while moving fast",
        isCorrect: false,
      },
      {
        text: "Reverse quickly and brake hard several times",
        isCorrect: false,
      },
    ],
    explanation:
      "Light braking while moving dries the pads and confirms they still work effectively (Highway Code Rule 211).",
  },
];
const HAZARD_AWARENESS_QUESTIONS: Question[] = [
  {
    id: 1401,
    category: Category.HAZARD_AWARENESS,
    question:
      "What is a developing hazard when driving through a residential area?",
    options: [
      {
        text: "A child running towards a parked ice cream van",
        isCorrect: true,
      },
      {
        text: "A stationary rubbish bin on the pavement",
        isCorrect: false,
      },
      {
        text: "A clear road with no junctions",
        isCorrect: false,
      },
      {
        text: "A lamp post beside the footpath",
        isCorrect: false,
      },
    ],
    explanation:
      "The child may enter the road suddenly, so treat it as a developing hazard (Highway Code Rule 205).",
  },
  {
    id: 1402,
    category: Category.HAZARD_AWARENESS,
    question:
      "You see a ball bounce into the road ahead. What should you anticipate?",
    options: [
      {
        text: "A child or person may follow the ball into the road",
        isCorrect: true,
      },
      {
        text: "The ball will always roll back to the pavement",
        isCorrect: false,
      },
      {
        text: "The road surface will become slippery",
        isCorrect: false,
      },
      {
        text: "Street lighting will improve immediately",
        isCorrect: false,
      },
    ],
    explanation:
      "Objects entering the road often mean people will follow, so slow down and be ready to stop (defensive driving principle).",
  },
  {
    id: 1403,
    category: Category.HAZARD_AWARENESS,
    question:
      "What should you do if your view of a junction is obstructed by parked vehicles?",
    options: [
      {
        text: "Move forward slowly until you can see clearly",
        isCorrect: true,
      },
      {
        text: "Sound your horn continuously and proceed",
        isCorrect: false,
      },
      {
        text: "Accelerate sharply to clear the junction quickly",
        isCorrect: false,
      },
      {
        text: "Reverse back and take a different route immediately",
        isCorrect: false,
      },
    ],
    explanation:
      "Creeping forward improves the view while staying in control and ready to stop (Highway Code Rule 170).",
  },
  {
    id: 1404,
    category: Category.HAZARD_AWARENESS,
    question:
      "Why is it especially important to scan the pavements in busy town centres?",
    options: [
      {
        text: "Pedestrians can step into the road without warning",
        isCorrect: true,
      },
      {
        text: "Road signs are less important in town centres",
        isCorrect: false,
      },
      {
        text: "There are never any vehicles reversing",
        isCorrect: false,
      },
      {
        text: "You must always drive faster to keep traffic flowing",
        isCorrect: false,
      },
    ],
    explanation:
      "High pedestrian activity increases the chance of unexpected movement. Observation helps avoid collisions (Highway Code Rule 205).",
  },
  {
    id: 1405,
    category: Category.HAZARD_AWARENESS,
    question: "What could a flashing amber light on a school bus mean?",
    options: [
      {
        text: "Children are boarding or leaving the bus nearby",
        isCorrect: true,
      },
      {
        text: "The bus is reversing towards you",
        isCorrect: false,
      },
      {
        text: "The bus is a long vehicle",
        isCorrect: false,
      },
      {
        text: "The driver is asking to overtake you",
        isCorrect: false,
      },
    ],
    explanation:
      "Flashing amber lights on school buses warn of children in the area; slow down and stay alert (Highway Code Rule 96).",
  },
  {
    id: 1406,
    category: Category.HAZARD_AWARENESS,
    question:
      "You see horse riders ahead on a narrow country road. What should you do?",
    options: [
      {
        text: "Slow right down and pass only when it is safe and wide enough",
        isCorrect: true,
      },
      {
        text: "Sound your horn to warn them you are there",
        isCorrect: false,
      },
      {
        text: "Speed up to pass before they reach a junction",
        isCorrect: false,
      },
      {
        text: "Get very close so they pull into the verge",
        isCorrect: false,
      },
    ],
    explanation:
      "Horses can be startled easily. A cautious approach prevents a hazard from developing (Highway Code Rule 215).",
  },
  {
    id: 1407,
    category: Category.HAZARD_AWARENESS,
    question: "How can reflective road studs help you at night on a motorway?",
    options: [
      {
        text: "They indicate lane and carriageway boundaries",
        isCorrect: true,
      },
      {
        text: "They measure the depth of surface water",
        isCorrect: false,
      },
      {
        text: "They warn of approaching level crossings",
        isCorrect: false,
      },
      {
        text: "They show the direction to the nearest services",
        isCorrect: false,
      },
    ],
    explanation:
      "Different coloured studs show lanes, hard shoulders, and slip roads, helping you anticipate junctions (Highway Code Rule 301).",
  },
  {
    id: 1408,
    category: Category.HAZARD_AWARENESS,
    question:
      "Why should you be cautious when driving past queues of stationary traffic at a pedestrian crossing?",
    options: [
      {
        text: "Pedestrians may cross between the vehicles into your path",
        isCorrect: true,
      },
      {
        text: "Your car will always stall in the middle of the road",
        isCorrect: false,
      },
      {
        text: "The traffic lights will stay green for longer",
        isCorrect: false,
      },
      {
        text: "Other drivers will reverse to let you through",
        isCorrect: false,
      },
    ],
    explanation:
      "Hidden pedestrians are a developing hazard, so pass slowly and be ready to stop (Highway Code Rule 195).",
  },
  {
    id: 1409,
    category: Category.HAZARD_AWARENESS,
    question:
      "How should you react to a parked vehicle with its reverse lights on?",
    options: [
      {
        text: "Be prepared to stop because the vehicle may move back suddenly",
        isCorrect: true,
      },
      {
        text: "Assume it will stay still until you pass",
        isCorrect: false,
      },
      {
        text: "Flash your headlights to tell the driver to stop",
        isCorrect: false,
      },
      {
        text: "Accelerate quickly to get past first",
        isCorrect: false,
      },
    ],
    explanation:
      "Reverse lights warn that a vehicle might move. Slow down and be ready to stop (Highway Code Rule 202).",
  },
  {
    id: 1410,
    category: Category.HAZARD_AWARENESS,
    question:
      "What is the hazard of driving towards a bridge with a height restriction sign?",
    options: [
      {
        text: "Your vehicle or load may be too tall and could strike the bridge",
        isCorrect: true,
      },
      {
        text: "The road surface will always be icy",
        isCorrect: false,
      },
      {
        text: "You are required to stop and sound your horn",
        isCorrect: false,
      },
      {
        text: "You will be forced to reverse long distances",
        isCorrect: false,
      },
    ],
    explanation:
      "Height restrictions warn of limited clearance. Check your vehicle height to avoid collisions (Highway Code Rule 221).",
  },
  {
    id: 1411,
    category: Category.HAZARD_AWARENESS,
    question:
      "When approaching a concealed level crossing on a rural road, what is the main hazard?",
    options: [
      {
        text: "A train may arrive suddenly with little warning",
        isCorrect: true,
      },
      {
        text: "Your sat-nav will stop working",
        isCorrect: false,
      },
      {
        text: "The road surface will always be flooded",
        isCorrect: false,
      },
      {
        text: "The gradient changes to a steep hill",
        isCorrect: false,
      },
    ],
    explanation:
      "Concealed crossings require extra caution because trains are fast and quiet. Obey warning signs (Highway Code Rule 294).",
  },
  {
    id: 1412,
    category: Category.HAZARD_AWARENESS,
    question:
      "What should you do if you encounter slow-moving maintenance vehicles on a dual carriageway?",
    options: [
      {
        text: "Reduce speed and only pass when it is safe with a clear view",
        isCorrect: true,
      },
      {
        text: "Drive on the hard shoulder to get around quickly",
        isCorrect: false,
      },
      {
        text: "Flash your headlights so they speed up",
        isCorrect: false,
      },
      {
        text: "Sound your horn and stay close behind",
        isCorrect: false,
      },
    ],
    explanation:
      "Maintenance vehicles may have workers nearby. Pass with caution and only when safe (Highway Code Rule 288).",
  },
  {
    id: 1413,
    category: Category.HAZARD_AWARENESS,
    question:
      "How should you treat a junction obscured by high hedges on a country lane?",
    options: [
      {
        text: "Approach slowly, use the horn cautiously, and be ready to stop",
        isCorrect: true,
      },
      {
        text: "Drive in the centre of the road for a better view",
        isCorrect: false,
      },
      {
        text: "Ignore it and maintain your normal speed",
        isCorrect: false,
      },
      {
        text: "Rely on sat-nav warnings rather than observation",
        isCorrect: false,
      },
    ],
    explanation:
      "Blind junctions require very low speed and readiness to stop because hazards cannot be seen early (Highway Code Rule 130).",
  },
  {
    id: 1414,
    category: Category.HAZARD_AWARENESS,
    question:
      "You see warning signs for deer crossing on a rural road. How should you respond?",
    options: [
      {
        text: "Be prepared to slow down suddenly if animals appear",
        isCorrect: true,
      },
      {
        text: "Ignore the sign because deer only travel at night",
        isCorrect: false,
      },
      {
        text: "Sound your horn continuously to scare animals away",
        isCorrect: false,
      },
      {
        text: "Increase speed to pass through the area quickly",
        isCorrect: false,
      },
    ],
    explanation:
      "Wild animals may enter the road without warning. Staying alert gives time to react safely (Highway Code Rule 214).",
  },
  {
    id: 1415,
    category: Category.HAZARD_AWARENESS,
    question:
      "How can early use of mirrors help when approaching a hazard such as a queue of stopped cars?",
    options: [
      {
        text: "It lets you check if following drivers are aware so you can slow gradually",
        isCorrect: true,
      },
      {
        text: "It allows you to judge the height of the vehicles ahead",
        isCorrect: false,
      },
      {
        text: "It proves that the hazard is not serious",
        isCorrect: false,
      },
      {
        text: "It ensures your indicator bulbs are working",
        isCorrect: false,
      },
    ],
    explanation:
      "Observing behind helps warn following drivers and avoid sudden braking, reducing the risk of rear-end collisions (Highway Code Rule 161).",
  },
];
const VULNERABLE_ROAD_USERS_QUESTIONS: Question[] = [
  {
    id: 1501,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "What clearance should you give when overtaking a cyclist at up to 30 mph?",
    options: [
      { text: "At least 1.5 metres", isCorrect: true },
      { text: "At least 0.5 metres", isCorrect: false },
      { text: "At least 3 metres", isCorrect: false },
      { text: "At least 5 metres", isCorrect: false },
    ],
    explanation:
      "The Highway Code states you should leave at least 1.5 metres when passing cyclists at speeds up to 30 mph (Rule 163).",
  },
  {
    id: 1502,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "Why should you slow down near schools during opening or closing times?",
    options: [
      {
        text: "Children may run into the road unexpectedly",
        isCorrect: true,
      },
      {
        text: "Teachers often wave cars through quickly",
        isCorrect: false,
      },
      {
        text: "Parking rules are suspended at these times",
        isCorrect: false,
      },
      {
        text: "Speed bumps are switched off in the afternoon",
        isCorrect: false,
      },
    ],
    explanation:
      "Children are unpredictable and may suddenly step into the road. Slow speeds reduce risk (Highway Code Rule 205).",
  },
  {
    id: 1503,
    category: Category.VULNERABLE_ROAD_USERS,
    question: "How should you pass horse riders on a country road?",
    options: [
      {
        text: "At no more than 10 mph, giving at least 2 metres of space",
        isCorrect: true,
      },
      {
        text: "At 30 mph to avoid startling the horse",
        isCorrect: false,
      },
      {
        text: "Very close to prevent the horse from moving sideways",
        isCorrect: false,
      },
      {
        text: "By sounding the horn to warn the rider",
        isCorrect: false,
      },
    ],
    explanation:
      "Horses can be startled; pass slowly and give wide clearance, as advised in the 2022 Highway Code update (Rule 215).",
  },
  {
    id: 1504,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "Why should you give way to pedestrians already crossing a side road when you turn in?",
    options: [
      {
        text: "The Highway Code hierarchy gives them priority",
        isCorrect: true,
      },
      {
        text: "Because pedestrians must always cross diagonally",
        isCorrect: false,
      },
      {
        text: "Because they have right of way only at night",
        isCorrect: false,
      },
      {
        text: "Because your vehicle will automatically stop",
        isCorrect: false,
      },
    ],
    explanation:
      "Drivers should give way to pedestrians crossing or waiting to cross side roads (Highway Code Rule H2).",
  },
  {
    id: 1505,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "How can you reduce risk to motorcyclists when changing lanes on a dual carriageway?",
    options: [
      {
        text: "Check mirrors and blind spots carefully before moving",
        isCorrect: true,
      },
      {
        text: "Signal only after moving to surprise them",
        isCorrect: false,
      },
      {
        text: "Accelerate quickly without signalling",
        isCorrect: false,
      },
      {
        text: "Rely solely on your rear-view mirror",
        isCorrect: false,
      },
    ],
    explanation:
      "Motorcycles are small and easily hidden; a lifesaver check prevents collisions (Highway Code Rule 211).",
  },
  {
    id: 1506,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "Why must you not park on the zigzag lines by a pedestrian crossing?",
    options: [
      {
        text: "You would obstruct drivers' and pedestrians’ views",
        isCorrect: true,
      },
      {
        text: "You could legally park there for three minutes only",
        isCorrect: false,
      },
      {
        text: "Your car would automatically be clamped",
        isCorrect: false,
      },
      {
        text: "It helps pedestrians cross more quickly",
        isCorrect: false,
      },
    ],
    explanation:
      "Parking on zigzag markings severely reduces visibility and is illegal (Highway Code Rule 191).",
  },
  {
    id: 1507,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "How should you treat people using mobility scooters on the road?",
    options: [
      {
        text: "Give them plenty of room and be prepared for low speeds",
        isCorrect: true,
      },
      {
        text: "Pass closely because they are very stable",
        isCorrect: false,
      },
      {
        text: "Sound the horn so they know you are coming",
        isCorrect: false,
      },
      {
        text: "Drive behind them with main beam headlights on",
        isCorrect: false,
      },
    ],
    explanation:
      "Mobility scooters are slow and may be unstable; treat them as vulnerable users (Highway Code Rule 214).",
  },
  {
    id: 1508,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "When approaching a pelican crossing with a flashing amber light, what should you do?",
    options: [
      {
        text: "Give way to pedestrians on the crossing",
        isCorrect: true,
      },
      {
        text: "Accelerate if the crossing is clear",
        isCorrect: false,
      },
      {
        text: "Sound your horn to alert pedestrians",
        isCorrect: false,
      },
      {
        text: "Ignore the light because it is advisory",
        isCorrect: false,
      },
    ],
    explanation:
      "Flashing amber means you can proceed only if the crossing is clear; pedestrians already on it have priority (Highway Code Rule 192).",
  },
  {
    id: 1509,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "Why should you avoid revving the engine while waiting near cyclists at traffic lights?",
    options: [
      {
        text: "It can startle them and cause them to wobble",
        isCorrect: true,
      },
      {
        text: "It saves fuel compared to idling quietly",
        isCorrect: false,
      },
      {
        text: "It keeps your brakes warmer",
        isCorrect: false,
      },
      {
        text: "It makes them move off faster",
        isCorrect: false,
      },
    ],
    explanation:
      "Noise and sudden movement can unsettle cyclists and lead to loss of balance (Highway Code Rule 178).",
  },
  {
    id: 1510,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "What is the safest way to open a car door when parked on a busy street?",
    options: [
      {
        text: "Use the hand opposite the door to perform the 'Dutch reach'",
        isCorrect: true,
      },
      {
        text: "Open it quickly without looking",
        isCorrect: false,
      },
      {
        text: "Push it fully open and wait for cyclists to stop",
        isCorrect: false,
      },
      {
        text: "Open the door halfway and leave it there",
        isCorrect: false,
      },
    ],
    explanation:
      "Using the far hand forces you to look over your shoulder, helping spot cyclists (Highway Code Rule 239).",
  },
  {
    id: 1511,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "How should you approach a zebra crossing with an elderly person waiting to cross?",
    options: [
      {
        text: "Stop and allow them extra time to cross safely",
        isCorrect: true,
      },
      {
        text: "Drive through quickly before they step out",
        isCorrect: false,
      },
      {
        text: "Signal right to show you are not stopping",
        isCorrect: false,
      },
      {
        text: "Flash your headlights to urge them to hurry",
        isCorrect: false,
      },
    ],
    explanation:
      "Pedestrians have priority at zebra crossings once they step onto the crossing; allow extra time for vulnerable users (Highway Code Rule 195).",
  },
  {
    id: 1512,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "Why must you check for people on foot when reversing into a side road?",
    options: [
      {
        text: "Pedestrians may be walking behind your vehicle out of sight",
        isCorrect: true,
      },
      {
        text: "Zebra crossings are always hidden there",
        isCorrect: false,
      },
      {
        text: "Pedestrians are not allowed on side roads",
        isCorrect: false,
      },
      {
        text: "Your reversing lights automatically alert them",
        isCorrect: false,
      },
    ],
    explanation:
      "Pedestrians can appear unexpectedly, so look carefully and reverse slowly (Highway Code Rule 202).",
  },
  {
    id: 1513,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "What should you do when approaching a bus that has signalled to leave its stop?",
    options: [
      {
        text: "Give way if it is safe to do so",
        isCorrect: true,
      },
      {
        text: "Pass immediately before it moves off",
        isCorrect: false,
      },
      {
        text: "Use your horn to make the driver wait",
        isCorrect: false,
      },
      {
        text: "Drive on the pavement to get by quickly",
        isCorrect: false,
      },
    ],
    explanation:
      "Buses need space to rejoin traffic; giving way helps protect passengers and maintains flow (Highway Code Rule 223).",
  },
  {
    id: 1514,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "Why is it dangerous to overtake a cyclist just before turning left?",
    options: [
      {
        text: "They might continue straight on and you could cut across them",
        isCorrect: true,
      },
      {
        text: "Cyclists must always stop behind left-turning traffic",
        isCorrect: false,
      },
      {
        text: "Cyclists should dismount when traffic turns left",
        isCorrect: false,
      },
      {
        text: "You will automatically receive a fine",
        isCorrect: false,
      },
    ],
    explanation:
      "Cyclists often go straight ahead at junctions; overtaking then turning left can cause a collision (Highway Code Rule 182).",
  },
  {
    id: 1515,
    category: Category.VULNERABLE_ROAD_USERS,
    question: "How should you treat guide dogs and their owners at crossings?",
    options: [
      {
        text: "Be patient and allow them to cross without rushing them",
        isCorrect: true,
      },
      {
        text: "Expect the dog to stop so you can drive through",
        isCorrect: false,
      },
      {
        text: "Use your horn so they know you are waiting",
        isCorrect: false,
      },
      {
        text: "Drive close behind to encourage them to speed up",
        isCorrect: false,
      },
    ],
    explanation:
      "Guide dogs assist visually impaired people who may need more time to cross safely (Highway Code Rule 207).",
  },
];
const OTHER_TYPES_OF_VEHICLE_QUESTIONS: Question[] = [
  {
    id: 1601,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "What should you do if a long vehicle is turning left at a junction ahead of you?",
    options: [
      {
        text: "Stay well back because it may swing wide or need extra room",
        isCorrect: true,
      },
      {
        text: "Overtake on the right immediately",
        isCorrect: false,
      },
      {
        text: "Drive up the inside to pass quickly",
        isCorrect: false,
      },
      {
        text: "Sound your horn so it finishes the turn sooner",
        isCorrect: false,
      },
    ],
    explanation:
      "Large vehicles often occupy more than one lane when turning. Keeping back avoids being trapped (Highway Code Rule 221).",
  },
  {
    id: 1602,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "Why do buses and coaches need additional space when pulling away from stops?",
    options: [
      {
        text: "They are long and may swing out into traffic",
        isCorrect: true,
      },
      {
        text: "They accelerate faster than cars",
        isCorrect: false,
      },
      {
        text: "Passengers lean sideways to signal other drivers",
        isCorrect: false,
      },
      {
        text: "Their brakes are less effective at low speed",
        isCorrect: false,
      },
    ],
    explanation:
      "Due to size and passenger safety, you should allow them space to rejoin traffic (Highway Code Rule 223).",
  },
  {
    id: 1603,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "How should you approach a tram stop where passengers are boarding from the road?",
    options: [
      {
        text: "Stop if necessary and give way to passengers",
        isCorrect: true,
      },
      {
        text: "Drive through quickly to avoid holding up traffic",
        isCorrect: false,
      },
      {
        text: "Sound your horn to warn people to move aside",
        isCorrect: false,
      },
      {
        text: "Flash your headlights so the tram leaves sooner",
        isCorrect: false,
      },
    ],
    explanation:
      "Passengers may step into the road; you must stop and let them board safely (Highway Code Rule 300).",
  },
  {
    id: 1604,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "Why is it dangerous to overtake a HGV that is reversing into a side road?",
    options: [
      {
        text: "The driver may not see you and the vehicle could swing out",
        isCorrect: true,
      },
      {
        text: "The HGV will automatically stop as you pass",
        isCorrect: false,
      },
      {
        text: "Your vehicle will fail its MOT if you wait",
        isCorrect: false,
      },
      {
        text: "The reversing lights mean you must overtake quickly",
        isCorrect: false,
      },
    ],
    explanation:
      "Reversing HGVs have large blind spots. Wait patiently until the manoeuvre is complete (Highway Code Rule 201).",
  },
  {
    id: 1605,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "What extra hazard do large goods vehicles present in wet weather?",
    options: [
      {
        text: "They can throw up spray that reduces your visibility",
        isCorrect: true,
      },
      {
        text: "They always skid more than cars when braking",
        isCorrect: false,
      },
      {
        text: "They cannot use dipped headlights",
        isCorrect: false,
      },
      {
        text: "They never signal before changing lanes",
        isCorrect: false,
      },
    ],
    explanation:
      "Spray from large vehicles can obscure your view; use wipers, dipped headlights, and keep back (Highway Code Rule 227).",
  },
  {
    id: 1606,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "How should you adapt when driving near a vehicle carrying hazardous goods displaying orange plates?",
    options: [
      {
        text: "Keep well back and avoid using cruise control nearby",
        isCorrect: true,
      },
      {
        text: "Follow closely to read the plate clearly",
        isCorrect: false,
      },
      {
        text: "Overtake immediately to stay ahead of it",
        isCorrect: false,
      },
      {
        text: "Flash your headlights to check the driver is alert",
        isCorrect: false,
      },
    ],
    explanation:
      "Hazardous loads need extra space. Staying back reduces risk if the vehicle has to stop suddenly (ADR regulations referenced in Highway Code Rule 282).",
  },
  {
    id: 1607,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "What should you expect from slow-moving agricultural vehicles on rural roads?",
    options: [
      {
        text: "They may turn into fields or side roads without warning",
        isCorrect: true,
      },
      {
        text: "They are limited to motorways only",
        isCorrect: false,
      },
      {
        text: "They always travel faster than the speed limit",
        isCorrect: false,
      },
      {
        text: "They give way to cars at every junction",
        isCorrect: false,
      },
    ],
    explanation:
      "Farm vehicles can make wide or sudden turns. Be prepared to slow down and only overtake if safe (Highway Code Rule 215).",
  },
  {
    id: 1608,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "Why should you avoid passing a tram on the inside where there is a shared lane?",
    options: [
      {
        text: "Passengers may step out and trams cannot steer away",
        isCorrect: true,
      },
      {
        text: "Trams always stop immediately if overtaken",
        isCorrect: false,
      },
      {
        text: "You will be prosecuted for speeding",
        isCorrect: false,
      },
      {
        text: "Trams have priority over emergency vehicles",
        isCorrect: false,
      },
    ],
    explanation:
      "Trams run on fixed rails so pass with caution and never squeeze between the tram and kerb (Highway Code Rule 305).",
  },
  {
    id: 1609,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "What is a particular hazard when you follow a large lorry at night?",
    options: [
      {
        text: "Your headlights may be masked, making it harder to see ahead",
        isCorrect: true,
      },
      {
        text: "The lorry will always brake more sharply than you",
        isCorrect: false,
      },
      {
        text: "The lorry's exhaust emissions increase",
        isCorrect: false,
      },
      {
        text: "Your anti-lock brakes stop working",
        isCorrect: false,
      },
    ],
    explanation:
      "Large vehicles block your view. Drop back so you can see the road and be seen by other drivers (Highway Code Rule 222).",
  },
  {
    id: 1610,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "How should you react to a vehicle displaying a flashing amber beacon on the motorway?",
    options: [
      {
        text: "Be aware it is a slow-moving or abnormal load and approach with caution",
        isCorrect: true,
      },
      {
        text: "Ignore it because it is only for decoration",
        isCorrect: false,
      },
      {
        text: "Overtake immediately regardless of conditions",
        isCorrect: false,
      },
      {
        text: "Follow closely to benefit from the beacon's light",
        isCorrect: false,
      },
    ],
    explanation:
      "Amber beacons warn of slow or wide vehicles. Give them space and be ready to slow down (Highway Code Rule 219).",
  },
  {
    id: 1611,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "Why must you not overtake a bus on the approach to a pedestrian crossing?",
    options: [
      {
        text: "Pedestrians may be crossing in front of the bus",
        isCorrect: true,
      },
      {
        text: "Your vehicle will automatically stall",
        isCorrect: false,
      },
      {
        text: "Buses accelerate slowly from crossings",
        isCorrect: false,
      },
      {
        text: "It is legal only if you sound the horn",
        isCorrect: false,
      },
    ],
    explanation:
      "The bus may hide pedestrians. Overtaking in this situation is highly dangerous (Highway Code Rule 167).",
  },
  {
    id: 1612,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "What should you consider when following a tanker carrying liquid loads?",
    options: [
      {
        text: "The load may surge, causing the vehicle to brake unevenly",
        isCorrect: true,
      },
      {
        text: "The tanker has no brake lights",
        isCorrect: false,
      },
      {
        text: "It will never enter the left lane",
        isCorrect: false,
      },
      {
        text: "It emits steam that cleans your windscreen",
        isCorrect: false,
      },
    ],
    explanation:
      "Liquid loads can shift, affecting stability and stopping distances. Leave extra room (Highway Code Rule 246 context).",
  },
  {
    id: 1613,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "What should you do if a large vehicle coming towards you positions in the middle of a narrow bridge?",
    options: [
      {
        text: "Wait and allow it to clear the bridge before you proceed",
        isCorrect: true,
      },
      {
        text: "Force your way through quickly",
        isCorrect: false,
      },
      {
        text: "Flash headlights aggressively until it stops",
        isCorrect: false,
      },
      {
        text: "Drive onto the pavement to get past",
        isCorrect: false,
      },
    ],
    explanation:
      "Large vehicles may need the full width. Waiting avoids a collision and respects their limitations (Highway Code Rule 152).",
  },
  {
    id: 1614,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "Why should you be cautious when overtaking electric buses that use overhead lines?",
    options: [
      {
        text: "They can draw in close to the kerb without steering",
        isCorrect: false,
      },
      {
        text: "They may stop frequently and occupants may step into the road",
        isCorrect: true,
      },
      {
        text: "They travel only in the right-hand lane",
        isCorrect: false,
      },
      {
        text: "They are forbidden to use mirrors",
        isCorrect: false,
      },
    ],
    explanation:
      "Trolleybuses or electric buses stop often; expect passengers and plan to pass carefully (Highway Code Rule 223).",
  },
  {
    id: 1615,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "When following a convoy of military vehicles, what rules should you observe?",
    options: [
      {
        text: "Do not overtake unless you can pass the entire convoy safely",
        isCorrect: true,
      },
      {
        text: "Sound your horn to signal them to pull over",
        isCorrect: false,
      },
      {
        text: "Drive between vehicles to reduce your journey time",
        isCorrect: false,
      },
      {
        text: "Rely on the convoy to show you the speed limit",
        isCorrect: false,
      },
    ],
    explanation:
      "Convoys keep specific spacing. Only overtake if you can clear the whole group safely (Highway Code Rule 219).",
  },
];
const VEHICLE_HANDLING_QUESTIONS: Question[] = [
  {
    id: 1701,
    category: Category.VEHICLE_HANDLING,
    question: "What should you do if your rear wheels begin to skid on a bend?",
    options: [
      {
        text: "Steer gently in the direction of the skid and ease off the accelerator",
        isCorrect: true,
      },
      {
        text: "Brake hard and steer against the skid",
        isCorrect: false,
      },
      {
        text: "Accelerate sharply to regain traction",
        isCorrect: false,
      },
      {
        text: "Apply the parking brake immediately",
        isCorrect: false,
      },
    ],
    explanation:
      "Correcting a skid requires easing off the accelerator and steering into it to regain grip smoothly (Highway Code Rule 119).",
  },
  {
    id: 1702,
    category: Category.VEHICLE_HANDLING,
    question:
      "How should you control your speed when driving down a steep hill?",
    options: [
      {
        text: "Select a lower gear and use engine braking",
        isCorrect: true,
      },
      {
        text: "Coast in neutral to save fuel",
        isCorrect: false,
      },
      {
        text: "Use the clutch pedal to slow the car",
        isCorrect: false,
      },
      {
        text: "Switch off the engine and rely on the brakes",
        isCorrect: false,
      },
    ],
    explanation:
      "Engine braking helps control speed and prevents brake fade on steep descents (Highway Code Rule 160).",
  },
  {
    id: 1703,
    category: Category.VEHICLE_HANDLING,
    question:
      "When should you use the parking brake while stationary in traffic?",
    options: [
      {
        text: "When you are stopped in neutral to secure the vehicle",
        isCorrect: true,
      },
      {
        text: "Only when parked overnight",
        isCorrect: false,
      },
      {
        text: "Never, because it increases fuel use",
        isCorrect: false,
      },
      {
        text: "Whenever you want to flash your brake lights",
        isCorrect: false,
      },
    ],
    explanation:
      "Using the parking brake keeps the vehicle secure and prevents brake lights dazzling drivers behind (Highway Code Rule 114).",
  },
  {
    id: 1704,
    category: Category.VEHICLE_HANDLING,
    question:
      "How should you handle the vehicle when entering a contraflow system on a motorway?",
    options: [
      {
        text: "Reduce speed, obey temporary limits, and keep your distance",
        isCorrect: true,
      },
      {
        text: "Speed up to match traffic in the normal lanes",
        isCorrect: false,
      },
      {
        text: "Drive on the hard shoulder to avoid narrow lanes",
        isCorrect: false,
      },
      {
        text: "Ignore the cones when the road looks clear",
        isCorrect: false,
      },
    ],
    explanation:
      "Contraflow lanes may be narrower and have no hard shoulder. Follow limits and keep a safe gap (Highway Code Rule 303).",
  },
  {
    id: 1705,
    category: Category.VEHICLE_HANDLING,
    question:
      "Why should you avoid braking harshly when driving on loose gravel?",
    options: [
      {
        text: "It can cause locking and loss of steering control",
        isCorrect: true,
      },
      {
        text: "It improves tyre grip on the loose surface",
        isCorrect: false,
      },
      {
        text: "It automatically engages four-wheel drive",
        isCorrect: false,
      },
      {
        text: "It keeps dust away from the brakes",
        isCorrect: false,
      },
    ],
    explanation:
      "Loose surfaces reduce traction. Harsh braking can lock wheels and cause a skid (defensive driving principle).",
  },
  {
    id: 1706,
    category: Category.VEHICLE_HANDLING,
    question:
      "How can you reduce wheelspin when starting off on a slippery surface?",
    options: [
      {
        text: "Use higher gear and release the clutch gently",
        isCorrect: true,
      },
      {
        text: "Accelerate hard with the clutch fully depressed",
        isCorrect: false,
      },
      {
        text: "Select neutral and rev the engine",
        isCorrect: false,
      },
      {
        text: "Apply the handbrake slightly while moving off",
        isCorrect: false,
      },
    ],
    explanation:
      "Higher gears reduce torque at the wheels, helping maintain traction on slippery surfaces (Highway Code Rule 228).",
  },
  {
    id: 1707,
    category: Category.VEHICLE_HANDLING,
    question:
      "What steering technique keeps steering smooth when negotiating tight bends?",
    options: [
      {
        text: "Use the pull-push method for controlled movement",
        isCorrect: true,
      },
      {
        text: "Cross your hands quickly to turn faster",
        isCorrect: false,
      },
      {
        text: "Grip the wheel loosely at the bottom only",
        isCorrect: false,
      },
      {
        text: "Use one hand to steer and the other for the gear lever",
        isCorrect: false,
      },
    ],
    explanation:
      "The pull-push method keeps hands on opposite sides and maintains fine control (Driver and Vehicle Standards Agency guidance).",
  },
  {
    id: 1708,
    category: Category.VEHICLE_HANDLING,
    question:
      "What effect can carrying a heavy roof load have on your vehicle?",
    options: [
      {
        text: "It raises the centre of gravity and affects handling",
        isCorrect: true,
      },
      {
        text: "It automatically stiffens the suspension",
        isCorrect: false,
      },
      {
        text: "It improves traction in wet weather",
        isCorrect: false,
      },
      {
        text: "It makes the brakes more powerful",
        isCorrect: false,
      },
    ],
    explanation:
      "High loads make the vehicle less stable in bends and gusts. Drive more gently (Highway Code Rule 98).",
  },
  {
    id: 1709,
    category: Category.VEHICLE_HANDLING,
    question:
      "When should you use lower gears while towing a caravan downhill?",
    options: [
      {
        text: "To control speed and avoid the caravan pushing the car",
        isCorrect: true,
      },
      {
        text: "Only when you are overtaking",
        isCorrect: false,
      },
      {
        text: "To make the caravan sway intentionally",
        isCorrect: false,
      },
      {
        text: "To save fuel by coasting",
        isCorrect: false,
      },
    ],
    explanation:
      "Lower gears use engine braking to keep the outfit stable downhill (Highway Code Rule 98).",
  },
  {
    id: 1710,
    category: Category.VEHICLE_HANDLING,
    question: "How will a fully laden car feel compared to when it is unladen?",
    options: [
      {
        text: "It will take longer to accelerate and stop",
        isCorrect: true,
      },
      {
        text: "It will corner more sharply",
        isCorrect: false,
      },
      {
        text: "It will become lighter and more responsive",
        isCorrect: false,
      },
      {
        text: "It will automatically use less fuel",
        isCorrect: false,
      },
    ],
    explanation:
      "Extra weight increases stopping distances and reduces acceleration. Plan manoeuvres accordingly (Highway Code Rule 98).",
  },
  {
    id: 1711,
    category: Category.VEHICLE_HANDLING,
    question:
      "What is the safest way to brake in an emergency with ABS fitted?",
    options: [
      {
        text: "Press the brake pedal firmly and steer to avoid obstacles",
        isCorrect: true,
      },
      {
        text: "Pump the brake pedal rapidly to prevent lock-up",
        isCorrect: false,
      },
      {
        text: "Apply the parking brake first",
        isCorrect: false,
      },
      {
        text: "Release the brake as soon as you feel pulsing",
        isCorrect: false,
      },
    ],
    explanation:
      "ABS works best with firm, continuous pressure, allowing you to steer while braking (Highway Code Rule 120).",
  },
  {
    id: 1712,
    category: Category.VEHICLE_HANDLING,
    question: "Why is gentle acceleration important when driving in snow?",
    options: [
      {
        text: "It reduces the chance of wheelspin and maintains control",
        isCorrect: true,
      },
      {
        text: "It keeps the engine temperature lower",
        isCorrect: false,
      },
      {
        text: "It stops the heater from working",
        isCorrect: false,
      },
      {
        text: "It makes the ABS system turn off",
        isCorrect: false,
      },
    ],
    explanation:
      "Smooth acceleration keeps traction on slippery surfaces, preventing sudden loss of control (Highway Code Rule 228).",
  },
  {
    id: 1713,
    category: Category.VEHICLE_HANDLING,
    question:
      "How can you maintain control when driving through standing water at speed?",
    options: [
      {
        text: "Slow down before entering the water and avoid heavy steering",
        isCorrect: true,
      },
      {
        text: "Accelerate through the water to create a bow wave",
        isCorrect: false,
      },
      {
        text: "Select neutral gear and steer rapidly",
        isCorrect: false,
      },
      {
        text: "Switch off all electrical systems midstream",
        isCorrect: false,
      },
    ],
    explanation:
      "Reducing speed before water and steering smoothly keeps the tyres in contact with the road (Highway Code Rule 211).",
  },
  {
    id: 1714,
    category: Category.VEHICLE_HANDLING,
    question:
      "What should you do if your vehicle begins to aquaplane on a dual carriageway?",
    options: [
      {
        text: "Ease off the accelerator and do not brake sharply",
        isCorrect: true,
      },
      {
        text: "Brake firmly and steer from side to side",
        isCorrect: false,
      },
      {
        text: "Accelerate hard to break through the water",
        isCorrect: false,
      },
      {
        text: "Engage cruise control to stabilise the car",
        isCorrect: false,
      },
    ],
    explanation:
      "Aquaplaning requires gentle correction; sudden braking or steering can cause a skid (Highway Code Rule 227).",
  },
  {
    id: 1715,
    category: Category.VEHICLE_HANDLING,
    question:
      "Why should you avoid resting your foot on the clutch pedal while driving?",
    options: [
      {
        text: "It can cause unnecessary clutch wear and reduce control",
        isCorrect: true,
      },
      {
        text: "It improves fuel economy but reduces braking ability",
        isCorrect: false,
      },
      {
        text: "It automatically locks the gearbox",
        isCorrect: false,
      },
      {
        text: "It makes steering lighter in tight bends",
        isCorrect: false,
      },
    ],
    explanation:
      "Riding the clutch can lead to slipping and loss of precise control, especially on hills (Highway Code Rule 159).",
  },
];
const MOTORWAY_RULES_QUESTIONS: Question[] = [
  {
    id: 1801,
    category: Category.MOTORWAY_RULES,
    question: "Who may legally use the hard shoulder on a motorway?",
    options: [
      {
        text: "Emergency vehicles and motorists in an emergency when directed",
        isCorrect: true,
      },
      {
        text: "Drivers who want to overtake slower traffic",
        isCorrect: false,
      },
      {
        text: "Learner drivers practicing for the test",
        isCorrect: false,
      },
      {
        text: "Vehicles seeking a quicker route to the next junction",
        isCorrect: false,
      },
    ],
    explanation:
      "Hard shoulders are for emergency use and authorised vehicles only (Highway Code Rule 269).",
  },
  {
    id: 1802,
    category: Category.MOTORWAY_RULES,
    question:
      "What is the national speed limit for cars on motorways unless otherwise signed?",
    options: [
      { text: "70 mph", isCorrect: true },
      { text: "60 mph", isCorrect: false },
      { text: "50 mph", isCorrect: false },
      { text: "80 mph", isCorrect: false },
    ],
    explanation:
      "Cars and motorcycles have a 70 mph national limit on motorways (Highway Code Rule 124).",
  },
  {
    id: 1803,
    category: Category.MOTORWAY_RULES,
    question:
      "When should you use the right-hand lane of a three-lane motorway?",
    options: [
      {
        text: "Only for overtaking, or when directed by signs",
        isCorrect: true,
      },
      {
        text: "Whenever you are travelling at the speed limit",
        isCorrect: false,
      },
      {
        text: "To cruise with less congestion",
        isCorrect: false,
      },
      {
        text: "When you are about to leave at the next exit",
        isCorrect: false,
      },
    ],
    explanation:
      "The right-hand lane is primarily for overtaking; return to a left lane after passing (Highway Code Rule 264).",
  },
  {
    id: 1804,
    category: Category.MOTORWAY_RULES,
    question: "What should you do if you miss your exit on a motorway?",
    options: [
      {
        text: "Continue to the next junction before turning back",
        isCorrect: true,
      },
      {
        text: "Stop on the hard shoulder and reverse to the exit",
        isCorrect: false,
      },
      {
        text: "Perform a U-turn using the central reservation",
        isCorrect: false,
      },
      {
        text: "Reverse carefully in the left lane with hazard lights on",
        isCorrect: false,
      },
    ],
    explanation:
      "Stopping or reversing on a motorway is prohibited except in emergencies. Always continue to the next exit (Highway Code Rule 271).",
  },
  {
    id: 1805,
    category: Category.MOTORWAY_RULES,
    question: "How should you join a motorway from a slip road?",
    options: [
      {
        text: "Match the speed of traffic in the left lane and merge safely",
        isCorrect: true,
      },
      {
        text: "Stop at the end of the slip road before entering",
        isCorrect: false,
      },
      {
        text: "Join at a right angle to the traffic flow",
        isCorrect: false,
      },
      {
        text: "Drive on the hard shoulder until space appears",
        isCorrect: false,
      },
    ],
    explanation:
      "Use the slip road to adjust speed, check mirrors, and merge without interrupting traffic (Highway Code Rule 259).",
  },
  {
    id: 1806,
    category: Category.MOTORWAY_RULES,
    question: "What do red flashing lights above your lane on a motorway mean?",
    options: [
      {
        text: "You must not proceed in that lane",
        isCorrect: true,
      },
      {
        text: "Speed up to clear the lane quickly",
        isCorrect: false,
      },
      {
        text: "The lane is about to open",
        isCorrect: false,
      },
      {
        text: "You can use the hard shoulder instead",
        isCorrect: false,
      },
    ],
    explanation:
      "Red flashing lights close a lane or the whole carriageway. Move out of the lane safely (Highway Code Rule 258).",
  },
  {
    id: 1807,
    category: Category.MOTORWAY_RULES,
    question:
      "What should you do if your vehicle breaks down on the motorway and you cannot reach an exit?",
    options: [
      {
        text: "Pull onto the hard shoulder, switch on hazard lights, and use an SOS phone",
        isCorrect: true,
      },
      {
        text: "Stay in the vehicle with the doors locked",
        isCorrect: false,
      },
      {
        text: "Place a warning triangle behind your car on the hard shoulder",
        isCorrect: false,
      },
      {
        text: "Walk down the carriageway warning other drivers",
        isCorrect: false,
      },
    ],
    explanation:
      "Stop on the hard shoulder, exit via the passenger side, stand behind the barrier, and contact emergency services (Highway Code Rule 275).",
  },
  {
    id: 1808,
    category: Category.MOTORWAY_RULES,
    question: "When can learner drivers use motorways?",
    options: [
      {
        text: "When accompanied by an approved instructor in a dual-controlled car",
        isCorrect: true,
      },
      {
        text: "Never, until they pass the practical test",
        isCorrect: false,
      },
      {
        text: "Only between midnight and 6 am",
        isCorrect: false,
      },
      {
        text: "When supervised by any full licence holder",
        isCorrect: false,
      },
    ],
    explanation:
      "Learners may use motorways only with an approved instructor and dual controls (Highway Code changes 2018).",
  },
  {
    id: 1809,
    category: Category.MOTORWAY_RULES,
    question:
      "What should you do when you see a large 'RED X' sign above your lane?",
    options: [
      {
        text: "Leave that lane as soon as it is safe",
        isCorrect: true,
      },
      {
        text: "Continue unless you see a hazard",
        isCorrect: false,
      },
      {
        text: "Stop immediately in the lane",
        isCorrect: false,
      },
      {
        text: "Sound your horn to alert others",
        isCorrect: false,
      },
    ],
    explanation:
      "A red X indicates a closed lane. You must move out of it promptly (Highway Code Rule 258).",
  },
  {
    id: 1810,
    category: Category.MOTORWAY_RULES,
    question:
      "How do smart motorways without a hard shoulder advise drivers of variable speed limits?",
    options: [
      {
        text: "Using signals on overhead gantries or verge-mounted signs",
        isCorrect: true,
      },
      {
        text: "By flashing indicators on every vehicle",
        isCorrect: false,
      },
      {
        text: "By changing the colour of the road surface",
        isCorrect: false,
      },
      {
        text: "By sounding a horn from the central reservation",
        isCorrect: false,
      },
    ],
    explanation:
      "Variable message signs display temporary speed limits and lane status (Highway Code Rule 257).",
  },
  {
    id: 1811,
    category: Category.MOTORWAY_RULES,
    question:
      "What is the correct action when blue flashing lights appear in your mirror on the motorway?",
    options: [
      {
        text: "Move left when safe to let the emergency vehicle pass",
        isCorrect: true,
      },
      {
        text: "Stop immediately in your lane",
        isCorrect: false,
      },
      {
        text: "Accelerate so it can follow you closely",
        isCorrect: false,
      },
      {
        text: "Switch on your hazard lights and continue normally",
        isCorrect: false,
      },
    ],
    explanation:
      "Create a clear path by moving left safely, avoiding sudden braking (Highway Code Rule 219).",
  },
  {
    id: 1812,
    category: Category.MOTORWAY_RULES,
    question: "Where are you allowed to stop on a motorway?",
    options: [
      {
        text: "In lay-bys, service areas, or the hard shoulder in an emergency",
        isCorrect: true,
      },
      {
        text: "On the central reservation to rest",
        isCorrect: false,
      },
      {
        text: "On the verge to check a map",
        isCorrect: false,
      },
      {
        text: "In any lane if traffic is light",
        isCorrect: false,
      },
    ],
    explanation:
      "Stopping is permitted only in designated areas or emergency refuge zones (Highway Code Rule 270).",
  },
  {
    id: 1813,
    category: Category.MOTORWAY_RULES,
    question: "What should you do when leaving a motorway?",
    options: [
      {
        text: "Signal in good time and reduce speed on the slip road",
        isCorrect: true,
      },
      {
        text: "Brake sharply while still in the left lane",
        isCorrect: false,
      },
      {
        text: "Cross all lanes at once without signalling",
        isCorrect: false,
      },
      {
        text: "Stop on the hard shoulder before the exit",
        isCorrect: false,
      },
    ],
    explanation:
      "Use the exit lane to decelerate; do not slow significantly on the main carriageway (Highway Code Rule 272).",
  },
  {
    id: 1814,
    category: Category.MOTORWAY_RULES,
    question: "How should you respond to 'fog' displayed on a motorway signal?",
    options: [
      {
        text: "Reduce speed, increase your distance, and use dipped headlights",
        isCorrect: true,
      },
      {
        text: "Ignore it if visibility seems good",
        isCorrect: false,
      },
      {
        text: "Switch on main beam immediately",
        isCorrect: false,
      },
      {
        text: "Move to the right-hand lane",
        isCorrect: false,
      },
    ],
    explanation:
      "Signals warn of hazards ahead. Adjust your driving before you reach the fog (Highway Code Rule 258).",
  },
  {
    id: 1815,
    category: Category.MOTORWAY_RULES,
    question: "When should you use hazard warning lights on a motorway?",
    options: [
      {
        text: "To warn traffic behind of an obstruction or sudden slowing",
        isCorrect: true,
      },
      {
        text: "To celebrate reaching the speed limit",
        isCorrect: false,
      },
      {
        text: "When overtaking in the right-hand lane",
        isCorrect: false,
      },
      {
        text: "To discourage other drivers from using the hard shoulder",
        isCorrect: false,
      },
    ],
    explanation:
      "Use hazard lights briefly to warn following drivers of danger ahead (Highway Code Rule 116).",
  },
];
const RULES_OF_THE_ROAD_QUESTIONS: Question[] = [
  {
    id: 1901,
    category: Category.RULES_OF_THE_ROAD,
    question: "What does a broken white line down the centre of the road mean?",
    options: [
      {
        text: "Overtake if safe as long as the road ahead is clear",
        isCorrect: true,
      },
      {
        text: "You must not cross the line under any circumstances",
        isCorrect: false,
      },
      {
        text: "The road is designated for buses only",
        isCorrect: false,
      },
      {
        text: "You must use dipped headlights",
        isCorrect: false,
      },
    ],
    explanation:
      "A broken white line indicates you may cross or overtake when it is safe (Highway Code Rule 127).",
  },
  {
    id: 1902,
    category: Category.RULES_OF_THE_ROAD,
    question:
      "How should you respond to a signal from a police officer directing traffic?",
    options: [
      {
        text: "Obey the signal, as it overrides traffic lights and signs",
        isCorrect: true,
      },
      {
        text: "Ignore it if the traffic light is green",
        isCorrect: false,
      },
      {
        text: "Stop only if the officer is wearing high-visibility clothing",
        isCorrect: false,
      },
      {
        text: "Carry on if you have right of way",
        isCorrect: false,
      },
    ],
    explanation:
      "Police directions must be followed even if traffic signals show differently (Highway Code Rule 109).",
  },
  {
    id: 1903,
    category: Category.RULES_OF_THE_ROAD,
    question:
      "What should you do when you see a double yellow line at the edge of the road?",
    options: [
      {
        text: "Do not wait or park at any time unless signs say otherwise",
        isCorrect: true,
      },
      {
        text: "Park for up to 20 minutes",
        isCorrect: false,
      },
      {
        text: "Stop only in the evening",
        isCorrect: false,
      },
      {
        text: "Use the lane for loading only",
        isCorrect: false,
      },
    ],
    explanation:
      "Double yellow lines indicate no waiting at any time unless local signs allow (Highway Code Rule 238).",
  },
  {
    id: 1904,
    category: Category.RULES_OF_THE_ROAD,
    question:
      "Who has priority at an uncontrolled crossroads where two vehicles arrive at the same time?",
    options: [
      {
        text: "No one has priority; proceed carefully and be prepared to stop",
        isCorrect: true,
      },
      {
        text: "The vehicle approaching from the left",
        isCorrect: false,
      },
      {
        text: "The fastest vehicle",
        isCorrect: false,
      },
      {
        text: "The vehicle on the minor road",
        isCorrect: false,
      },
    ],
    explanation:
      "At uncontrolled junctions nobody has priority. Approach with caution and proceed when safe (Highway Code Rule 170).",
  },
  {
    id: 1905,
    category: Category.RULES_OF_THE_ROAD,
    question: "What does a solid white line at the side of the road indicate?",
    options: [
      {
        text: "The edge of the carriageway, especially at night or in poor visibility",
        isCorrect: true,
      },
      {
        text: "A lane reserved for cyclists only",
        isCorrect: false,
      },
      {
        text: "A parking bay you may use",
        isCorrect: false,
      },
      {
        text: "An area you may cross to overtake",
        isCorrect: false,
      },
    ],
    explanation:
      "Edge lines help you judge the edge of the road in darkness or fog (Highway Code Rule 131).",
  },
  {
    id: 1906,
    category: Category.RULES_OF_THE_ROAD,
    question:
      "When must you stop at a pedestrian crossing with a red traffic light and flashing amber control?",
    options: [
      {
        text: "Always stop while the red light shows",
        isCorrect: true,
      },
      {
        text: "Only stop if a police officer is present",
        isCorrect: false,
      },
      {
        text: "Stop only when pedestrians are on the crossing",
        isCorrect: false,
      },
      {
        text: "You may proceed without stopping",
        isCorrect: false,
      },
    ],
    explanation:
      "A steady red light at all crossings means stop and wait; do not proceed until the signal changes (Highway Code Rule 195).",
  },
  {
    id: 1907,
    category: Category.RULES_OF_THE_ROAD,
    question:
      "What is the speed limit in a built-up area with street lights and no other limit signs?",
    options: [
      { text: "30 mph", isCorrect: true },
      { text: "20 mph", isCorrect: false },
      { text: "40 mph", isCorrect: false },
      { text: "50 mph", isCorrect: false },
    ],
    explanation:
      "Street lighting usually signifies a 30 mph limit unless signs show otherwise (Highway Code Rule 124).",
  },
  {
    id: 1908,
    category: Category.RULES_OF_THE_ROAD,
    question:
      "Who is responsible for ensuring that children under 14 wear suitable restraints in a car?",
    options: [
      { text: "The driver", isCorrect: true },
      { text: "The child", isCorrect: false },
      { text: "A front-seat passenger", isCorrect: false },
      { text: "Any passenger over 18", isCorrect: false },
    ],
    explanation:
      "Drivers must ensure children use appropriate child restraints and seat belts (Road Traffic Act 1988, Highway Code Rule 99).",
  },
  {
    id: 1909,
    category: Category.RULES_OF_THE_ROAD,
    question:
      "What does a circular blue sign with a white arrow pointing left mean?",
    options: [
      {
        text: "You must keep left",
        isCorrect: true,
      },
      {
        text: "No left turn permitted",
        isCorrect: false,
      },
      {
        text: "Give way to oncoming traffic",
        isCorrect: false,
      },
      {
        text: "Turn left ahead only",
        isCorrect: false,
      },
    ],
    explanation:
      "Mandatory signs are blue with white symbols. A left-pointing arrow means keep left (Highway Code road signs).",
  },
  {
    id: 1910,
    category: Category.RULES_OF_THE_ROAD,
    question: "When can you wait in a yellow box junction?",
    options: [
      {
        text: "When turning right and your exit road is clear but you must wait for oncoming traffic",
        isCorrect: true,
      },
      {
        text: "Whenever the traffic light is green",
        isCorrect: false,
      },
      {
        text: "To drop off passengers quickly",
        isCorrect: false,
      },
      {
        text: "If the junction is empty",
        isCorrect: false,
      },
    ],
    explanation:
      "You should not enter a box junction unless your exit is clear, except when turning right and waiting for oncoming traffic (Highway Code Rule 174).",
  },
  {
    id: 1911,
    category: Category.RULES_OF_THE_ROAD,
    question: "What should you do before changing lane on a dual carriageway?",
    options: [
      {
        text: "Check mirrors, signal if necessary, and look over your shoulder",
        isCorrect: true,
      },
      {
        text: "Signal only if traffic is heavy",
        isCorrect: false,
      },
      {
        text: "Change lanes first, then signal",
        isCorrect: false,
      },
      {
        text: "Rely on other drivers slowing for you",
        isCorrect: false,
      },
    ],
    explanation:
      "Use mirrors and blind spot checks before signalling and moving to ensure the lane is clear (Highway Code Rule 133).",
  },
  {
    id: 1912,
    category: Category.RULES_OF_THE_ROAD,
    question:
      "What must you do if you approach a pelican crossing and the amber light is flashing?",
    options: [
      {
        text: "Give way to pedestrians already on the crossing",
        isCorrect: true,
      },
      {
        text: "Treat it as a green light",
        isCorrect: false,
      },
      {
        text: "Stop only if the crossing is clear",
        isCorrect: false,
      },
      {
        text: "Sound your horn to warn pedestrians",
        isCorrect: false,
      },
    ],
    explanation:
      "Flashing amber allows you to proceed only when the crossing is clear of pedestrians (Highway Code Rule 192).",
  },
  {
    id: 1913,
    category: Category.RULES_OF_THE_ROAD,
    question:
      "What do zigzag white lines either side of a pelican crossing mean?",
    options: [
      {
        text: "No stopping or parking; keep the crossing approach clear",
        isCorrect: true,
      },
      {
        text: "Vehicles may overtake carefully",
        isCorrect: false,
      },
      {
        text: "Motorcycles must use the crossing only",
        isCorrect: false,
      },
      {
        text: "Parking is allowed for three minutes",
        isCorrect: false,
      },
    ],
    explanation:
      "Zigzag lines prohibit parking or overtaking on the approach to keep sight lines clear (Highway Code Rule 191).",
  },
  {
    id: 1914,
    category: Category.RULES_OF_THE_ROAD,
    question:
      "Which lane should you use on a motorway if you are travelling at a steady speed and not overtaking?",
    options: [
      {
        text: "The left-hand lane",
        isCorrect: true,
      },
      {
        text: "Any lane you choose",
        isCorrect: false,
      },
      {
        text: "The right-hand lane",
        isCorrect: false,
      },
      {
        text: "The middle lane only",
        isCorrect: false,
      },
    ],
    explanation:
      "Keep left unless overtaking to maintain traffic flow (Highway Code Rule 264).",
  },
  {
    id: 1915,
    category: Category.RULES_OF_THE_ROAD,
    question:
      "What must you do when a school crossing patrol signals you to stop?",
    options: [
      {
        text: "Stop and wait until the patrol withdraws the sign",
        isCorrect: true,
      },
      {
        text: "Proceed slowly if no children are visible",
        isCorrect: false,
      },
      {
        text: "Sound the horn and continue carefully",
        isCorrect: false,
      },
      {
        text: "Stop only if you are travelling in a built-up area",
        isCorrect: false,
      },
    ],
    explanation:
      "School crossing patrols have authority to stop traffic. Obey their signal (Highway Code Rule 210).",
  },
];
const ROAD_AND_TRAFFIC_SIGNS_QUESTIONS: Question[] = [
  {
    id: 2001,
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    question:
      "What does a circular red and white sign with a motorcycle above a car mean?",
    options: [
      {
        text: "No motor vehicles are allowed on this road",
        isCorrect: true,
      },
      {
        text: "Motorcycles only beyond this point",
        isCorrect: false,
      },
      {
        text: "Cars must give way to motorcycles",
        isCorrect: false,
      },
      {
        text: "End of speed restriction for cars",
        isCorrect: false,
      },
    ],
    explanation:
      "A red circle indicates prohibition. This sign bans motor vehicles (Highway Code road signs).",
  },
  {
    id: 2002,
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    question:
      "A triangular sign with a red border and a deer symbol warns you about what?",
    options: [
      {
        text: "Wild animals crossing ahead",
        isCorrect: true,
      },
      {
        text: "Zoo entrance nearby",
        isCorrect: false,
      },
      {
        text: "Farm animals kept indoors",
        isCorrect: false,
      },
      {
        text: "No hunting zone",
        isCorrect: false,
      },
    ],
    explanation:
      "Triangular signs warn of hazards. A deer symbol warns of wild animals likely to cross (Highway Code signs).",
  },
  {
    id: 2003,
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    question: "What does a blue rectangular sign with a white 'P' indicate?",
    options: [
      {
        text: "Parking place",
        isCorrect: true,
      },
      {
        text: "Pedestrian zone",
        isCorrect: false,
      },
      {
        text: "Priority road",
        isCorrect: false,
      },
      {
        text: "Private property only",
        isCorrect: false,
      },
    ],
    explanation:
      "Blue rectangles usually provide information; 'P' indicates parking (Highway Code signs).",
  },
  {
    id: 2004,
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    question:
      "What does a red triangular sign showing a car with skid marks mean?",
    options: [
      {
        text: "Slippery road ahead",
        isCorrect: true,
      },
      {
        text: "Skid marks illegal beyond this point",
        isCorrect: false,
      },
      {
        text: "Emergency escape lane ahead",
        isCorrect: false,
      },
      {
        text: "Road surface is newly laid",
        isCorrect: false,
      },
    ],
    explanation:
      "This warning sign alerts you to slippery conditions; slow down and drive smoothly (Highway Code signs).",
  },
  {
    id: 2005,
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    question:
      "What does a blue circular sign with arrows forming a circle mean?",
    options: [
      {
        text: "Mini-roundabout ahead; give way to traffic from the right",
        isCorrect: true,
      },
      {
        text: "No entry to the next junction",
        isCorrect: false,
      },
      {
        text: "End of one-way street",
        isCorrect: false,
      },
      {
        text: "Bus station nearby",
        isCorrect: false,
      },
    ],
    explanation:
      "Blue circles indicate mandatory directions. The white arrows show a mini-roundabout (Highway Code Rule 188).",
  },
  {
    id: 2006,
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    question:
      "A rectangular sign with white lettering on a green background generally indicates what type of route?",
    options: [
      {
        text: "Primary route (major roads)",
        isCorrect: true,
      },
      {
        text: "Temporary diversion",
        isCorrect: false,
      },
      {
        text: "Tourist destination",
        isCorrect: false,
      },
      {
        text: "Motorway service area",
        isCorrect: false,
      },
    ],
    explanation:
      "Green backgrounds with white text mark primary routes on UK roads (Highway Code signs).",
  },
  {
    id: 2007,
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    question:
      "What does a sign showing two arrows pointing in opposite directions around a central obstruction mean?",
    options: [
      {
        text: "Pass either side to reach the same destination",
        isCorrect: true,
      },
      {
        text: "Dual carriageway ends ahead",
        isCorrect: false,
      },
      {
        text: "One-way street begins",
        isCorrect: false,
      },
      {
        text: "Vehicles must turn right only",
        isCorrect: false,
      },
    ],
    explanation:
      "This sign indicates you may pass the obstruction on either side (Highway Code signs).",
  },
  {
    id: 2008,
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    question:
      "What is indicated by a sign with a black diagonal stripe across a white circle?",
    options: [
      {
        text: "National speed limit applies",
        isCorrect: true,
      },
      {
        text: "No entry",
        isCorrect: false,
      },
      {
        text: "End of motorway",
        isCorrect: false,
      },
      {
        text: "Area of outstanding natural beauty",
        isCorrect: false,
      },
    ],
    explanation:
      "The national speed limit sign lifts previous restrictions, applying the default limit (Highway Code Rule 124).",
  },
  {
    id: 2009,
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    question:
      "What does a triangular sign with traffic lights depicted on it warn you about?",
    options: [
      {
        text: "Traffic signals ahead",
        isCorrect: true,
      },
      {
        text: "Temporary signals not in use",
        isCorrect: false,
      },
      {
        text: "Speed cameras ahead",
        isCorrect: false,
      },
      {
        text: "End of controlled parking zone",
        isCorrect: false,
      },
    ],
    explanation:
      "The sign warns of upcoming traffic lights, so you should be prepared to stop (Highway Code signs).",
  },
  {
    id: 2010,
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    question:
      "What does a roundel showing a number in black within a red circle mean?",
    options: [
      {
        text: "Maximum speed limit in mph",
        isCorrect: true,
      },
      {
        text: "Minimum speed limit",
        isCorrect: false,
      },
      {
        text: "Recommended speed",
        isCorrect: false,
      },
      {
        text: "Number of lanes ahead",
        isCorrect: false,
      },
    ],
    explanation:
      "A red circular border signifies a limit; the number indicates the maximum speed (Highway Code Rule 119).",
  },
  {
    id: 2011,
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    question:
      "You see a rectangular brown sign showing a castle icon. What does it indicate?",
    options: [
      {
        text: "A tourist attraction",
        isCorrect: true,
      },
      {
        text: "Emergency services access",
        isCorrect: false,
      },
      {
        text: "No through road",
        isCorrect: false,
      },
      {
        text: "Conservation area speed limits apply",
        isCorrect: false,
      },
    ],
    explanation:
      "Brown tourist signs direct you to places of interest such as heritage sites (Highway Code signs).",
  },
  {
    id: 2012,
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    question:
      "What does a circular blue sign with a white bicycle symbol mean?",
    options: [
      {
        text: "Route for pedal cycles only",
        isCorrect: true,
      },
      {
        text: "Cyclists must dismount",
        isCorrect: false,
      },
      {
        text: "Cycle lane ends",
        isCorrect: false,
      },
      {
        text: "No cycling",
        isCorrect: false,
      },
    ],
    explanation:
      "Blue circles give mandatory instructions; a bicycle symbol indicates a cycle-only route (Highway Code signs).",
  },
  {
    id: 2013,
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    question: "What does a triangular sign showing falling rocks signify?",
    options: [
      {
        text: "Danger of rock falls ahead",
        isCorrect: true,
      },
      {
        text: "Quarry entrance",
        isCorrect: false,
      },
      {
        text: "No heavy goods vehicles",
        isCorrect: false,
      },
      {
        text: "Road repairs completed",
        isCorrect: false,
      },
    ],
    explanation:
      "The sign warns of falling or fallen rocks; proceed carefully (Highway Code signs).",
  },
  {
    id: 2014,
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    question:
      "What is indicated by a blue rectangular sign with a white upward arrow?",
    options: [
      {
        text: "Ahead only",
        isCorrect: true,
      },
      {
        text: "Road closed ahead",
        isCorrect: false,
      },
      {
        text: "One-way street ends",
        isCorrect: false,
      },
      {
        text: "Give way",
        isCorrect: false,
      },
    ],
    explanation:
      "A white arrow on a blue background indicates a mandatory direction: ahead only (Highway Code signs).",
  },
  {
    id: 2015,
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    question:
      "What does a rectangular sign with black letters 'BUS LANE' and operating times mean?",
    options: [
      {
        text: "Only permitted vehicles may use the lane during those times",
        isCorrect: true,
      },
      {
        text: "All vehicles may use the lane at all times",
        isCorrect: false,
      },
      {
        text: "Buses are banned at those hours",
        isCorrect: false,
      },
      {
        text: "Cyclists must dismount in the lane",
        isCorrect: false,
      },
    ],
    explanation:
      "Bus lane signs show when restrictions apply; obey the times to avoid penalties (Highway Code Rule 104).",
  },
];
const DOCUMENTS_QUESTIONS: Question[] = [
  {
    id: 2101,
    category: Category.DOCUMENTS,
    question:
      "What document must you produce to police within seven days if requested at the roadside?",
    options: [
      {
        text: "A valid insurance certificate or cover note",
        isCorrect: true,
      },
      {
        text: "Your vehicle service history",
        isCorrect: false,
      },
      {
        text: "A copy of the Highway Code",
        isCorrect: false,
      },
      {
        text: "Your bank statement",
        isCorrect: false,
      },
    ],
    explanation:
      "Drivers must produce insurance, licence, and MOT when requested or within seven days at a police station (Road Traffic Act).",
  },
  {
    id: 2102,
    category: Category.DOCUMENTS,
    question: "What is the purpose of the V5C registration certificate?",
    options: [
      {
        text: "It identifies the registered keeper and vehicle details",
        isCorrect: true,
      },
      {
        text: "It proves ownership of the radio",
        isCorrect: false,
      },
      {
        text: "It records your driving test results",
        isCorrect: false,
      },
      {
        text: "It acts as proof of insurance",
        isCorrect: false,
      },
    ],
    explanation:
      "The V5C (log book) records the registered keeper and must be updated when details change (DVLA guidance).",
  },
  {
    id: 2103,
    category: Category.DOCUMENTS,
    question: "When must you notify the DVLA about a change of address?",
    options: [
      {
        text: "Immediately for both your driving licence and V5C",
        isCorrect: true,
      },
      {
        text: "Only when you renew your insurance",
        isCorrect: false,
      },
      {
        text: "Every five years regardless of changes",
        isCorrect: false,
      },
      {
        text: "When your vehicle reaches three years old",
        isCorrect: false,
      },
    ],
    explanation:
      "You must update the DVLA promptly with address changes to keep records accurate (Highway Code Rule 6).",
  },
  {
    id: 2104,
    category: Category.DOCUMENTS,
    question:
      "Which document shows your vehicle has passed the required safety checks for the year?",
    options: [
      { text: "MOT test certificate (VT20)", isCorrect: true },
      { text: "Insurance cover note", isCorrect: false },
      { text: "Certificate of road tax", isCorrect: false },
      { text: "Driving licence counterpart", isCorrect: false },
    ],
    explanation:
      "Vehicles over three years old must pass an annual MOT to confirm roadworthiness (Highway Code Rule 89).",
  },
  {
    id: 2105,
    category: Category.DOCUMENTS,
    question: "What does third-party insurance cover?",
    options: [
      {
        text: "Damage or injury caused to others, but not your own vehicle",
        isCorrect: true,
      },
      {
        text: "Your vehicle only",
        isCorrect: false,
      },
      {
        text: "Theft of any items kept in the boot",
        isCorrect: false,
      },
      {
        text: "Maintenance and servicing costs",
        isCorrect: false,
      },
    ],
    explanation:
      "Third-party cover is the minimum legal requirement, covering liability to others (Road Traffic Act 1988).",
  },
  {
    id: 2106,
    category: Category.DOCUMENTS,
    question: "When must you have insurance in place for your vehicle?",
    options: [
      {
        text: "At all times unless the vehicle is declared SORN",
        isCorrect: true,
      },
      {
        text: "Only when you drive it on a Sunday",
        isCorrect: false,
      },
      {
        text: "During daylight hours only",
        isCorrect: false,
      },
      {
        text: "When you carry passengers",
        isCorrect: false,
      },
    ],
    explanation:
      "Continuous Insurance Enforcement requires cover unless the vehicle is off-road and SORN (DVLA guidance).",
  },
  {
    id: 2107,
    category: Category.DOCUMENTS,
    question: "What document proves a vehicle is taxed?",
    options: [
      {
        text: "Online confirmation or receipt of Vehicle Excise Duty payment",
        isCorrect: true,
      },
      {
        text: "A tax disc displayed on the windscreen",
        isCorrect: false,
      },
      {
        text: "The MOT certificate",
        isCorrect: false,
      },
      {
        text: "Your driving theory test pass certificate",
        isCorrect: false,
      },
    ],
    explanation:
      "VED is now checked electronically; keep digital or printed confirmation of payment (DVLA guidance).",
  },
  {
    id: 2108,
    category: Category.DOCUMENTS,
    question:
      "What must you check before allowing another person to drive your car?",
    options: [
      {
        text: "That they hold a valid licence and are insured to drive the vehicle",
        isCorrect: true,
      },
      {
        text: "That they know your favourite route",
        isCorrect: false,
      },
      {
        text: "That they have a passport",
        isCorrect: false,
      },
      {
        text: "That they have owned a car before",
        isCorrect: false,
      },
    ],
    explanation:
      "You must ensure any driver is licensed and covered by insurance before driving your car (Highway Code Rule 90).",
  },
  {
    id: 2109,
    category: Category.DOCUMENTS,
    question: "What does a Statutory Off Road Notification (SORN) declare?",
    options: [
      {
        text: "A vehicle is not being used on the road and is kept off public highways",
        isCorrect: true,
      },
      {
        text: "The vehicle has a valid MOT",
        isCorrect: false,
      },
      {
        text: "Insurance is not required even when driving",
        isCorrect: false,
      },
      {
        text: "The vehicle is for business use only",
        isCorrect: false,
      },
    ],
    explanation:
      "SORN tells the DVLA the vehicle will not be used on the road, removing the need for tax and insurance (DVLA guidance).",
  },
  {
    id: 2110,
    category: Category.DOCUMENTS,
    question:
      "When buying a used car, why is it important to check the service record and MOT history?",
    options: [
      {
        text: "It shows regular maintenance and previous advisories",
        isCorrect: true,
      },
      {
        text: "It confirms the car was made in the UK",
        isCorrect: false,
      },
      {
        text: "It provides insurance discounts automatically",
        isCorrect: false,
      },
      {
        text: "It allows you to avoid paying for future MOTs",
        isCorrect: false,
      },
    ],
    explanation:
      "Service and MOT records reveal the car's condition and any recurring issues, aiding safe purchase decisions.",
  },
  {
    id: 2111,
    category: Category.DOCUMENTS,
    question: "How long is a MOT test certificate valid for?",
    options: [
      { text: "12 months", isCorrect: true },
      { text: "6 months", isCorrect: false },
      { text: "18 months", isCorrect: false },
      { text: "24 months", isCorrect: false },
    ],
    explanation:
      "MOT certificates are valid for 12 months from date of issue (Highway Code Rule 89).",
  },
  {
    id: 2112,
    category: Category.DOCUMENTS,
    question:
      "When can you renew your MOT certificate without losing any time from the current one?",
    options: [
      {
        text: "Up to one calendar month before it expires",
        isCorrect: true,
      },
      {
        text: "Only on the expiry date",
        isCorrect: false,
      },
      {
        text: "Only after the expiry date has passed",
        isCorrect: false,
      },
      {
        text: "Six months before it expires",
        isCorrect: false,
      },
    ],
    explanation:
      "Testing within a month of expiry adds the new certificate to the existing expiry date (DVSA guidance).",
  },
  {
    id: 2113,
    category: Category.DOCUMENTS,
    question:
      "What document should accompany you when driving abroad in Europe?",
    options: [
      {
        text: "Your full driving licence and, if required, an International Driving Permit",
        isCorrect: true,
      },
      {
        text: "Your vehicle log book only",
        isCorrect: false,
      },
      {
        text: "Only your passport",
        isCorrect: false,
      },
      {
        text: "Only your insurance schedule",
        isCorrect: false,
      },
    ],
    explanation:
      "Many European countries require you to carry a photocard licence and, for some, an IDP (Department for Transport guidance).",
  },
  {
    id: 2114,
    category: Category.DOCUMENTS,
    question:
      "What is the minimum period of insurance cover required for a vehicle kept on the road?",
    options: [
      {
        text: "Continuous cover 365 days a year",
        isCorrect: true,
      },
      {
        text: "Cover only during the working week",
        isCorrect: false,
      },
      {
        text: "Cover only while parked",
        isCorrect: false,
      },
      {
        text: "Cover only during daylight hours",
        isCorrect: false,
      },
    ],
    explanation:
      "Continuous insurance enforcement requires cover at all times unless SORN is declared (DVLA guidance).",
  },
  {
    id: 2115,
    category: Category.DOCUMENTS,
    question:
      "What must you do after receiving six or more penalty points within two years of passing your test?",
    options: [
      {
        text: "Your licence is revoked and you must reapply as a learner",
        isCorrect: true,
      },
      {
        text: "You must retake only the theory test",
        isCorrect: false,
      },
      {
        text: "Nothing; the penalty points are removed automatically",
        isCorrect: false,
      },
      {
        text: "Your insurance becomes invalid immediately",
        isCorrect: false,
      },
    ],
    explanation:
      "Under the New Drivers Act, accumulating six points revokes the licence, requiring you to retake both tests.",
  },
];
const INCIDENTS_ACCIDENTS_EMERGENCIES_QUESTIONS: Question[] = [
  {
    id: 2201,
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    question:
      "What is the first priority if you are involved in a collision where someone is injured?",
    options: [
      {
        text: "Stop, make the scene safe, and call the emergency services",
        isCorrect: true,
      },
      {
        text: "Move all vehicles to the nearest lay-by immediately",
        isCorrect: false,
      },
      {
        text: "Leave the scene quickly to avoid blocking traffic",
        isCorrect: false,
      },
      {
        text: "Exchange insurance details before helping casualties",
        isCorrect: false,
      },
    ],
    explanation:
      "Your legal duty is to stop, secure the scene, and summon help if anyone is injured (Highway Code Rule 286).",
  },
  {
    id: 2202,
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    question: "What should you do if your vehicle catches fire while driving?",
    options: [
      {
        text: "Stop, switch off the engine, evacuate, and move everyone to a safe distance",
        isCorrect: true,
      },
      {
        text: "Carry on driving to find a river",
        isCorrect: false,
      },
      {
        text: "Open the bonnet fully to inspect the flames",
        isCorrect: false,
      },
      {
        text: "Stay inside and wait for firefighters",
        isCorrect: false,
      },
    ],
    explanation:
      "Evacuate immediately and call emergency services. Do not attempt to tackle large fires (Highway Code Rule 269 guidance).",
  },
  {
    id: 2203,
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    question:
      "If you arrive at a crash scene where someone is unconscious but breathing, what should you do first?",
    options: [
      {
        text: "Check for danger, then place them in the recovery position",
        isCorrect: true,
      },
      {
        text: "Give them water immediately",
        isCorrect: false,
      },
      {
        text: "Move them quickly into your vehicle",
        isCorrect: false,
      },
      {
        text: "Remove their helmet to aid breathing",
        isCorrect: false,
      },
    ],
    explanation:
      "Ensure the area is safe, then use the recovery position to keep the airway clear while awaiting help (Highway Code first aid).",
  },
  {
    id: 2204,
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    question: "What should you do if someone is bleeding heavily from a wound?",
    options: [
      {
        text: "Apply firm pressure to the wound with a clean cloth",
        isCorrect: true,
      },
      {
        text: "Give them a hot drink",
        isCorrect: false,
      },
      {
        text: "Keep the wound exposed to the air",
        isCorrect: false,
      },
      {
        text: "Allow them to walk around to maintain circulation",
        isCorrect: false,
      },
    ],
    explanation:
      "Applying firm pressure slows blood loss while awaiting medical help (Highway Code first aid guidance).",
  },
  {
    id: 2205,
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    question:
      "What is the correct sequence for the DR ABC method in first aid?",
    options: [
      {
        text: "Danger, Response, Airway, Breathing, Compressions",
        isCorrect: true,
      },
      {
        text: "Driving, Recovery, Airbag, Braking, Communication",
        isCorrect: false,
      },
      {
        text: "Damage, Response, Breathing, Compress, Ambulance",
        isCorrect: false,
      },
      {
        text: "Danger, Rescue, Airway, Bandage, Casualty",
        isCorrect: false,
      },
    ],
    explanation:
      "DR ABC is the recommended order for assessing casualties: ensure danger is clear, check response, open airway, check breathing, then compress if required.",
  },
  {
    id: 2206,
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    question:
      "What should you do if you damage another vehicle while it is unattended?",
    options: [
      {
        text: "Provide your contact details to the owner or report to police within 24 hours",
        isCorrect: true,
      },
      {
        text: "Leave quickly if there are no witnesses",
        isCorrect: false,
      },
      {
        text: "Leave a note with only your first name",
        isCorrect: false,
      },
      {
        text: "Wait in your vehicle until someone notices",
        isCorrect: false,
      },
    ],
    explanation:
      "You must stop and give details; if unable, report the incident to police within 24 hours (Road Traffic Act).",
  },
  {
    id: 2207,
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    question:
      "Why should you never remove a motorcyclist’s helmet unless absolutely necessary?",
    options: [
      {
        text: "It could worsen head or neck injuries",
        isCorrect: true,
      },
      {
        text: "It is illegal to touch another person’s helmet",
        isCorrect: false,
      },
      {
        text: "It always locks automatically",
        isCorrect: false,
      },
      {
        text: "It prevents them from identifying you",
        isCorrect: false,
      },
    ],
    explanation:
      "Removing a helmet can aggravate spinal injuries. Only remove if the airway is blocked and you cannot maintain it otherwise (Highway Code first aid).",
  },
  {
    id: 2208,
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    question:
      "What should you do if your car breaks down in a live lane on a smart motorway and you cannot exit the vehicle safely?",
    options: [
      {
        text: "Stay in the car with seat belts on, switch on hazard lights, and call 999",
        isCorrect: true,
      },
      {
        text: "Get out and stand in front of the car",
        isCorrect: false,
      },
      {
        text: "Walk down the carriageway to find help",
        isCorrect: false,
      },
      {
        text: "Sit on the central reservation barrier",
        isCorrect: false,
      },
    ],
    explanation:
      "If it’s unsafe to leave, remain belted, use hazard lights, and contact emergency services immediately (National Highways guidance).",
  },
  {
    id: 2209,
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    question:
      "After a collision, when must you report the incident to the police?",
    options: [
      {
        text: "Within 24 hours if you failed to exchange details at the scene",
        isCorrect: true,
      },
      {
        text: "Only if the damage exceeds £1000",
        isCorrect: false,
      },
      {
        text: "Only if the road is blocked",
        isCorrect: false,
      },
      {
        text: "Only if instructed by your insurance company",
        isCorrect: false,
      },
    ],
    explanation:
      "If details cannot be exchanged, the law requires reporting as soon as practicable and within 24 hours (Road Traffic Act).",
  },
  {
    id: 2210,
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    question:
      "How should you warn other traffic of a broken-down vehicle on a two-way road in good visibility?",
    options: [
      {
        text: "Use hazard warning lights and place a warning triangle at least 45 metres behind",
        isCorrect: true,
      },
      {
        text: "Stand in the road waving your arms",
        isCorrect: false,
      },
      {
        text: "Switch on full beam headlights",
        isCorrect: false,
      },
      {
        text: "Only switch on the interior light",
        isCorrect: false,
      },
    ],
    explanation:
      "Warn others with hazard lights and, if safe, place a triangle 45 metres behind (but never on motorways) (Highway Code Rule 274).",
  },
  {
    id: 2211,
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    question: "What should you do if you see a vehicle on fire in a tunnel?",
    options: [
      {
        text: "Pull over, switch off the engine, evacuate, and use emergency phones",
        isCorrect: true,
      },
      {
        text: "Drive past quickly and hope it goes out",
        isCorrect: false,
      },
      {
        text: "Stop and open your bonnet to check your engine",
        isCorrect: false,
      },
      {
        text: "Continue driving without stopping",
        isCorrect: false,
      },
    ],
    explanation:
      "In tunnels, switch off engines, evacuate, and notify authorities via emergency phones (Highway Code Rule 274).",
  },
  {
    id: 2212,
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    question: "What is the safest way to assist a casualty with burns?",
    options: [
      {
        text: "Cool the burn with clean, cool water for at least 10 minutes",
        isCorrect: true,
      },
      {
        text: "Apply butter or grease to seal the skin",
        isCorrect: false,
      },
      {
        text: "Cover the burn immediately with wool",
        isCorrect: false,
      },
      {
        text: "Burst any blisters to release heat",
        isCorrect: false,
      },
    ],
    explanation:
      "Cool burns with water, cover loosely, and seek medical help. Do not use oils or burst blisters (Highway Code first aid).",
  },
  {
    id: 2213,
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    question:
      "Why should you keep your hazard lights flashing if you have stopped in an emergency lane on a smart motorway?",
    options: [
      {
        text: "To warn approaching traffic and alert the control centre",
        isCorrect: true,
      },
      {
        text: "To recharge the vehicle battery faster",
        isCorrect: false,
      },
      {
        text: "To indicate that you do not need assistance",
        isCorrect: false,
      },
      {
        text: "To allow you to use your phone legally",
        isCorrect: false,
      },
    ],
    explanation:
      "Hazard lights warn others of the obstruction and help traffic officers locate you quickly (National Highways guidance).",
  },
  {
    id: 2214,
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    question: "After an accident, when should you move an injured person?",
    options: [
      {
        text: "Only if there is immediate danger, such as fire",
        isCorrect: true,
      },
      {
        text: "As soon as possible to clear the road",
        isCorrect: false,
      },
      {
        text: "Whenever they ask you to move them",
        isCorrect: false,
      },
      {
        text: "Immediately, regardless of injuries",
        isCorrect: false,
      },
    ],
    explanation:
      "Moving casualties can worsen injuries unless there is immediate danger (Highway Code first aid).",
  },
  {
    id: 2215,
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    question:
      "What information should you provide when calling emergency services from the scene of a collision?",
    options: [
      {
        text: "Location, number of vehicles involved, and details of injuries",
        isCorrect: true,
      },
      {
        text: "Only your insurance company name",
        isCorrect: false,
      },
      {
        text: "The registration of every passing vehicle",
        isCorrect: false,
      },
      {
        text: "Whether you agree with the Highway Code",
        isCorrect: false,
      },
    ],
    explanation:
      "Clear information helps emergency services respond quickly and appropriately (Highway Code Rule 283).",
  },
];
const VEHICLE_LOADING_QUESTIONS: Question[] = [
  {
    id: 2301,
    category: Category.VEHICLE_LOADING,
    question: "How should heavy items be positioned when loading a car boot?",
    options: [
      {
        text: "Low down and as close to the rear seat back as possible",
        isCorrect: true,
      },
      {
        text: "Stacked high near the tailgate",
        isCorrect: false,
      },
      {
        text: "Balanced on the parcel shelf",
        isCorrect: false,
      },
      {
        text: "Tied to the rear wiper arm",
        isCorrect: false,
      },
    ],
    explanation:
      "Keeping heavy items low and forward maintains vehicle stability and reduces risk of injury if you brake suddenly (Highway Code Rule 98).",
  },
  {
    id: 2302,
    category: Category.VEHICLE_LOADING,
    question: "Why must luggage be securely fastened inside the vehicle?",
    options: [
      {
        text: "Loose loads can become dangerous projectiles in a crash",
        isCorrect: true,
      },
      {
        text: "It improves fuel economy",
        isCorrect: false,
      },
      {
        text: "It shortens braking distance",
        isCorrect: false,
      },
      {
        text: "It allows you to drive faster legally",
        isCorrect: false,
      },
    ],
    explanation:
      "Unrestrained loads can cause injury; secure all items before moving off (Highway Code Rule 98).",
  },
  {
    id: 2303,
    category: Category.VEHICLE_LOADING,
    question: "What is the effect of overloading your vehicle?",
    options: [
      {
        text: "It reduces stability and increases stopping distances",
        isCorrect: true,
      },
      {
        text: "It improves braking efficiency",
        isCorrect: false,
      },
      {
        text: "It reduces tyre wear",
        isCorrect: false,
      },
      {
        text: "It makes steering lighter",
        isCorrect: false,
      },
    ],
    explanation:
      "Overloading strains suspension and brakes, lengthening stopping distances and affecting control (Highway Code Rule 98).",
  },
  {
    id: 2304,
    category: Category.VEHICLE_LOADING,
    question:
      "Before towing a trailer, what should you check regarding your driving licence?",
    options: [
      {
        text: "That you have the correct entitlement for the weight being towed",
        isCorrect: true,
      },
      {
        text: "That you have driven abroad before",
        isCorrect: false,
      },
      {
        text: "That the vehicle handbook is in the glovebox",
        isCorrect: false,
      },
      {
        text: "That your MOT is less than one month old",
        isCorrect: false,
      },
    ],
    explanation:
      "You must have the right licence category for the combined weight of car and trailer (GOV.UK towing rules).",
  },
  {
    id: 2305,
    category: Category.VEHICLE_LOADING,
    question: "How should weight be distributed when loading a trailer?",
    options: [
      {
        text: "Place heavier items over the axle and strap them securely",
        isCorrect: true,
      },
      {
        text: "Put all heavy items at the rear",
        isCorrect: false,
      },
      {
        text: "Balance heavy items on the drawbar",
        isCorrect: false,
      },
      {
        text: "Stack everything as high as possible",
        isCorrect: false,
      },
    ],
    explanation:
      "Keeping heavy weight over the axle maintains balance and helps prevent snaking (Highway Code Rule 98).",
  },
  {
    id: 2306,
    category: Category.VEHICLE_LOADING,
    question:
      "What should you do if a roof rack load extends well beyond the back of the vehicle?",
    options: [
      {
        text: "Mark it clearly with a high-visibility flag or board",
        isCorrect: true,
      },
      {
        text: "Leave it unmarked to avoid distracting others",
        isCorrect: false,
      },
      {
        text: "Allow it to swing freely",
        isCorrect: false,
      },
      {
        text: "Cover it with a dark cloth",
        isCorrect: false,
      },
    ],
    explanation:
      "Loads projecting beyond the vehicle must be clearly marked to warn other road users (Road Vehicles Construction & Use Regulations).",
  },
  {
    id: 2307,
    category: Category.VEHICLE_LOADING,
    question: "Why should you adjust tyre pressures when carrying heavy loads?",
    options: [
      {
        text: "Manufacturers recommend higher pressures to handle weight safely",
        isCorrect: true,
      },
      {
        text: "Lower pressures improve suspension comfort",
        isCorrect: false,
      },
      {
        text: "Overinflation reduces fuel use dramatically",
        isCorrect: false,
      },
      {
        text: "It is required only for winter tyres",
        isCorrect: false,
      },
    ],
    explanation:
      "The handbook lists higher pressures for heavy loads to maintain stability and prevent tyre damage.",
  },
  {
    id: 2308,
    category: Category.VEHICLE_LOADING,
    question: "What must you ensure about passengers before setting off?",
    options: [
      {
        text: "Everyone uses the correct seat belt or child restraint",
        isCorrect: true,
      },
      {
        text: "All doors remain unlocked",
        isCorrect: false,
      },
      {
        text: "Windows are fully lowered",
        isCorrect: false,
      },
      {
        text: "Seats are reclined for comfort",
        isCorrect: false,
      },
    ],
    explanation:
      "The driver is responsible for ensuring passengers, especially children, are correctly restrained (Highway Code Rule 99).",
  },
  {
    id: 2309,
    category: Category.VEHICLE_LOADING,
    question: "What effect can towing an unbalanced trailer have?",
    options: [
      {
        text: "It can cause snaking and loss of control",
        isCorrect: true,
      },
      {
        text: "It improves fuel efficiency",
        isCorrect: false,
      },
      {
        text: "It makes braking more effective",
        isCorrect: false,
      },
      {
        text: "It eliminates tyre wear",
        isCorrect: false,
      },
    ],
    explanation:
      "Incorrectly balanced trailers can sway or snake; proper loading and steady speed reduce the risk (Highway Code Rule 98).",
  },
  {
    id: 2310,
    category: Category.VEHICLE_LOADING,
    question:
      "What should you do before carrying a load on a roof rack for the first time?",
    options: [
      {
        text: "Check the manufacturer's maximum roof load limit",
        isCorrect: true,
      },
      {
        text: "Drive faster to test stability",
        isCorrect: false,
      },
      {
        text: "Lower tyre pressures to compensate",
        isCorrect: false,
      },
      {
        text: "Leave the load unsecured to adjust balance later",
        isCorrect: false,
      },
    ],
    explanation:
      "Exceeding roof load limits is dangerous. Always check the maximum capacity before loading (Vehicle handbook guidance).",
  },
  {
    id: 2311,
    category: Category.VEHICLE_LOADING,
    question:
      "Why should you recheck your load soon after starting a long journey?",
    options: [
      {
        text: "Straps and fixings can settle and loosen as you drive",
        isCorrect: true,
      },
      {
        text: "To make the vehicle lighter",
        isCorrect: false,
      },
      {
        text: "Because it is illegal to stop without doing so",
        isCorrect: false,
      },
      {
        text: "To lower tyre pressures midway",
        isCorrect: false,
      },
    ],
    explanation:
      "Loads may shift after initial movement. Stop in a safe place and ensure everything remains secure.",
  },
  {
    id: 2312,
    category: Category.VEHICLE_LOADING,
    question:
      "What should you do if a load extends more than one metre beyond the front of the vehicle?",
    options: [
      {
        text: "Check legal requirements and fit an appropriate marker board",
        isCorrect: true,
      },
      {
        text: "Cover it with a tarpaulin only",
        isCorrect: false,
      },
      {
        text: "Drive faster to reduce journey time",
        isCorrect: false,
      },
      {
        text: "Remove all mirrors to avoid striking them",
        isCorrect: false,
      },
    ],
    explanation:
      "Long loads require additional notification or marking to warn other road users (Construction & Use Regulations).",
  },
  {
    id: 2313,
    category: Category.VEHICLE_LOADING,
    question: "When towing a caravan, how should you load items inside it?",
    options: [
      {
        text: "Keep heavy items low and near the axle, securing everything",
        isCorrect: true,
      },
      {
        text: "Store heavy items in overhead lockers",
        isCorrect: false,
      },
      {
        text: "Pile heavy items at the rear",
        isCorrect: false,
      },
      {
        text: "Leave loose items scattered for easy access",
        isCorrect: false,
      },
    ],
    explanation:
      "Correct distribution prevents swaying and keeps the caravan stable (Highway Code Rule 98).",
  },
  {
    id: 2314,
    category: Category.VEHICLE_LOADING,
    question: "What should you do if animals are travelling in your vehicle?",
    options: [
      {
        text: "Restrain them safely so they cannot distract or injure you",
        isCorrect: true,
      },
      {
        text: "Let them move freely to keep them calm",
        isCorrect: false,
      },
      {
        text: "Hold them on your lap while driving",
        isCorrect: false,
      },
      {
        text: "Feed them treats while cornering",
        isCorrect: false,
      },
    ],
    explanation:
      "Animals must be appropriately restrained to prevent distraction or injury (Highway Code Rule 57).",
  },
  {
    id: 2315,
    category: Category.VEHICLE_LOADING,
    question:
      "Why is it important to allow greater braking distances when towing a trailer or caravan?",
    options: [
      {
        text: "The combined weight increases momentum, lengthening stopping distances",
        isCorrect: true,
      },
      {
        text: "Brakes always fail when towing",
        isCorrect: false,
      },
      {
        text: "Traffic behind will expect you to brake earlier",
        isCorrect: false,
      },
      {
        text: "Indicators stop working while towing",
        isCorrect: false,
      },
    ],
    explanation:
      "Extra weight means you need more time to halt safely. Increase following distances accordingly (Highway Code Rule 98).",
  },
];

const rawQuestions: Question[] = [
  ...ALERTNESS_QUESTIONS,
  ...ATTITUDE_QUESTIONS,
  ...SAFETY_AND_YOUR_VEHICLE_QUESTIONS,
  ...SAFETY_MARGINS_QUESTIONS,
  ...HAZARD_AWARENESS_QUESTIONS,
  ...VULNERABLE_ROAD_USERS_QUESTIONS,
  ...OTHER_TYPES_OF_VEHICLE_QUESTIONS,
  ...VEHICLE_HANDLING_QUESTIONS,
  ...MOTORWAY_RULES_QUESTIONS,
  ...RULES_OF_THE_ROAD_QUESTIONS,
  ...ROAD_AND_TRAFFIC_SIGNS_QUESTIONS,
  ...DOCUMENTS_QUESTIONS,
  ...INCIDENTS_ACCIDENTS_EMERGENCIES_QUESTIONS,
  ...VEHICLE_LOADING_QUESTIONS,
];

export const QUESTION_BANK: Question[] = questionSchema
  .array()
  .parse(rawQuestions);

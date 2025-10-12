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
  {
    id: 1016,
    category: Category.ALERTNESS,
    question:
      "You’re approaching a queue on a dual carriageway and notice brake lights appearing ahead. What should you do first?",
    options: [
      {
        text: "Check your mirrors and ease off the accelerator early",
        isCorrect: true,
      },
      {
        text: "Sound your horn to warn traffic behind",
        isCorrect: false,
      },
      {
        text: "Switch on main beam to alert other drivers",
        isCorrect: false,
      },
      {
        text: "Accelerate to clear the hazard before the queue builds",
        isCorrect: false,
      },
    ],
    explanation:
      "Mirrors and early deceleration give following drivers time to react, preventing harsh braking and collisions (Highway Code Rule 126).",
  },
  {
    id: 1017,
    category: Category.ALERTNESS,
    question:
      "Driving through a town centre, you see a ball bounce into the road from the left between parked cars. What should you anticipate?",
    options: [
      {
        text: "A child may follow, so slow immediately and be prepared to stop",
        isCorrect: true,
      },
      {
        text: "The ball will roll clear, so maintain your speed",
        isCorrect: false,
      },
      {
        text: "Other drivers will block the lane behind you",
        isCorrect: false,
      },
      {
        text: "Pedestrians will shout if anyone is approaching",
        isCorrect: false,
      },
    ],
    explanation:
      "Loose toys or animals often signal hidden hazards; reducing speed protects vulnerable pedestrians (Highway Code Rule 205).",
  },
  {
    id: 1018,
    category: Category.ALERTNESS,
    question:
      "How should you use your mirrors when towing a trailer on a single carriageway?",
    options: [
      {
        text: "Check them more frequently to monitor the trailer and following traffic",
        isCorrect: true,
      },
      {
        text: "Avoid them unless you intend to overtake",
        isCorrect: false,
      },
      {
        text: "Only use the rear-view mirror because door mirrors give distorted views",
        isCorrect: false,
      },
      {
        text: "Rely solely on the trailer’s indicator repeaters",
        isCorrect: false,
      },
    ],
    explanation:
      "Towing reduces visibility and acceleration; frequent mirror checks help anticipate overtakes and keep the outfit stable (Highway Code Rule 160).",
  },
  {
    id: 1019,
    category: Category.ALERTNESS,
    question:
      "On a smart motorway, you see a red ‘X’ displayed over the left lane you’re in. What must you do?",
    options: [
      {
        text: "Move promptly to another lane before reaching the red ‘X’",
        isCorrect: true,
      },
      {
        text: "Stay put until an enforcement camera flashes",
        isCorrect: false,
      },
      {
        text: "Only change lanes if you can see an obstruction ahead",
        isCorrect: false,
      },
      {
        text: "Ignore the sign unless there’s debris present",
        isCorrect: false,
      },
    ],
    explanation:
      "A red ‘X’ means the lane is closed ahead; you must leave it as soon as it’s safe (Motorways Regulations and Highway Code Rule 258).",
  },
  {
    id: 1020,
    category: Category.ALERTNESS,
    question:
      "When approaching a mini-roundabout with pedestrians waiting at the adjacent zebra crossing, how should you plan your observations?",
    options: [
      {
        text: "Look for traffic on the roundabout and be ready to stop for pedestrians once you exit",
        isCorrect: true,
      },
      {
        text: "Focus only on traffic approaching from the right",
        isCorrect: false,
      },
      {
        text: "Accelerate quickly to clear both junction and crossing together",
        isCorrect: false,
      },
      {
        text: "Ignore the crossing because priority lies with roundabout users",
        isCorrect: false,
      },
    ],
    explanation:
      "Mini-roundabouts demand 360° observation while zebra crossings still take priority for pedestrians. Plan a smooth exit ready to stop (Highway Code Rules 146, 195).",
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
  {
    id: 1116,
    category: Category.ATTITUDE,
    question:
      "You are driving at night on a residential street where a driver ahead is struggling to reverse into a space. How should you respond?",
    options: [
      {
        text: "Hold back patiently with dipped headlights to avoid dazzling them",
        isCorrect: true,
      },
      {
        text: "Sound your horn and drive close to make them hurry",
        isCorrect: false,
      },
      {
        text: "Switch to full beam to give them more light",
        isCorrect: false,
      },
      {
        text: "Overtake immediately, even if you must cross solid lines",
        isCorrect: false,
      },
    ],
    explanation:
      "Considerate drivers stay patient and avoid dazzling others, especially in built-up areas at night (Highway Code Rules 114, 147).",
  },
  {
    id: 1117,
    category: Category.ATTITUDE,
    question:
      "A learner driver stalls at green traffic lights in front of you. What is the best course of action?",
    options: [
      {
        text: "Give them time to restart and keep a safe distance",
        isCorrect: true,
      },
      {
        text: "Drive around them using the oncoming lane immediately",
        isCorrect: false,
      },
      {
        text: "Use your horn repeatedly until they move",
        isCorrect: false,
      },
      {
        text: "Flash your headlights aggressively",
        isCorrect: false,
      },
    ],
    explanation:
      "Learners need encouragement, not pressure; patience helps them recover safely (Highway Code Rule 150).",
  },
  {
    id: 1118,
    category: Category.ATTITUDE,
    question:
      "Why is it unhelpful to signal other drivers to proceed at junctions when you have priority?",
    options: [
      {
        text: "They might rely on your judgment and collide with unseen hazards",
        isCorrect: true,
      },
      {
        text: "It is illegal to signal anyone else at a junction",
        isCorrect: false,
      },
      {
        text: "Signals can damage your indicator stalk",
        isCorrect: false,
      },
      {
        text: "It always confuses automated traffic lights",
        isCorrect: false,
      },
    ],
    explanation:
      "Each driver must make independent decisions; waving others through can create misunderstanding and danger (Highway Code Rule 171).",
  },
  {
    id: 1119,
    category: Category.ATTITUDE,
    question:
      "How can car-sharing or taking public transport demonstrate a positive driving attitude?",
    options: [
      {
        text: "It reduces congestion and pollution for all road users",
        isCorrect: true,
      },
      {
        text: "It guarantees priority at every junction",
        isCorrect: false,
      },
      {
        text: "It means you no longer need valid insurance",
        isCorrect: false,
      },
      {
        text: "It allows you to ignore speed limits when you do drive",
        isCorrect: false,
      },
    ],
    explanation:
      "Considering the wider impact of journeys helps the environment and improves traffic for everyone (Highway Code introduction to attitude).",
  },
  {
    id: 1120,
    category: Category.ATTITUDE,
    question:
      "While waiting at roadworks controlled by portable lights, a driver behind repeatedly sounds their horn. What should you do?",
    options: [
      {
        text: "Remain calm and obey the signal sequence when it turns green",
        isCorrect: true,
      },
      {
        text: "Move through the red light to placate them",
        isCorrect: false,
      },
      {
        text: "Exit the queue onto the pavement to let them pass",
        isCorrect: false,
      },
      {
        text: "Leave the car and confront the driver immediately",
        isCorrect: false,
      },
    ],
    explanation:
      "Keeping composure and following the signals maintains safety; retaliating can escalate conflict (Highway Code Rule 110, 174).",
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
  {
    id: 1216,
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    question:
      "When should you replace windscreen wiper blades to maintain safety?",
    options: [
      {
        text: "As soon as they smear or leave un-wiped areas",
        isCorrect: true,
      },
      {
        text: "Only when the MOT tester advises",
        isCorrect: false,
      },
      {
        text: "When the rubber colour fades",
        isCorrect: false,
      },
      {
        text: "Every five years regardless of condition",
        isCorrect: false,
      },
    ],
    explanation:
      "Clear vision is essential. Replace blades as soon as they smear so you comply with Road Vehicles regulations (Highway Code Rule 229).",
  },
  {
    id: 1217,
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    question: "How can carrying unnecessary roof loads affect your vehicle?",
    options: [
      {
        text: "It raises fuel consumption and increases body roll",
        isCorrect: true,
      },
      {
        text: "It improves tyre grip in wet conditions",
        isCorrect: false,
      },
      {
        text: "It makes braking distances shorter",
        isCorrect: false,
      },
      {
        text: "It guarantees better traction when accelerating",
        isCorrect: false,
      },
    ],
    explanation:
      "Extra weight and drag reduce efficiency and stability; remove unused loads (Highway Code Rule 98).",
  },
  {
    id: 1218,
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    question:
      "What is the safest way to check brake lights are working if you are alone?",
    options: [
      {
        text: "Reverse near a reflective surface and press the pedal",
        isCorrect: true,
      },
      {
        text: "Switch on hazard lights while driving",
        isCorrect: false,
      },
      {
        text: "Flash headlights and assume the brakes are similar",
        isCorrect: false,
      },
      {
        text: "Pull the handbrake repeatedly to check",
        isCorrect: false,
      },
    ],
    explanation:
      "Use reflections or ask someone to help so you can verify brake lights before driving (vehicle safety checks).",
  },
  {
    id: 1219,
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    question:
      "How often should you test your car’s parking brake effectiveness?",
    options: [
      {
        text: "During routine maintenance and whenever it feels weak",
        isCorrect: true,
      },
      {
        text: "Only immediately after leaving an MOT test",
        isCorrect: false,
      },
      {
        text: "Never, because it is self-adjusting",
        isCorrect: false,
      },
      {
        text: "Only if you plan to tow a trailer",
        isCorrect: false,
      },
    ],
    explanation:
      "Frequent checks ensure the handbrake secures the vehicle when parked, preventing roll-away incidents (Highway Code Rule 252).",
  },
  {
    id: 1220,
    category: Category.SAFETY_AND_YOUR_VEHICLE,
    question:
      "Why should you keep your vehicle’s exhaust system in good condition?",
    options: [
      {
        text: "It prevents harmful fumes entering the cabin and reduces noise",
        isCorrect: true,
      },
      {
        text: "It allows you to carry heavier loads",
        isCorrect: false,
      },
      {
        text: "It means you can legally remove the catalytic converter",
        isCorrect: false,
      },
      {
        text: "It increases engine power dramatically",
        isCorrect: false,
      },
    ],
    explanation:
      "A sound exhaust keeps emissions legal and stops fumes entering the cabin, aiding health and compliance (Construction & Use Regulations).",
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
    id: 1315,
    category: Category.SAFETY_MARGINS,
    question:
      "What is the safest way to control your speed on a steep downhill gradient?",
    options: [
      {
        text: "Select a lower gear early so the engine helps with braking",
        isCorrect: true,
      },
      {
        text: "Keep the clutch down and coast to avoid brake wear",
        isCorrect: false,
      },
      {
        text: "Apply the handbrake intermittently while holding the clutch",
        isCorrect: false,
      },
      {
        text: "Shift into neutral and rely on the footbrake only",
        isCorrect: false,
      },
    ],
    explanation:
      "Using engine braking by selecting a lower gear prevents overheating the brakes and maintains steering control (Highway Code Rule 160).",
  },
  {
    id: 1316,
    category: Category.SAFETY_MARGINS,
    question:
      "When following a large vehicle that blocks your view ahead, what should you do to maintain a safe margin?",
    options: [
      {
        text: "Drop further back to improve your view and stopping distance",
        isCorrect: true,
      },
      {
        text: "Move closer so you can use their slipstream",
        isCorrect: false,
      },
      {
        text: "Stay level with their rear wheels to overtake immediately",
        isCorrect: false,
      },
      {
        text: "Flash headlights repeatedly to warn them you are there",
        isCorrect: false,
      },
    ],
    explanation:
      "Increasing the gap restores your view and gives more time to react to hazards beyond the large vehicle (Highway Code Rule 151).",
  },
  {
    id: 1317,
    category: Category.SAFETY_MARGINS,
    question:
      "How should you adapt your driving when passing through standing water across the road?",
    options: [
      {
        text: "Slow to a crawl and check your brakes afterwards",
        isCorrect: true,
      },
      {
        text: "Accelerate quickly to clear the water before it splashes pedestrians",
        isCorrect: false,
      },
      {
        text: "Drive in the centre of the road at normal speed",
        isCorrect: false,
      },
      {
        text: "Switch off ABS to prevent wheel lock",
        isCorrect: false,
      },
    ],
    explanation:
      "Slowing reduces the risk of aquaplaning and protects pedestrians; testing brakes afterwards ensures they still work (Highway Code Rule 228).",
  },
  {
    id: 1318,
    category: Category.SAFETY_MARGINS,
    question:
      "What gap should you leave when stopping behind another vehicle in traffic?",
    options: [
      {
        text: "Enough space to pull out if it breaks down",
        isCorrect: true,
      },
      {
        text: "Less than half a car length",
        isCorrect: false,
      },
      {
        text: "No gap, to discourage others from cutting in",
        isCorrect: false,
      },
      {
        text: "A full bus length regardless of vehicle size",
        isCorrect: false,
      },
    ],
    explanation:
      "Holding back leaves an escape route if the vehicle ahead stalls and prevents rear-end collisions (Highway Code Rule 151).",
  },
  {
    id: 1319,
    category: Category.SAFETY_MARGINS,
    question:
      "Why should you avoid driving in another vehicle’s blind spot on a multi-lane road?",
    options: [
      {
        text: "They may change lanes without seeing you, reducing your safety margin",
        isCorrect: true,
      },
      {
        text: "It increases your fuel consumption slightly",
        isCorrect: false,
      },
      {
        text: "It prevents you from using dipped headlights",
        isCorrect: false,
      },
      {
        text: "It guarantees you will be splashed by surface water",
        isCorrect: false,
      },
    ],
    explanation:
      "Staying out of blind spots gives you space if others move unexpectedly (Highway Code Rule 268).",
  },
  {
    id: 1320,
    category: Category.SAFETY_MARGINS,
    question:
      "In icy conditions, how should you increase your stopping margin?",
    options: [
      {
        text: "By driving at a slow speed in the highest gear possible",
        isCorrect: true,
      },
      {
        text: "By braking harshly to test the road surface",
        isCorrect: false,
      },
      {
        text: "By following closely so others shield you from the wind",
        isCorrect: false,
      },
      {
        text: "By using cruise control to maintain speed",
        isCorrect: false,
      },
    ],
    explanation:
      "Low gears and gentle inputs reduce wheel spin while large gaps provide time to stop on slippery surfaces (Highway Code Rule 230).",
  },
  {
    id: 1321,
    category: Category.SAFETY_MARGINS,
    question:
      "What should you do if spray from a lorry ahead reduces your visibility?",
    options: [
      {
        text: "Drop back until the spray clears and use dipped headlights",
        isCorrect: true,
      },
      {
        text: "Speed up to pass the lorry immediately",
        isCorrect: false,
      },
      {
        text: "Switch to rear fog lights to warn drivers behind",
        isCorrect: false,
      },
      {
        text: "Turn on full beam to cut through the spray",
        isCorrect: false,
      },
    ],
    explanation:
      "Dropping back restores forward vision and prevents spray covering your windscreen (Highway Code Rule 229).",
  },
  {
    id: 1322,
    category: Category.SAFETY_MARGINS,
    question:
      "When overtaking a cyclist in windy conditions, what margin should you allow?",
    options: [
      {
        text: "At least 1.5 metres and even more if they could be blown sideways",
        isCorrect: true,
      },
      {
        text: "Half a metre is sufficient in strong winds",
        isCorrect: false,
      },
      {
        text: "No gap is needed if you accelerate quickly",
        isCorrect: false,
      },
      {
        text: "Drive close to shield them from gusts",
        isCorrect: false,
      },
    ],
    explanation:
      "Passing wide protects cyclists from sudden gusts and keeps them stable (Highway Code Rule 163).",
  },
  {
    id: 1323,
    category: Category.SAFETY_MARGINS,
    question:
      "Why is it important to keep your tyres correctly inflated before a long motorway trip?",
    options: [
      {
        text: "Correct pressures maximise grip and prevent overheating at speed",
        isCorrect: true,
      },
      {
        text: "Under-inflation allows quicker acceleration",
        isCorrect: false,
      },
      {
        text: "Over-inflation improves ride comfort in traffic",
        isCorrect: false,
      },
      {
        text: "Over-inflation keeps the speedometer accurate",
        isCorrect: false,
      },
    ],
    explanation:
      "Correct tyre pressures keep the contact patch effective and stop overheating on long high-speed journeys (Highway Code Rule 229).",
  },
  {
    id: 1324,
    category: Category.SAFETY_MARGINS,
    question:
      "How can you maintain a safety margin when being overtaken on a dual carriageway?",
    options: [
      {
        text: "Keep a steady speed and stay left while monitoring mirrors",
        isCorrect: true,
      },
      {
        text: "Speed up to help the overtaking driver pass sooner",
        isCorrect: false,
      },
      {
        text: "Move right to give them more room",
        isCorrect: false,
      },
      {
        text: "Brake sharply to make them abort the manoeuvre",
        isCorrect: false,
      },
    ],
    explanation:
      "Holding a constant speed and position lets the other driver pass safely while you watch for hazards (Highway Code Rule 168).",
  },
  {
    id: 1325,
    category: Category.SAFETY_MARGINS,
    question:
      "When joining a motorway from a slip road, how do you create a safe merging gap?",
    options: [
      {
        text: "Match the speed of motorway traffic and adjust position smoothly",
        isCorrect: true,
      },
      {
        text: "Stop at the end of the slip road before entering",
        isCorrect: false,
      },
      {
        text: "Sound your horn to force a space",
        isCorrect: false,
      },
      {
        text: "Use hazard lights so drivers move across",
        isCorrect: false,
      },
    ],
    explanation:
      "Using the slip road to match speed and merge smoothly maintains a safe margin without disrupting motorway traffic (Highway Code Rule 259).",
  },
];
const HAZARD_AWARENESS_QUESTIONS: Question[] = [
  {
    id: 1401,
    category: Category.HAZARD_AWARENESS,
    question:
      "You’re approaching the brow of a narrow country lane. What’s the safest way to deal with this hazard?",
    options: [
      {
        text: "Keep to the left, ease off the accelerator, and be ready to stop",
        isCorrect: true,
      },
      {
        text: "Flash your headlights repeatedly to warn oncoming traffic",
        isCorrect: false,
      },
      {
        text: "Sound your horn and continue at the same speed",
        isCorrect: false,
      },
      {
        text: "Move towards the centre line so you can see further ahead",
        isCorrect: false,
      },
    ],
    explanation:
      "Blind summits hide oncoming traffic. Keep left and slow so you can stop safely if needed (Highway Code Rule 154).",
  },
  {
    id: 1402,
    category: Category.HAZARD_AWARENESS,
    question:
      "A ball suddenly bounces into the road ahead between parked cars. What should you do?",
    options: [
      {
        text: "Maintain your speed to clear the area quickly",
        isCorrect: false,
      },
      {
        text: "Brake in good time and be prepared for a child to follow",
        isCorrect: true,
      },
      {
        text: "Swerve around the ball while accelerating away",
        isCorrect: false,
      },
      {
        text: "Use the horn continuously to warn others",
        isCorrect: false,
      },
    ],
    explanation:
      "Children often chase after toys. Slow or stop so you can avoid them emerging from between parked cars (Highway Code Rule 205).",
  },
  {
    id: 1403,
    category: Category.HAZARD_AWARENESS,
    question:
      "Many windscreens on parked cars are still covered in frost during a cold morning. Why is this a potential hazard?",
    options: [
      {
        text: "It means the road surface will stay dry for longer",
        isCorrect: false,
      },
      {
        text: "The vehicles are less likely to be driven that day",
        isCorrect: false,
      },
      {
        text: "Drivers may pull away without fully clearing their vision",
        isCorrect: true,
      },
      {
        text: "It guarantees the owners are still sitting inside",
        isCorrect: false,
      },
    ],
    explanation:
      "Poorly cleared windscreens limit drivers’ vision, so they might not see you when moving off (Highway Code Rules 229, 97).",
  },
  {
    id: 1404,
    category: Category.HAZARD_AWARENESS,
    question:
      "You’re following a high-sided lorry on a dual carriageway and cannot see past it. What should you do?",
    options: [
      {
        text: "Switch on full beam headlights to improve your view",
        isCorrect: false,
      },
      {
        text: "Move closer so you can see round the vehicle",
        isCorrect: false,
      },
      {
        text: "Start to overtake immediately without signalling",
        isCorrect: false,
      },
      {
        text: "Drop back to regain a clear view of the road ahead",
        isCorrect: true,
      },
    ],
    explanation:
      "Falling back opens up your forward vision and increases reaction time (Highway Code Rule 151).",
  },
  {
    id: 1405,
    category: Category.HAZARD_AWARENESS,
    question:
      "You’re turning left at a junction where a cycle lane continues across the mouth of the side road. What should you do?",
    options: [
      {
        text: "Check mirrors, signal early, and give way to any cyclists",
        isCorrect: true,
      },
      {
        text: "Cut across quickly before cyclists can reach the junction",
        isCorrect: false,
      },
      {
        text: "Hug the kerb and keep your signal off until you turn",
        isCorrect: false,
      },
      {
        text: "Stop on the cycle lane and wait for a larger gap",
        isCorrect: false,
      },
    ],
    explanation:
      "Cyclists have priority when lanes continue through the junction. Check carefully and allow them to pass (Highway Code Rules 72, 182).",
  },
  {
    id: 1406,
    category: Category.HAZARD_AWARENESS,
    question:
      "While driving at night on a rural road, you notice reflective studs zig-zagging sharply ahead. What should this alert you to?",
    options: [
      {
        text: "A steep downhill gradient",
        isCorrect: false,
      },
      {
        text: "A sharp bend that requires you to slow down",
        isCorrect: true,
      },
      {
        text: "A series of speed humps",
        isCorrect: false,
      },
      {
        text: "A level crossing with barriers",
        isCorrect: false,
      },
    ],
    explanation:
      "Reflective studs and chevron markers warn of sharp deviations. Reduce speed and adjust position (Highway Code Rule 264).",
  },
  {
    id: 1407,
    category: Category.HAZARD_AWARENESS,
    question:
      "What’s the main danger of overtaking a slow-moving vehicle as you approach a pedestrian refuge island?",
    options: [
      {
        text: "You might block the right-hand lane",
        isCorrect: false,
      },
      {
        text: "The refuge narrows the road, leaving little room to pass safely",
        isCorrect: true,
      },
      {
        text: "Pedestrians will be unable to see your number plate",
        isCorrect: false,
      },
      {
        text: "Traffic lights always change to red near refuges",
        isCorrect: false,
      },
    ],
    explanation:
      "Refuges restrict the road width. Overtaking at that point risks clipping the refuge or oncoming traffic (Highway Code Rule 167).",
  },
  {
    id: 1408,
    category: Category.HAZARD_AWARENESS,
    question:
      "In which situation are you most likely to be affected by crosswinds?",
    options: [
      {
        text: "When emerging from a long tunnel onto an exposed bridge",
        isCorrect: true,
      },
      {
        text: "When travelling slowly through city traffic",
        isCorrect: false,
      },
      {
        text: "When driving behind tall hedges on calm days",
        isCorrect: false,
      },
      {
        text: "When parking facing downhill",
        isCorrect: false,
      },
    ],
    explanation:
      "Exposed areas such as bridges create sudden gusts that can push you sideways (Highway Code Rule 232).",
  },
  {
    id: 1409,
    category: Category.HAZARD_AWARENESS,
    question:
      "You’re driving through slow-moving traffic and notice brake lights several vehicles ahead. How should you react?",
    options: [
      {
        text: "Sound your horn to warn the driver in front",
        isCorrect: false,
      },
      {
        text: "Change lanes immediately to maintain speed",
        isCorrect: false,
      },
      {
        text: "Ease off the accelerator early and prepare to stop smoothly",
        isCorrect: true,
      },
      {
        text: "Accelerate to close the gap before traffic stops",
        isCorrect: false,
      },
    ],
    explanation:
      "Observing brake lights ahead lets you slow early, reducing the risk of harsh braking (Highway Code Rule 126).",
  },
  {
    id: 1410,
    category: Category.HAZARD_AWARENESS,
    question:
      "Why is it especially important to check your mirrors after passing a hazard such as a parked car?",
    options: [
      {
        text: "To make sure your signal has cancelled",
        isCorrect: false,
      },
      {
        text: "To confirm the hazard hasn’t moved",
        isCorrect: false,
      },
      {
        text: "To assess how following drivers are reacting",
        isCorrect: true,
      },
      {
        text: "To ensure your headlights remain on",
        isCorrect: false,
      },
    ],
    explanation:
      "Checking mirrors shows whether following drivers have altered speed or position, helping you plan the next hazard (Highway Code Rule 161).",
  },
  {
    id: 1411,
    category: Category.HAZARD_AWARENESS,
    question:
      "A tractor ahead is signalling right but appears to pull slightly left first. Why might this happen?",
    options: [
      {
        text: "The driver is unsure which direction to take",
        isCorrect: false,
      },
      {
        text: "Tractors often swing left to make wide right turns",
        isCorrect: true,
      },
      {
        text: "The indicator relay is faulty",
        isCorrect: false,
      },
      {
        text: "They want you to overtake on the right",
        isCorrect: false,
      },
    ],
    explanation:
      "Large vehicles sometimes steer the opposite way first to negotiate turns. Hold back and give them room (Highway Code Rule 221).",
  },
  {
    id: 1412,
    category: Category.HAZARD_AWARENESS,
    question:
      "Why should you avoid driving over spilt diesel on the road surface?",
    options: [
      {
        text: "It greatly reduces tyre grip and increases the risk of skidding",
        isCorrect: true,
      },
      {
        text: "It can clog the windscreen washers",
        isCorrect: false,
      },
      {
        text: "It damages catalytic converters immediately",
        isCorrect: false,
      },
      {
        text: "It falsely triggers speed cameras",
        isCorrect: false,
      },
    ],
    explanation:
      "Diesel spillage makes the surface slippery like ice; give it a wide berth or reduce speed significantly (Highway Code Rule 130).",
  },
  {
    id: 1413,
    category: Category.HAZARD_AWARENESS,
    question:
      "How can you reduce the risk from drivers emerging from driveways hidden by tall hedges?",
    options: [
      {
        text: "Drive in the centre of the road to be more visible",
        isCorrect: false,
      },
      {
        text: "Sound the horn continuously as you pass",
        isCorrect: false,
      },
      {
        text: "Slow down and be prepared for vehicles pulling out",
        isCorrect: true,
      },
      {
        text: "Increase speed to clear the area quickly",
        isCorrect: false,
      },
    ],
    explanation:
      "Restricted views mean others may not see you. Reduce speed and anticipate emerging traffic (Highway Code Rule 201).",
  },
  {
    id: 1414,
    category: Category.HAZARD_AWARENESS,
    question:
      "Why should you avoid coasting downhill in neutral when assessing hazards?",
    options: [
      {
        text: "It reduces your control because the engine isn’t helping with braking",
        isCorrect: true,
      },
      {
        text: "It increases engine temperature dramatically",
        isCorrect: false,
      },
      {
        text: "It automatically turns off your headlights",
        isCorrect: false,
      },
      {
        text: "It stops the speedometer working",
        isCorrect: false,
      },
    ],
    explanation:
      "Staying in gear gives better speed control and quicker power response if hazards appear (Highway Code Rule 122).",
  },
  {
    id: 1415,
    category: Category.HAZARD_AWARENESS,
    question:
      "When planning an overtake, why is it important to consider junctions on either side of the road?",
    options: [
      {
        text: "Vehicles might emerge, turning across your path mid-overtake",
        isCorrect: true,
      },
      {
        text: "It’s illegal to pass a junction at any time",
        isCorrect: false,
      },
      {
        text: "Junctions always have speed bumps to slow you down",
        isCorrect: false,
      },
      {
        text: "You must sound the horn near every junction",
        isCorrect: false,
      },
    ],
    explanation:
      "Emerging vehicles create serious conflicts. Avoid overtaking near junctions (Highway Code Rule 167).",
  },
  {
    id: 1416,
    category: Category.HAZARD_AWARENESS,
    question:
      "How should you react when approaching a level crossing whose warning lights begin flashing as you arrive?",
    options: [
      {
        text: "Stop at the stop line and wait until the lights go out",
        isCorrect: true,
      },
      {
        text: "Accelerate quickly to clear the crossing before the barriers lower",
        isCorrect: false,
      },
      {
        text: "Reverse back without checking mirrors",
        isCorrect: false,
      },
      {
        text: "Sound your horn and proceed cautiously",
        isCorrect: false,
      },
    ],
    explanation:
      "Flashing red signals mean you must stop; trains can approach rapidly (Highway Code Rule 293).",
  },
  {
    id: 1417,
    category: Category.HAZARD_AWARENESS,
    question:
      "What’s the main hazard when passing stationary buses at a bus stop?",
    options: [
      {
        text: "Passengers might step into the road unexpectedly",
        isCorrect: true,
      },
      {
        text: "The bus may roll backwards when leaving",
        isCorrect: false,
      },
      {
        text: "Your speedometer stops working near buses",
        isCorrect: false,
      },
      {
        text: "The bus headlights can dazzle you",
        isCorrect: false,
      },
    ],
    explanation:
      "Passengers, especially children, can appear suddenly in front of the bus. Pass slowly and be prepared to stop (Highway Code Rule 223).",
  },
  {
    id: 1418,
    category: Category.HAZARD_AWARENESS,
    question:
      "Why can keeping windows mist-free be a key part of hazard awareness?",
    options: [
      {
        text: "Clear windows maximise your ability to spot developing hazards",
        isCorrect: true,
      },
      {
        text: "It reduces the need to use headlights",
        isCorrect: false,
      },
      {
        text: "It prevents air entering the vehicle",
        isCorrect: false,
      },
      {
        text: "It means you can drive faster in fog",
        isCorrect: false,
      },
    ],
    explanation:
      "Good visibility is essential to observe hazards early. Use demisters and air conditioning as needed (Highway Code Rule 229).",
  },
  {
    id: 1419,
    category: Category.HAZARD_AWARENESS,
    question:
      "On a smart motorway, overhead signs show a red ‘X’ over the lane you’re in. What hazard does this indicate?",
    options: [
      {
        text: "The lane is closed due to an incident or obstruction ahead",
        isCorrect: true,
      },
      {
        text: "There’s no hazard; it’s only for advisory purposes",
        isCorrect: false,
      },
      {
        text: "You may continue if traffic is light",
        isCorrect: false,
      },
      {
        text: "It indicates a compulsory speed increase",
        isCorrect: false,
      },
    ],
    explanation:
      "A red X means the lane is closed. Move out promptly; ignoring it risks lives and carries penalties (Highway Code Rule 258).",
  },
  {
    id: 1420,
    category: Category.HAZARD_AWARENESS,
    question:
      "While queuing in slow traffic, you see pedestrians waiting at a pelican crossing with flashing amber lights. What should you do?",
    options: [
      {
        text: "Give way to pedestrians still on the crossing",
        isCorrect: true,
      },
      {
        text: "Drive through immediately because the lights are flashing",
        isCorrect: false,
      },
      {
        text: "Sound your horn to hurry them across",
        isCorrect: false,
      },
      {
        text: "Wave other drivers across before you move",
        isCorrect: false,
      },
    ],
    explanation:
      "Flashing amber means you may proceed only if the crossing is clear; allow pedestrians to finish crossing (Highway Code Rule 196).",
  },
];
const VULNERABLE_ROAD_USERS_QUESTIONS: Question[] = [
  {
    id: 1501,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "Why should you give extra time and space to older pedestrians crossing the road?",
    options: [
      {
        text: "They may take longer to cross and might not judge your speed accurately",
        isCorrect: true,
      },
      {
        text: "They must legally wave you across before you proceed",
        isCorrect: false,
      },
      {
        text: "They always have right of way only on motorways",
        isCorrect: false,
      },
      {
        text: "They are required to cross diagonally",
        isCorrect: false,
      },
    ],
    explanation:
      "Older people may be slower or have limited vision and hearing. Allow extra time and be prepared to stop (Highway Code Rule 207).",
  },
  {
    id: 1502,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "You’re approaching a zebra crossing where a pedestrian with a white cane is waiting. What should you do?",
    options: [
      {
        text: "Stop and let them cross the road",
        isCorrect: true,
      },
      {
        text: "Sound the horn lightly to guide them across",
        isCorrect: false,
      },
      {
        text: "Flash your headlights and continue",
        isCorrect: false,
      },
      {
        text: "Wave them to wait until traffic behind has passed",
        isCorrect: false,
      },
    ],
    explanation:
      "Drivers must give way to pedestrians on zebra crossings, especially those with visual impairments (Highway Code Rule 195).",
  },
  {
    id: 1503,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "How should you pass a group of cyclists riding two abreast on a country road?",
    options: [
      {
        text: "Wait until it’s safe, then overtake leaving at least 1.5 metres clearance",
        isCorrect: true,
      },
      {
        text: "Drive between them to encourage single file",
        isCorrect: false,
      },
      {
        text: "Use the horn and overtake closely to save time",
        isCorrect: false,
      },
      {
        text: "Follow them in a low gear until they pull over",
        isCorrect: false,
      },
    ],
    explanation:
      "Give cyclists plenty of room, ideally 1.5 metres at up to 30 mph, and overtake only when safe (Highway Code Rule 163).",
  },
  {
    id: 1504,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "When approaching a pelican crossing with pedestrians already crossing, what should you do if the lights change to flashing amber?",
    options: [
      {
        text: "Give way until the crossing is clear",
        isCorrect: true,
      },
      {
        text: "Proceed immediately before more pedestrians step out",
        isCorrect: false,
      },
      {
        text: "Sound your horn to make pedestrians hurry",
        isCorrect: false,
      },
      {
        text: "Drive onto the crossing and stop there",
        isCorrect: false,
      },
    ],
    explanation:
      "Flashing amber means you must give way to pedestrians already on the crossing (Highway Code Rule 196).",
  },
  {
    id: 1505,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "Why should you be particularly cautious around children playing near parked cars?",
    options: [
      {
        text: "They may suddenly run into the road without looking",
        isCorrect: true,
      },
      {
        text: "They always wear high-visibility clothing",
        isCorrect: false,
      },
      {
        text: "They can legally direct traffic at any time",
        isCorrect: false,
      },
      {
        text: "They are required to stay behind the parked cars",
        isCorrect: false,
      },
    ],
    explanation:
      "Children are unpredictable and may dash into the road; reduce speed and be ready to stop (Highway Code Rule 206).",
  },
  {
    id: 1506,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "How should you respond when a horse rider signals you to slow down on a narrow lane?",
    options: [
      {
        text: "Reduce speed, pass wide and slowly when it’s safe",
        isCorrect: true,
      },
      {
        text: "Rev the engine gently to show you’re in control",
        isCorrect: false,
      },
      {
        text: "Sound the horn to warn the horse you’re approaching",
        isCorrect: false,
      },
      {
        text: "Accelerate quickly to avoid frightening the horse",
        isCorrect: false,
      },
    ],
    explanation:
      "Pass horses slowly, giving at least 2 metres clearance, and be prepared to stop (Highway Code Rule 215).",
  },
  {
    id: 1507,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "You see a school crossing patrol (lollipop person) stepping into the road with a stop sign. What must you do?",
    options: [
      {
        text: "Stop and wait until the patrol signals for you to proceed",
        isCorrect: true,
      },
      {
        text: "Wave the children across but continue driving",
        isCorrect: false,
      },
      {
        text: "Drive past slowly as long as no children are present",
        isCorrect: false,
      },
      {
        text: "Only stop if the patrol sounds a whistle",
        isCorrect: false,
      },
    ],
    explanation:
      "School crossing patrols can stop traffic. You must obey their instructions (Highway Code Rule 210).",
  },
  {
    id: 1508,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "Why do motorcyclists need particular consideration at junctions?",
    options: [
      {
        text: "They can be hard to spot because of their narrow profile",
        isCorrect: true,
      },
      {
        text: "They always have priority over cars",
        isCorrect: false,
      },
      {
        text: "They never use mirrors when turning",
        isCorrect: false,
      },
      {
        text: "They must legally stop at every junction",
        isCorrect: false,
      },
    ],
    explanation:
      "Motorcyclists are easily hidden by blind spots; look carefully and use mirrors before pulling out (Highway Code Rule 211).",
  },
  {
    id: 1509,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "Why should you avoid blocking advanced stop lines (bike boxes) at traffic lights?",
    options: [
      {
        text: "They provide cyclists with a visible and safe starting position",
        isCorrect: true,
      },
      {
        text: "Cyclists are not allowed to use other lanes",
        isCorrect: false,
      },
      {
        text: "It is the only place motorcyclists may wait",
        isCorrect: false,
      },
      {
        text: "Buses need the space to turn left",
        isCorrect: false,
      },
    ],
    explanation:
      "Advanced stop lines improve cyclist visibility. You must stay behind the first stop line (Highway Code Rule 178).",
  },
  {
    id: 1510,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "You’re approaching a junction where a pedestrian wearing a reflective armband is waiting to cross at night. What should you do?",
    options: [
      {
        text: "Slow down and be prepared to stop to let them cross",
        isCorrect: true,
      },
      {
        text: "Switch to main beam headlights to highlight them",
        isCorrect: false,
      },
      {
        text: "Speed up before they step onto the road",
        isCorrect: false,
      },
      {
        text: "Wave at them to cross behind you",
        isCorrect: false,
      },
    ],
    explanation:
      "Pedestrians may misjudge your speed, especially in the dark. Approach carefully (Highway Code Rule 170).",
  },
  {
    id: 1511,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "Why should you take extra care when you see ice cream vans stopped by the kerb?",
    options: [
      {
        text: "Children may run out from the van unexpectedly",
        isCorrect: true,
      },
      {
        text: "The van’s refrigeration can cause fog",
        isCorrect: false,
      },
      {
        text: "Parking is always prohibited near them",
        isCorrect: false,
      },
      {
        text: "The driver must reverse without warning",
        isCorrect: false,
      },
    ],
    explanation:
      "Children often run across the road towards ice cream vans; slow down and look carefully (Highway Code Rule 205).",
  },
  {
    id: 1512,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "A pedestrian with a guide dog steps onto the crossing as the light turns green for you. How should you react?",
    options: [
      {
        text: "Wait patiently until they have crossed safely",
        isCorrect: true,
      },
      {
        text: "Proceed slowly, expecting them to move faster",
        isCorrect: false,
      },
      {
        text: "Sound the horn once to alert them",
        isCorrect: false,
      },
      {
        text: "Flash headlights to show you intend to move",
        isCorrect: false,
      },
    ],
    explanation:
      "People with guide dogs need time; the green signal doesn’t override their priority on the crossing (Highway Code Rule 195).",
  },
  {
    id: 1513,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "Why should you not park opposite or within 10 metres of a junction?",
    options: [
      {
        text: "It obstructs visibility for drivers and pedestrians crossing",
        isCorrect: true,
      },
      {
        text: "It makes it easier for buses to turn",
        isCorrect: false,
      },
      {
        text: "It improves access for delivery vehicles",
        isCorrect: false,
      },
      {
        text: "It reduces tyre wear on your car",
        isCorrect: false,
      },
    ],
    explanation:
      "Parking too close to junctions makes it harder for others, including pedestrians, to see hazards (Highway Code Rule 243).",
  },
  {
    id: 1514,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "When must you use dipped headlights to help vulnerable road users in poor daylight?",
    options: [
      {
        text: "Whenever visibility is seriously reduced",
        isCorrect: true,
      },
      {
        text: "Only when driving above 40 mph",
        isCorrect: false,
      },
      {
        text: "Only when following another vehicle closely",
        isCorrect: false,
      },
      {
        text: "Only if cyclists are present",
        isCorrect: false,
      },
    ],
    explanation:
      "Dipped headlights help others see you during poor visibility such as heavy rain or fog (Highway Code Rule 226).",
  },
  {
    id: 1515,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "How should you approach a peloton of racing cyclists escorted by a vehicle displaying a flashing amber beacon?",
    options: [
      {
        text: "Treat it as a slow-moving convoy and overtake only when safe",
        isCorrect: true,
      },
      {
        text: "Use the horn repeatedly to warn the cyclists",
        isCorrect: false,
      },
      {
        text: "Force your way through the group quickly",
        isCorrect: false,
      },
      {
        text: "Overtake immediately, ignoring the escort vehicle",
        isCorrect: false,
      },
    ],
    explanation:
      "Flashing amber beacons warn of slow-moving or escorted vehicles; proceed with caution and pass safely (Highway Code Rule 108).",
  },
  {
    id: 1516,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "What’s the best way to protect pedestrians on a shared-use path when you’re emerging from a driveway?",
    options: [
      {
        text: "Stop at the end, look both ways, and move off slowly",
        isCorrect: true,
      },
      {
        text: "Rely on pedestrians to give way because you’re on private land",
        isCorrect: false,
      },
      {
        text: "Sound the horn continuously while emerging",
        isCorrect: false,
      },
      {
        text: "Accelerate quickly to clear the path",
        isCorrect: false,
      },
    ],
    explanation:
      "Drivers must give way to pedestrians and cyclists when emerging onto footpaths (Highway Code Rule 202).",
  },
  {
    id: 1517,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "Why must you check for motorcyclists before changing lanes in slow-moving traffic?",
    options: [
      {
        text: "They may filter between lanes and be in your blind spots",
        isCorrect: true,
      },
      {
        text: "They can’t ride in bus lanes legally",
        isCorrect: false,
      },
      {
        text: "They must always ride in the centre of a lane",
        isCorrect: false,
      },
      {
        text: "They have priority over buses only",
        isCorrect: false,
      },
    ],
    explanation:
      "Filtering motorcycles can appear suddenly. Mirror and shoulder checks are vital (Highway Code Rule 160).",
  },
  {
    id: 1518,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "A pedestrian pushing a wheelchair is about to cross a side road you’re turning into. What should you do?",
    options: [
      {
        text: "Wait until they’ve crossed safely",
        isCorrect: true,
      },
      {
        text: "Drive through quickly so they can cross behind you",
        isCorrect: false,
      },
      {
        text: "Stop in the middle of the side road",
        isCorrect: false,
      },
      {
        text: "Flash your headlights to tell them to wait",
        isCorrect: false,
      },
    ],
    explanation:
      "Pedestrians, including those pushing wheelchairs, have priority when you’re turning into a side road (Highway Code Rule 170).",
  },
  {
    id: 1519,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "How should you position your vehicle when waiting at traffic lights alongside a lorry?",
    options: [
      {
        text: "Stay well back so the driver can see you in their mirrors",
        isCorrect: true,
      },
      {
        text: "Pull right up beside the cab so you can move off first",
        isCorrect: false,
      },
      {
        text: "Stop directly under the lorry’s mirror arms",
        isCorrect: false,
      },
      {
        text: "Move into the blind spot to save space behind",
        isCorrect: false,
      },
    ],
    explanation:
      "Large vehicles have big blind spots. Keeping back makes you visible and avoids being cut off when they turn (Highway Code Rule 221).",
  },
  {
    id: 1520,
    category: Category.VULNERABLE_ROAD_USERS,
    question:
      "What’s the safest way to deal with a mobility scooter user crossing slowly at a toucan crossing?",
    options: [
      {
        text: "Remain stopped until they have crossed completely",
        isCorrect: true,
      },
      {
        text: "Drive around them because they are moving slowly",
        isCorrect: false,
      },
      {
        text: "Rev the engine to encourage them to hurry",
        isCorrect: false,
      },
      {
        text: "Flash headlights to claim priority",
        isCorrect: false,
      },
    ],
    explanation:
      "Mobility scooter users are vulnerable; wait patiently and allow them to clear the crossing (Highway Code Rule 178).",
  },
];
const OTHER_TYPES_OF_VEHICLE_QUESTIONS: Question[] = [
  {
    id: 1601,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "Why should you allow extra space when following a tram on wet rails?",
    options: [
      {
        text: "Trams can take longer to stop and may spray debris onto the road",
        isCorrect: true,
      },
      {
        text: "Trams must stop at every junction without warning",
        isCorrect: false,
      },
      {
        text: "Tram drivers rely on your lights as guidance",
        isCorrect: false,
      },
      {
        text: "Wet rails make trams accelerate uncontrollably",
        isCorrect: false,
      },
    ],
    explanation:
      "Trams run on rails and need longer to stop, especially in the wet. Keep back and watch for spray or slippery rails (Highway Code Rule 302).",
  },
  {
    id: 1602,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "When you see a bus at a bus stop indicating to pull out, what should you do?",
    options: [
      {
        text: "Give way when safe to do so",
        isCorrect: true,
      },
      {
        text: "Accelerate past before it moves off",
        isCorrect: false,
      },
      {
        text: "Sound the horn to warn the driver",
        isCorrect: false,
      },
      {
        text: "Drive onto the opposite carriageway immediately",
        isCorrect: false,
      },
    ],
    explanation:
      "Where possible, allow buses to rejoin the flow as they may be carrying many passengers (Highway Code Rule 223).",
  },
  {
    id: 1603,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "Why must you take care when overtaking long vehicles that are turning left?",
    options: [
      {
        text: "They may need to swing wide to complete the turn",
        isCorrect: true,
      },
      {
        text: "They always stop mid-turn to let you pass",
        isCorrect: false,
      },
      {
        text: "They only use indicators when parked",
        isCorrect: false,
      },
      {
        text: "They must reverse before turning",
        isCorrect: false,
      },
    ],
    explanation:
      "Large vehicles often move to the right before turning left. Stay behind and give them space (Highway Code Rule 221).",
  },
  {
    id: 1604,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "Why should you avoid driving in the space alongside HGVs on multilane roads?",
    options: [
      {
        text: "You may be in the driver’s blind spot and at risk if they change lane",
        isCorrect: true,
      },
      {
        text: "HGVs emit fumes that damage tyres instantly",
        isCorrect: false,
      },
      {
        text: "HGVs are not allowed to change lanes",
        isCorrect: false,
      },
      {
        text: "Speed limits are lower beside HGVs",
        isCorrect: false,
      },
    ],
    explanation:
      "Blind spots alongside large vehicles are extensive. Avoid lingering there (Highway Code Rule 151).",
  },
  {
    id: 1605,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "How should you approach a vehicle displaying an amber flashing beacon on a dual carriageway?",
    options: [
      {
        text: "Slow down and be prepared for it to travel slowly or stop",
        isCorrect: true,
      },
      {
        text: "Overtake immediately without observing",
        isCorrect: false,
      },
      {
        text: "Accelerate and follow closely to clear the hazard",
        isCorrect: false,
      },
      {
        text: "Use your horn until it speeds up",
        isCorrect: false,
      },
    ],
    explanation:
      "Amber beacons warn of slow-moving or stopped vehicles such as gritters or recovery trucks (Highway Code Rule 108).",
  },
  {
    id: 1606,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "Why should you give extra room to tanker lorries carrying hazardous loads?",
    options: [
      {
        text: "Spillage or fumes can be dangerous in a collision",
        isCorrect: true,
      },
      {
        text: "They have priority at roundabouts",
        isCorrect: false,
      },
      {
        text: "They always travel above the speed limit",
        isCorrect: false,
      },
      {
        text: "They are exempt from signalling requirements",
        isCorrect: false,
      },
    ],
    explanation:
      "Hazard placards indicate dangerous goods. Keep well back and avoid sudden braking near them (ADR regulations, Highway Code Rule 97).",
  },
  {
    id: 1607,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "What should you do if you’re following an articulated lorry reversing into a side road?",
    options: [
      {
        text: "Wait patiently, giving the driver plenty of room to manoeuvre",
        isCorrect: true,
      },
      {
        text: "Drive alongside to guide them with hand signals",
        isCorrect: false,
      },
      {
        text: "Sound your horn to make them stop",
        isCorrect: false,
      },
      {
        text: "Overtake quickly before they finish reversing",
        isCorrect: false,
      },
    ],
    explanation:
      "Large vehicles may need to shunt back and forth. Hold back and let them complete the manoeuvre safely (Highway Code Rule 221).",
  },
  {
    id: 1608,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "Why do long vehicles sometimes straddle lanes on mini-roundabouts?",
    options: [
      {
        text: "Their length requires more space to negotiate the turn safely",
        isCorrect: true,
      },
      {
        text: "They are exempt from using indicators",
        isCorrect: false,
      },
      {
        text: "They must always take the right-hand lane",
        isCorrect: false,
      },
      {
        text: "They intend to park on the roundabout",
        isCorrect: false,
      },
    ],
    explanation:
      "Large vehicles may need both lanes to clear the centre. Allow them room and avoid overtaking (Highway Code Rule 188).",
  },
  {
    id: 1609,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "How should you react to a slow-moving agricultural vehicle turning into a field ahead?",
    options: [
      {
        text: "Slow down and be ready to stop as it may swing wide",
        isCorrect: true,
      },
      {
        text: "Overtake immediately on the left",
        isCorrect: false,
      },
      {
        text: "Drive as close as possible to help it turn",
        isCorrect: false,
      },
      {
        text: "Expect it to speed up once off the main road",
        isCorrect: false,
      },
    ],
    explanation:
      "Farm vehicles may swing across the road to enter gateways. Stay back and wait (Highway Code Rule 163).",
  },
  {
    id: 1610,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "Why is it important to avoid splashing pedestrians when passing through standing water?",
    options: [
      {
        text: "It’s unsafe and can constitute careless driving",
        isCorrect: true,
      },
      {
        text: "It cools the brakes too quickly",
        isCorrect: false,
      },
      {
        text: "Pedestrians must dry the road afterwards",
        isCorrect: false,
      },
      {
        text: "It damages the road markings immediately",
        isCorrect: false,
      },
    ],
    explanation:
      "Driving without due consideration for other road users, such as drenching pedestrians, can lead to prosecution (Highway Code Rule 147).",
  },
  {
    id: 1611,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "What’s the main risk of overtaking an electric tram at a stop in the city centre?",
    options: [
      {
        text: "Passengers may step into the road from the tram",
        isCorrect: true,
      },
      {
        text: "The tram will reverse suddenly",
        isCorrect: false,
      },
      {
        text: "You’ll be fined for exceeding the speed limit",
        isCorrect: false,
      },
      {
        text: "It’s illegal to pass any stationary vehicle",
        isCorrect: false,
      },
    ],
    explanation:
      "Passengers often cross in front of or behind trams. Approach slowly and be ready to stop (Highway Code Rule 307).",
  },
  {
    id: 1612,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "How do high-sided vehicles affect you when driving on exposed motorway sections?",
    options: [
      {
        text: "They can be blown sideways, creating sudden hazards",
        isCorrect: true,
      },
      {
        text: "They always stay in the left lane regardless of wind",
        isCorrect: false,
      },
      {
        text: "They cannot use hazard warning lights",
        isCorrect: false,
      },
      {
        text: "They provide shelter, so you should follow closely",
        isCorrect: false,
      },
    ],
    explanation:
      "Crosswinds can push high-sided vehicles off course. Give them extra room and be prepared for sudden movements (Highway Code Rule 232).",
  },
  {
    id: 1613,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "What should you do if a tram lane is marked by a white line and sign showing a tram symbol?",
    options: [
      {
        text: "Keep out unless signs allow other vehicles to use it",
        isCorrect: true,
      },
      {
        text: "Drive in it to avoid congestion",
        isCorrect: false,
      },
      {
        text: "Use it as a parking area when waiting",
        isCorrect: false,
      },
      {
        text: "Cross it diagonally whenever you like",
        isCorrect: false,
      },
    ],
    explanation:
      "Tram lanes may be restricted. Only enter if permitted; otherwise stay clear (Highway Code Rule 305).",
  },
  {
    id: 1614,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "Why should you avoid driving too close to vehicles carrying live animals?",
    options: [
      {
        text: "Animal movement can shift the load and affect vehicle stability",
        isCorrect: true,
      },
      {
        text: "They have the right of way at crossings",
        isCorrect: false,
      },
      {
        text: "They always travel at over 60 mph",
        isCorrect: false,
      },
      {
        text: "They are exempt from using brake lights",
        isCorrect: false,
      },
    ],
    explanation:
      "Live loads can move unpredictably, affecting handling. Give them space in case of sudden changes (Highway Code Rule 120).",
  },
  {
    id: 1615,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "How should you deal with a recovery truck loading a broken-down vehicle on the hard shoulder?",
    options: [
      {
        text: "Slow down and move to another lane if safe",
        isCorrect: true,
      },
      {
        text: "Continue at the same speed using the hard shoulder briefly",
        isCorrect: false,
      },
      {
        text: "Flash your headlights continuously",
        isCorrect: false,
      },
      {
        text: "Stop and offer assistance in the live lane",
        isCorrect: false,
      },
    ],
    explanation:
      "Protect people working at the roadside by slowing and changing lanes where possible (Highway Code Rule 264).",
  },
  {
    id: 1616,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "Why should you avoid overtaking near the rear of a long vehicle that’s signalling right?",
    options: [
      {
        text: "It may conceal a smaller vehicle or junction into which it’s turning",
        isCorrect: true,
      },
      {
        text: "Long vehicles cannot have working indicators",
        isCorrect: false,
      },
      {
        text: "They must reverse before turning right",
        isCorrect: false,
      },
      {
        text: "They’re about to stop and let you pass",
        isCorrect: false,
      },
    ],
    explanation:
      "Large vehicles may hide other road users or side roads. Wait until the manoeuvre is complete (Highway Code Rule 170).",
  },
  {
    id: 1617,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "What is the main hazard when following a refuse collection lorry on a residential street?",
    options: [
      {
        text: "Crew members may step into the road without warning",
        isCorrect: true,
      },
      {
        text: "The lorry cannot reverse in narrow streets",
        isCorrect: false,
      },
      {
        text: "Refuse lorries automatically scatter debris",
        isCorrect: false,
      },
      {
        text: "The lorry cannot use mirrors",
        isCorrect: false,
      },
    ],
    explanation:
      "Collection crews regularly enter the carriageway. Drive slowly and be ready to stop (Highway Code Rule 113).",
  },
  {
    id: 1618,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "How can you help a tram pass safely if traffic is queuing at a junction in front of you?",
    options: [
      {
        text: "Keep the tracks clear by stopping short of the junction",
        isCorrect: true,
      },
      {
        text: "Block the tracks because trams must stop",
        isCorrect: false,
      },
      {
        text: "Move onto the crossing to create more space",
        isCorrect: false,
      },
      {
        text: "Sound your horn to warn the tram driver",
        isCorrect: false,
      },
    ],
    explanation:
      "Never block tram lines or junctions. Leave space so trams can continue safely (Highway Code Rule 306).",
  },
  {
    id: 1619,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "When should you expect slow-moving vehicles like gritters to operate?",
    options: [
      {
        text: "During winter weather or when freezing conditions are forecast",
        isCorrect: true,
      },
      {
        text: "Only during summer bank holidays",
        isCorrect: false,
      },
      {
        text: "Only at motorway service areas",
        isCorrect: false,
      },
      {
        text: "Only when traffic levels are very low at night",
        isCorrect: false,
      },
    ],
    explanation:
      "Gritters treat roads during cold spells. Expect them at lower speeds and give them room (Highway Code Rule 97).",
  },
  {
    id: 1620,
    category: Category.OTHER_TYPES_OF_VEHICLE,
    question:
      "What should you do when meeting a horse-drawn vehicle on a narrow road?",
    options: [
      {
        text: "Slow right down and be prepared to stop if necessary",
        isCorrect: true,
      },
      {
        text: "Use your horn repeatedly to warn the horse",
        isCorrect: false,
      },
      {
        text: "Pass closely to give them shelter",
        isCorrect: false,
      },
      {
        text: "Accelerate past quickly to reduce noise",
        isCorrect: false,
      },
    ],
    explanation:
      "Horse-drawn vehicles move slowly. Give them ample room and be prepared to stop (Highway Code Rule 215).",
  },
];
const VEHICLE_HANDLING_QUESTIONS: Question[] = [
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
  {
    id: 1716,
    category: Category.VEHICLE_HANDLING,
    question:
      "If your vehicle begins to understeer on a bend, what is the first action you should take?",
    options: [
      {
        text: "Ease off the accelerator and allow the front tyres to regain grip",
        isCorrect: true,
      },
      {
        text: "Brake sharply while holding the steering straight",
        isCorrect: false,
      },
      {
        text: "Increase the steering angle dramatically",
        isCorrect: false,
      },
      {
        text: "Accelerate harder to transfer weight to the rear",
        isCorrect: false,
      },
    ],
    explanation:
      "Understeer is corrected by gently reducing speed so the front tyres can grip again; harsh inputs worsen the skid (Highway Code Rule 118).",
  },
  {
    id: 1717,
    category: Category.VEHICLE_HANDLING,
    question:
      "When the rear of your car starts to slide outward (oversteer), how should you respond?",
    options: [
      {
        text: "Steer gently in the same direction as the skid and ease off the accelerator",
        isCorrect: true,
      },
      {
        text: "Steer sharply opposite to the skid and brake hard",
        isCorrect: false,
      },
      {
        text: "Apply the parking brake immediately",
        isCorrect: false,
      },
      {
        text: "Accelerate to straighten the car",
        isCorrect: false,
      },
    ],
    explanation:
      "Correcting oversteer requires smooth steering into the skid while reducing speed so grip returns (Highway Code Rule 118).",
  },
  {
    id: 1718,
    category: Category.VEHICLE_HANDLING,
    question:
      "Before a tight bend, when should you complete most of your braking to maintain balance?",
    options: [
      {
        text: "Before entering the bend so the car is stable as you steer",
        isCorrect: true,
      },
      {
        text: "Halfway through the bend",
        isCorrect: false,
      },
      {
        text: "While accelerating out of the bend",
        isCorrect: false,
      },
      {
        text: "Only after you exit the bend",
        isCorrect: false,
      },
    ],
    explanation:
      "Braking in a straight line keeps the vehicle balanced, reducing the risk of skidding as you turn (Highway Code Rule 160).",
  },
  {
    id: 1719,
    category: Category.VEHICLE_HANDLING,
    question:
      "Which steering technique gives the best control for low-speed manoeuvres like junction turns?",
    options: [
      {
        text: "Using the pull-push method with both hands on the wheel",
        isCorrect: true,
      },
      {
        text: "Crossing your arms quickly while steering",
        isCorrect: false,
      },
      {
        text: "Steering with one hand at the top of the wheel",
        isCorrect: false,
      },
      {
        text: "Holding the wheel loosely with fingertips",
        isCorrect: false,
      },
    ],
    explanation:
      "Pull-push steering keeps both hands in control and avoids arm tangle during manoeuvres (Highway Code Rule 160).",
  },
  {
    id: 1720,
    category: Category.VEHICLE_HANDLING,
    question:
      "Why should you avoid coasting in neutral while cornering downhill?",
    options: [
      {
        text: "You lose engine braking and the vehicle can run wide",
        isCorrect: true,
      },
      {
        text: "It improves fuel economy but reduces tyre wear",
        isCorrect: false,
      },
      {
        text: "It allows the ABS to work more effectively",
        isCorrect: false,
      },
      {
        text: "It keeps the power steering operating at higher pressure",
        isCorrect: false,
      },
    ],
    explanation:
      "Keeping the car in gear maintains engine braking and better control through bends (Highway Code Rule 160).",
  },
  {
    id: 1721,
    category: Category.VEHICLE_HANDLING,
    question: "How can you move off smoothly on a slippery uphill slope?",
    options: [
      {
        text: "Select second gear, release the clutch gently, and apply minimal throttle",
        isCorrect: true,
      },
      {
        text: "Use first gear with high revs to gain speed quickly",
        isCorrect: false,
      },
      {
        text: "Release the clutch immediately and rely on traction control",
        isCorrect: false,
      },
      {
        text: "Keep the handbrake off and let the car roll backwards first",
        isCorrect: false,
      },
    ],
    explanation:
      "Using a higher gear and gentle inputs reduces wheelspin on slippery inclines (Highway Code Rule 228).",
  },
  {
    id: 1722,
    category: Category.VEHICLE_HANDLING,
    question:
      "What should you do if the traction control warning light flashes while cornering?",
    options: [
      {
        text: "Ease off the accelerator slightly and keep steering smoothly",
        isCorrect: true,
      },
      {
        text: "Switch the traction control off to regain power",
        isCorrect: false,
      },
      {
        text: "Brake sharply to reset the system",
        isCorrect: false,
      },
      {
        text: "Accelerate harder to override the system",
        isCorrect: false,
      },
    ],
    explanation:
      "Traction systems work best when you keep inputs smooth and reduce power slightly to regain grip (Highway Code Rule 118).",
  },
  {
    id: 1723,
    category: Category.VEHICLE_HANDLING,
    question:
      "In an automatic car, how can you maintain control on a long downhill descent?",
    options: [
      {
        text: "Select a lower gear or manual mode to use engine braking",
        isCorrect: true,
      },
      {
        text: "Keep the selector in Drive and coast in neutral intermittently",
        isCorrect: false,
      },
      {
        text: "Apply the parking brake lightly throughout the descent",
        isCorrect: false,
      },
      {
        text: "Switch off overdrive and accelerate to maintain speed",
        isCorrect: false,
      },
    ],
    explanation:
      "Lower gears give additional engine braking so the brakes do not overheat on long descents (Highway Code Rule 160).",
  },
  {
    id: 1724,
    category: Category.VEHICLE_HANDLING,
    question:
      "How should you negotiate a long sweeping bend on a dual carriageway?",
    options: [
      {
        text: "Plan your speed early and steer with smooth, progressive inputs",
        isCorrect: true,
      },
      {
        text: "Brake sharply in the middle of the bend to tighten your line",
        isCorrect: false,
      },
      {
        text: "Hug the inside lane marker regardless of traffic",
        isCorrect: false,
      },
      {
        text: "Accelerate hard before you can see the exit",
        isCorrect: false,
      },
    ],
    explanation:
      "Smooth steering and planned speed changes keep the vehicle stable through fast bends (Highway Code Rule 160).",
  },
  {
    id: 1725,
    category: Category.VEHICLE_HANDLING,
    question:
      "When should you begin to accelerate out of a bend to maintain stability?",
    options: [
      {
        text: "When you can see the exit and start to straighten the steering",
        isCorrect: true,
      },
      {
        text: "While still applying heavy steering input",
        isCorrect: false,
      },
      {
        text: "Before entering the bend to keep the speed constant",
        isCorrect: false,
      },
      {
        text: "Only once you are completely back on a straight road",
        isCorrect: false,
      },
    ],
    explanation:
      "Apply power progressively as the steering unwinds so the tyres share grip evenly (Highway Code Rule 118).",
  },
  {
    id: 1726,
    category: Category.VEHICLE_HANDLING,
    question:
      "Where should you position your hands on the steering wheel for the best control at speed?",
    options: [
      {
        text: "At roughly quarter to three with a firm grip",
        isCorrect: true,
      },
      {
        text: "At twelve o'clock with one hand for relaxation",
        isCorrect: false,
      },
      {
        text: "At the bottom of the wheel to reduce effort",
        isCorrect: false,
      },
      {
        text: "Changing hand positions frequently to stay comfortable",
        isCorrect: false,
      },
    ],
    explanation:
      "Keeping both hands in the quarter-to-three position gives maximum leverage and control (Highway Code Rule 160).",
  },
  {
    id: 1727,
    category: Category.VEHICLE_HANDLING,
    question:
      "How should you drive over a series of speed humps to protect your suspension?",
    options: [
      {
        text: "Slow right down and keep steering and braking smooth",
        isCorrect: true,
      },
      {
        text: "Accelerate between each hump to maintain progress",
        isCorrect: false,
      },
      {
        text: "Straddle the humps with one wheel on the kerb",
        isCorrect: false,
      },
      {
        text: "Brake sharply at the crest of each hump",
        isCorrect: false,
      },
    ],
    explanation:
      "Traffic-calming features should be taken slowly and smoothly to stay in control (Highway Code Rule 152).",
  },
  {
    id: 1728,
    category: Category.VEHICLE_HANDLING,
    question:
      "When reversing with a restricted view, how can you maintain the best control?",
    options: [
      {
        text: "Reverse slowly using clutch control and look all around continuously",
        isCorrect: true,
      },
      {
        text: "Rely solely on mirrors and reverse quickly",
        isCorrect: false,
      },
      {
        text: "Open the door and lean out while coasting backwards",
        isCorrect: false,
      },
      {
        text: "Look only through the rear window without checking blind spots",
        isCorrect: false,
      },
    ],
    explanation:
      "Reverse at walking pace with constant observations to stay in full control (Highway Code Rule 202).",
  },
  {
    id: 1729,
    category: Category.VEHICLE_HANDLING,
    question:
      "How should you rejoin a paved road from a loose gravel driveway to maintain traction?",
    options: [
      {
        text: "Straighten the wheels and accelerate gently until grip increases",
        isCorrect: true,
      },
      {
        text: "Spin the wheels quickly to clear the gravel",
        isCorrect: false,
      },
      {
        text: "Turn sharply while accelerating hard",
        isCorrect: false,
      },
      {
        text: "Apply the handbrake briefly to steady the car",
        isCorrect: false,
      },
    ],
    explanation:
      "Gentle acceleration and straight steering help tyres transition from loose to firm surfaces (Highway Code Rule 228).",
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
  {
    id: 1816,
    category: Category.MOTORWAY_RULES,
    question:
      "What should you do if you miss your exit on a motorway with a hard shoulder?",
    options: [
      {
        text: "Continue to the next junction and replan your route there",
        isCorrect: true,
      },
      {
        text: "Reverse carefully along the hard shoulder",
        isCorrect: false,
      },
      {
        text: "Stop on the hard shoulder and wait for a gap",
        isCorrect: false,
      },
      {
        text: "Make a U-turn when traffic is clear",
        isCorrect: false,
      },
    ],
    explanation:
      "Never reverse or turn on a motorway. Leave at the next exit (Highway Code Rule 270).",
  },
  {
    id: 1817,
    category: Category.MOTORWAY_RULES,
    question:
      "On a smart motorway, what does a mandatory speed limit displayed on a red-ringed sign above the lane mean?",
    options: [
      {
        text: "You must not exceed that speed while the signal is displayed",
        isCorrect: true,
      },
      {
        text: "It’s advisory only if the road looks clear",
        isCorrect: false,
      },
      {
        text: "It applies only to heavy vehicles",
        isCorrect: false,
      },
      {
        text: "You may ignore it after overtaking",
        isCorrect: false,
      },
    ],
    explanation:
      "Red-ringed speed limits on smart motorways are legally enforceable (Highway Code Rule 258).",
  },
  {
    id: 1818,
    category: Category.MOTORWAY_RULES,
    question:
      "Why should you plan regular breaks when driving long distances on the motorway?",
    options: [
      {
        text: "To avoid fatigue and maintain concentration",
        isCorrect: true,
      },
      {
        text: "To keep within motorway toll regulations",
        isCorrect: false,
      },
      {
        text: "To ensure the catalytic converter cools down",
        isCorrect: false,
      },
      {
        text: "To allow others to overtake you more easily",
        isCorrect: false,
      },
    ],
    explanation:
      "Regular breaks help prevent tiredness and maintain alertness (Highway Code Rule 91).",
  },
  {
    id: 1819,
    category: Category.MOTORWAY_RULES,
    question:
      "Where can you find the reference number to give breakdown services when stopped on a motorway?",
    options: [
      {
        text: "On the nearest driver location sign or marker post",
        isCorrect: true,
      },
      {
        text: "Only on your vehicle log book",
        isCorrect: false,
      },
      {
        text: "Painted on the central reservation",
        isCorrect: false,
      },
      {
        text: "Displayed inside the glovebox",
        isCorrect: false,
      },
    ],
    explanation:
      "Driver location signs and marker posts show the precise location for emergency services (Highway Code Rule 275).",
  },
  {
    id: 1820,
    category: Category.MOTORWAY_RULES,
    question:
      "What’s the safest way to rejoin the motorway after stopping in an emergency refuge area on an all-lane-running section?",
    options: [
      {
        text: "Wait for a safe gap and rejoin when the overhead signals allow",
        isCorrect: true,
      },
      {
        text: "Move straight out without checking mirrors",
        isCorrect: false,
      },
      {
        text: "Drive along the refuge lane to build up speed",
        isCorrect: false,
      },
      {
        text: "Reverse back to the previous junction",
        isCorrect: false,
      },
    ],
    explanation:
      "Check the signals, build up speed, and merge when it’s safe (Highway Code smart motorway guidance).",
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
  {
    id: 1916,
    category: Category.RULES_OF_THE_ROAD,
    question:
      "What does a single yellow line along the kerb with an upright sign showing times indicate?",
    options: [
      {
        text: "Waiting restrictions apply only during the times shown",
        isCorrect: true,
      },
      {
        text: "Parking is prohibited for residents only",
        isCorrect: false,
      },
      {
        text: "Loading is banned at all times",
        isCorrect: false,
      },
      {
        text: "The road is for buses and taxis only",
        isCorrect: false,
      },
    ],
    explanation:
      "Single yellow lines restrict waiting during stated times. Check nearby plates (Highway Code Rule 238).",
  },
  {
    id: 1917,
    category: Category.RULES_OF_THE_ROAD,
    question:
      "When may you cross a continuous double white line down the centre of the road?",
    options: [
      {
        text: "To pass a stationary vehicle, cyclist, or road maintenance vehicle travelling at 10 mph or less",
        isCorrect: true,
      },
      {
        text: "To overtake if the road ahead is clear for 100 metres",
        isCorrect: false,
      },
      {
        text: "To turn left into a side road",
        isCorrect: false,
      },
      {
        text: "Whenever traffic behind is queuing",
        isCorrect: false,
      },
    ],
    explanation:
      "Cross solid white lines only for specific reasons such as passing slow or stationary road users (Highway Code Rule 129).",
  },
  {
    id: 1918,
    category: Category.RULES_OF_THE_ROAD,
    question:
      "What is the national speed limit for cars towing trailers on dual carriageways?",
    options: [
      {
        text: "60 mph",
        isCorrect: true,
      },
      {
        text: "50 mph",
        isCorrect: false,
      },
      {
        text: "70 mph",
        isCorrect: false,
      },
      {
        text: "55 mph",
        isCorrect: false,
      },
    ],
    explanation:
      "Cars towing trailers are limited to 60 mph on dual carriageways (Highway Code speed limits).",
  },
  {
    id: 1919,
    category: Category.RULES_OF_THE_ROAD,
    question:
      "Before entering a box junction to go straight ahead, what must you ensure?",
    options: [
      {
        text: "That your exit road is clear so you won’t block the junction",
        isCorrect: true,
      },
      {
        text: "That you can cross before the lights change",
        isCorrect: false,
      },
      {
        text: "That you sound the horn to warn others",
        isCorrect: false,
      },
      {
        text: "That you increase speed to clear it quickly",
        isCorrect: false,
      },
    ],
    explanation:
      "Only enter box junctions if your exit is clear, preventing obstruction (Highway Code Rule 174).",
  },
  {
    id: 1920,
    category: Category.RULES_OF_THE_ROAD,
    question:
      "What is the national speed limit for cars on single carriageway roads?",
    options: [
      {
        text: "60 mph",
        isCorrect: true,
      },
      {
        text: "50 mph",
        isCorrect: false,
      },
      {
        text: "70 mph",
        isCorrect: false,
      },
      {
        text: "40 mph",
        isCorrect: false,
      },
    ],
    explanation:
      "Unless signs show otherwise, the national limit on single carriageways is 60 mph (Highway Code speed limits).",
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
  {
    id: 2016,
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    question: "What does a red circular sign with a white horizontal bar mean?",
    options: [
      {
        text: "No entry for vehicular traffic",
        isCorrect: true,
      },
      {
        text: "End of one-way street",
        isCorrect: false,
      },
      {
        text: "No overtaking",
        isCorrect: false,
      },
      {
        text: "Give way ahead",
        isCorrect: false,
      },
    ],
    explanation:
      "This sign indicates no entry for vehicles; do not proceed beyond it (Highway Code signs).",
  },
  {
    id: 2017,
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    question:
      "A rectangular blue sign with a white 'P' above a wheelchair symbol indicates what?",
    options: [
      {
        text: "Parking reserved for Blue Badge holders",
        isCorrect: true,
      },
      {
        text: "Pedestrian priority zone",
        isCorrect: false,
      },
      {
        text: "No stopping except to load",
        isCorrect: false,
      },
      {
        text: "Multi-storey car park ahead",
        isCorrect: false,
      },
    ],
    explanation:
      "Blue information signs with a wheelchair symbol indicate facilities for disabled users (Highway Code signs).",
  },
  {
    id: 2018,
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    question:
      "What does a triangular sign with a red border and children holding hands warn you about?",
    options: [
      {
        text: "A school nearby; expect children crossing",
        isCorrect: true,
      },
      {
        text: "A pedestrian zone where vehicles are banned",
        isCorrect: false,
      },
      {
        text: "Only cyclists ahead",
        isCorrect: false,
      },
      {
        text: "Play street where driving is prohibited",
        isCorrect: false,
      },
    ],
    explanation:
      "This warning sign indicates a school or children likely to cross. Slow down and be prepared to stop (Highway Code signs).",
  },
  {
    id: 2019,
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    question:
      "What is indicated by a blue circular sign showing a white pedestrian and bicycle symbol side by side?",
    options: [
      {
        text: "A segregated route shared by pedestrians and cyclists",
        isCorrect: true,
      },
      {
        text: "Cyclists must dismount",
        isCorrect: false,
      },
      {
        text: "End of cycle lane",
        isCorrect: false,
      },
      {
        text: "Pedestrians prohibited",
        isCorrect: false,
      },
    ],
    explanation:
      "Blue mandatory signs indicate shared or segregated routes for pedestrians and cyclists (Highway Code signs).",
  },
  {
    id: 2020,
    category: Category.ROAD_AND_TRAFFIC_SIGNS,
    question:
      "What does a yellow-backed rectangular sign showing a motorway junction number help drivers with?",
    options: [
      {
        text: "Advance information about the next junction",
        isCorrect: true,
      },
      {
        text: "A compulsory stop for toll payment",
        isCorrect: false,
      },
      {
        text: "An emergency refuge area",
        isCorrect: false,
      },
      {
        text: "The end of motorway regulations",
        isCorrect: false,
      },
    ],
    explanation:
      "Yellow-backed signs give advance notice of motorway exits to aid route planning (Highway Code motorway signs).",
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
  {
    id: 2116,
    category: Category.DOCUMENTS,
    question: "Which document confirms the registered keeper of a vehicle?",
    options: [
      {
        text: "The V5C registration certificate",
        isCorrect: true,
      },
      {
        text: "The MOT test certificate",
        isCorrect: false,
      },
      {
        text: "The vehicle service book",
        isCorrect: false,
      },
      {
        text: "A driving licence counterpart",
        isCorrect: false,
      },
    ],
    explanation:
      "The V5C records the registered keeper and must be kept up to date (DVLA guidance).",
  },
  {
    id: 2117,
    category: Category.DOCUMENTS,
    question: "When must you notify the DVLA about a change of address?",
    options: [
      {
        text: "As soon as you permanently move home",
        isCorrect: true,
      },
      {
        text: "Only when your insurance renews",
        isCorrect: false,
      },
      {
        text: "Within five years of moving",
        isCorrect: false,
      },
      {
        text: "When your vehicle reaches three years old",
        isCorrect: false,
      },
    ],
    explanation:
      "Keeping the DVLA informed ensures your licence and vehicle records remain valid (DVLA requirements).",
  },
  {
    id: 2118,
    category: Category.DOCUMENTS,
    question: "What is a Statutory Off Road Notification (SORN)?",
    options: [
      {
        text: "A declaration that a vehicle isn’t used on public roads",
        isCorrect: true,
      },
      {
        text: "Permission to exceed speed limits temporarily",
        isCorrect: false,
      },
      {
        text: "A record of penalty points on a licence",
        isCorrect: false,
      },
      {
        text: "A receipt for annual road tax",
        isCorrect: false,
      },
    ],
    explanation:
      "Declaring SORN means the vehicle doesn’t need tax or insurance while kept off road (DVLA).",
  },
  {
    id: 2119,
    category: Category.DOCUMENTS,
    question: "What does a valid MOT certificate confirm?",
    options: [
      {
        text: "The vehicle met minimum safety standards at the time of the test",
        isCorrect: true,
      },
      {
        text: "The vehicle is insured for another year",
        isCorrect: false,
      },
      {
        text: "The vehicle can carry unlimited passengers",
        isCorrect: false,
      },
      {
        text: "The driver has no penalty points",
        isCorrect: false,
      },
    ],
    explanation:
      "An MOT confirms roadworthiness at the time of test; maintenance remains the owner’s responsibility (DVSA).",
  },
  {
    id: 2120,
    category: Category.DOCUMENTS,
    question:
      "When buying a used car, which document should you check to confirm a valid MOT history?",
    options: [
      {
        text: "The GOV.UK MOT history service or MOT certificate",
        isCorrect: true,
      },
      {
        text: "The seller’s driving licence",
        isCorrect: false,
      },
      {
        text: "The vehicle’s fuel receipts",
        isCorrect: false,
      },
      {
        text: "The previous owner’s insurance schedule",
        isCorrect: false,
      },
    ],
    explanation:
      "Check MOT status using official records to ensure the vehicle is legally compliant (DVSA guidance).",
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
  {
    id: 2216,
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    question:
      "What should you do first if you discover a casualty who is unconscious but breathing?",
    options: [
      {
        text: "Check their airway is open and place them in the recovery position",
        isCorrect: true,
      },
      {
        text: "Give them food and drink",
        isCorrect: false,
      },
      {
        text: "Move them into your vehicle",
        isCorrect: false,
      },
      {
        text: "Remove their shoes to cool them down",
        isCorrect: false,
      },
    ],
    explanation:
      "Maintaining an open airway by placing the casualty in the recovery position helps them breathe (Highway Code first aid).",
  },
  {
    id: 2217,
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    question:
      "How should you assist a casualty with severe bleeding from an arm?",
    options: [
      {
        text: "Apply firm pressure to the wound using a clean pad",
        isCorrect: true,
      },
      {
        text: "Remove any embedded objects immediately",
        isCorrect: false,
      },
      {
        text: "Give them a hot drink to prevent shock",
        isCorrect: false,
      },
      {
        text: "Apply a tourniquet above the wound without medical advice",
        isCorrect: false,
      },
    ],
    explanation:
      "Pressure controls bleeding; leave embedded objects and seek medical help (Highway Code first aid).",
  },
  {
    id: 2218,
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    question:
      "If you see a vehicle involved in a collision leaking fuel, what is the safest action?",
    options: [
      {
        text: "Keep people away, switch off engines, and call the emergency services",
        isCorrect: true,
      },
      {
        text: "Light a flare beside the vehicle to warn others",
        isCorrect: false,
      },
      {
        text: "Collect the fuel in a container",
        isCorrect: false,
      },
      {
        text: "Push the vehicle to the side of the road yourself",
        isCorrect: false,
      },
    ],
    explanation:
      "Fuel leaks create fire risk; keep clear and alert emergency services (Highway Code Rule 283).",
  },
  {
    id: 2219,
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    question:
      "What’s the safest way to assist casualties if traffic is still moving past the scene of an incident?",
    options: [
      {
        text: "Warn other drivers by switching on hazard lights and placing a warning triangle if safe",
        isCorrect: true,
      },
      {
        text: "Stand in the live lane waving your arms",
        isCorrect: false,
      },
      {
        text: "Direct traffic without wearing high-visibility clothing",
        isCorrect: false,
      },
      {
        text: "Leave your vehicle blocking the carriageway",
        isCorrect: false,
      },
    ],
    explanation:
      "Warn approaching drivers using hazard lights and triangles (not on motorways) to protect the scene (Highway Code Rule 274).",
  },
  {
    id: 2220,
    category: Category.INCIDENTS_ACCIDENTS_EMERGENCIES,
    question:
      "When contacting emergency services from a motorway emergency phone, what additional information should you provide?",
    options: [
      {
        text: "The number shown on the phone or marker post so they know your exact location",
        isCorrect: true,
      },
      {
        text: "Your tyre pressures and fuel level",
        isCorrect: false,
      },
      {
        text: "Your vehicle’s service history",
        isCorrect: false,
      },
      {
        text: "The full names of all your passengers",
        isCorrect: false,
      },
    ],
    explanation:
      "Location numbers help services reach you quickly. Emergency phones automatically connect to control rooms (Highway Code Rule 275).",
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
  {
    id: 2316,
    category: Category.VEHICLE_LOADING,
    question: "Before loading roof bars, what should you check first?",
    options: [
      {
        text: "The maximum permissible roof load in the vehicle handbook",
        isCorrect: true,
      },
      {
        text: "That the tyres are under-inflated",
        isCorrect: false,
      },
      {
        text: "Whether the rear fog lights are working",
        isCorrect: false,
      },
      {
        text: "That passengers are wearing seat belts",
        isCorrect: false,
      },
    ],
    explanation:
      "Manufacturers specify a roof load limit. Exceeding it can affect stability (vehicle handbook guidance).",
  },
  {
    id: 2317,
    category: Category.VEHICLE_LOADING,
    question: "How should you secure loose tools inside a van?",
    options: [
      {
        text: "Store them in locked compartments or strapped-down containers",
        isCorrect: true,
      },
      {
        text: "Leave them on the floor for easy access",
        isCorrect: false,
      },
      {
        text: "Pile them near the rear doors",
        isCorrect: false,
      },
      {
        text: "Place them on the dashboard",
        isCorrect: false,
      },
    ],
    explanation:
      "Unsecured tools become projectiles in a collision; keep them tied down (Highway Code Rule 98).",
  },
  {
    id: 2318,
    category: Category.VEHICLE_LOADING,
    question:
      "When towing, why is it important to ensure the coupling is correctly attached and locked?",
    options: [
      {
        text: "To prevent the trailer from detaching while in motion",
        isCorrect: true,
      },
      {
        text: "To reduce fuel consumption",
        isCorrect: false,
      },
      {
        text: "To improve radio reception",
        isCorrect: false,
      },
      {
        text: "To avoid checking lights",
        isCorrect: false,
      },
    ],
    explanation:
      "A secure coupling keeps the trailer safely connected; always double-check before moving off (Highway Code Rule 98).",
  },
  {
    id: 2319,
    category: Category.VEHICLE_LOADING,
    question: "How can incorrect nose weight affect a trailer’s stability?",
    options: [
      {
        text: "Too little can cause snaking; too much can overload the towbar",
        isCorrect: true,
      },
      {
        text: "It improves cornering ability",
        isCorrect: false,
      },
      {
        text: "It makes the trailer shorter",
        isCorrect: false,
      },
      {
        text: "It only affects tyre wear",
        isCorrect: false,
      },
    ],
    explanation:
      "Correct nose weight keeps the trailer stable and the towbar within limits (Highway Code Rule 98).",
  },
  {
    id: 2320,
    category: Category.VEHICLE_LOADING,
    question:
      "What routine check should you make on a trailer’s breakaway cable?",
    options: [
      {
        text: "Ensure it’s correctly clipped to a secure point on the towing vehicle",
        isCorrect: true,
      },
      {
        text: "Wrap it around the towbar several times",
        isCorrect: false,
      },
      {
        text: "Tie it in a knot to shorten it",
        isCorrect: false,
      },
      {
        text: "Leave it hanging loose for flexibility",
        isCorrect: false,
      },
    ],
    explanation:
      "A properly secured breakaway cable activates the trailer brakes if it becomes detached (towing safety guidance).",
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

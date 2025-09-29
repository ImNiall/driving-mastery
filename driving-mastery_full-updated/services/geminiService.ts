

import { GoogleGenAI, GenerateContentResponse, Content, FunctionDeclaration, Type } from "@google/genai";
import { ChatMessage, QuizAction, Category } from "../types";
import { SYSTEM_INSTRUCTION, DVSA_CATEGORIES } from '../constants';

// Initialize the Google Gemini API client.
// The API key is sourced from the `process.env.API_KEY` environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Tool Definitions ---

const getUserProgressOverview: FunctionDeclaration = {
    name: 'get_user_progress_overview',
    description: "Provides a complete summary of the user's learning journey, including strengths, weaknesses, time spent, and modules completed. Use this as your first step for almost any coaching-related query.",
    parameters: {
        type: Type.OBJECT,
        properties: {},
        required: []
    }
};

const getSpecificTopicPerformance: FunctionDeclaration = {
    name: 'get_specific_topic_performance',
    description: "Retrieves detailed performance data for a single topic, including a list of the specific questions the user consistently gets wrong.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            topic: {
                type: Type.STRING,
                description: 'The topic to get performance data for, e.g., "Motorway Rules".'
            }
        },
        required: ['topic']
    }
};

const createPersonalizedQuiz: FunctionDeclaration = {
    name: 'create_personalized_quiz',
    description: "Generates a new, custom quiz for the user focused on one or more specific areas of weakness.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            topics: {
                type: Type.ARRAY,
                description: 'A list of topics to include in the quiz, e.g., ["Motorway Rules", "Road and Traffic Signs"].',
                items: {
                    type: Type.STRING
                }
            },
            question_count: {
                type: Type.INTEGER,
                description: 'The number of questions for the quiz.'
            }
        },
        required: ['topics', 'question_count']
    }
};

// --- Mocked Tool Implementations ---

const tools = {
  get_user_progress_overview: () => {
    // In a real app, this would fetch data from a backend or localStorage
    console.log("TOOL CALLED: get_user_progress_overview");
    return {
      user_name: "Alex",
      average_score_percent: 78,
      strengths: ["Attitude", "Safety Margins"],
      weaknesses: ["Road and Traffic Signs", "Motorway Rules"],
      time_spent_per_module: {
        "Road Signs": "5.5 hours",
        "Motorway Rules": "1.2 hours",
        "Alertness": "3 hours"
      },
      quizzes_taken: 25,
      completed_modules: ["Alertness", "Attitude", "Safety Margins"],
      unseen_modules: ["Hazard Perception Principles", "Vehicle Loading"]
    };
  },
  get_specific_topic_performance: ({ topic }: { topic: string }) => {
    console.log(`TOOL CALLED: get_specific_topic_performance with topic: ${topic}`);
    // Mock data for a specific topic
    if (topic === "Motorway Rules") {
        return {
          topic: "Motorway Rules",
          accuracy_percent: 55,
          common_errors: [
            {
              question_id: "q_801",
              question_text: "What does this sign of a number in a red circle on a motorway signify?",
              user_incorrect_answer: "Advisory speed limit."
            },
            {
              question_id: "q_802",
              question_text: "What is the national speed limit for a car on a motorway?",
              user_incorrect_answer: "60 mph."
            }
          ]
        };
    }
    return {
        topic: topic,
        accuracy_percent: 85,
        common_errors: []
    }
  },
  create_personalized_quiz: ({ topics, question_count }: { topics: string[], question_count: number }) => {
    console.log(`TOOL CALLED: create_personalized_quiz with topics: ${topics.join(', ')} and count: ${question_count}`);
    return {
      quiz_created: true,
    };
  }
};

// --- Main Service Function ---

export const getChatResponse = async (history: ChatMessage[]): Promise<{ text: string, action?: QuizAction }> => {
  try {
    const contents: Content[] = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{
          functionDeclarations: [
            getUserProgressOverview,
            getSpecificTopicPerformance,
            createPersonalizedQuiz
          ]
        }],
      },
    });

    const functionCalls = response.functionCalls;

    if (!functionCalls || functionCalls.length === 0) {
      return { text: response.text };
    }
    
    // If there is a function call, execute it and send the response back
    const toolResponseParts = functionCalls.map(fc => {
        const tool = tools[fc.name as keyof typeof tools];
        if (!tool) {
            console.error(`Unknown tool called: ${fc.name}`);
            return {
                functionResponse: {
                    name: fc.name,
                    response: { content: { error: `Function ${fc.name} not found.` } }
                }
            };
        }
        const result = tool(fc.args as any);
        return {
            functionResponse: {
                name: fc.name,
                response: {
                    content: result,
                },
            },
        };
    });
    
    const createQuizCall = functionCalls.find(fc => fc.name === 'create_personalized_quiz');

    const secondResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            ...contents,
            response.candidates![0].content, // Append the model's turn that included the function call
            { role: 'tool', parts: toolResponseParts }, // Append the tool's response
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION
        }
    });

    const responseText = secondResponse.text;

    if (createQuizCall) {
        const topics = createQuizCall.args.topics as string[];
        const questionCount = createQuizCall.args.question_count as number;

        const categories = DVSA_CATEGORIES.filter(c => topics.includes(c)) as Category[];
        
        if (categories.length > 0) {
            return {
                text: responseText,
                action: {
                    type: 'start_quiz',
                    categories: categories,
                    questionCount: questionCount
                }
            };
        }
    }


    return { text: responseText };

  } catch (error) {
    console.error("Error fetching response from Gemini API:", error);
    return { text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later."};
  }
};
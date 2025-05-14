import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const PALM_READING_PROMPT = `As an expert palm reader, analyze this palm image and provide a detailed, authentic palmistry reading in the following JSON format:
{
  "handAnalysis": "Analyze the overall hand shape (square, conical, spatulate, etc.), finger length ratios, and texture. Discuss what these reveal about the person's basic nature and approach to life.",
  
  "majorLines": "Provide a detailed analysis of the following lines: Life line, Head line, Heart line, Girdle of Venus, Sun line, Mercury line, and Fate line. For each, discuss its quality, depth, length, and unique characteristics, and what these reveal about the person's emotional life, intellect, vitality, career, creativity, communication, and destiny.",
  
  "mounts": "Analyze the mounts of the palm: Jupiter, Saturn, Apollo, Mercury, Mars positive, Mars negative, plain of Mars, Luna mount, Neptune mount, and Venus mount. For each mount, describe its prominence or flatness and what this indicates about the person's personality traits, ambitions, talents, and challenges.",
  
  "lifePath": "Based on the lines' intersections and overall pattern, interpret the subject's life direction, potential opportunities, and significant life periods. Mention specific age ranges when relevant.",
  
  "personalityTraits": "Summarize the core personality traits, natural talents and abilities, and potential challenges, referencing both the mounts and the lines. Include any special markings and their traditional meanings in palmistry.",
  
  "futureInsights": "Provide forward-looking insights about upcoming opportunities or challenges, areas for personal growth, and specific guidance for making the most of their potential. Focus on empowering advice rather than predictions."
}

Ensure each section is a single string with proper formatting and line breaks. Do not use nested objects. Use authentic palmistry terminology and tradition in your analysis.`;

export const analyzeHand = async (base64Image) => {
  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            { 
              type: "input_text", 
              text: PALM_READING_PROMPT
            },
            {
              type: "input_image",
              image_url: `data:image/jpeg;base64,${base64Image}`
            }
          ]
        }
      ]
    });

    try {
      // Try to parse the response as JSON
      const parsedReading = JSON.parse(response.output_text);
      
      // Ensure all sections are strings
      return {
        handAnalysis: String(parsedReading.handAnalysis || 'Unable to analyze hand shape'),
        majorLines: String(parsedReading.majorLines || 'Unable to analyze major lines'),
        lifePath: String(parsedReading.lifePath || 'Unable to analyze life path'),
        personalityTraits: String(parsedReading.personalityTraits || 'Unable to analyze personality traits'),
        futureInsights: String(parsedReading.futureInsights || 'Unable to analyze future insights')
      };
    } catch (parseError) {
      // If parsing fails, structure the text response into sections
      const sections = response.output_text.split('\n\n');
      return {
        handAnalysis: String(sections[0] || 'Unable to analyze hand shape'),
        majorLines: String(sections[1] || 'Unable to analyze major lines'),
        lifePath: String(sections[2] || 'Unable to analyze life path'),
        personalityTraits: String(sections[3] || 'Unable to analyze personality traits'),
        futureInsights: String(sections[4] || 'Unable to analyze future insights')
      };
    }
  } catch (error) {
    console.error('Error in palm analysis:', error);
    throw error;
  }
};
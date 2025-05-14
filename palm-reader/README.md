# Palm Reader App

A sophisticated palm reading application that uses AI to analyze palm images and provide detailed readings based on traditional palmistry methods.

## Features

- Take photos of your palm using the device camera
- Choose images from your gallery
- AI-powered palm analysis
- Detailed readings including:
  - Hand Analysis
  - Major Lines
  - Life Path
  - Personality Traits
  - Future Insights

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Open the app and tap "Start Reading"
2. Take a clear photo of your palm or choose an existing image
3. Wait for the AI to analyze your palm
4. View your detailed palm reading
5. Get another reading or share your results

## Requirements

- Node.js 14 or later
- Expo CLI
- iOS 13 or later / Android 5 or later
- OpenAI API key

## Notes

- The app uses GPT-4 Vision to analyze palm images
- Only one hand is needed for an accurate reading
- The AI will automatically determine which hand is best for analysis
- Readings are based on traditional palmistry methods

## License

MIT 
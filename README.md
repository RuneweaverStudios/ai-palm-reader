# Palm Reader App

A sophisticated palm reading application that uses AI (OpenAI Vision) to analyze palm images and provide detailed readings based on traditional palmistry methods.

## Features

- Take photos of your palm using the device camera
- Choose images from your gallery
- AI-powered palm analysis (OpenAI Vision)
- Detailed readings including:
  - Hand Analysis
  - Major Lines
  - Life Path
  - Personality Traits
  - Future Insights
- Share your reading with others

## Screens

- **HomeScreen:** Welcome and instructions, start your reading.
- **CameraScreen:** Take a palm photo or pick from gallery, tips for best results, and hand flip option.
- **ResultScreen:** View your detailed palm reading, share results, and get another reading.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RuneweaverStudios/ai-palm-reader.git
   cd ai-palm-reader/palm-reader
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set your OpenAI API Key:**
   - Add your OpenAI API key to the Expo config.
   - Open `app.json` and add the following under the `expo.extra` section:
     ```json
     "extra": {
       "OPENAI_API_KEY": "your_openai_api_key_here"
     }
     ```
   - Alternatively, you can use environment variables with Expo's secrets management.

4. **Start the development server:**
   ```bash
   npm start
   ```
   or
   ```bash
   expo start
   ```

## Usage

1. Open the app in Expo Go (scan the QR code) or run on an emulator/simulator.
2. Tap **Start Reading**.
3. Take a clear photo of your palm or choose an existing image.
4. Wait for the AI to analyze your palm.
5. View your detailed palm reading.
6. Share your results or get another reading.

## Requirements

- Node.js 14 or later
- Expo CLI (`npm install -g expo-cli`)
- iOS 13+ or Android 5+
- OpenAI API key with GPT-4 Vision access

## Notes

- The app uses OpenAI Vision (GPT-4) to analyze palm images.
- Only one hand is needed for an accurate reading (dominant hand recommended).
- The AI will automatically determine which hand is best for analysis.
- Readings are based on traditional palmistry methods.
- Your API key is required for the AI analysis to work.

## License

MIT 
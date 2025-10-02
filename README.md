# AI Photo Enhancer

An AI-powered photo editing app that uses the Google Gemini API to automatically enhance image colors, apply creative styles, and export professional-grade results.

This application provides a user-friendly interface to leverage the powerful image editing capabilities of the `gemini-2.5-flash-image` model.

## ✨ Features

- **One-Click Enhancement**: Instantly improve your photos with "Auto Color" correction.
- **Batch Processing**: Upload and enhance multiple images at once.
- **Creative Styling**: Guide the AI with text prompts (e.g., "warm vintage tones", "cool cinematic") to achieve a specific look.
- **Advanced Controls**: Automatically align skewed horizons and intelligently crop for better composition.
- **Flexible Export**: Download images in their original size or resized to standard resolutions (1024px, 2048px, 4K).
- **LUT Export**: For any enhancement, generate and download a 3D LUT (.cube file) to use in video editing software like DaVinci Resolve or Adobe Premiere Pro.
- **Bulk Download**: Conveniently download all your enhanced images in a single .zip file.

## 🚀 Tech Stack

- **Frontend**: [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Model**: [Google Gemini API](https://ai.google.dev/)
- **Packaging**: No bundler needed! The app runs directly in the browser using ES Modules and an import map.

## 🛠️ Setup and Running Locally

This project is designed to be simple to run without a complex build setup.

### Prerequisites

- A local web server (e.g., Python's `http.server` or the VS Code [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension).
- An environment where the `process.env.API_KEY` variable is accessible to the JavaScript code. You can get a Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running the App

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-photo-enhancer.git
    cd ai-photo-enhancer
    ```

2.  **Provide the API Key:**
    The application requires a Google Gemini API Key to be available via `process.env.API_KEY`. You must configure your local development and deployment environments to provide this variable. **Do not hardcode your key in the source files.**

3.  **Serve the files:**
    Start your local web server from the project's root directory. For example, using Python:
    ```bash
    python -m http.server
    ```
    Or, right-click `index.html` in VS Code and select "Open with Live Server".

4.  **Open in browser:**
    Navigate to the local server address (e.g., `http://localhost:8000`).

## 🌐 Deployment

### GitHub Pages

Since this project has no build step, you can deploy it directly to GitHub Pages by enabling it in your repository settings to serve from your main branch.

**⚠️ Security Warning:** Deploying this application in its current state to a public URL will expose your `API_KEY` in the client-side code, which is a major security risk. For a public deployment, you must refactor the application to use a backend proxy or a serverless function that securely handles API calls. Your deployment environment (e.g., Vercel, Netlify, or a custom server) would be configured with the API key as a secret environment variable, and the frontend would call your proxy instead of the Gemini API directly.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

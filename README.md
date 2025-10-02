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

-   A modern web browser (e.g., Chrome, Firefox, Safari, Edge).
-   A Google Gemini API Key. You can get one for free from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running the App

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-photo-enhancer.git
    cd ai-photo-enhancer
    ```

2.  **Open `index.html`:**
    Since this is a client-side only application with no build step, you can simply open the `index.html` file in your web browser. For best results, serve the files using a local web server (e.g., using the VS Code [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension or `python -m http.server`).

3.  **Enter Your API Key:**
    On first launch, the application will prompt you to enter your Google Gemini API Key. This key is stored securely in your browser's local storage and is only used to communicate directly with the Google API.

## 🌐 Deployment

### GitHub Pages

This project is perfectly suited for deployment on static hosting services like GitHub Pages, Vercel, or Netlify. Since it has no build step, you can deploy it directly.

**The application is secure to deploy publicly.** It works by asking each user for their own API key, which is stored locally on their device and never exposed. There are no server-side components or secrets to manage.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

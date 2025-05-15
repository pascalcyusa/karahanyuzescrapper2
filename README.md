# Music Discovery Platform

This project is a web application designed for discovering and enjoying music. It features a user-friendly interface for browsing, searching, and playing music, as well as managing user profiles and playlists.

## ✨ Features

*   **Music Playback**: Integrated music player for seamless listening.
*   **Search Functionality**: Easily find tracks, artists, or albums.
*   **User Profiles**: Manage your account and preferences.
*   **Playlist Management**: Create and organize your personal playlists.
*   **Featured & Recommended Music**: Discover new music through curated sections.

## 🛠️ Technologies Used

*   **Frontend**: React, TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS, Shadcn/ui (likely)
*   **Icons**: Lucide React
*   **Backend/Database**: Firebase (for features like authentication, data storage)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v18.x or later recommended)
*   npm or bun (as `bun.lockb` is present)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd karahanyuzescrapper2
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using Bun:
    ```bash
    bun install
    ```

3.  **Set up Firebase:**
    *   Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
    *   Obtain your Firebase project configuration (apiKey, authDomain, etc.).
    *   Create a `.env` file in the root of the project or update the Firebase configuration in `src/lib/firebase.ts` with your project's credentials.
        Example for `src/lib/firebase.ts` (update with your actual config):
        ```typescript
        // src/lib/firebase.ts
        import { initializeApp } from "firebase/app";
        // import { getAnalytics } from "firebase/analytics"; // If you use analytics
        import { getAuth } from "firebase/auth";
        import { getFirestore } from "firebase/firestore";

        const firebaseConfig = {
          apiKey: "YOUR_API_KEY",
          authDomain: "YOUR_AUTH_DOMAIN",
          projectId: "YOUR_PROJECT_ID",
          storageBucket: "YOUR_STORAGE_BUCKET",
          messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
          appId: "YOUR_APP_ID",
          // measurementId: "YOUR_MEASUREMENT_ID" // If you use analytics
        };

        const app = initializeApp(firebaseConfig);
        // const analytics = getAnalytics(app); // If you use analytics
        export const auth = getAuth(app);
        export const db = getFirestore(app);
        export default app;
        ```

4.  **Run the development server:**
    Using npm:
    ```bash
    npm run dev
    ```
    Or using Bun:
    ```bash
    bun run dev
    ```

    The application should now be running on `http://localhost:5173` (or another port if specified by Vite).

## 📜 License

This project is licensed under the MIT License - see the LICENSE.md file for details (if applicable, otherwise specify or remove this section).
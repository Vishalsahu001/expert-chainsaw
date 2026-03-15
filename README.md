# Interview AI 🚀
### Your Personal AI-Powered Interview Strategist

Interview AI is a high-end MERN stack application designed to help job seekers prepare for interviews with surgical precision. By analyzing a user's resume and a specific job description, the platform uses Google's Gemini AI to generate a hyper-personalized preparation strategy.

---

## 🌟 Key Features

- **Personalized Interview Strategy**: Generates a custom plan based on your unique profile and the target role.
- **AI-Powered Question Generation**: Produces a curated list of Technical and Behavioral questions you are likely to face.
- **Skill Gap Analysis**: Identifies exactly where your profile falls short compared to the job description and suggests ways to improve.
- **Day-Wise Preparation Plan**: Provides a structured, actionable roadmap to get you interview-ready.
- **Dynamic Resume Upload**: Interactive drag-and-drop resume uploader with instant feedback.
- **Premium UI/UX**: A state-of-the-art dashboard featuring glassmorphism, smooth animations, and a modern dark-themed aesthetic.
- **History Tracking**: Keeps a record of all your generated strategy plans for easy retrieval.

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js**: Core UI library.
- **React Router**: For seamless single-page navigation.
- **SASS (SCSS)**: For advanced, high-end modular styling.
- **Axios**: For robust API communication.
- **Canvas API**: Used for background grain and textured effects to give a premium feel.

### **Backend**
- **Node.js & Express.js**: Fast and scalable server architecture.
- **MongoDB & Mongoose**: Database for storing user profiles and generated AI reports.
- **Google GenAI (Gemini)**: The brain behind the interview strategies and question generation.
- **Multer**: For handling secure resume file uploads.
- **PDF-Parse**: For extracting technical depth from uploaded resumes.
- **JSONWebToken (JWT)**: For secure user authentication.

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)
- Google Gemini API Key

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/Vishalsahu001/expert-chainsaw.git
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   # Create a .env file with your MONGO_URI, JWT_SECRET, and GOOGLE_GENAI_API_KEY
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   npm run dev
   ```

---

## 📈 Objective
The primary objective of **Interview AI** is to bridge the gap between a candidate's current profile and their dream job. By leveraging Generative AI, it provides the insights of a professional career coach instantly, helping users walk into their interviews with confidence and a clear plan.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
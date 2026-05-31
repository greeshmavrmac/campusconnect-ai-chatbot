# CampusConnect AI – Intelligent College FAQ Assistant

CampusConnect AI is a real-world, highly optimized, bilingual virtual assistant designed to deliver lightning-fast, highly accurate college-related information to students and parents. It handles admissions criteria, fee payments, examination calendars, placement records, and campus facilities in both **English and Telugu**.

To facilitate college project submissions and internship resumes, the system is designed in a modern **Full-Stack layout**. In this workspace, it executes as a robust **React 19 (Vite) + Node.js (Express) server-side matching system**. It also includes instructions and blueprints for running a **Python Flask + Scikit-Learn** counterpart, allowing total curriculum flexibility.

---

## 🚀 Key Architectural Capabilities

1. **Intelligent Vectorization engine (From scratch)**: Tokenizes, normalizes, strips punctuation, removes stopwords (for both English and Telugu), computes Term Frequencies (TF), dynamically figures Inverse Document Frequencies (IDF) across active FAQs, and runs Cosine Similarity calculations.
2. **Dynamic Keyword Boosting**: Increases matching accuracy by checking for direct overlaps between user query words and specified indexing keywords.
3. **Advanced AI Fallback Service**: If matching similarity flags fall below our optimal confidence limit, the server utilizes the **Gemini 3.5 Flash** model (via the official `@google/genai` SDK) to answer questions correctly *only* within the context of the college faqs, preventing hallucination.
4. **Bilingual Voice Support**: Implements dual-channel browser speech synthesis (`window.speechSynthesis`) to recite English answers with fluent Indian pronunciation and Telugu answers with authentic accents. Supports microphone Speech Recognition (`webkitSpeechRecognition`) for hands-free queries.
5. **Dynamic Dashboard Analytics**: Displays real-time KPIs (total queries, response accuracy rate, language shares) and Recharts charts mapping usage distributions and daily activity trends.
6. **Double-confirmed Admin CRUD**: Secure password-gated dashboard of campus coordinators (`admin / admin123`) to Add, Edit, Update, or Delete FAQ records reflecting directly onto disk.

---

## 🗂️ Project Directory Structure

```text
CampusConnect-AI/
├── data/                            # Persistent File-System Database
│   ├── faqs.json                    # FAQ core knowledge base (Bilingual)
│   └── queries.json                 # Query history logs & analytics
├── src/                             # Front-End Source (React 19 + TypeScript)
│   ├── components/
│   │   ├── Sidebar.tsx              # Sidebar navigation, filters & brand
│   │   ├── ChatCenter.tsx           # Voice/text chat workspace with ratings
│   │   ├── ExploreFAQs.tsx          # Categorized search and clickable cards
│   │   ├── AnalyticsConsole.tsx     # Recharts KPIs, pies, lines, and logs list
│   │   └── AdminPanel.tsx           # Security-gated CRUD forms & connectors
│   ├── lib/
│   │   └── nlp.ts                   # From-scratch TF-IDF and Cosine calculations
│   ├── App.tsx                      # Root coordinator and state synchronizer
│   ├── main.tsx                     # React rendering entry-point
│   ├── types.ts                     # Type definitions and interfaces
│   └── index.css                    # Global tailwind directive
├── server.ts                        # Express backend, matching routes & Vite proxy
├── requirements.txt                 # Python ML requirements counterpart
├── package.json                     # Node/Vite build configurations
├── tsconfig.json                    # TS compiler options
└── README.md                        # Documentation and Setup instructions
```

---

## 🧠 NLP Similarity Mathematical Model

The matching pipeline executes the following mathematical sequence for every query:

1. **Preprocessing / Tokenization**:
   $$\text{Tokens}(d) = \{ \text{words in } d \} \setminus \text{Stopwords}$$

2. **Term Frequency (TF)**:
   $$\text{TF}(t, d) = \frac{\text{Count}(t \text{ in } d)}{\text{Total Words in } d}$$

3. **Inverse Document Frequency (IDF)**:
   $$\text{IDF}(t, D) = \ln\left(1 + \frac{|D|}{1 + |\{d \in D : t \in d\}|}\right)$$

4. **Cosine Similarity Formula**:
   $$\text{Similarity}(Q, D) = \frac{\vec{Q} \cdot \vec{D}}{\|\vec{Q}\| \|\vec{D}\|} = \frac{\sum_{i=1}^{n} w_{i,Q} w_{i,D}}{\sqrt{\sum_{i=1}^{n} w_{i,Q}^2} \sqrt{\sum_{i=1}^{n} w_{i,D}^2}}$$

---

## ⚙️ Setup and Installation (VS Code Local Run)

### Option A: Running the React + Node.js Application (Recommended)

This compiles and runs the exact responsive application displayed in your AI Studio preview iframe.

#### Prerequisites
- Download and install [Node.js (v18 or higher)](https://nodejs.org/)

#### Step-by-Step Commands
1. **Unzip the Project** and open the folder in VS Code (`File > Open Folder`).
2. **Install node dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment variables (.env)**:
   Create a `.env` file in the root folder and add your Gemini API Key for smart AI fallbacks:
   ```env
   GEMINI_API_KEY="YOUR_ACTUAL_API_KEY_HERE"
   ```
4. **Boot the Developer servers**:
   ```bash
   npm run dev
   ```
5. **Open Browser**:
   Navigate to `http://localhost:3000` to interact with the application.

---

### Option B: Running the Python Flask + Machine Learning backend

If your college submission explicitly mandates a **Python Flask backend** with Scikit-Learn libraries, follow this guide to script a matching module using requirements.txt.

#### Prerequisites
- Download and install [Python (v3.9 or higher)](https://www.python.org/)

#### Step-by-step Setup
1. **Set up a Virtual Environment**:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
2. **Install requirements**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Run Python Helper logic**:
   You can easily translate our custom TS `nlp.ts` file to Python using the standard `scikit-learn` imports:
   ```python
   # python-blueprint example
   from flask import Flask, request, jsonify
   from sklearn.feature_extraction.text import TfidfVectorizer
   from sklearn.metrics.pairwise import cosine_similarity
   import json

   app = Flask(__name__)

   @app.route('/api/chat', methods=['POST'])
   def python_chat():
       data = request.json
       query = data.get("message", "")
       # TF-IDF & Cosine Similarity computations fit here beautifully
       return jsonify({"answer": "Python ML synthesis response result"})

   if __name__ == '__main__':
       app.run(port=5000)
   ```

---

## 🛡️ Admin Password Credentials
- **Admin Username**: `admin`
- **Security Password**: `admin123`
*(Can be customized in server.ts or overridden with an `ADMIN_PASSWORD` environment variable).*

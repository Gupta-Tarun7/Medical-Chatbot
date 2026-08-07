# 🩺 Medical Chatbot using LangChain, Flask & Pinecone

A Retrieval-Augmented Generation (RAG) based Medical Chatbot built using **LangChain**, **Flask**, **Pinecone**, and **Hugging Face**.

The chatbot retrieves relevant information from medical documents stored in a Pinecone vector database and uses a Hugging Face language model to generate responses.

> ⚠️ **Medical Disclaimer:** This chatbot is intended for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.

---

## 🚀 Features

- 🩺 Medical Question Answering
- 🔎 Retrieval-Augmented Generation (RAG)
- 📚 PDF document-based knowledge retrieval
- 🧠 LangChain integration
- 🌲 Pinecone vector database
- 🤗 Hugging Face embeddings
- 💬 Interactive chat interface
- 🌙 Dark mode
- 🗑️ Clear chat functionality
- 📱 Responsive web interface
- ⚡ Flask backend
- 🚀 Gunicorn production server
- ☁️ Render deployment

---

## 🛠️ Tech Stack

### Backend

- Python
- Flask
- Gunicorn
- LangChain

### AI / RAG

- Hugging Face
- Sentence Transformers
- Pinecone
- Retrieval-Augmented Generation

### Frontend

- HTML
- CSS
- JavaScript
- jQuery
- Font Awesome

### Deployment

- GitHub
- Render

---

# 📂 Project Structure

```text
Medical-Chatbot/
│
├── data/
│   └── data.pdf
│
├── research/
│   └── trials.ipynb
│
├── src/
│   ├── __init__.py
│   ├── helper.py
│   └── prompt.py
│
├── static/
│   ├── script.js
│   └── style.css
│
├── templates/
│   └── chat.html
│
├── app.py
├── store_index.py
├── requirements.txt
├── setup.py
├── .gitignore
├── LICENSE
└── README.md
```

---

# 🧠 How It Works

The chatbot uses a Retrieval-Augmented Generation pipeline.

```text
                  User Question
                       │
                       ▼
                 Flask Web App
                       │
                       ▼
                Query Processing
                       │
                       ▼
              Embedding Generation
                       │
                       ▼
              Pinecone Vector Search
                       │
                       ▼
             Relevant Medical Documents
                       │
                       ▼
                Hugging Face LLM
                       │
                       ▼
                Generated Answer
                       │
                       ▼
                 Chat Interface
```

---

# 📚 RAG Pipeline

The medical PDF is processed using the following pipeline:

```text
Medical PDF
     │
     ▼
PyPDFLoader
     │
     ▼
Text Extraction
     │
     ▼
RecursiveCharacterTextSplitter
     │
     ▼
Text Chunks
     │
     ▼
Hugging Face Embeddings
     │
     ▼
Pinecone Vector Database
```

When a user asks a question, the system retrieves the most relevant document chunks from Pinecone and provides them to the language model to generate an answer.

---

# ⚙️ Installation

## Step 1 — Clone the Repository

```bash
git clone https://github.com/Gupta-Tarun7/Medical-Chatbot.git
cd Medical-Chatbot
```

---

## Step 2 — Create Conda Environment

Create a Python 3.11 environment:

```bash
conda create -n genai python=3.11
```

Activate the environment:

```bash
conda activate genai
```

---

## Step 3 — Install Dependencies

Install the required Python packages:

```bash
pip install -r requirements.txt
```

---

# 🔐 Environment Variables

Create a `.env` file in the root directory of the project.

```env
PINECONE_API_KEY=your_pinecone_api_key
HF_TOKEN=your_huggingface_token
```

Your project should look like:

```text
Medical-Chatbot/
│
├── .env
├── app.py
├── store_index.py
├── requirements.txt
└── ...
```

### ⚠️ Important

Never upload your `.env` file to GitHub.

Your `.gitignore` should contain:

```gitignore
.env
__pycache__/
*.pyc
.ipynb_checkpoints/
.venv/
```

---

# 🌲 Create Pinecone Vector Index

Before running the chatbot, create the Pinecone vector index and upload the medical document embeddings.

Run:

```bash
python store_index.py
```

This process will:

1. Load the medical PDF.
2. Extract text from the PDF.
3. Split the text into smaller chunks.
4. Generate embeddings using Hugging Face.
5. Create the Pinecone index if it does not already exist.
6. Upload the embeddings to Pinecone.

---

# ▶️ Run the Application Locally

Start the Flask application:

```bash
python app.py
```

The application will run at:

```text
http://127.0.0.1:8080
```

Open the URL in your browser.

---

# 🚀 Production Deployment

For production deployment, the Flask application uses **Gunicorn**.

The production start command is:

```bash
gunicorn app:app
```

Here:

```text
app.py
   │
   └── app = Flask(__name__)
```

Therefore:

```bash
gunicorn app:app
```

means:

```text
gunicorn <python_file>:<flask_application_variable>
```

---

# ☁️ Deploy on Render

This project can be deployed as a **Web Service on Render**.

## Step 1 — Push the Project to GitHub

Make sure the repository contains:

```text
app.py
requirements.txt
setup.py
src/
static/
templates/
.gitignore
README.md
```

Do not upload:

```text
.env
__pycache__/
.venv/
```

---

## Step 2 — Create a Render Web Service

Create a new **Web Service** on Render and connect your GitHub repository.

Select:

```text
Medical-Chatbot
```

---

## Step 3 — Configure the Build Command

Use:

```bash
pip install -r requirements.txt
```

---

## Step 4 — Configure the Start Command

Use:

```bash
gunicorn app:app
```

---

## Step 5 — Add Environment Variables

In the Render **Environment Variables** section, add:

```text
PINECONE_API_KEY
```

and provide your Pinecone API key.

Add:

```text
HF_TOKEN
```

and provide your Hugging Face token.

Your Render environment variables should look like:

```text
PINECONE_API_KEY = your_pinecone_api_key
HF_TOKEN         = your_huggingface_token
```

### ⚠️ Security

Do not put API keys directly inside Python files.

Do not upload your `.env` file to GitHub.

---

# 📦 Requirements

The project uses the following major dependencies:

```text
gunicorn
langchain
langchain-core
langchain-community
langchain-huggingface
langchain-pinecone
langchain-classic
pinecone
sentence-transformers
transformers
huggingface-hub
python-dotenv
pypdf
flask
```

The exact package versions are available in:

```text
requirements.txt
```

Install them using:

```bash
pip install -r requirements.txt
```

---

# 💬 Example Questions

You can ask questions such as:

```text
What is diabetes?
```

```text
What are the symptoms of asthma?
```

```text
What causes acne?
```

```text
What is hypertension?
```

```text
What are the treatments for hypertension?
```

```text
What are the symptoms of diabetes?
```

---

# 🔄 RAG Workflow

When a user asks a question, the application follows this workflow:

```text
User
 │
 ▼
Flask Web Interface
 │
 ▼
User Question
 │
 ▼
Embedding Model
 │
 ▼
Pinecone Vector Search
 │
 ▼
Relevant Medical Documents
 │
 ▼
Prompt + Retrieved Context
 │
 ▼
Hugging Face Language Model
 │
 ▼
Generated Response
 │
 ▼
User
```

---

# 🧪 Local Development Commands

Activate the Conda environment:

```bash
conda activate genai
```

Navigate to the project:

```bash
cd Medical-Chatbot
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create the Pinecone vector index:

```bash
python store_index.py
```

Run the Flask application:

```bash
python app.py
```

Run the application using Gunicorn:

```bash
gunicorn app:app
```

---

# 🔒 Security

Never commit API keys, tokens, or credentials to GitHub.

The following files and directories should not be committed:

```text
.env
__pycache__/
*.pyc
.venv/
```

Recommended `.gitignore`:

```gitignore
.env
__pycache__/
*.pyc
.ipynb_checkpoints/
.venv/
```

If an API key is accidentally pushed to GitHub, immediately revoke the exposed key and generate a new one.

---

# ⚠️ Medical Disclaimer

This chatbot is designed for educational and informational purposes only.

It:

- Does not provide professional medical diagnosis.
- Does not replace a qualified healthcare professional.
- Should not be used for emergency medical decisions.
- May generate inaccurate, incomplete, or outdated information.

Always consult a qualified healthcare professional for diagnosis, treatment, and medical advice.

---

# 📌 Important Notes

### Pinecone

The Pinecone vector index must be populated before the chatbot can retrieve medical information.

Run:

```bash
python store_index.py
```

before using the chatbot with a new Pinecone index.

### Hugging Face

A valid Hugging Face token must be configured:

```text
HF_TOKEN
```

### Pinecone API

A valid Pinecone API key must be configured:

```text
PINECONE_API_KEY
```

### Production Server

For production deployment, use:

```bash
gunicorn app:app
```

instead of:

```bash
python app.py
```

---

# 🌐 Deployment Architecture

```text
                    Internet
                       │
                       ▼
                    Render
                       │
                       ▼
                 Gunicorn
                       │
                       ▼
                   Flask
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
        Hugging Face         Pinecone
         Embeddings        Vector Database
              │                 │
              └────────┬────────┘
                       │
                       ▼
                 Medical RAG
                       │
                       ▼
                 Chat Response
```

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Tarun Gupta**

GitHub:

https://github.com/Gupta-Tarun7
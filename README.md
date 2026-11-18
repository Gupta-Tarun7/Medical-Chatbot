# 🩺 Medical Chatbot using LangChain, Flask, Groq & Pinecone

A Retrieval-Augmented Generation (RAG) based Medical Chatbot built using **LangChain**, **Flask**, **Groq**, **Pinecone**, and **FastEmbed** (local `all-MiniLM-L6-v2` embeddings).

The chatbot retrieves relevant information from medical documents stored in a Pinecone vector database and uses a Groq-hosted language model to generate responses based on the retrieved context.

> ⚠️ **Medical Disclaimer:** This chatbot is intended for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.

---

## 🚀 Features

* 🩺 Medical Question Answering
* 🔎 Retrieval-Augmented Generation (RAG)
* 📚 PDF document-based knowledge retrieval
* 🧠 LangChain integration
* 🌲 Pinecone vector database
* 🧬 Local `all-MiniLM-L6-v2` embeddings via FastEmbed (ONNX, no paid embedding API)
* ⚡ Groq LLM inference
* 💬 Interactive chat interface
* 🌙 Dark mode
* 🗑️ Clear chat functionality
* 📱 Responsive web interface
* ⚡ Flask backend
* 🚀 Gunicorn production server
* ☁️ Render deployment

---

## 🛠️ Tech Stack

### Backend

* Python
* Flask
* Gunicorn
* LangChain

### AI / RAG

* LangChain
* Groq
* `openai/gpt-oss-20b`
* FastEmbed (ONNX runtime)
* `sentence-transformers/all-MiniLM-L6-v2`
* Pinecone
* Retrieval-Augmented Generation

### Frontend

* HTML
* CSS
* JavaScript
* jQuery
* Font Awesome

### Deployment

* GitHub
* Render

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
        Local Query Embedding (FastEmbed, MiniLM)
                          │
                          ▼
                 Pinecone Search
                          │
                          ▼
             Relevant Medical Documents
                          │
                          ▼
                  Retrieved Context
                          │
                          ▼
                    Groq LLM
                          │
                          ▼
                  Generated Answer
                          │
                          ▼
                   Chat Interface
```

The application separates **knowledge retrieval** from **answer generation**:

* `all-MiniLM-L6-v2`, run locally through FastEmbed, converts text and questions into 384-dimensional embeddings.
* Pinecone stores and searches those vectors.
* Groq processes the retrieved medical context and generates the final response.

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
all-MiniLM-L6-v2 Embeddings
     │
     ▼
384-Dimensional Vectors
     │
     ▼
Pinecone Vector Database
```

When a user asks a question:

```text
User Question
      │
      ▼
all-MiniLM-L6-v2 (local, FastEmbed)
      │
      ▼
Query Vector
      │
      ▼
Pinecone Similarity Search
      │
      ▼
Top 3 Relevant Chunks
      │
      ▼
Prompt + Retrieved Context
      │
      ▼
Groq LLM
      │
      ▼
Final Answer
```

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

Install the required packages:

```bash
pip install -r requirements.txt
```

---

# 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
PINECONE_API_KEY=your_pinecone_api_key
GROQ_API_KEY=your_groq_api_key
```

### Why are these keys required?

| Variable           | Purpose                                    |
| ------------------ | ------------------------------------------ |
| `PINECONE_API_KEY` | Connects to Pinecone vector database       |
| `GROQ_API_KEY`     | Allows the application to use the Groq LLM |

> ℹ️ `HF_TOKEN` is **no longer required**. Embeddings are generated locally, so no Hugging Face Inference API call is made. You may optionally set a free `HF_TOKEN` to get faster first-time model downloads and silence the "unauthenticated requests" warning.

Your project should look like:

```text
Medical-Chatbot/

├── .env
├── app.py
├── store_index.py
├── requirements.txt
└── ...
```

### ⚠️ Important

Never upload `.env` to GitHub.

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

Before running the chatbot, the Pinecone index must be populated with the medical document embeddings.

Run **once**:

```bash
python store_index.py
```

The script will:

1. Load the medical PDF.
2. Extract text from the PDF.
3. Filter document metadata.
4. Split the text into chunks.
5. Generate embeddings using `all-MiniLM-L6-v2`.
6. Create a Pinecone index if it does not already exist.
7. Upload the vectors to Pinecone.

The Pinecone index uses:

```text
Index name: medical-chatbot
Dimension: 384
Metric: cosine
Cloud: AWS
Region: us-east-1
```

The dimension is `384` because `all-MiniLM-L6-v2` generates 384-dimensional embeddings.

> ⚠️ **Do not run `store_index.py` again on an index that is already populated.** Each run adds the chunks again with new IDs, which creates duplicate records. If you need to rebuild, delete the index in the Pinecone console first.

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

> ⏳ **First run:** FastEmbed downloads the embedding model (about 90 MB), so startup can take 30 seconds to 2 minutes. Later runs start in a few seconds because the model is cached.

---

# 🤖 Groq LLM

The chatbot uses Groq for language-model inference.

The current model configured in `app.py` is:

```python
llm = ChatGroq(
    model="openai/gpt-oss-20b",
    temperature=0.2,
    max_tokens=1024,
    groq_api_key=GROQ_API_KEY
)
```

Groq is responsible for generating the final answer after relevant medical information has been retrieved from Pinecone.

---

# 🔎 Vector Embeddings

The project uses:

```text
sentence-transformers/all-MiniLM-L6-v2
```

for generating embeddings, executed locally with **FastEmbed** (ONNX runtime, no PyTorch required).

The embedding size is:

```text
384 dimensions
```

In `src/helper.py`:

```python
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings

def download_embeddings():
    return FastEmbedEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
```

These embeddings are used for both:

* Medical document chunks
* User queries

Using the same embedding model for documents and queries ensures that they exist in the same vector space for similarity search. **If you change the embedding model, you must re-create the Pinecone index and re-embed all documents.**

### Why local embeddings?

Earlier versions called the Hugging Face Inference API for every question. Once the account's free Inference Providers credits ran out, the API returned `402 Payment Required` and every chat request failed with a 500 error. Running the same model locally removes that dependency, costs nothing, and produces the same kind of vectors, so the existing Pinecone index keeps working without re-indexing.

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
         Local all-MiniLM-L6-v2 Embedding (FastEmbed)
                          │
                          ▼
                  Pinecone Search
                          │
                          ▼
               Top 3 Relevant Chunks
                          │
                          ▼
             Prompt + Retrieved Context
                          │
                          ▼
                    Groq LLM
                          │
                          ▼
                  Generated Response
                          │
                          ▼
                         User
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
What is jock itch?
```

The chatbot answers using the information retrieved from the medical knowledge base.

---

# 🚀 Production Deployment

For production deployment, the application uses **Gunicorn**.

Run:

```bash
gunicorn --workers 1 --threads 1 --timeout 120 --bind 0.0.0.0:$PORT app:app
```

Here:

```text
app.py
   │
   └── app = Flask(__name__)
```

Therefore `app:app` means:

```text
gunicorn <python_file>:<flask_application_variable>
```

A single worker keeps memory usage low, and the 120-second timeout leaves room for the embedding model to load on startup.

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

Create a new Web Service on Render and connect your GitHub repository.

Select:

```text
Medical-Chatbot
```

---

## Step 3 — Configure Build Command

Use:

```bash
pip install -r requirements.txt
```

---

## Step 4 — Configure Start Command

Use:

```bash
gunicorn --workers 1 --threads 1 --timeout 120 --bind 0.0.0.0:$PORT app:app
```

---

## Step 5 — Add Environment Variables

Add the following environment variables in Render:

```text
PINECONE_API_KEY
GROQ_API_KEY
```

For example:

```text
PINECONE_API_KEY = your_pinecone_api_key
GROQ_API_KEY     = your_groq_api_key
```

### ⚠️ Security

Do not put API keys directly inside Python files.

Do not upload `.env` to GitHub.

### ⏳ Startup note

On each fresh start, the embedding model (about 90 MB) is downloaded before the app begins serving requests, so allow 1 to 2 minutes after a deploy or after the free-tier instance wakes from sleep. Watch the Render logs for `Listening at` to confirm the app is ready. FastEmbed uses ONNX instead of PyTorch to stay within small memory limits; if the worker is killed for running out of memory, upgrade to a larger Render instance.

---

# 📦 Requirements

The project uses the following major dependencies:

```text
Flask
Gunicorn
Python-dotenv

LangChain
LangChain Core
LangChain Community
LangChain Classic
LangChain Pinecone
LangChain Groq

Pinecone
FastEmbed

PyPDF
LangChain Text Splitters
```

The exact versions are available in:

```text
requirements.txt
```

Install them using:

```bash
pip install -r requirements.txt
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

Create the Pinecone vector index and upload document embeddings (only needed for a new, empty index):

```bash
python store_index.py
```

Run the Flask application:

```bash
python app.py
```

For production-style local execution:

```bash
gunicorn app:app
```

---

# 🛠️ Troubleshooting

| Problem | Likely cause and fix |
| ------- | -------------------- |
| First startup is slow | The embedding model is being downloaded; it is cached afterwards |
| `Vector dimension ... does not match the dimension of the index` | The embedding model does not match the model used to build the index. Use `all-MiniLM-L6-v2` (384 dims) with the `medical-chatbot` index |
| Empty or irrelevant answers | The Pinecone index is empty or points to the wrong index name in `app.py` |
| `ModuleNotFoundError: No module named 'src'` | Run commands from the project root folder |
| Worker killed / out of memory on Render | Upgrade the instance size |
| Chat returns "Sorry, I was unable to generate a response" | Check the server logs for the traceback; usually a missing or invalid `PINECONE_API_KEY` or `GROQ_API_KEY` |

---

# 🔒 Security

Never commit API keys, tokens, or credentials to GitHub.

The following files and directories should not be committed:

```text
.env
__pycache__/
*.pyc
.venv/
.ipynb_checkpoints/
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

* Does not provide professional medical diagnosis.
* Does not replace a qualified healthcare professional.
* Should not be used for emergency medical decisions.
* May generate inaccurate, incomplete, or outdated information.
* Should not be relied upon as the sole source for medical decisions.

Always consult a qualified healthcare professional for diagnosis, treatment, and medical advice.

---

# 📌 Important Notes

### Pinecone

The Pinecone vector index must be populated before the chatbot can retrieve medical information. The index name used by `app.py` is:

```text
medical-chatbot
```

Run:

```bash
python store_index.py
```

only when setting up a new, empty index or knowledge base.

### Groq

A valid Groq API key must be configured:

```text
GROQ_API_KEY
```

The application currently uses:

```text
openai/gpt-oss-20b
```

for response generation.

### Embeddings

Embeddings run locally with FastEmbed. No Hugging Face token or paid embedding API is needed. The embedding model is:

```text
sentence-transformers/all-MiniLM-L6-v2
```

### Pinecone API

A valid Pinecone API key must be configured:

```text
PINECONE_API_KEY
```

### Production Server

For production deployment, use:

```bash
gunicorn --workers 1 --threads 1 --timeout 120 --bind 0.0.0.0:$PORT app:app
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
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
     Local Query Embedding         Pinecone
     (FastEmbed, MiniLM)        Vector Database
              │                       │
              └───────────┬───────────┘
                          │
                          ▼
                     Retrieved
                      Context
                          │
                          ▼
                       Groq LLM
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
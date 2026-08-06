# 🩺 Medical Chatbot using LangChain, Flask & Pinecone

A Retrieval-Augmented Generation (RAG) based Medical Chatbot built with **LangChain**, **Flask**, **Pinecone**, and **Hugging Face embeddings**. The chatbot allows users to ask questions based on medical documents stored in a vector database.

---

## 📂 Project Structure

```
Medical-Chatbot/
│
├── research/               # Jupyter notebooks and experiments
├── src/                    # Source code
├── static/                 # CSS & JavaScript
├── templates/              # HTML templates
│   └── chat.html
│
├── app.py                  # Flask application
├── store_index.py          # Creates vector embeddings
├── requirements.txt
├── setup.py
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Features

- Medical Question Answering
- Retrieval-Augmented Generation (RAG)
- LangChain Integration
- Pinecone Vector Database
- Hugging Face Embeddings
- Responsive Chat Interface
- Flask Backend

---

## 🛠 Tech Stack

- Python
- Flask
- LangChain
- Pinecone
- Hugging Face
- Hugging Face Embeddings
- HTML
- CSS
- JavaScript

---

# Installation

## Step 1: Clone the Repository

```bash
git clone https://github.com/Gupta-Tarun7/Medical-Chatbot.git

cd Medical-Chatbot
```
---

## Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Step 3: Create a `.env` File

Create a `.env` file in the project root.

```env
PINECONE_API_KEY=your_pinecone_api_key
HF_TOKEN=your_huggingface_token
```

---

## Step 4: Create the Vector Index

```bash
python store_index.py
```

---

## Step 5: Run the Application

```bash
python app.py
```

---

## Open the Application

```
http://127.0.0.1:8080
```

---

# AWS Deployment (Optional)

## AWS Services Used

- Amazon EC2
- Amazon ECR
- GitHub Actions

### IAM Permissions

- AmazonEC2FullAccess
- AmazonEC2ContainerRegistryFullAccess

### Deployment Workflow

1. Build Docker Image
2. Push Image to Amazon ECR
3. Launch EC2 Instance
4. Install Docker
5. Pull Image from ECR
6. Run Docker Container
7. Configure GitHub Actions

### GitHub Secrets

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION
ECR_REPO
PINECONE_API_KEY
HF_TOKEN
```

---

## License

This project is licensed under the MIT License.

---

## Author

**Tarun Gupta**

GitHub: https://github.com/Gupta-Tarun7
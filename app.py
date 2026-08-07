import os

from flask import Flask, render_template, request

from dotenv import load_dotenv

from src.helper import download_embeddings

from langchain_pinecone import PineconeVectorStore

from langchain_huggingface import (
    ChatHuggingFace,
    HuggingFaceEndpoint
)

from langchain_classic.chains import (
    create_retrieval_chain
)

from langchain_classic.chains.combine_documents import (
    create_stuff_documents_chain
)

from langchain_core.prompts import ChatPromptTemplate

from src.prompt import system_prompt


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
HF_TOKEN = os.getenv("HF_TOKEN")


# ============================================================
# FLASK
# ============================================================

app = Flask(__name__)


# ============================================================
# EMBEDDINGS
# ============================================================

embeddings = download_embeddings()


# ============================================================
# PINECONE
# ============================================================

index_name = "medical-chatbot"

docsearch = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    embedding=embeddings
)


retriever = docsearch.as_retriever(
    search_type="similarity",
    search_kwargs={
        "k": 3
    }
)


# ============================================================
# HUGGING FACE LLM
# ============================================================

llm = HuggingFaceEndpoint(
    repo_id="Qwen/Qwen2.5-7B-Instruct",
    task="text-generation",
    huggingfacehub_api_token=HF_TOKEN,
    max_new_tokens=256,
    temperature=0.2
)


chatModel = ChatHuggingFace(
    llm=llm
)


# ============================================================
# PROMPT
# ============================================================

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        ("human", "{input}")
    ]
)


# ============================================================
# RAG CHAIN
# ============================================================

question_answer_chain = create_stuff_documents_chain(
    chatModel,
    prompt
)


rag_chain = create_retrieval_chain(
    retriever,
    question_answer_chain
)


# ============================================================
# HOME PAGE
# ============================================================

@app.route("/")
def index():

    return render_template("chat.html")


# ============================================================
# CHAT API
# ============================================================

@app.route("/get", methods=["POST"])
def chat():

    msg = request.form.get("msg", "").strip()

    if not msg:

        return "Please enter a question.", 400

    try:

        response = rag_chain.invoke(
            {
                "input": msg
            }
        )

        answer = response.get(
            "answer",
            "Sorry, I could not generate an answer."
        )

        return answer

    except Exception as e:

        print("ERROR:", repr(e))

        return (
            "Sorry, I was unable to generate a response. "
            "Please try again later."
        ), 500


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8080)),
        debug=False
    )
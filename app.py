from flask import Flask, render_template, jsonify, request
from src.helper import download_embeddings
from langchain_pinecone import PineconeVectorStore
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import (
    create_stuff_documents_chain,
)
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from src.prompt import *
import os


app = Flask(__name__)


load_dotenv()

PINECONE_API_KEY=os.environ.get('PINECONE_API_KEY')
HF_TOKEN = os.getenv("HF_TOKEN")

embeddings = download_embeddings()

index_name = "medical-chatbot" 
# Embed each chunk and upsert the embeddings into your Pinecone index.
docsearch = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    embedding=embeddings
)




retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k":3})

llm = HuggingFaceEndpoint(
    repo_id="Qwen/Qwen2.5-7B-Instruct",
    task="text-generation",
    huggingfacehub_api_token=HF_TOKEN,
    max_new_tokens=512,
    temperature=0.2,
)

chatModel = ChatHuggingFace(llm=llm)

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        ("human", "{input}"),
    ]
)

question_answer_chain = create_stuff_documents_chain(chatModel, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)



@app.route("/")
def index():
    return render_template('chat.html')



@app.route("/get", methods=["POST"])
def chat():
    msg = request.form["msg"]

    response = rag_chain.invoke({"input": msg})

    return response["answer"]



if __name__ == '__main__':
    app.run(host="0.0.0.0", port= 8080, debug= True)
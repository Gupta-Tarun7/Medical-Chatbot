from dotenv import load_dotenv
import os

from src.helper import (
    load_pdf,
    filter_metadata,
    text_split,
    download_embeddings,
)

from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore


# Load environment variables
load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
HF_TOKEN = os.getenv("HF_TOKEN")

# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)

index_name = "medical-chatbot"

# Create index if it doesn't exist
if not pc.has_index(index_name):
    pc.create_index(
        name=index_name,
        dimension=384,          
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        ),
    )
    

# Load and process PDF
extracted_data = load_pdf("data/data.pdf")
filtered_data = filter_metadata(extracted_data)
text_chunks = text_split(filtered_data)

# Load embedding model
embedding = download_embeddings()

# Upload vectors
docsearch = PineconeVectorStore.from_documents(
    documents=text_chunks,
    embedding=embedding,
    index_name=index_name,
)

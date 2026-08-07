from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
import os


def load_pdf(data):
    loader = PyPDFLoader(data)
    return loader.load()


def filter_metadata(docs):
    for doc in docs:
        doc.metadata = {
            "source": doc.metadata.get("source"),
            "page": doc.metadata.get("page")
        }

    return docs


def text_split(docs):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    return splitter.split_documents(docs)


def download_embeddings():

    return HuggingFaceInferenceAPIEmbeddings(
        api_key=os.environ.get("HF_TOKEN"),
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings


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
    return HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
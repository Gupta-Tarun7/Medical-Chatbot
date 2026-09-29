import os

from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.embeddings import Embeddings

from huggingface_hub import InferenceClient

load_dotenv()


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

class HuggingFaceEmbeddingsAPI(Embeddings):

    def __init__(
        self,
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    ):

        self.model_name = model_name

        token = os.getenv("HF_TOKEN")

        if not token:

            raise ValueError(
                "HF_TOKEN environment variable is not set."
            )

        self.client = InferenceClient(
            provider="hf-inference",
            api_key=token
        )

    def embed_documents(self, texts):

        embeddings = []

        for text in texts:

            result = self.client.feature_extraction(
                text,
                model=self.model_name
            )

            if hasattr(result, "tolist"):

                result = result.tolist()

            if isinstance(result[0], list):

                result = result[0]

            embeddings.append(result)

        return embeddings

    def embed_query(self, text):

        result = self.client.feature_extraction(
            text,
            model=self.model_name
        )

        if hasattr(result, "tolist"):

            result = result.tolist()

        if isinstance(result[0], list):

            result = result[0]

        return result

def download_embeddings():

    return HuggingFaceEmbeddingsAPI(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
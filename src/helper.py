from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.embeddings import Embeddings
from sentence_transformers import SentenceTransformer

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

class LocalEmbeddings(Embeddings):

    def __init__(
        self,
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    ):

        self.model_name = model_name
        self.model = None

    def _load_model(self):

        if self.model is None:

            print("Loading embedding model...")

            self.model = SentenceTransformer(
                self.model_name
            )

            print("Embedding model loaded.")

    def embed_documents(self, texts):

        self._load_model()

        embeddings = self.model.encode(
            texts,
            normalize_embeddings=True
        )

        return embeddings.tolist()

    def embed_query(self, text):

        self._load_model()

        embedding = self.model.encode(
            text,
            normalize_embeddings=True
        )

        return embedding.tolist()

def download_embeddings():

    return LocalEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
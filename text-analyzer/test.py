import json
from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport
from sentence_transformers import SentenceTransformer, util
import numpy as np
import torch
from python_graphql_client import GraphqlClient

client = GraphqlClient(endpoint="http://localhost:4000/graphql")


def filterQuestions(item):
    if len(item["embedding"]) > 0:
        return True
    else:
        return False


query = """
    query {
        questions {
            text
            embedding
        }
    }
    """

result = list(filter(filterQuestions, client.execute(
    query=query)["data"]["questions"]))
print(result)
corpus_embeddings = [torch.FloatTensor(
    o["embedding"]) for o in result]

q = "How many school-aged children (e.g. pre-school, kindergarten, elementary school, middle school, high school) live in your household?"

embedder = SentenceTransformer('distilbert-base-nli-stsb-mean-tokens')
embedding = embedder.encode([q], convert_to_tensor=True)
searched = util.semantic_search(embedding, corpus_embeddings)[0]
ret = []

for o in searched:
    item = result[o["corpus_id"]]
    item["score"] = o["score"].astype(float)
    del item["embedding"]
    print(item)
    ret.append(item)

print(ret)

print(json.dumps(ret))

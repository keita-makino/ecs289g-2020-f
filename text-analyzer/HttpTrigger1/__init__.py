import json
import azure.functions as func
from sentence_transformers import SentenceTransformer, util
from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport
import torch
from python_graphql_client import GraphqlClient


def filterQuestions(item):
    if len(item["embedding"]) > 0:
        return True
    else:
        return False


async def main(req: func.HttpRequest) -> func.HttpResponse:
    client = GraphqlClient(endpoint="http://localhost:4000/graphql")

    query = """
        query {
            questions {
                id
                name
                text
                embedding
            }
        }
        """

    result = list(filter(filterQuestions, client.execute(
        query=query)["data"]["questions"]))
    corpus_embeddings = [torch.FloatTensor(
        o["embedding"]) for o in result]

    query = req.params.get('query')
    if not query:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            query = req_body.get('query')

    if query:
        embedder = SentenceTransformer('distilbert-base-nli-stsb-mean-tokens')
        query_embedding = embedder.encode(query, convert_to_tensor=True)
        searched = util.semantic_search(query_embedding, corpus_embeddings)[0]

        ret = []

        for o in searched:
            item = result[o["corpus_id"]]
            item["score"] = o["score"].astype(float)
            del item["embedding"]
            ret.append(item)

        return func.HttpResponse(json.dumps(ret))
    else:
        return func.HttpResponse(
            "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
            status_code=200
        )

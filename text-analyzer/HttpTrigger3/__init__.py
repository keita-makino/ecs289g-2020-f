import json
import azure.functions as func
from sentence_transformers import SentenceTransformer, util
from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport
import torch
from python_graphql_client import GraphqlClient


def filterQuestions(item):
    if len(item["primaryEmbedding"]) > 0:
        return True
    else:
        return False


async def main(req: func.HttpRequest) -> func.HttpResponse:
    client = GraphqlClient(endpoint="http://localhost:4000/graphql")

    query = """
        query($id: String!, $isChoiceBased: Boolean!) {
            question(where: { id: $id }) {
                name
                elements {
                    choice {
                        label
                        details
                    }
                    answer {
                        label
                        details
                    }
                    primaryEmbedding(isChoiceBased: $isChoiceBased)
                }
            }
        }
        """

    result = list()
    wordList = list()
    queryResult = list(filter(filterQuestions, client.execute(
        query=query, variables={
            "id": req.params.get('id'),
            "isChoiceBased": True if req.params.get('isChoiceBased') == "true" else False
        })["data"]["question"]["elements"]))
    for o in queryResult:
        label = o["choice" if req.params.get(
            'isChoiceBased') == "true" else "answer"]["details" if req.params.get('isTextEntry') == "true" else "label"]
        if label not in wordList:
            wordList.append(label)
            result.append(o)
    corpus_embeddings = [torch.FloatTensor(
        o["primaryEmbedding"]) for o in result]

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
            del item["primaryEmbedding"]
            ret.append(item)

        return func.HttpResponse(json.dumps(ret))
    else:
        return func.HttpResponse(
            "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
            status_code=200
        )

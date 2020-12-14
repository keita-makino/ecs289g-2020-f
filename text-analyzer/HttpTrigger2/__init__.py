import json
import azure.functions as func
import numpy as np
from numpy.core.arrayprint import array2string
from sentence_transformers import SentenceTransformer, util


async def main(req: func.HttpRequest) -> func.HttpResponse:
    embedder = SentenceTransformer('distilbert-base-nli-stsb-mean-tokens')
    array = req.get_json()

    if array:
        embedding = embedder.encode(array, convert_to_tensor=True)

        result = embedding.numpy().tolist()
        list = []

        for x in result:
            element = {
                "embedded": x
            }
            list.append(element)

        return func.HttpResponse(json.dumps(list))
    else:
        return func.HttpResponse(
            "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
            status_code=200
        )

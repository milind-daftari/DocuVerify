from app import app
import json


def upload(event, context):
    # Convert the event to the format Flask expects
    data = {
        'method': event['httpMethod'],
        'headers': event['headers'],
        'data': event['body'],
        'query_string': event['queryStringParameters']
    }

    with app.test_request_context(**data):
        app.preprocess_request()
        response = app.make_response(app.dispatch_request())

    return {
        'statusCode': response.status_code,
        'headers': dict(response.headers),
        'body': response.get_data(as_text=True)
    }

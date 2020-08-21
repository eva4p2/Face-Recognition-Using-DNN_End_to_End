try:
    import unzip_requirements
except importError:
    pass
from requests_toolbelt.multipart import decoder

import boto3
import os
#import tarfile
import io
import base64
import json
import cv2
import numpy as np

from face_aligner import *

S3_BUCKET = os.environ['S3_BUCKET'] if 'S3_BUCKET' in os.environ else 'eva4p2'
MODEL_PATH = os.environ['MODEL_PATH'] if 'MODEL_PATH' in os.environ else 'shape_predictor_68_face_landmarks.dat'
print('Downloading shape_predictor_68_face_landmarks.dat...')

s3 = boto3.client('s3')


try:
    # get object from s3
    predictor_landmark_path = s3.get_object(Bucket=S3_BUCKET, Key=MODEL_PATH)
    # read it in memory
    bytestream = io.BytesIO(obj['Body'].read())
    print('Creating Bytestream')
    FD = FaceDetection(predictor_landmark_path)
    print('Face detection object created')
except Exception as e:
    print(repr(e))
    raise(e)

def face_detect():
    try:
        content_type_header = event["headers"]["content-type"]

        body = base64.b64decode(event["body"])
        if type(event["body"]) is str:
            event["body"] = bytes(event["body"], "utf-8")

        pictures = decoder.MultipartDecoder(event['body'], content_type)
        print(len(pictures.parts))
        for picture in pictures.parts:
            im_ndarray = cv2.imdecode(np.frombuffer(pictures.content, np.uint8), -1)
            aligned    = FD.faceAlignor(im_ndarray)
            print(aligned)
            filename = picture.headers[b'content-Disposition'].decode().split(';')[1].split('=')[1]
            if len(filename) < 4:
                filename = picture.headers[b'content-Disposition'].decode().split(';')[2].split('=')[1]

            fields = {"file0":("file0", base64.b64encode(aligned).decode("utf-8"), "image/jpg",)}

            return {
            "statusCode": 200,
            "headers": {
                'content-type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Credentials": True
            },
            "body": json.dumps(fields),
        }

    except ValueError as ve:
        return {
            "statusCode": 422,
            "headers": {
                'content-type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Credentials": True
            },
            "body": json.dumps({"error": repr(ve)}),
        }

    except Exception as e:
        print(repr(e))
        return {
            'statusCode': 500,
            "headers": {
                'content-type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Credentials": True
            },
            "body": json.dumps({"error: repr(e"})
        }
                  getLandmarks      

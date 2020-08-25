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
    # predictor_landmark_path = s3.get_object(Bucket=S3_BUCKET, Key=MODEL_PATH)
    predictor_landmark_path = 'shape_predictor_68_face_landmarks.dat'
    # read it in memory
    # bytestream = io.BytesIO(obj['Body'].read())
    print('Creating Bytestream')
    FD = FaceDetection(predictor_landmark_path)
    print('Face detection object created')
except Exception as e:
    print(repr(e))
    raise(e)

def face_align(event, context):
    try:
        content_type_header = event["headers"]["content-type"]

        body = base64.b64decode(event["body"])
        # if type(event["body"]) is str:
        #     event["body"] = bytes(event["body"], "utf-8")

        pictures = decoder.MultipartDecoder(body, content_type_header)
        print(len(pictures.parts))
        for picture in pictures.parts:
            im_ndarray = cv2.imdecode(np.frombuffer(picture.content, np.uint8), -1)
            print("image_decoded")
            err, aligned    = FD.faceAligner(im_ndarray)
            print(aligned)
            filename = picture.headers[b'content-Disposition'].decode().split(';')[1].split('=')[1]
            if len(filename) < 4:
                filename = picture.headers[b'content-Disposition'].decode().split(';')[2].split('=')[1]

            fields = {"face-aligned": base64.b64encode(aligned).decode("utf-8")}

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
            "body": json.dumps({"error": repr(e)})
        }


def face_swap(event, context):
    try:
        content_type_header = event["headers"]["content-type"]

        body = base64.b64decode(event["body"])
        # if type(event["body"]) is str:
        #     event["body"] = bytes(event["body"], "utf-8")

        pictures = decoder.MultipartDecoder(body, content_type_header)

        if(len(pictures.parts) == 2):
            src_img_ndarray = cv2.imdecode(np.frombuffer(pictures.parts[0].content, np.uint8), -1)
            dest_img_ndarray = cv2.imdecode(np.frombuffer(pictures.parts[1].content, np.uint8), -1)
            err, swapped_img = FD.faceSwap(src_img_ndarray, dest_img_ndarray)

            fields = {"face-swap": base64.b64encode(swapped_img).decode("utf-8") }

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
            "body": json.dumps({"error": repr(e)})
        }
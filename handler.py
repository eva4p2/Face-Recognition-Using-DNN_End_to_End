try:
    import unzip_requirements
except ImportError:
    pass
from requests_toolbelt.multipart import decoder

import sys
import dlib

import boto3
import os
#import tarfile
import io
import base64
import json
import cv2
import numpy as np
import json

S3_BUCKET = os.environ['S3_BUCKET'] if 'S3_BUCKET' in os.environ else 'face-recognition-ganji'
MODEL_PATH = os.environ['MODEL_PATH'] if 'MODEL_PATH' in os.environ else 'face-align/shape_predictor_5_face_landmarks.dat'
print('Downloading predictor 5 face landmarks dat file...')

s3 = boto3.client('s3')


try:
    # get object from s3
    predictor_landmark_path = s3.get_object(Bucket=S3_BUCKET, Key=MODEL_PATH)
    # read it in memory
    bytestream = io.BytesIO(obj['Body'].read())
    print('Creating Bytestream')
except Exception as e:
    print(repr(e))
    raise(e)
	
face_detector = dlib.get_frontal_face_detector()
shape_predictor = dlib.shape_predictor(predictor_landmark_path)

def align_faceimage(event, context):
	try:
		content_type_header = event['headers']['content-type']
        print(event['body'])
        body = base64.b64decode(event["body"])
        print('BODY LOADEED')
        picture = decoder.MultipartDecoder(body, content_type_header).parts[0]
        # convert into numpy array 
        # Load the image using Dlib
        img_np = dlib.load_rgb_image(io.BytesIO(image_bytes=picture.content))
        
        # Ask the detector to find the bounding boxes of each face. The 1 in the
        # second argument indicates that we should upsample the image 1 time. This
        # will make everything bigger and allow us to detect more faces.
        detected_faces = face_detector(img_np, 1)
        num_faces = len(detected_faces)
        if num_faces == 0:
            return {
                "statusCode": 200,
                "headers": {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    "Access-Control-Allow-Credentials": True
                },
                "body": json.dumps({"error": "Sorry, there were no faces found in the picture uploaded"})
            }
    except Exception as e:
        print(repr(e))
        return {
            "statusCode": 500,
            "headers": {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Credentials": True
            },
            "body": json.dumps({"error": repr(e)})
        }
	
        # Find the 5 face landmarks we need to do the alignment.
        faces = dlib.full_object_detections()
        for detection in detected_faces:
            faces.append(shape_predictor(img_np, detection))

        #Get the aligned face images
        # Optionally: 
        #- images = dlib.get_face_chips(img, faces, size=160, padding=0.25)
        #images = dlib.get_face_chips(img, faces, size=320)
        #for image in images:
        #    window.set_image(image)
        #    dlib.hit_enter_to_continue()
        
        #Takes an image and a full_object_detection that references a face in that image and returns the face as a Numpy array representing the image.
        #The face will be rotated upright and scaled to 150x150 pixels or with the optional specified size and padding.
        image_aligned_np = dlib.get_face_chip(img_np, faces[0])
        image_to_bytes=base64.b64encode(image_aligned_np)
        #json.dumps(arr.tolist())
        return {
                "statusCode": 200,
                "headers": {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    "Access-Control-Allow-Credentials": True
                },
                "body": json.dumps(image_to_bytes)
            }
        # at receiving end convert to np.array(json.loads(arr))

def lambda_handler_facealign(event, context):
    res = list()
    assert event.get('httpMethod') == 'POST'
    try :
        #the content of the body is encoded in base64 format, so it can be decoded using the following function:
        event['body'] = base64.b64decode(event['body'])
    except :
         return {
        'statusCode': 400,
        'body': json.dumps(res)
        }

    if event['path'] == '/predict' :
        infer_func = predict_class
    elif event['path'] == '/object_detection' :
        infer_func = predict_objects
    else:
         return {
        'statusCode': 404,
        'body': json.dumps(res)
        }

    #content_type = event.get('headers', {"content-type" : ''}).get('content-type')
    #the library request toolbelt provides some tools to decode multipart/form-data using the boundary of each part, 
    #then it’s possible to iterate in each part using the following function:
    
    if 'multipart/form-data' in content_type  :

        # convert to bytes if need
        if type(event['body']) is str:
            event['body'] = bytes(event['body'],'utf-8')

        multipart_data = decoder.MultipartDecoder(event['body'], content_type)
        for part in multipart_data.parts:
            content_disposition = part.headers.get(b'Content-Disposition',b'').decode('utf-8')
            search_field = pattern.search(content_disposition)
            #import pdb; pdb.set_trace()
            if search_field :
                if search_field.group(0) == 'image' :
                    try:
                        img_io = io.BytesIO(part.content)
                        img_io.seek(0)
                        img = Image.open(img_io)
                        img = cv2.cvtColor(np.array(img), cv2.COLOR_BGR2RGB)
                        images = align_func(img)
                        image =   images[0]                      
                        image_to_bytes=base64.b64encode(image)
                        
                        res.append(image_to_bytes.tolist())
                        """
                        return {
                                "statusCode": 200,
                                "headers": {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*',
                                    "Access-Control-Allow-Credentials": True
                                },
                                "body": json.dumps(image_to_bytes)
                            }
                        """

                        
                    except Exception as e:
                        print(e)
                        """
                        return {
                                "statusCode": 500,
                                "headers": {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*',
                                    "Access-Control-Allow-Credentials": True
                                },
                                "body": json.dumps({"error": e})
                            }
                        """
                        res.append([])

                elif search_field.group(0) == 'url' :
                    try:
                        resp = urlopen(part.content.decode('utf-8'))
                        img = np.asarray(bytearray(resp.read()), dtype="uint8")
                        img = cv2.imdecode(img, cv2.IMREAD_COLOR)
                        img = cv2.cvtColor(img , cv2.COLOR_BGR2RGB)
                        images = align_func(img)
                        image =   images[0]                      
                        image_to_bytes=base64.b64encode(image)
                        res.append(image_to_bytes.tolist())
                        #json.dumps(arr.tolist())
                        """
                        return {
                                "statusCode": 200,
                                "headers": {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*',
                                    "Access-Control-Allow-Credentials": True
                                },
                                "body": json.dumps(image_to_bytes)
                            }
                        """
                        #res.append(infer_func(img))
                    except Exception as e:
                        print(e)
                        res.append('{"error": repr(e)}')
                        """
                        return {
                                "statusCode": 500,
                                "headers": {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*',
                                    "Access-Control-Allow-Credentials": True
                                },
                                "body": json.dumps({"error": e})
                            }
                        """
                        #res.append([])
                        res.append('{"error": repr(e)}')
                else :
                    print('Bad field name in form-data')
                    """
                    return {
                                "statusCode": 500,
                                "headers": {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*',
                                    "Access-Control-Allow-Credentials": True
                                },
                                "body": json.dumps({"error": 'Bad field name in form-data'})
                            }
                    """
                    res.append({"error": 'Bad field name in form-data'})
                 
    
    return {
            'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
                },
            'statusCode': 200,
            'body': json.dumps(res)
            }
    
def align_func(img):
    # Ask the detector to find the bounding boxes of each face. The 1 in the
    # second argument indicates that we should upsample the image 1 time. This
    # will make everything bigger and allow us to detect more faces.
    detected_faces = face_detector(img, 1)
    num_faces = len(detected_faces)
    
    #shape detector of faces
    faces = dlib.full_object_detections()
    for detection in detected_faces:
        faces.append(shape_predictor(img, detection))
    
    # Get the aligned face images
    # Optionally: 
    #- images = dlib.get_face_chips(img, faces, size=160, padding=0.25)
    images = dlib.get_face_chips(img, faces, size=320)
    #for image in images:
    #    window.set_image(image)
    #    dlib.hit_enter_to_continue()

    # It is also possible to get a single chip
    #image = dlib.get_face_chip(img, faces[0]) # img is rgb image
    return images
                        

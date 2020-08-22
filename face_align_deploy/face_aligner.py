import numpy as np
import dlib
import cv2
from renderFace import *
import faceblendcommon as fbc


class FaceDetection( shape_predictor, num_point = 68):
	def __init__(self):
		self.faceDetector = dlib.get_frontal_face_detector()
		self.landmarkDetector = dlib.shape_predictor(shape_predictor)
		self.num_points	= num_points
	def faceDetector(self, ):
		return self.faceDetector( im, 0)
	def faceAlignor(self, im: np.ndarray):
		points = fbc.getLandmarks(self.faceDetector, self.landmarkDetector, im)
		points = np.array(points)
		im = np.float32(im)/255.0
		h = 600	
		w = 600
		imNorm, points = fbc.normalizeImagesAndLandmarks((h,w),im,points)
		imNorm = np.uint8(imNorm*255)
		alignImage = imNorm[:,:,::-1]
		aligned_img_encoded = cv2.imencode(".jpg", cv2.cvtColor(alignImage, cv2.COLOR_BGR2RGB))
		return aligned_img_encoded



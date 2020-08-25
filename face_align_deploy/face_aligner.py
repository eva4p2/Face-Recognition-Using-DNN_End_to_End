import numpy as np
import dlib
import cv2
from renderFace import *
import faceblendcommon as fbc


class FaceDetection():
	def __init__( self, predictor_landmark_path, num_point = 68):
		self.faceDetector = dlib.get_frontal_face_detector()
		self.landmarkDetector = dlib.shape_predictor("model/shape_predictor_68_face_landmarks.dat")
		self.num_points	= num_point


	def faceDetector(self, ):
		return self.faceDetector( im, 0)
	def faceAligner(self, im: np.ndarray):
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

	def faceSwap( self, img_source, img_target):
		points_source = fbc.getLandmarks(self.faceDetector, self.landmarkDetector, img_source)
		points_target = fbc.getLandmarks(self.faceDetector, self.landmarkDetector, img_target)

		img_source_warped = np.copy(img_target)

		#####################Convex Hull#####################################
		# Find convex hull
		hull_index = cv2.convexHull(np.array(points_target), returnPoints=False)

		# Create convex hull lists
		hull_source = []
		hull_target = []
		for i in range(0, len(hull_index)):
		    hull_source.append(points_source[hull_index[i][0]])
		    hull_target.append(points_target[hull_index[i][0]])
		####################Hull Mask#############################################
		# Calculate Mask for Seamless cloning
		hull8U = []
		for i in range(0, len(hull_target)):
		    hull8U.append((hull_target[i][0], hull_target[i][1]))

		mask = np.zeros(img_target.shape, dtype=img_target.dtype) 
		cv2.fillConvexPoly(mask, np.int32(hull8U), (255, 255, 255))

		# Find Centroid
		m = cv2.moments(mask[:,:,1])
		center = (int(m['m10'] / m['m00']), int(m['m01'] / m['m00']))

		######################Create triangulation!###############################

		# Find Delaunay traingulation for convex hull points
		img_target_size = img_target.shape    
		rect = (0, 0, img_target_size[1], img_target_size[0])

		dt = fbc.calculateDelaunayTriangles(rect, hull_target)

		# If no Delaunay Triangles were found, quit
		if len(dt) == 0:
		    quit()



		img_source_temp = img_source.copy()
		img_target_temp = img_target.copy()

		tris_source = []
		tris_target = []
		for i in range(0, len(dt)):
		    tri_source = []
		    tri_target = []
		    for j in range(0, 3):
		        tri_source.append(hull_source[dt[i][j]])
		        tri_target.append(hull_target[dt[i][j]])

		    tris_source.append(tri_source)
		    tris_target.append(tri_target)

		cv2.polylines(img_source_temp,np.array(tris_source),True,(0,0,255),2);
		cv2.polylines(img_target_temp,np.array(tris_target),True,(0,0,255),2);


		######################Swap Face################################

		# Simple Alpha Blending
		# Apply affine transformation to Delaunay triangles
		for i in range(0, len(tris_source)):
		    fbc.warpTriangle(img_source, img_source_warped, tris_source[i], tris_target[i])

		# Clone seamlessly.
		output = cv2.seamlessClone(np.uint8(img_source_warped), img_target, mask, center, cv2.NORMAL_CLONE)

		swapped_img = output[:,:,::-1]

		swapped_img_encoded = cv2.imencode(".jpg", cv2.cvtColor(swapped_img, cv2.COLOR_BGR2RGB))
		return swapped_img_encoded

@staticmethod
def downloadArtifacts():
    urls = [
        ("model", "http://dlib.net/files/shape_predictor_5_face_landmarks.dat.bz2"),
        ("model", "http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2"),
        (
            "model",
            "https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml",
        ),
        ("data", "https://github.com/EVA4-RS-Group/Phase2/releases/download/s2/3M-KN95-9501-Dust-Mask_v1.jpg"),
    ]
    for url in urls:
        os.system(f"wget {url[1]} -P ./{url[0]}/")
        if "bz2" in url[1]:
            os.system(f"bzip2 -dk ./{url[0]}/{url[1].split('/')[-1]}")



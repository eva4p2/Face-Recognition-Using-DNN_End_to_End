import cv2
import dlib

# set up the 68 point facial landmark detector
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

#we'll import our image, then convert it to greyscale\

# bring in the input image
img = cv2.imread('example_03.jpg', 1)

# convert to grayscale
img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# detect faces in the image
faces_in_image = detector(img_gray, 0)

#Below, for each face in the image (again, we only have one but you could definitely have more than one) 
#- we'll loop through and use our predictor to isolate the coordinates of the 68 landmarks.  

# loop through each face in image
for face in faces_in_image:

	# assign the facial landmarks
	landmarks = predictor(img_gray, face)

	# unpack the 68 landmark coordinates from the dlib object into a list 
	landmarks_list = []
	for i in range(0, landmarks.num_parts):
		landmarks_list.append((landmarks.part(i).x, landmarks.part(i).y))

	# for each landmark, plot and write number
	for landmark_num, xy in enumerate(landmarks_list, start = 1):
		cv2.circle(img, (xy[0], xy[1]), 12, (168, 0, 20), -1)
		cv2.putText(img, str(landmark_num),(xy[0]-7,xy[1]+5), cv2.FONT_HERSHEY_SIMPLEX, 0.4,(255,255,255), 1)

#Finally display the image
# visualise the image with landmarks
print('faces=',len(list(faces_in_image)))

cv2.imshow('img',img)
cv2.waitKey(0)
cv2.destroyAllWindows()

  
import cv2
import numpy as np


def drawPolyline(im, landmarks, start, end, isClosed=False):
    points = []
    for i in range(start, end + 1):
        point = [landmarks.part(i).x, landmarks.part(i).y]
        points.append(point)
    points = np.array(points, dtype=np.int32)
    cv2.polylines(im, [points], isClosed, (255, 200, 0), thickness=2, lineType=cv2.LINE_8)


def renderFace(im, landmarks):
    assert landmarks.num_parts == 68
    drawPolyline(im, landmarks, 0, 16)
    drawPolyline(im, landmarks, 17, 21)
    drawPolyline(im, landmarks, 22, 26)
    drawPolyline(im, landmarks, 27, 30)
    drawPolyline(im, landmarks, 30, 35, True)
    drawPolyline(im, landmarks, 36, 41, True)
    drawPolyline(im, landmarks, 42, 47, True)
    drawPolyline(im, landmarks, 48, 59, True)
    drawPolyline(im, landmarks, 60, 67, True)


def renderFace2(im, landmarks, color=(0, 255, 0), radius=3):
    for p in landmarks.parts():
        cv2.circle(im, (p.x, p.y), radius, color, -1)


def writeLandmarksToFile(landmarks, landmarksFileName):
    with open(landmarksFileName, "w") as f:
        for p in landmarks.parts():
            f.write(f"{int(p.x)} {int(p.y)}\n")
    f.close()
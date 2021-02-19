import uuid

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont


def showComputedGaze(img, gaze_origin, pitchyaw, computed_angle, computed_magnitude, score, classification, length=200, thickness=1, color=(0, 0, 255)):
    image_out = np.array(img.copy())
    dx = -length * np.sin(pitchyaw[1])
    dy = -length * np.sin(pitchyaw[0])
    image_out = cv2.circle(image_out, gaze_origin, 3, (0, 255, 0), -1)    
    image_out = cv2.arrowedLine(image_out, tuple(np.round(gaze_origin).astype(np.int32)),
                   tuple(np.round([gaze_origin[0] + dx, gaze_origin[1] + dy]).astype(int)), color,
                   thickness, cv2.LINE_AA, tipLength=0.5)
    

    img_copy = Image.fromarray(image_out)
    draw = ImageDraw.ImageDraw(img_copy)
    font = ImageFont.load_default()

    draw.text((0, 0), "Gaze Angle: " + str(computed_angle) , font=font, fill="#8E1600")
    draw.text((0, 10), "Gaze Magnitude: " + str(computed_magnitude) , font=font, fill="#8E1600")
    draw.text((0, 20), "Classification: " + str(classification) , font=font, fill="#8E1600")
    draw.text((0, 30), "Score: " + str(score*10) , font=font, fill="#8E1600")
    filename= str(uuid.uuid1()) + ".png"
    print("Saving to filename" + filename)
    img_copy.save("./" + filename)


def showBoundingBox(img, bounding_boxes,  computed_angle, computed_magnitude, classification, facial_landmarks=[], width=2, eyeline=False):
    img_copy = img.copy()
    draw = ImageDraw.ImageDraw(img_copy)
    font = ImageFont.load_default()

    for b in bounding_boxes:
        draw.rectangle([
            (b[0], b[1]), (b[2], b[3])
        ], outline='red', width=width)

    offset = 1.0*width
    for p in facial_landmarks:
        for i in range(5):
            draw.ellipse([
                (p[i] - offset, p[i + 5] - offset),
                (p[i] + offset, p[i + 5] + offset)
            ], outline='red', fill='red')

        if (eyeline):
            draw.line(tuple([p[0],p[5], p[1],p[6]]), width=width, fill='blue')
    
    draw.text((0, 0), "Gaze Angle: " + str(computed_angle) , font=font, fill="#8E1600")
    draw.text((0, 10), "Gaze Magnitude: " + str(computed_magnitude) , font=font, fill="#8E1600")
    draw.text((0, 20), "Classification: " + str(classification) , font=font, fill="#8E1600")
    filename= str(uuid.uuid1()) + ".png"
    print("Saving to filename" + filename)
    img_copy.save("./" + filename)

#!/usr/bin/env python
import base64
import json
import os
import sys
from io import BytesIO
from datetime import datetime
from graphqlclient import GraphQLClient
from PIL import Image

from machine_learning.gaze_model import GazeDetector


def demo_frames():
    base64Frames = []
    test_frames = ["me1.png", "me2.png", "me3.png", "me4.png", "me5.png", "me6.png", "me7.png"]

    for frame in test_frames:
        image = Image.open("./" + frame).resize((200,200)) 
        imageString = img_to_base64_str(image)
        base64Frames.append(imageString)

    return base64Frames

def img_to_base64_str(img):
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    buffered.seek(0)
    img_byte = buffered.getvalue()
    return "data:image/png;base64," + base64.b64encode(img_byte).decode()

def send_to_graphql(logger, studentID, roomID, token, score, classification):
    ENDPOINT = "http://learnlab-server.herokuapp.com/"
    #logger.info("sending via graphql")
    try:
        auth = "Bearer " + token
        client = GraphQLClient(ENDPOINT)
        client.inject_token(auth)
        query = '''mutation addEngagement($room_id:ID!, $student_id:ID!, $score:Int!, $classification:String!, $created_at:Date!) {
                upsertEngagementCurrent(room_id: $room_id, student_id: $student_id, score: $score, classification: $classification, created_at: $created_at) {
                success,
                message
                }
            }'''

        variables = {
            "room_id":roomID,
            "student_id":studentID,
            "score":score,
            "classification":classification,
            "created_at":datetime.today().strftime('%m/%d/%Y %H:%M:%S')
        }
        # logger.info("Executing room_id: {}, student_id: {}, score: {}, classification: {}".format(roomID, studentID, score, classification))
        # logger.info("Query: ".format(query))
        data = client.execute(query=query, variables=variables)
        # logger.info(data)
    except Exception as e:
        logger.info("ERROR: {}".format(e))

def process_frame(logger, data):
    for frame in data["frames"]:
        # strip the MIME message from frame string
        base64EncodedString = frame.encode('utf-8').partition(b",")[2]

        # add padding to base64 if needed (this will append '=' to the end if the string length is not a multiple of 4)
        pad = len(base64EncodedString)%4
        base64EncodedString += b"="*pad

        # logger.info("Running Predicting Logic")
        base64_jpg: str = base64EncodedString
        convolutional_net = GazeDetector(logger=logger, base_64_image=base64_jpg)
        # logger.info("Running Gaze Prediction")
        gaze_angle, gaze_magnitude, classification, score = convolutional_net.predict_gaze()
        # logger.info(gaze_angle, gaze_magnitude, classification, score*10)
        send_to_graphql(logger, data["studentID"], data["roomID"], data["token"], score*10, classification)

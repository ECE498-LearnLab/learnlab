import os.path
from base64 import b64decode as base64_decode
from collections import namedtuple
from io import BytesIO
from logging import Logger
from typing import List

import numpy as np
from cv2 import COLOR_RGB2BGR, INTER_CUBIC, cvtColor
from cv2 import flip as flip_image
from cv2 import getRotationMatrix2D, warpAffine
from PIL import Image
from torch import cuda as torch_gpu
from torch import device as torch_device
from torch import load as torch_load
from torch import no_grad as torch_no_grad

from machine_learning.models import gazenet as gaze_cnn
from machine_learning.mtcnn import FaceDetector, showComputedGaze


class GazeDetector:
    """
    Detect a user's gaze to see if they are engaged
    or not
    """
    weights_path: str = os.path.abspath("machine_learning/models/weights/gazenet.pth")
    coordinate_length: float = 200

    device: torch_device = torch_device("cuda:0" if torch_gpu.is_available() else "cpu")
    model: gaze_cnn.GazeNet = gaze_cnn.GazeNet(device=device)
    model.load_state_dict(torch_load(weights_path, map_location=device))
    model.eval()

    def __init__(self, logger, base_64_image):
        """
        Base 64 image from the student app
        :param base_64_image: string from client in request
        """
        self.logger = logger
        self.opencv_image = self._read_base64(base_64_image)
        self.face_detector = FaceDetector(device=self.device)

    @staticmethod
    def _read_base64(base64_string: str) -> cvtColor:
        """
        Read base64 string into CV2
        :param base64_string: base 64 string
        :return: cv2 image
        """
        byte_buffer: BytesIO = BytesIO()
        byte_buffer.write(base64_decode(base64_string))
        pil_img: Image = Image.open(byte_buffer)
        return cvtColor(np.array(pil_img), COLOR_RGB2BGR)

    @staticmethod
    def _normalize_face(landmarks, frame) -> tuple:
        """
        Normalize the face to a standard map
        :param landmarks: landmarks on the face
        :param frame: image frame
        :return: the face, gaze origin and
        """
        left_eye_coord: tuple = (0.70, 0.35)
        lcenter: tuple = tuple([landmarks[0], landmarks[5]])
        rcenter: tuple = tuple([landmarks[1], landmarks[6]])

        gaze_origin: tuple = (int((lcenter[0] + rcenter[0]) / 2), int((lcenter[1] + rcenter[1]) / 2))

        dY: float = rcenter[1] - lcenter[1]
        dX: float = rcenter[0] - lcenter[0]
        angle = np.degrees(np.arctan2(dY, dX)) - 180
        right_eye_x = 1.0 - left_eye_coord[0]
        dist: np.float32 = np.sqrt((dX ** 2) + (dY ** 2))
        new_dist = (right_eye_x - left_eye_coord[0])
        new_dist *= 112
        scale: np.float32 = new_dist / dist
        M = getRotationMatrix2D(gaze_origin, angle, scale)

        tX = 112 * 0.5
        tY = 112 * left_eye_coord[1]
        M[0, 2] += (tX - gaze_origin[0])
        M[1, 2] += (tY - gaze_origin[1])

        face = warpAffine(frame, M, (112, 112), flags=INTER_CUBIC)
        return face, gaze_origin, M

    @staticmethod
    def _get_vector(pitch_yaw: List) -> (np.float32, np.float32):
        """
        Get the deltas in the x and y direction to measure gaze
        :param pitch_yaw: gaze coords from CNN
        :return: dx, dy
        """
        dx: np.float32 = -GazeDetector.coordinate_length * np.sin(pitch_yaw[1])
        dy: np.float32 = -GazeDetector.coordinate_length * np.sin(pitch_yaw[0])  # coords start in upper left corner
        return dx, dy

    @staticmethod
    def _compute_angle(dx: float, dy: float) -> np.float32:
        """
        Computes the angle in degrees of the vector defined
        by dx and dy

        :param dx: delta x for vector
        :param dy: delta y for vector
        :return: angle between standard position and the vector in degs
        """
        return np.arctan2(dy, dx) * (180 / np.pi)  # convert to degrees from radians

    @staticmethod
    def _compute_magnitude(dx: float, dy: float) -> float:
        """
        Compute the magnitude of vector <dy, dx>
        :param dx: delta x for vector
        :param dy: delta y for vector
        :return: magnitude of vector <dx, dy>
        """
        return np.sqrt(dx ** 2 + dy ** 2)  # find magnitude of vector

    def predict_gaze(self) -> (float, float):
        """
        Predict the Gaze trajectory as a vector using our GazeNet CNN
        and return the angle and magnitude of the vector
        :return: angle between delta x and delta y
        """
        self.opencv_image = flip_image(self.opencv_image[:, :, ::-1], 1)  # helps to rectify rectangular coordinates
        faces, landmarks = self.face_detector.detect(Image.fromarray(self.opencv_image))

        if len(faces) == 0:
            self.logger.info("No faces found!")
            return 0, 0, "NOT ENGAGED", 0

        for face, landmark in zip(faces, landmarks):
            if face[-1] > 0.98:  # confidence check
                normal_face, gaze_origin, _ = GazeDetector._normalize_face(landmark, self.opencv_image)
                # Predict Gaze
                with torch_no_grad():
                    gaze = GazeDetector.model.get_gaze(normal_face)
                    gaze = gaze[0].data.cpu()
                #self.logger("Predicted on CNN: Gaze com puted to be " + str(gaze))
                dx, dy = self._get_vector(gaze)
                dy *= -1
                #self.logger.info("Original Gaze Location: " + str(gaze_origin))
                #self.logger.info("Delta X: " + str(dx) + "; Delta Y: " + str(dy))
                
                computed_angle = self._compute_angle(dx, dy).cpu().numpy()
                computed_magnitude = self._compute_magnitude(dx, dy).cpu().numpy()
                classification, score = self.interpret_vectors(computed_angle, computed_magnitude)

                #self.logger.info("Trying to save gaze computation")
                # showComputedGaze(Image.fromarray(self.opencv_image), gaze_origin, gaze, computed_angle, computed_magnitude, score, classification)
                return computed_angle, computed_magnitude, classification, score
            else:
                return 0, 0, "NOT ENGAGED", 0
                

    def interpret_vectors(self, angle: np.float32, magnitude: np.float32):
        """
        Interpret the Vector's Position and Magnitude for engagement/disengagement
        :param angle: the angle of the gaze vector
        :param magnitude: the magnitude of the gaze vector
        :return: student state and confidence
        """
        Rule = namedtuple('Rule', ['trigger_str', 'confidence', 'result', 'score'])

        rules: List[Rule] = [  # in order of precedence
            Rule('angle == -1.0 and magnitude == -1.0', 0.0, "NOT ENGAGED", 0),
            Rule('magnitude <= 30.0 or 0 < angle <= 15', 0.95, "ENGAGED", 10),
            Rule('magnitude <= 40.0', 0.95, "ENGAGED", 9),
            Rule('magnitude <= 50.0', 0.60, "ENGAGED",8),
            Rule('magnitude <= 60.0', 0.65, "ENGAGED", 7),
            Rule('15 < angle < 50', 0.70, "SOMEWHAT ENGAGED", 6),
            Rule('60 < magnitude <= 70', 0.65, "SOMEWHAT ENGAGED", 5),
            Rule('70 < magnitude <= 120', 0.70, "NOT ENGAGED", 4),
            Rule('120 < magnitude < 360', 0.70, "NOT ENGAGED", 3),
            Rule('magnitude > 60.0', 0.70, "NOT ENGAGED", 2),
            Rule('magnitude > 50.0', 0.85, "NOT ENGAGED", 1),
            Rule('True', 0.0, "ENGAGED", 10)  # default condition (base case-- should never be called)
        ]

        for rule_no, rule in enumerate(rules):
            if eval(rule.trigger_str):
                self.logger.info("Triggered rule: " + rule.trigger_str + ": " + str(rule))
                return rule.result, rule.score

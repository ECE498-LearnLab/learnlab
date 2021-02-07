import imutils
import pyximport; pyximport.install()
import ddestimator
import base64
import cv2
import numpy as np
from graphqlclient import GraphQLClient
import time

class DddAnalysis:
	ENDPOINT = "http://server:4000/"

	FRAME_WIDTH = 750
	TIMESTAMP_THRESHOLD = 400
	PROCESS_INTERVAL = 50

	K_ESC = 27
	K_QUIT = ord('q')
	K_POINTS = ord('p')
	K_BOUNDING = ord('b')
	K_GAZE = ord('g')
	K_EYES = ord('e')
	K_MOUTH = ord('m')
	K_DD = ord('d')
	K_NONE = ord('n')
	K_REFRESH = ord('r')
	K_SAVE_LOG = ord('l')
	K_HELP = ord('h')

	LOG_PATH = './kss_%ts.csv'

	CALIBRATE_CAMERA_ANGLES = True

	def __init__(self):
		self.token = None
		self.images = []
		self.studentID = None
		self.roomID = None
		self.show_gaze = True
		self.show_ear = True
		self.ddestimator = ddestimator.ddestimator(weights=[4, 1, 6, 0.75])
		self.has_calibrated = False

	def feed_batch(self, b64_frames, studentID, roomID, token):
		self.token = token
		self.images = b64_frames
		self.studentID = studentID
		self.roomID = roomID

	def run(self):
		print("Running...")
		if not self.images:
			print("No images to process.")
			return

		start = time.time()

		sum_kss = 0
		num_kss = 0
		for image in self.images:
			img = base64.b64decode(image)
			npimg = np.frombuffer(img, dtype=np.uint8)

			frame = cv2.imdecode(npimg, 1)
			frame = imutils.resize(frame, width=DddAnalysis.FRAME_WIDTH)
			frame, kss = self.process_frame(frame)
			if kss is not None:
				sum_kss += kss
				num_kss += 1

		if num_kss == 0:
			print('No KSS derived from batch')
			return
		avg_kss = round(sum_kss/num_kss, 2)

		print(f'==== Batch completed in {time.time() - start}s ====')
		print(f'==== Avg. KSS {avg_kss}')
		# self.send_to_graphql(avg_kss)

	def process_frame(self, frame=None):
		#Detect faces in frame
		faces_loc = self.ddestimator.detect_faces(frame, None, True)

		if len(faces_loc) == 0:
			return frame, None

		#If there's more than one face, only interested in first face found
		face_loc = faces_loc[0]

		#Predict coordinates of 68 points of this face using ML trained model
		points = self.ddestimator.pred_points_on_face(frame, face_loc)

		#All immediate estimations based on points locations
		euler, rotation, translation = self.ddestimator.est_head_dir(points)
		#- Calibrate for camera angles based on euler angles
		if DddAnalysis.CALIBRATE_CAMERA_ANGLES and not self.ddestimator.has_calibrated:
			has_calibration, _, meds = self.ddestimator.get_med_eulers()
			if has_calibration:
				self.ddestimator.calibrate_camera_angles(meds)
		_, _, gaze_D = self.ddestimator.est_gaze_dir(points)
		ear_B, ear_R, ear_L = self.ddestimator.est_eye_openness(points)
		mar = self.ddestimator.est_mouth_openess(points)

		#All timescale estimations based on points locations
		head_distraction, _, _ = self.ddestimator.est_head_dir_over_time(ts_threshold=400)
		if not head_distraction:
			gaze_distraction, _, _ = self.ddestimator.est_gaze_dir_over_time(ts_threshold=1000)
		else:
			gaze_distraction = False
		eye_drowsiness, _, _, eye_closedness = self.ddestimator.get_eye_closedness_over_time()
		did_yawn, _, _, _ = self.ddestimator.get_mouth_openess_over_time()

		# calc KSS with previous measurements
		kss = self.ddestimator.calc_kss(DddAnalysis.TIMESTAMP_THRESHOLD)
		kss_rounded = None
		if kss is not None:
			kss_rounded = round(kss, 2)
			print(f"--------- inter-KSS: {kss_rounded} ---------")

		self.persist_distraction_analysis(frame, head_distraction, gaze_distraction,
									did_yawn, eye_closedness, eye_drowsiness)

		return frame, kss_rounded

	def persist_distraction_analysis(self, frame, head_distraction, gaze_distraction,
									did_yawn, eye_closedness, eye_drowsiness):
		h = frame.shape[0]

		if head_distraction:
			cv2.putText(frame, "DISTRACTED [h]", (20, h - 100),
						cv2.FONT_HERSHEY_PLAIN, 0.9, (0, 0, 0), thickness=1)
			print("DISTRACTED (head)")
		elif self.show_gaze and gaze_distraction:
			cv2.putText(frame, "distracted [g]", (20, h - 100),
						cv2.FONT_HERSHEY_PLAIN, 0.9, (0, 0, 0), thickness=1)
			print("distracted (gaze)")
		if did_yawn:
			cv2.putText(frame, "DROWSY [y]", (20, h - 80),
						cv2.FONT_HERSHEY_PLAIN, 0.9, (0, 0, 255), thickness=1)
			print("DROWSY (yawn)")
		if eye_closedness:
			cv2.putText(frame, "DROWSY [ec]", (20, h - 60),
						cv2.FONT_HERSHEY_PLAIN, 0.9, (0, 0, 255), thickness=1)
			print("DROWSY (eye closedness)")
		elif self.show_ear and eye_drowsiness:
			cv2.putText(frame, "drowsy [ed]", (20, h - 60),
						cv2.FONT_HERSHEY_PLAIN, 0.9, (0, 0, 0), thickness=1)
			print("drowsy (eye drowsiness)")	

	def send_to_graphql(self, score):
		print("sending via graphql")
		try:
			auth = "Bearer " + self.token
			client = GraphQLClient(DddAnalysis.ENDPOINT)
			client.inject_token(auth)
			query = '''mutation addEngagement($room_id:ID!, $student_id:ID!, $score:Int!, $classification:String!, $created_at:Date!) {
				  upsertEngagementCurrent(room_id: $room_id, student_id: $student_id, score: $score, classification: $classification, created_at: $created_at) {
					success,
					message
				  }
				}'''

			#TODO: unhardcode created_at date
			variables = {
				"room_id":self.roomID,
				"student_id":self.studentID,
				"score":score,
				"classification":"---",
				"created_at":"06/27/2019 14:22:00"
			}
			# print_graphql_query(score, query)
			data = client.execute(query=query, variables=variables)
		except Exception as e:
			print("ERROR: {}".format(e))

	def print_graphql_query(self, score, query):
		print(f'Executing room_id: {self.roomID}, student_id: {self.studentID}, score: {score}, classification: -')
		print(f'Query: {query}')

	def script_teardown(self):
		print('->')

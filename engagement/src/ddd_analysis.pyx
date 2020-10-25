import imutils
import pyximport; pyximport.install()
import ddestimator
import tkinter as tk
import base64
import cv2
import numpy as np

class DddAnalysis:

	FRAME_WIDTH = 750
	# WINDOW_TITLE = "Frame Distraction Estimation"

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

	def __init__(self, b64_string):
		# self.rootwin = tk.Tk()
		# self.rootwin.withdraw()
		self.images = []
		self.images.append(b64_string)
		# cv2.namedWindow(DddAnalysis.WINDOW_TITLE)
		self.show_points = True
		self.show_bounding = True
		self.show_gaze = True
		self.show_ear = True
		self.show_mar = True
		self.show_dd = True
		self.ddestimator = ddestimator.ddestimator()
		self.has_calibrated = True

	def run(self):
		print("Running...")
		if not self.images:
			print("No images to process.")
			return

		# TODO: make this consume batches instead of the same image once set up on web
		for i in range(10):
		# for image in self.images:
			img = base64.b64decode(self.images[0])
			npimg = np.fromstring(img, dtype=np.uint8)

			frame = cv2.imdecode(npimg, 1)
			frame = imutils.resize(frame, width=DddAnalysis.FRAME_WIDTH)
			frame = self.process_frame(frame)
			self.script_teardown()

	def process_frame(self, frame=None):
		print("processing frame")

		#Detect faces in frame
		faces_loc = self.ddestimator.detect_faces(frame, None, True)

		if len(faces_loc) > 0:
			#If there's more than one face...
			#Only interested in first face found (for his demo)
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
			head_distraction, _, _ = self.ddestimator.est_head_dir_over_time()
			if not head_distraction:
				gaze_distraction, _, _ = self.ddestimator.est_gaze_dir_over_time()
			else:
				gaze_distraction = False
			eye_drowsiness, _, _, eye_closedness = self.ddestimator.get_eye_closedness_over_time()
			did_yawn, _, _, _ = self.ddestimator.get_mouth_openess_over_time()

			#Calc KSS with previous measurements
			kss = self.ddestimator.calc_kss()
			if kss is not None:
				print("\t%.2f" % (kss*10))

			#Show results on frame
			if self.show_points:
				frame = self.ddestimator.draw_points_on_face(frame, points, (0, 0, 255))

			if self.show_bounding:
				bc_2d_coords = self.ddestimator.proj_head_bounding_cube_coords(rotation, translation)
				frame = self.ddestimator.draw_bounding_cube(frame, bc_2d_coords, (0, 0, 255), euler)

			if self.show_gaze:
				gl_2d_coords = self.ddestimator.proj_gaze_line_coords(rotation, translation, gaze_D)
				self.ddestimator.draw_gaze_line(frame, gl_2d_coords, (0, 255, 0), gaze_D)

			if self.show_ear:
				frame = self.ddestimator.draw_eye_lines(frame, points, ear_R, ear_L)

			if self.show_mar:
				frame = self.ddestimator.draw_mouth(frame, points, mar)

			if self.show_dd:
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

				if kss is not None:
					kss_int = int(round(kss*10))
					frame = self.ddestimator.draw_progress_bar(frame, 140, 35, kss, str(kss_int))

		return frame

	def script_teardown(self):
		print('-> QUIT')

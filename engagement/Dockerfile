FROM jjanzic/docker-python3-opencv:opencv-4.0.0

RUN ln -s \
  /usr/local/python/cv2/python-3.7/cv2.cpython-37m-x86_64-linux-gnu.so \
  /usr/local/lib/python3.7/site-packages/cv2.so

# Pip install Python dependencies
RUN which pip
RUN pip install torch==1.4.0+cpu torchvision==0.5.0+cpu -f https://download.pytorch.org/whl/torch_stable.html

WORKDIR /usr/src/learnlab/engagement/src

COPY requirements.txt ../
RUN cd ../ && pip install -r requirements.txt

COPY ./src .
CMD ["python", "-u", "consumer.py"]
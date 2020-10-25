FROM python:3.8
RUN apt-get update ##[edited]
RUN apt-get install 'ffmpeg'\
    'libsm6'\
    'libxext6'  -y
RUN apt-get update

WORKDIR /usr/src/learnlab/engagement/src

COPY requirements.txt ../
RUN cd ../ && pip3 install -r requirements.txt

COPY ./src .
CMD ["python3", "-u", "consumer.py"]
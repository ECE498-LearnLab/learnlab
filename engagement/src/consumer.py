#!/usr/bin/env python
import pika, sys, os
import codecs
import pyximport; pyximport.install()
import ddd_analysis
import json
import base64

def main():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()
    global x
    x = 0
    # we need to make sure the queue exists, if it doesn't exist create it
    # durable means the queue will survive a broker restart
    channel.queue_declare(queue='frames', durable=True)
    
    # Subscribe to queue, whenever message is appended to the queue, 
    # this callback function will be called
    def callback(ch, method, properties, body):
        print(" [x] Received Frame")
        global x

        batchedData = json.loads(body)
        base64Frames = []

        for frame in batchedData['frames']:
            x += 1

            # strip the MIME message from frame string
            base64EncodedString = frame.encode('utf-8').partition(b",")[2]

            # add padding to base64 if needed (this will append '=' to the end if the string length is not a multiple of 4)
            pad = len(base64EncodedString)%4
            base64EncodedString += b"="*pad
            base64Frames.append(base64EncodedString)

            # # decode base64 string to image
            # frameImage = codecs.decode(base64EncodedString.strip(),'base64')
            
            # with open('./frame-(%d).jpg' % x,'wb') as f:
            #     # save image to frame.jpg in current directory
            #     f.write(frameImage)
        
        analyze = ddd_analysis.DddAnalysis(base64Frames, studentID, roomID)
        analyze.run()

    channel.basic_consume(queue='frames', on_message_callback=callback, auto_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
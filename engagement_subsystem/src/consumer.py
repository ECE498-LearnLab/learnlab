#!/usr/bin/env python
import pika, sys, os
import codecs
import pyximport; pyximport.install()
import ddd_analysis

def main():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()

    # we need to make sure the queue exists, if it doesn't exist create it
    # durable means the queue will survive a broker restart
    channel.queue_declare(queue='frames', durable=True)
    
    # Subscribe to queue, whenever message is appended to the queue, 
    # this callback function will be called
    def callback(ch, method, properties, body):
        print(" [x] Received Frame")
        
        # strip the MIME message from body
        base64EncodedString = body.partition(b",")[2]

        # add padding to base64 if needed (this will append '=' to the end if the string length is not a multiple of 4)
        pad = len(base64EncodedString)%4
        base64EncodedString += b"="*pad

        # # decode base64 string to image
        # frame = codecs.decode(base64EncodedString.strip(),'base64')
        #
        # with open('./frame.jpg','wb') as f:
        #     # save image to frame.jpg in current directory
        #     f.write(frame)

        analyze = ddd_analysis.DddAnalysis(base64EncodedString)
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

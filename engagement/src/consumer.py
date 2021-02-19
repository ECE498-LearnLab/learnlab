import datetime
import json
import logging
from collections import OrderedDict
from concurrent.futures import ThreadPoolExecutor
from logging import StreamHandler
from random import randint
from time import sleep

import pika
from pika import SelectConnection

from consumerUtils import process_frame

logging.basicConfig(handlers=[StreamHandler()],
                    level=logging.INFO,
                    format=logging.BASIC_FORMAT)
_logger = logging.getLogger(__name__)


class QueueConsumer(object):
    """The consumer class to manage connections to the AMQP server/queue"""

    def __init__(self, queue, logger, parameters, thread_id=0):
        self.channel = None
        self.connection = None
        self.queue_name = queue
        self.logger = logger
        self.consumer_id = 'Thread: %d' % (thread_id,)
        self.parameters = pika.ConnectionParameters(**parameters)

    def _on_queue_declared(self, frame):
        self.logger.debug('{} ... declaring queue'.format(self.consumer_id))
        self.channel.basic_qos(prefetch_count=1)
        try:
            self.channel.basic_consume(self.queue_name, self.handle_delivery, auto_ack=True)
            self.logger.info("{} Declared queue...".format(self.consumer_id))
        except Exception as e:
            self.logger.error('{} crashing:--> {}'.format(self.consumer_id, str(e)))

    def _on_channel_open(self, channel):
        self.channel = channel
        try:
            self.channel.queue_declare(queue=self.queue_name,
                                       exclusive=False,
                                       durable=True,
                                       auto_delete=False,
                                       callback=self._on_queue_declared)
            self.logger.info("{} Opened Channel....".format(self.consumer_id))
        except Exception as e:
            self.logger.error('{} {}'.format(self.consumer_id, str(e)))

    def _on_connected(self, connection):
        connection.channel(on_open_callback=self._on_channel_open)

    def consume(self):
        try:
            self.connection = SelectConnection(self.parameters,
                                               self._on_connected)
            self.connection.ioloop.start()
        except Exception as e:
            self.logger.error('{} {}'.format(self.consumer_id, str(e)))
            self.connection.close()
            self.connection.ioloop.start()

    def decode(self, body):
        try:
            _body = body.decode('utf-8')
        except AttributeError:
            _body = body

        return _body

    def handle_delivery(self, channel, method, header, body):
        try:
            start_time = datetime.datetime.now()
            _logger.info("[x] Received Frame")
            req = json.loads(self.decode(body))

            # Process the frame
            process_frame(_logger, req)

            time_taken = datetime.datetime.now() - start_time
            _logger.info("[x] [Consumer {}] Time Taken: {}.{}".format(
                self.consumer_id , time_taken.seconds, time_taken.microseconds))

        except Exception as err:
            _logger.exception(err)


if __name__ == "__main__":
    workers = 5
    pika_parameters = OrderedDict([('host', 'rabbitmq')])
    try:
        pool = ThreadPoolExecutor(max_workers=workers)
        start = 1
        for thread_id in range(start, (workers + start)):
            pool.submit(QueueConsumer('frames', _logger, pika_parameters, thread_id).consume)

    except Exception as err:
        _logger.exception(err)

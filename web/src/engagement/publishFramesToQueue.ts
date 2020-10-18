import {Client} from '@stomp/stompjs';

const CONNECTION_URL = 'ws://localhost:15674/ws';
const QUEUE_NAME = 'frames';

const client = new Client();

client.configure({
   brokerURL: CONNECTION_URL,
   heartbeatIncoming: 4000,
   heartbeatOutgoing: 4000,
   onConnect: () => {
      // tslint:disable-next-line: no-console
      console.log("Connected to RabbitMQ");
   },
   debug: (str) => {
     // tslint:disable-next-line: no-console
     console.log(new Date(), str);
   },
   onStompError: (frame) => {
      // Will be invoked in case of error encountered at Broker
      // Bad login/passcode typically will cause an error
      // Complaint brokers will set `message` header with a brief message. Body may contain details.
      // Compliant brokers will terminate the connection after any error
      console.log('Broker reported error: ' + frame.headers['message']);
      console.log('Additional details: ' + frame.body);
    },
 });

client.activate();

export function publishToQueue (data) {
   console.log("Sending frame to RabbitMQ");
   client.publish({destination: `/queue/${QUEUE_NAME}`, headers: {}, body: data});
}
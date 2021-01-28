import { Client } from '@stomp/stompjs'

const CONNECTION_URL = 'ws://localhost:15674/ws'
const QUEUE_NAME = 'frames'

const client = new Client()
const batchedData = { frames: [], studentID: 1, roomID: 1, token: localStorage.getItem('token') }

client.configure({
  brokerURL: CONNECTION_URL,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  onConnect: () => {
    // console.log('Connected to RabbitMQ')
  },
  debug: () => {
    // console.log(new Date(), str)
  },
  onStompError: frame => {
    // Will be invoked in case of error encountered at Broker
    // Bad login/passcode typically will cause an error
    // Complaint brokers will set `message` header with a brief message. Body may contain details.
    // Compliant brokers will terminate the connection after any error
    console.log(`Broker reported error: ${frame.headers.message}`)
    console.log(`Additional details: ${frame.body}`)
  },
})

client.activate()

function publishAllToQueue(data) {
  client.publish({ destination: `/queue/${QUEUE_NAME}`, headers: {}, body: data })
}

export function addToBatch(frameBase64String) {
  batchedData.frames.push(frameBase64String)
  if (batchedData.frames.length === 10) {
    publishAllToQueue(JSON.stringify(batchedData))
    batchedData.frames = []
  }
}

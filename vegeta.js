'use strict'
import * as mosca from 'mosca'
import Server from './bin/server'
import { config } from './config'
import * as redis from 'redis'

console.log(config)


const ascoltatore = {
  type: 'redis',
  redis: redis,
  port: config.redis.port,
  host: config.redis.host
}

const settings = {
  port: process.env.NODE_PORT || 1337,
  backend: ascoltatore,
  persistence: {
    factory: mosca.persistence.Redis,
    port: config.redis.port,
    host: config.redis.host
  }
}

const server = new Server(settings)
const vegeta = server.getBroker()

vegeta.on('ready', () => {
  console.log('MQTT Broker listening on port - ', process.env.NODE_PORT || 1337)
})

vegeta.on('clientConnected', (client) => {
  console.log('Client connected with id - ' + client.id)
})

vegeta.on('published', (packet, client) => {
  if (packet.topic.indexOf('$SYS') === 0) return
  console.log("TOPIC / CHANNEL -  " + packet.topic)
  console.log("Message received from - " + client.id.toString() + " || Payload - " + packet.payload.toString())
  console.log('Broker Relaying ! ', packet.payload.toString(), 'on topic', packet.topic)
})

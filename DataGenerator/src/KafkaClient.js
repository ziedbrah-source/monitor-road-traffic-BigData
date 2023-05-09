const { Kafka } = require('kafkajs')



export async function KafkaClient() {
    const kafka = new Kafka({
        brokers: ['localhost:9092'],
      })
      
      const producer = kafka.producer()
      
      await producer.connect()
      await producer.send({
        topic: 'sensorsData',
        messages: [
          { key:"1",value: 'Hello KafkaJS user!' },
        ],
      })
      await producer.disconnect()
 }


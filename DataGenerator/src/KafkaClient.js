const { Kafka } = require('kafkajs')



export async function KafkaClient() {
    const kafka = new Kafka({
        brokers: ['localhost:9092'],
      })
      
      const producer = kafka.producer()
      
      await producer.connect()
     // while(true){
        await producer.send({
          topic: 'sensorsData',
          messages: [
            {value: '{"msg":"Hello KafkaJS user you!","id":"1","event":"INFO"}' },
          ],
        })
     // }
      await producer.disconnect()
 }


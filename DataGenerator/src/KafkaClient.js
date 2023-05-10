const { Kafka } = require('kafkajs')



export async function KafkaClient(msg) {
  
  
   const kafka = new Kafka({
        brokers: ['localhost:9092'],
      })
      
      const producer = kafka.producer()
     
      await producer.connect()
        await producer.send({
          topic: 'sensorsData',
          messages: [
            {value: msg },
          ],
        })

      await producer.disconnect()
 }


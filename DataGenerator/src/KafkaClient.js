const { Kafka } = require('kafkajs')



export async function KafkaClient(msg) {
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
   const kafka = new Kafka({
        brokers: ['localhost:9092'],
      })
      
      const producer = kafka.producer()
     

      await sleep(3000);
        
          //your task after delay.
          await producer.connect()
          await producer.send({
            topic: 'sensorsData',
            messages: [
              {value: msg },
            ],
          })
      await producer.disconnect()
 }


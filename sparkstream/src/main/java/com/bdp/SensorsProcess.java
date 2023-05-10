package com.bdp;


import java.util.*;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import jdk.nashorn.internal.parser.JSONParser;
import org.apache.hadoop.shaded.net.minidev.json.JSONObject;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.spark.streaming.api.java.JavaDStream;
import org.apache.spark.streaming.api.java.JavaInputDStream;
import org.apache.spark.streaming.api.java.JavaPairReceiverInputDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.apache.spark.streaming.kafka.KafkaUtils;
import org.bson.Document;
import scala.Tuple2;

public class SensorsProcess {
    static void process(JavaStreamingContext jsc) {
        KafkaProducerV1 producerV1=new KafkaProducerV1();
        Map<String, Object> kafkaParams = KafkaParams.getKafkaParams();
        Collection<String> topics = Arrays.asList("sensorsData");
        int numThreads = 1;
        Map<String, Integer> topicMap = new HashMap<>();
        topicMap.put("sensorsData", numThreads);
        String arg1="localhost:2181";
        String arg2="test";
        JavaPairReceiverInputDStream<String, String> messages =
                KafkaUtils.createStream(jsc, arg1, arg2, topicMap);

        JavaDStream<String> data = messages.map(Tuple2::_2);

        MongoDatabase database = MyMongoClient.getMongoDatabase();

        MongoCollection<Document> dbCollection = database
                .getCollection("sensors");
        data.foreachRDD(d -> {
            if (d != null) {
                List<String> result = d.collect();
                for (String temp : result) {
                    final Document doc = Document.parse(temp);
                    System.out.println(temp);
                    doc.append("source", "vehicules");
                    dbCollection.insertOne(doc);
                    producerV1.send(doc.getString("id"),doc.getString("event"),doc.getString("msg"));

                }

                if (result.size() != 0) {
                    System.out.println("Inserted Data Done");
                } else {
                    System.out.println("Got no data in this window");
                }
            } else {
                System.out.println("Got no data in this window");
            }

        });
    }
}
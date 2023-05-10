package com.bdp;

import org.apache.kafka.common.serialization.StringDeserializer;

import java.util.HashMap;
import java.util.Map;

public class KafkaParams {

    static Map<String, Object> getKafkaParams() {
        final String kafkaHost = System.getenv().getOrDefault("KAFKA_SERVER", "localhost:9092");
        ;
        Map<String, Object> kafkaParams = new HashMap<>();
        kafkaParams.put("bootstrap.servers", kafkaHost);
        kafkaParams.put("key.deserializer", StringDeserializer.class);
        kafkaParams.put("value.deserializer", StringDeserializer.class);
        kafkaParams.put("group.id", "bdpspark");
        kafkaParams.put("auto.offset.reset", "latest");
        kafkaParams.put("enable.auto.commit", true);
        return kafkaParams;
    }
}
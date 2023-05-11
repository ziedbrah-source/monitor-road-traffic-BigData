import org.json.*;
import java.net.URI;
import java.time.Duration;
import java.util.Collections;
import java.util.Properties;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.ConsumerRecord;

public class Consumer {
    public static void main(String[] args) throws Exception {
        String topicName = "sensorsData";
        Properties props = new Properties();

        props.put("bootstrap.servers", "kafka://localhost:9092");
        props.put("group.id", "test");
        props.put("enable.auto.commit", "true");
        props.put("auto.commit.interval.ms", "1000");
        props.put("session.timeout.ms", "30000");
        props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

        KafkaConsumer<String, String> consumer = new KafkaConsumer<String, String>(props);

        consumer.subscribe(Collections.singletonList(topicName));

        System.out.println("Subscribed to topic: " + topicName);

        int i=0;
        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(100);
            for (ConsumerRecord<String, String> record : records) {
                try {
                    i++;

                    System.out.println(record.value());

                    JSONObject json = new JSONObject(record.value());
                    HDFSClient writer = new HDFSClient(new URI("hdfs://localhost:9000/"), "/user/root/res.txt");
                    writer.write(json.getString("macAddress")+ " " + json.getString("alert") + " "+json.getString("speed"));
                    writer.close();

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

    }
}
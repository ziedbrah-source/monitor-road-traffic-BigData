import java.util.Arrays;

import org.apache.commons.lang.ArrayUtils;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import scala.Tuple2;

public class Monitor {

    static String[] Words = {"Apple",
            "Samsung",
            "Xiaomi",
            "Huawei",
            "Oppo",
            "OnePlus",
            "Motorola",
            "Sony",
            "LG",
            "Nokia"};

    public static void main(String[] args) {
        new Monitor().run("hdfs://localhost:9000/user/root/res.txt", "hdfs://localhost:9000/user/root/outbatch");
    }

    public void run(String inputFilePath, String outputDir) {
        SparkConf conf = new SparkConf().setMaster("local[*]").setAppName(Monitor.class.getName());
        JavaSparkContext sc = new JavaSparkContext(conf);

        JavaRDD<String> logs = sc.textFile(inputFilePath);
        JavaPairRDD<String, Integer> statistics = logs.flatMap(e -> Arrays.asList(e.split(" , ")).iterator())
                .mapToPair(message -> {
                    String[] words = message.split(" ");
                    String disp="";
                    int numberOfWarnings = 0;
                    for (String word : words) {
                        if (ArrayUtils.contains(Words, word)) {
                            disp=word;
                        }
                    }
                    return new Tuple2<>(disp, 1);

                }).reduceByKey(Integer::sum);

        statistics.saveAsTextFile(outputDir);
    }
}
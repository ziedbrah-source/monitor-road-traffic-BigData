package com.bdp;

import org.apache.spark.SparkConf;
import org.apache.spark.streaming.Duration;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaStreamingContext;

public class JavaSparkApp {
    public static void main(String[] args) throws Exception {
        System.setProperty("hadoop.home.dir", "/");

        SparkConf sparkConf = new SparkConf();
        sparkConf.setMaster("local[*]");

        sparkConf.setAppName("BDPStreaming");
        JavaStreamingContext jsc = new JavaStreamingContext(sparkConf,
                new Duration(2000));

        jsc.sparkContext().setLogLevel("WARN");
        SensorsProcess.process(jsc);

        jsc.start();
        jsc.awaitTermination();
    }
}
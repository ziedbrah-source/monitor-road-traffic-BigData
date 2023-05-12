# Road Monitoring System

The Road Monitoring System is a software application developed for real-time monitoring and analysis of vehicular data on Tunisian roads. It utilizes big data technologies such as Kafka, Flask, MongoDB, Spark (batch and streaming), and Node.js to provide a comprehensive solution for road traffic monitoring.

## Features

- Real-time monitoring of vehicle locations and movements on a map.
- Real-time alerts for specific events or conditions.
- Real-time data analytics, including average alerts and average speed for last X minutes (you chose it).
- Batch processing to calculate percentages of different device types for vehicles.
- Visualization of batch processing results using Chart.js.

## Technologies Used

- Kafka
- HDFS (HADOOP FILE SYSTEM)
- Flask
- MongoDB
- Spark
- Node.js
- Java
- React

## Flow Description

The Road Monitoring System follows the following flow:

1. Vehicle sensors installed in vehicles continuously gather data and send it to Kafka, utilizing the "sensorsData" topic. This ensures a continuous stream of data from multiple vehicles on Tunisian roads (generated accurately by us for presentation purpose for now).

2. A java server receives the data from Kafka. It processes the incoming data and writes it to HDFS (Hadoop Distributed File System). HDFS provides a scalable and fault-tolerant storage solution for large-scale data.

3. Spark Batch Processing takes over and retrieves the data from HDFS. It performs batch processing operations on the data, calculating the percentages of each device type for the vehicles. These percentages provide valuable insights into the distribution of different device types among the vehicles.(on demand by the administrator)

4. The monitoring server, built using Node.js, fetches the batch processing results from Spark Batch Processing. It uses Chart.js to visualize the data in the form of charts and graphs. This allows users to easily understand and interpret the distribution of device types among the vehicles.

5. Concurrently, the Spark Streaming server continuously pulls data from the "sensorsData" topic in Kafka. It performs real-time data cleaning and transformation operations to ensure data accuracy and consistency. The cleaned data is then inserted into MongoDB, a NoSQL database designed for high-performance real-time data storage.

6. With the cleaned and processed data in MongoDB, the Spark Streaming server enables real-time analytics. It calculates metrics such as the average number of alerts and average speed of vehicles over the past 5 minutes. These metrics provide insights into the current traffic conditions and help identify potential issues or anomalies.

7. Additionally, the Spark Streaming server publishes a portion of the cleaned data to the "cleanData" topic in Kafka. This allows the monitoring server to retrieve the real-time cleaned data from Kafka (we used this approach to not overload our flask server).

8. The monitoring server made with Flask pulls the cleaned data from the "cleanData" topic in Kafka, enabling real-time monitoring of vehicle locations and movements on a map. It visualizes the vehicles' real-time positions, tracks their movements, and alerts users in case of any anomalies or specific events.

9. The monitoring server also queries MongoDB for real-time data analytics. It fetches and displays additional information such as average alerts and average speed over the past X minutes (you choose X). This information enhances the monitoring capabilities and provides a comprehensive view of the driver/car conditions.


## ARCHITECTURE
![ARCHITECTURE Diagram](https://i.ibb.co/Y0cF56h/Screenshot-from-2023-05-12-00-42-10.png)

FROM maven:3.8.5-openjdk-8 as  mavendeps
COPY pom.xml pom.xml
RUN mvn dependency:resolve

FROM mavendeps as mavenbuild
WORKDIR /app
COPY . .
RUN mvn package

FROM bitnami/spark
WORKDIR /app
COPY --from=mavenbuild /app/target/*.jar /app/

CMD [ "spark-submit" , "--class" , "com.bdp.JavaSparkApp" ,"/app/sparkstream-1.0-SNAPSHOT-jar-with-dependencies.jar"  ]
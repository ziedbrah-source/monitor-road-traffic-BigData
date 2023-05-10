package com.bdp;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

public class MyMongoClient {
    static MongoDatabase getMongoDatabase() {

        final String defaultUri = "mongodb://bdp:password@localhost:27017";

        String uri = System.getenv().getOrDefault("MONGO_URI", defaultUri);

        MongoClient mongoClient = MongoClients.create(uri);

        MongoDatabase database = mongoClient.getDatabase("sensors");

        return database;
    }
}
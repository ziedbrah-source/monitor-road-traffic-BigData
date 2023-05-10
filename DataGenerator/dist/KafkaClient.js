"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaClient = void 0;
const { Kafka } = require('kafkajs');
function KafkaClient() {
    return __awaiter(this, void 0, void 0, function* () {
        const kafka = new Kafka({
            brokers: ['localhost:9092'],
        });
        const producer = kafka.producer();
        yield producer.connect();
        // while(true){
        yield producer.send({
            topic: 'sensorsData',
            messages: [
                { value: '{"msg":"Hello KafkaJS user you!","id":"1","event":"INFO"}' },
            ],
        });
        // }
        yield producer.disconnect();
    });
}
exports.KafkaClient = KafkaClient;

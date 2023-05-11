from flask import Flask, render_template, Response
from pykafka import KafkaClient

from pymongo import MongoClient
from datetime import datetime , timedelta , timezone





def get_kafka_client():
    return KafkaClient(hosts='127.0.0.1:9092')

app = Flask(__name__)
client = MongoClient('mongodb+srv://user:user@cluster0.dge37.mongodb.net/')
#client = MongoClient('mongodb://7.tcp.eu.ngrok.io:18242',username='bdp', password='password')

#db = client.flask_db
db = client['sensors']
collection = db['sensors']
#sensors = db.sensors


@app.route('/statistics')
def test():
    start_date = datetime.now() -  timedelta(minutes= 5) # Replace with your desired start date
    end_date = datetime.now() # Replace with your desired end date
    # Define the query using the $gte and $lt operators
    #print(int(end_date.timestamp() * 1000))

    alertsQuery = {
        'alert': 'true'
    }
    all_todos = collection.find()
    alerts_todos = collection.find(alertsQuery)

    listt = list(all_todos)
    print(listt)
    for document in alerts_todos:
         print(document)
         if(int(document["timestamp"])>int(start_date.timestamp() * 1000)):
            print(document)
            
    for document in all_todos:
        #print(document)
         if(int(document["timestamp"])>int(start_date.timestamp() * 1000)):
            sped = document["speed"];

            print(document)
    #print(all_todos)
    return render_template('index2.html', todos=all_todos)

@app.route('/')
def index():
    return(render_template('index.html'))

#Consumer API
@app.route('/topic/<topicname>')
def get_messages(topicname):
    client = get_kafka_client()
    def events():
        for i in client.topics[topicname].get_simple_consumer():
            yield 'data:{0}\n\n'.format(i.value.decode())
    return Response(events(), mimetype="text/event-stream")

if __name__ == '__main__':
    app.run(debug=True, port=5001)

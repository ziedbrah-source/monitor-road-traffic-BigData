from flask import Flask, render_template, Response , send_from_directory
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


@app.route('/statistics/<int:time>')
def stats(time):
    start_date = datetime.now() -  timedelta(minutes= time) # Replace with your desired start date
    end_date = datetime.now() # Replace with your desired end date
    # Define the query using the $gte and $lt operators
    #print(int(end_date.timestamp() * 1000))

    alertsQuery = {
        'alert': 'true'
    }
    all_todos = collection.find()
    alerts_todos = collection.find(alertsQuery)

    #get the alerts
    alerts = []
    for document in alerts_todos:
         #print(document)
         if(int(document["timestamp"])>int(start_date.timestamp() * 1000)):
            print(document)
            alerts.append(document)

    #average speed
    total_speed = 0         
    for document in all_todos:
        if(int(document["timestamp"])>int(start_date.timestamp() * 1000)):
             print(document)
        speed = document["speed"]
        print(speed)
        speed_value = speed.replace(" km/h", "")
        #print(speed)
        total_speed += int(speed_value)
    average = 0 ;    
    if(len(alerts) != 0):
        average = total_speed/(len(alerts))

    return render_template('index2.html', todos=alerts , time=time , average = average ,nbr = len(alerts) )

@app.route('/')
def index():
    return(render_template('index.html'))

@app.route('/report')
def serve_text():
    return send_from_directory('static', 'batchData.txt', mimetype='text/plain')

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

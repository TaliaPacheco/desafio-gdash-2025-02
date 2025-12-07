import requests
import pika
import json
import time
import os

QUEUE_NAME = os.getenv('QUEUE_NAME')

def conectar_rabbitmq():
    while True:
        try:
            print("Abrindo conexão RabbitMQ...")
            credentials = pika.PlainCredentials('admin', 'admin')
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(
                   host='rabbitmq', 
                   port=5672,
                   credentials=credentials,
                   socket_timeout=10,
                   connection_attempts=3,
                   retry_delay=2,
                   heartbeat=30
                )
            )
            channel = connection.channel()
            channel.queue_declare(queue=QUEUE_NAME, durable=True)
            print("Conectado ao RabbitMQ!")
            return connection, channel
        except Exception as e:
            print(f"Erro ao conectar RabbitMQ: {e}")
            time.sleep(5)

print("Começando")
connection, channel = conectar_rabbitmq()

API_KEY = os.getenv('OPENWEATHER_API_KEY')
LAT = -23.958807
LON = -46.331928

url = (
   f"http://api.openweathermap.org/data/2.5/weather?"
   f"lat={LAT}&lon={LON}&appid={API_KEY}&units=metric&lang=pt_br"
)

while True:   
   try:
      if connection.is_closed:
         print("Conexão perdida, reconectando...")
         connection, channel = conectar_rabbitmq()
      
      print("Chamando API de clima...")      
      response = requests.get(url, timeout=10)

      print("Resposta da API:", response.status_code)
      weather_data = response.json()

      weather_json = json.dumps(weather_data)

      channel.basic_publish(
         exchange='',
         routing_key=QUEUE_NAME,
         body=weather_json
      )

      print("Dados enviados para a fila 'clima'.")
      time.sleep(30)
   except pika.exceptions.ConnectionClosed:
      print("Conexão RabbitMQ fechada, reconectando...")
      connection, channel = conectar_rabbitmq()
   except Exception as err:
      print(f"Erro ao chamar API ou enviar dados: {err}")
      time.sleep(5)
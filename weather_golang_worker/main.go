package main

import (
	"encoding/json"
	"log"
	"net/http"
	"bytes"
	"os"
	"time"

	"github.com/rabbitmq/amqp091-go"
)

type IncomingWeather struct {
	Coord struct {
		Lon float64 `json:"lon"`
		Lat float64 `json:"lat"`
	} `json:"coord"`

	Weather []struct {
		ID          int    `json:"id"`
		Main        string `json:"main"`
		Description string `json:"description"`
		Icon        string `json:"icon"`
	} `json:"weather"`

	Base string `json:"base"`

	Main struct {
		Temp      float64 `json:"temp"`
		FeelsLike float64 `json:"feels_like"`
		TempMin   float64 `json:"temp_min"`
		TempMax   float64 `json:"temp_max"`
		Pressure  int     `json:"pressure"`
		Humidity  int     `json:"humidity"`
		SeaLevel  int     `json:"sea_level"`
		GrndLevel int     `json:"grnd_level"`
	} `json:"main"`

	Visibility int `json:"visibility"`

	Wind struct {
		Speed float64 `json:"speed"`
		Deg   int     `json:"deg"`
		Gust  float64 `json:"gust"`
	} `json:"wind"`

	Rain struct {
		OneH float64 `json:"1h"`
	} `json:"rain"`

	Clouds struct {
		All int `json:"all"`
	} `json:"clouds"`

	Dt int64 `json:"dt"`

	Sys struct {
		Type    int    `json:"type"`
		ID      int    `json:"id"`
		Country string `json:"country"`
		Sunrise int64  `json:"sunrise"`
		Sunset  int64  `json:"sunset"`
	} `json:"sys"`

	Timezone int    `json:"timezone"`
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Cod      int    `json:"cod"`
}


type ProcessedWeather struct {
	Coord struct {
		Lat float64 `json:"lat"`
		Lon float64 `json:"lon"`
	} `json:"coord"`
	Temperature     float64 `json:"temperature"`
	PercentHumidity int     `json:"percent_humidity"`
	Wind struct {
		Speed float64 `json:"speed"`
		Deg   int     `json:"deg"`
	} `json:"wind"`
	WeatherCondition struct {
		Type        string `json:"type"`
		Description string `json:"description"`
	} `json:"weather_condition"`
	FeelsLike       float64 `json:"feels_like"`
	TemperatureMin  float64 `json:"temperature_min"`
	TemperatureMax  float64 `json:"temperature_max"`
	VisibilityLevel int     `json:"visibility_level"`
}



func main() {

	log.Println("Iniciando worker Go...")

	rabbitURL := os.Getenv("RABBITMQ_URL")
	nestAPI := os.Getenv("NEST_API_URL")
	queueName := os.Getenv("QUEUE_NAME")

	log.Println("Conectando ao RabbitMQ em:", rabbitURL)

	var conn *amqp091.Connection
    var err error
    maxRetries := 5
    retryDelay := 2 * time.Second

    for i := 1; i <= maxRetries; i++ {
        conn, err = amqp091.Dial(rabbitURL)
        if err == nil {
            log.Println("Conectado ao RabbitMQ com sucesso!")
            break
        }
        
        if i < maxRetries {
            log.Printf("Tentativa %d/%d falhou. Tentando novamente em %v... (Erro: %v)\n", i, maxRetries, retryDelay, err)
            time.Sleep(retryDelay)
        } else {
            log.Fatal("Erro ao conectar RabbitMQ após 5 tentativas:", err)
        }
    }
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatal("Erro ao abrir canal:", err)
	}
	defer ch.Close()

	msgs, err := ch.Consume(
		queueName,
		"go-worker",
		false, 
		false,
		false,
		false,
		nil,
	)

	if err != nil {
		log.Fatal("Erro ao consumir fila:", err)
	}

	log.Println("Worker Go iniciado... aguardando mensagens.")

	for msg := range msgs {
		go processMessage(msg, nestAPI)
	}
}

func processMessage(msg amqp091.Delivery, nestAPI string) {
	var incoming IncomingWeather

	if err := json.Unmarshal(msg.Body, &incoming); err != nil {
		log.Println("JSON inválido:", err)
		msg.Nack(false, false) 
		return
	}

	var out ProcessedWeather
	out.Temperature = incoming.Main.Temp
	out.PercentHumidity = incoming.Main.Humidity
	out.Wind.Speed = incoming.Wind.Speed
	out.Wind.Deg = incoming.Wind.Deg

	if len(incoming.Weather) > 0 {
		out.WeatherCondition.Type = incoming.Weather[0].Main
		out.WeatherCondition.Description = incoming.Weather[0].Description
	}

	out.Coord.Lat = incoming.Coord.Lat
	out.Coord.Lon = incoming.Coord.Lon
	out.FeelsLike = incoming.Main.FeelsLike
	out.TemperatureMin = incoming.Main.TempMin
	out.TemperatureMax = incoming.Main.TempMax
	out.VisibilityLevel = incoming.Visibility

	jsonBody, _ := json.Marshal(out)

	resp, err := http.Post(nestAPI, "application/json", bytes.NewBuffer(jsonBody))

	if err != nil || resp.StatusCode >= 300 {
		log.Println("Erro ao enviar para NestJS. Tentando retry...")

		time.Sleep(2 * time.Second)

		resp2, err2 := http.Post(nestAPI, "application/json", bytes.NewBuffer(jsonBody))
		if err2 != nil || resp2.StatusCode >= 300 {
			log.Println("Retry falhou. DESCARTANDO mensagem.")
			msg.Nack(false, false)
			return
		}
	}

	log.Println("Processado com sucesso!")
	msg.Ack(false)
}
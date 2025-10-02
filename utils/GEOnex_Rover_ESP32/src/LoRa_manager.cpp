#include "LoRa_manager.h"

void RoverLoRa::begin()
{
    spiLoRa.begin(LORA_SCK, LORA_MISO, LORA_MOSI, LORA_CS);
    LoRa.setSPI(spiLoRa);
    LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO0);

    if (!LoRa.begin(433E6))
    {
        Serial.println("Starting LoRa failed!");
        while (1)
            ;
    }
    Serial.println("LoRa Rover Ready");
}

void RoverLoRa::receiveData()
{
    int packetSize = LoRa.parsePacket();
    if (packetSize)
    {
        String received = "";
        while (LoRa.available())
        {
            received += (char)LoRa.read();
        }

        Serial.println("Received: " + received);

        JsonDocument jsonDoc; // Dynamic allocation
        DeserializationError error = deserializeJson(jsonDoc, received);

        if (!error)
        {
            float latitude = jsonDoc["latitude"];
            float longitude = jsonDoc["longitude"];
            int satellites = jsonDoc["satellites"];
            const char *timestamp = jsonDoc["timestamp"];

            Serial.println("Received Base Data:");
            Serial.print("Lat: ");
            Serial.print(latitude, 8);
            Serial.print("Lon: ");
            Serial.print(longitude, 8);
            Serial.print("Satellites: ");
            Serial.print(satellites);
            Serial.print("Time: ");
            Serial.println(timestamp);
        }
        else
        {
            Serial.println("JSON parse failed");
        }
    }
}

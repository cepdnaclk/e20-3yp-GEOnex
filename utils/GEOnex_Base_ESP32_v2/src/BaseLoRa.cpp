#include "BaseLoRa.h"

void BaseLoRa::begin()
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
    Serial.println("LoRa Base Station Ready");
}

void BaseLoRa::sendData(float latitude, float longitude, int satellites, String timestamp)
{
    JsonDocument jsonDoc; // Dynamic allocation
    jsonDoc["latitude"] = latitude;
    jsonDoc["longitude"] = longitude;
    jsonDoc["satellites"] = satellites;
    jsonDoc["timestamp"] = timestamp;

    char jsonBuffer[256];
    serializeJson(jsonDoc, jsonBuffer);

    LoRa.beginPacket();
    LoRa.print(jsonBuffer);
    LoRa.endPacket();

    Serial.print("Sent: ");
    Serial.println(jsonBuffer);
}

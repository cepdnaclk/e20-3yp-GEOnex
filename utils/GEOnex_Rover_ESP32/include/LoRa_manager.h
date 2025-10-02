#ifndef LORAMANAGER_H
#define LORAMANAGER_H

#include <Arduino.h>
#include <SPI.h>
#include <LoRa.h>
#include <ArduinoJson.h>

// Pin definitions
#define LORA_SCK 14
#define LORA_MISO 12
#define LORA_MOSI 13
#define LORA_CS 15
#define LORA_RST 27
#define LORA_DIO0 25

class RoverLoRa
{
public:
    void begin();
    void receiveData();

private:
    SPIClass spiLoRa = SPIClass(HSPI);
};

#endif

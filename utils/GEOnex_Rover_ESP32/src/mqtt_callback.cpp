#include "mqtt_callback.h"
#include <ArduinoJson.h>
#include "config.h"
#include "gps_correction.h"

unsigned long lastBaseDataTime = 0;
unsigned long lastFixDataTime = 0;
const unsigned long baseTimeout = 1000; // 1 seconds

void mqttCallback(char *topic, byte *payload, unsigned int length)
{
    String incoming = "";
    for (unsigned int i = 0; i < length; i++)
    {
        incoming += (char)payload[i];
    }

    Serial.print("[RECEIVED] Topic: ");
    Serial.println(topic);
    // Serial.print("Payload: ");
    // Serial.println(incoming);

    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, incoming);

    if (error)
    {
        Serial.print("[ERROR] JSON parse failed: ");
        Serial.println(error.c_str());
        return;
    }

    String topicStr = String(topic);

    if (topicStr == MQTT_TOPIC_SUB_LIVE)
    {
        lastBaseDataTime = millis(); // Update time

        float lat = doc["latitude"];
        float lon = doc["longitude"];
        int sats = doc["Satellites"];
        String time = doc["timestamp"];

        Serial.print("[Live Base Data] Lat: ");
        Serial.print(lat, 6);
        Serial.print(", Lon: ");
        Serial.print(lon, 6);
        Serial.print(", Sats: ");
        Serial.print(sats);
        Serial.print(", Time: ");
        Serial.println(time);

        updateBaseLive(lat, lon, time); // ✅ Feed live base
    }
    else if (topicStr == MQTT_TOPIC_SUB_FIXED)
    {
        lastFixDataTime = millis(); // Update time

        float fixedLat = doc["Fixed_latitude"];
        float fixedLon = doc["Fixed_longitude"];

        Serial.print("[Fixed Base Position] Lat: ");
        Serial.print(fixedLat, 6);
        Serial.print(", Lon: ");
        Serial.println(fixedLon, 6);

        updateBaseFixed(fixedLat, fixedLon); // ✅ One-time init
    }
}

void checkBaseTimeout()
{
    unsigned long now = millis();

    if ((now - lastBaseDataTime) > baseTimeout)
    {
        Serial.println("[WARNING] No live base data received!");
        lastBaseDataTime = now; // reset to prevent spamming
    }

    if ((now - lastFixDataTime) > baseTimeout)
    {
        Serial.println("[WARNING] No fixed base data received!");
        lastFixDataTime = now; // reset to prevent spamming
    }
}

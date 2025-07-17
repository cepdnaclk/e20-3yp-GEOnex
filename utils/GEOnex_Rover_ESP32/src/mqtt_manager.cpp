#include <PubSubClient.h>
#include "mqtt_manager.h"
#include "wifi_manager.h"
#include "wifi_strength.h"
#include <ArduinoJson.h>
#include <WiFi.h>
#include "env.h"
#include <WiFiClientSecure.h>
#include "config.h"
#include "mqtt_callback.h"

WiFiClientSecure net;
PubSubClient client(net);

const int8_t TIME_ZONE = -5;

// Function to connect to NTP server and set time
void NTPConnect()
{
    // Set time using SNTP
    Serial.print("[PROCESS] Setting time using SNTP");
    configTime(TIME_ZONE * 3600, 0, "pool.ntp.org", "time.nist.gov");
    time_t now = time(nullptr);
    while (now < 1510592825)
    { // January 13, 2018
        delay(500);
        Serial.print(".");
        now = time(nullptr);
    }
    Serial.println("[DONE]");
}

// Function to connect to AWS IoT Core
void connectMQTT()
{
    delay(MQTT_RETRY_DELAY);

    // Connect to NTP server to set time
    NTPConnect();

    net.setCACert(cacert);
    net.setCertificate(client_cert);
    net.setPrivateKey(privkey);

    // Connect MQTT client to AWS IoT Core
    client.setServer(MQTT_HOST, MQTT_PORT);

    // ✅ Set the MQTT message callback here
    client.setCallback(mqttCallback);
    
    Serial.println("[PROCESS]   Connecting to AWS IoT...");

    // Attempt to connect to AWS IoT Core
    while (!client.connect(DEVICE_ID))
    {
        Serial.print(".");
        delay(MQTT_RETRY_DELAY);
    }

    // Check if connection is successful
    if (!client.connected())
    {
        Serial.println("[ERROR] AWS IoT Timeout!");
        return;
    }

    // Subscribe to desired topics to get data from the base
    client.subscribe(MQTT_TOPIC_SUB_LIVE);
    client.subscribe(MQTT_TOPIC_SUB_FIXED);

    // Subscribe to MQTT topic
    client.subscribe(MQTT_TOPIC_COMMAND);
    digitalWrite(LED_MQTT, HIGH);
    Serial.println("[SUCCESS]   AWS IoT Connected!");
}

bool mqttConnected()
{
    return client.connected();
}

void mqttLoop()
{
    client.loop();
}

void publishGPSData(float latitude, float longitude, int satellites, String time)

{
    if (!mqttConnected())
    {
        Serial.println("[RETRYING]  MQTT not connected. Attempting to reconnect...");
        connectMQTT();
    }

    JsonDocument jsonDoc;
    jsonDoc["latitude"] = latitude;
    jsonDoc["longitude"] = longitude;
    jsonDoc["Satellites"] = satellites;
    jsonDoc["timestamp"] = time;

    char jsonBuffer[256];
    serializeJson(jsonDoc, jsonBuffer);

    if (client.publish(MQTT_TOPIC_DATA_LIVE, jsonBuffer))
    {
        Serial.println("[INFO]  GPS data published successfully");
        handleMQTTLED();
    }
    else
    {
        Serial.println("[FAILED]    Failed to publish GPS data");
    }
}

// Function to publish RSSI and signal quality
void publish_wifi_strength()
{
    int rssi = get_wifi_rssi();
    int quality = get_signal_quality();

    JsonDocument jsonDoc;
    jsonDoc["device_id"] = DEVICE_ID;
    //jsonDoc["rssi"] = rssi;
    jsonDoc["wifi quality"] = quality;

    char jsonBuffer[128];
    serializeJson(jsonDoc, jsonBuffer);

    if (client.publish(MQTT_TOPIC_DATA_LIVE, jsonBuffer))
    {
        Serial.printf("[INFO]  Device ID: %s, Wifi_Quality: %d\n", DEVICE_ID, quality);
        //Serial.println("[INFO]  WiFi strength published successfully");
        handleMQTTLED();
    }
}

void publishData(String deviceId, String status, float latitude, float longitude, int satellites, 
                String time, float colat, float colon, int battery, int wifi )

{
    if (!mqttConnected())
    {
        Serial.println("[RETRYING]  MQTT not connected. Attempting to reconnect...");
        connectMQTT();
    }

    JsonDocument jsonDoc;
    jsonDoc["device_id"] = DEVICE_ID;
    jsonDoc["status"] = status;
    jsonDoc["latitude"] = latitude;
    jsonDoc["longitude"] = longitude;
    jsonDoc["Satellites"] = satellites;
    jsonDoc["timestamp"] = time;
    jsonDoc["colatitude"] = colat;
    jsonDoc["colongitude"] = colon;
    jsonDoc["battery"] = battery;
    jsonDoc["wifi"] = wifi;


    char jsonBuffer[256];
    serializeJson(jsonDoc, jsonBuffer);

    if (client.publish(MQTT_TOPIC_DATA_LIVE, jsonBuffer))
    {
        Serial.println("[INFO]  Data published successfully");
        handleMQTTLED();
    }
    else
    {
        Serial.println("[FAILED]    Failed to publish Data");
    }
}

void publishStatus(String status, int battery, int wifi)

{
    if (!mqttConnected())
    {
        Serial.println("[RETRYING]  MQTT not connected. Attempting to reconnect...");
        connectMQTT();
    }

    JsonDocument jsonDoc;
    jsonDoc["status"] = status;
    jsonDoc["battery"] = battery;
    jsonDoc["wifi"] = wifi;

    char jsonBuffer[256];
    serializeJson(jsonDoc, jsonBuffer);

    if (client.publish(MQTT_TOPIC_DATA_UTILS, jsonBuffer))
    {
        Serial.println("[INFO]  Status Data published successfully");
        handleMQTTLED();
    }
    else
    {
        Serial.println("[FAILED]    Failed to publish Status Data");
    }
}

void mockPublishGPSData()
{
    float baseLatitude = 37.7749;
    float baseLongitude = -122.4194;
    int baseSatellites = 10;
    String basetime = "20.20.20";

    float randomLatitude = baseLatitude + ((rand() % 100 - 50) * 0.0001);
    float randomLongitude = baseLongitude + ((rand() % 100 - 50) * 0.0001);
    int randomSatellites = baseSatellites + (rand() % 5 - 2);

    delay(MQTT_PUBLISH_DELAY_MOCK);
    publishGPSData(randomLatitude, randomLongitude, randomSatellites, basetime);
}

void handleMQTTLED()
{
    digitalWrite(LED_MQTT, LOW);
    delay(MQTT_LED_DELAY);
    digitalWrite(LED_MQTT, HIGH);
}

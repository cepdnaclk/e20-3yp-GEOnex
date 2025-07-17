#ifndef MQTT_MANAGER_H
#define MQTT_MANAGER_H

#include <Arduino.h>

void connectMQTT();
void publishGPSData(float latitude, float longitude, int satellites, String time);
void publish_wifi_strength();
void publishData(String deviceId, String status, float latitude, float longitude, int satellites,
                 String time, float colat, float colon, int battery, int wifi);

void publishStatus(String status, int battery, int wifi);

bool mqttConnected();
void mqttLoop();
void mockPublishGPSData();
void handleMQTTLED() ;

#endif

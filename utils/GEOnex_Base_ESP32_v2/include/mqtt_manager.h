#ifndef MQTT_MANAGER_H
#define MQTT_MANAGER_H

#include <Arduino.h>

void connectMQTT();
void publishGPSData(float latitude, float longitude, int satellites, String time);
void publishBaseFix(double latitude, double longitude);
void publishData(String deviceId, String status, double latitude, double longitude, int satellites,
                 String time, int battery, int wifi);

bool mqttConnected();
void mqttLoop();
void mockPublishGPSData();
void handleMQTTLED() ;

#endif

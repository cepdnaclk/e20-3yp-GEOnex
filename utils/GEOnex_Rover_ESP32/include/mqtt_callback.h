#ifndef MQTT_CALLBACK_H
#define MQTT_CALLBACK_H

#include <Arduino.h>

void mqttCallback(char *topic, byte *payload, unsigned int length);
void checkBaseTimeout();

#endif

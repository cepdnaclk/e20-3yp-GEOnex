#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "wifi_manager.h"
#include "mqtt_manager.h"
#include "gps_manager.h"
#include "env.h"
#include "gnss_esp.h"
#include "config.h"
#include "button_manager.h"
#include "base_calibration.h"
#include "battery_manager.h"
#include "wifi_strength.h"
#include "pin_manager.h"
#include "base_average.h"
#include "wifi_portal.h"

WiFiPortal wifi("GeoNex-Base", "12345678", BUTTON_RESET_WIFI);

void setup()
{
  Serial.begin(SERIAL_BAUD_RATE);

  // Configures pin modes for LEDs and buttons
  setupPins();

  // Initialize WiFi and connect to network
  // connectWiFi(); // Normal method to connect to wifi
  wifi.connect(); // Use WiFiPortal to connect to WiFi

  // Initialize MQTT
  connectMQTT();

  // Initialize Battery monitor
  initBatteryMonitor();

  Serial.println("[INFO]  ESP32 Setup complete");

  // Base Calibration
  FIXEDData fix = computePrecisePosition();
  if (fix.isValid)
  {
    publishBaseFix(fix.latitude, fix.longitude);
  }
}

void loop()
{
  //******************************************************* */
  // Process GPS Data
  // GPSData gpsInfo = processGPS();

  // double lat, lon;
  // int satellites;
  // String time;


  // if (gpsInfo.isValid)
  // {
  //   lat = gpsInfo.latitude;
  //   lon = gpsInfo.longitude;
  //   satellites = gpsInfo.satellites;
  //   time = gpsInfo.time;

  //   // Print GPS data for testing
  //   Serial.printf("[Test]  Raw GPS: Lat: %.6f, Lon: %.6f, Satellites: %d, Time: %s\n", lat, lon, satellites, time.c_str());
  // }
  // else
  // {
  //   lat = NAN;
  //   lon = NAN;
  //   satellites = -1;
  //   time = "";
  //   Serial.println("[Test]  No valid GPS data received.");
  // }

  // /* Publish data to MQTT  */
  // //publishGPSData(lat, lon, satellites, time);

  //******************************************************************* */

  int wifiquality = get_signal_quality();
  //Serial.printf("[Test]  WiFi Quality: %d\n", wifiquality);

  checkButtonPresses();
  wifi.checkResetButton();

  int batteryPercentage = getBatteryPercentage(readBatteryVoltage());
  //Serial.printf("[Test]  Battery Percentage: %d%%\n", batteryPercentage);

  // publishData(DEVICE_ID, "OK", lat, lon, satellites, time, batteryPercentage, wifiquality);


  //******************************************************* */
  // Sending average position instand of live position
  // To ensure the base station has a stable position before sending it
  AVEGData avefix = computeAveragePosition();
  if (avefix.isValid)
  {
    Serial.println("[INFO]  Base Station Position Stabilized! Sending average position");
    // Serial.print("Final Coordinates: ");
    // Serial.print(avefix.latitude, 8);
    // Serial.print(", ");
    // Serial.println(avefix.longitude, 8);
    // Serial.print("Satellites: ");
    // Serial.println(avefix.satellites);
    // Serial.print("Time: ");
    // Serial.println(avefix.time);
    // Publish the average position to MQTT
    publishData(DEVICE_ID, "OK", avefix.latitude, avefix.longitude, avefix.satellites, avefix.time, batteryPercentage, wifiquality);
  }
  //******************************************************* */

  // Handle MQTT connection and loop
  mqttLoop();


  // Main loop delay
  delay(MAIN_LOOP_DELAY);
}
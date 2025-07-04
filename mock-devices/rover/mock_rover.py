import ssl
import time
import json
import random
import paho.mqtt.client as mqtt
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# === AWS IoT Core Configuration ===
thing_name = os.getenv("THING_NAME_Base")
endpoint = os.getenv("AWS_IOT_ENDPOINT")
port = int(os.getenv("AWS_IOT_PORT", "8883"))  # Default to 8883 if not set
topic = os.getenv("TOPIC_Rover")

# === Paths to Certificates ===
ca_path = os.getenv("CA_PATH")
cert_path = os.getenv("CERT_PATH")
key_path = os.getenv("KEY_PATH")

# === Validate required environment variables ===
required_vars = [thing_name, endpoint, topic, ca_path, cert_path, key_path]
if not all(required_vars):
    print("Error: Missing required environment variables")
    exit(1)

# === Initial Rover GPS Position ===
rover_lat = float(os.getenv("ROVER_LAT", "6.9271"))  # Default to Colombo
rover_lon = float(os.getenv("ROVER_LON", "79.8612"))

# === MQTT Client Setup ===
client = mqtt.Client(client_id=thing_name)
client.tls_set(ca_certs=ca_path,
               certfile=cert_path,
               keyfile=key_path,
               tls_version=ssl.PROTOCOL_TLSv1_2)

# === GPS Movement Simulator ===
def simulate_rover_movement():
    global rover_lat, rover_lon
    return {
        "device": thing_name,
        "status" : "active",
        "latitude" : round(random.uniform(rover_lat - 0.00001, rover_lat + 0.00001), 6),    # Simulate small changes in latitude
        "longitude" : round(random.uniform(rover_lon - 0.00001, rover_lon + 0.00001), 6),  # Simulate small changes in longitude
        "satellites" : random.randint(5, 12),
        "timestamp" : time.strftime("%Y-%m-%d %H:%M:%S"),
        "battery" : random.randint(50, 100),
        "wifi" : random.randint(60, 100),
    }

def change_gps():
    global rover_lat, rover_lon
    # Simulate a very small change in GPS position
    rover_lat += random.uniform(-0.0005, 0.0005)
    rover_lon += random.uniform(-0.0005, 0.0005)
    # Optionally clamp to valid GPS ranges
    rover_lat = max(min(rover_lat, 90), -90)
    rover_lon = max(min(rover_lon, 180), -180)

# === Callback Functions ===
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print(f"[CONNECTED] Successfully connected to AWS IoT Core")
        print(f"[INFO] Publishing to topic: {topic}")
    else:
        print(f"[FAILED TO CONNECT] Error code: {rc}")
        return

def on_publish(client, userdata, mid):
    print(f"[PUBLISHED] Message ID: {mid}")

def on_disconnect(client, userdata, rc):
    print(f"[DISCONNECTED] Reason code: {rc}")

def on_log(client, userdata, level, buf):
    print(f"[LOG] {buf}")

# === Set Callbacks ===
client.on_connect = on_connect
client.on_publish = on_publish
client.on_disconnect = on_disconnect
client.on_log = on_log

# === Main Publishing Loop ===
def main():
    try:
        print(f"[CONNECTING] Connecting to {endpoint}:{port}")
        client.connect(endpoint, port, 60)
        
        # Start the network loop in a separate thread
        client.loop_start()
        
        # Wait for connection
        time.sleep(2)
        
        # Publishing loop
        while True:
            if client.is_connected():
                payload = simulate_rover_movement()
                result = client.publish(topic, json.dumps(payload), qos=1)
                
                if result.rc == mqtt.MQTT_ERR_SUCCESS:
                    print(f"[PAYLOAD] {payload}")
                else:
                    print(f"[PUBLISH ERROR] Failed to publish: {result.rc}")
                
                change_gps();   # to mock changeing the device locations
                time.sleep(8)  # Wait 10 seconds before next move
                
            else:
                print("[ERROR] Not connected, attempting to reconnect...")
                client.reconnect()
                time.sleep()
                
    except KeyboardInterrupt:
        print("\n[SHUTDOWN] Shutting down...")
    except Exception as e:
        print(f"[ERROR] {e}")
    finally:
        client.loop_stop()
        client.disconnect()

if __name__ == "__main__":
    main()
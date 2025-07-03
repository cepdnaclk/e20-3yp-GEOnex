# 🛰️ GEOnex Mock Devices

This folder contains Python scripts to simulate **GEOnex rover** and **base station** devices. These mock devices publish simulated GPS data to **AWS IoT Core** via MQTT, helping test your backend and frontend systems without needing actual hardware.

---

## 📁 Folder Structure

```
mock-devices/
├── rover/
│   └── mock_rover.py
├── base/
│   └── mock_base.py
├── certs/
│   ├── AmazonRootCA1.pem
│   ├── device.pem.crt
│   └── private.pem.key
└── README.md

```

## 🛠️ Requirements

- Python 3.6+
- `paho-mqtt` library
- AWS IoT Core credentials (certs and endpoint)

Install the MQTT library:

```bash
pip install paho-mqtt

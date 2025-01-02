import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

const BluetoothComponent = () => {
  const [isconnectedMQTTBroker, setIsconnectedMQTTBroker] = useState(false);
  const [messageMQTTBroker, setMessageMQTTBroker] = useState('');
  const broker = 'ws://192.168.1.9:9001';  // Địa chỉ broker MQTT qua WebSocket
  const topic = 'home/data';  // Topic mà bạn muốn lắng nghe

  useEffect(() => {
    // Kết nối đến broker MQTT qua WebSocket
    const client = mqtt.connect(broker);

    // Callback khi kết nối thành công
    client.on('connect', () => {
      setIsconnectedMQTTBroker(true);
      console.log('Connected to MQTT Broker');
      client.subscribe(topic, (err) => {
        if (!err) {
          console.log(`Subscribed to topic ${topic}`);
        } else {
          setIsconnectedMQTTBroker(false);
          console.error('Subscription failed:', err);
        }
      });
    });

    // Callback khi nhận thông điệp
    client.on('message', (topic, payload) => {
      console.log(`Received message: ${payload.toString()} on topic ${topic}`);
      setMessageMQTTBroker(payload.toString());
    });

    // Dọn dẹp khi component bị unmount
    return () => {
      client.end();
    };
  }, []);

  return (
    <div>
      <h1>MQTT Client</h1>
      <p>Received message: {messageMQTTBroker}</p>
      <p>{isconnectedMQTTBroker ? 'true' : 'false'}</p>
    </div>
  );
};

export default BluetoothComponent;

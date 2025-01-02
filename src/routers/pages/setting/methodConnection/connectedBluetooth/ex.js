import React, { useState } from 'react';

// Các UUID cấu hình
const BLE_CONFIG = {
  serviceUUID: '12345678-1234-5678-1234-56789abcdef0',  // UUID của dịch vụ
  cameraCharacteristicUUID: '12345678-1234-5678-1234-56789abcdef1',  // UUID của đặc tính camera
  serverCharacteristicUUID: '12345678-1234-5678-1234-56789abcdef2',  // UUID của đặc tính server
  qrCharacteristicUUID: '12345678-1234-5678-1234-56789abcdef3',  // UUID của đặc tính mã QR
};

const BluetoothComponent = () => {
  const [cameraStatus, setCameraStatus] = useState('off');
  const [serverStatus, setServerStatus] = useState('stopped');
  const [device, setDevice] = useState(null);  // Lưu trữ đối tượng thiết bị
  const [devicesList, setDevicesList] = useState([]);  // Lưu danh sách thiết bị tìm thấy
  const [qrData, setQrData] = useState('');  // Dữ liệu mã QR nhận được từ Raspberry Pi

  // Hàm kết nối với Raspberry Pi qua BLE
  const connectToBLE = async (device) => {
    try {
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(BLE_CONFIG.serviceUUID);

      // Lấy các đặc tính của camera, server và mã QR
      const cameraCharacteristic = await service.getCharacteristic(BLE_CONFIG.cameraCharacteristicUUID);
      const serverCharacteristic = await service.getCharacteristic(BLE_CONFIG.serverCharacteristicUUID);
      const qrCharacteristic = await service.getCharacteristic(BLE_CONFIG.qrCharacteristicUUID);

      setDevice({ cameraCharacteristic, serverCharacteristic, qrCharacteristic, server });  // Lưu thiết bị vào state

      // Đăng ký sự kiện nhận giá trị thay đổi từ mã QR
      qrCharacteristic.addEventListener('characteristicvaluechanged', handleQrDataReceived);

      return { cameraCharacteristic, serverCharacteristic, qrCharacteristic };
    } catch (error) {
      console.error('Error connecting to device:', error);
      alert("Failed to connect to the device.");
    }
  };

  // Hàm xử lý khi nhận dữ liệu mã QR từ Raspberry Pi
  const handleQrDataReceived = (event) => {
    const data = new TextDecoder().decode(event.target.value);
    setQrData(data);  // Lưu dữ liệu mã QR nhận được vào state
  };

  // Hàm quét thiết bị BLE
  const scanForDevices = async () => {
    try {
      const devices = await navigator.bluetooth.requestDevice({
        filters: [{ services: [BLE_CONFIG.serviceUUID] }]  // UUID dịch vụ của server
      });

      setDevicesList([devices]);  // Lưu thiết bị tìm thấy vào state
      alert(`Found device: ${devices.name}`);
    } catch (error) {
      console.error('Error scanning for devices:', error);
      alert('No devices found or error occurred during scanning.');
    }
  };

  // Gửi lệnh bật/tắt camera
  const toggleCamera = async (action) => {
    if (!device) {
      alert('Device not connected!');
      return;
    }

    const { cameraCharacteristic } = device;
    const command = new TextEncoder().encode(action);  // Mã hóa lệnh thành byte
    await cameraCharacteristic.writeValue(command);

    setCameraStatus(action);
  };

  // Gửi lệnh bật/tắt server
  const toggleServer = async (action) => {
    if (!device) {
      alert('Device not connected!');
      return;
    }

    const { serverCharacteristic } = device;
    const command = new TextEncoder().encode(action);  // Mã hóa lệnh thành byte
    await serverCharacteristic.writeValue(command);

    setServerStatus(action === 'start' ? 'running' : 'stopped');
  };

  // Kết nối với thiết bị đã chọn
  const handleConnectDevice = async (device) => {
    await connectToBLE(device);
  };

  return (
    <div className="App">
      <h1>Control Raspberry Pi Camera & Server via BLE</h1>

      <div>
        <h2>Camera: {cameraStatus}</h2>
        <button onClick={() => toggleCamera('on')}>Turn On Camera</button>
        <button onClick={() => toggleCamera('off')}>Turn Off Camera</button>
      </div>

      <div>
        <h2>Server: {serverStatus}</h2>
        <button onClick={() => toggleServer('start')}>Start Server</button>
        <button onClick={() => toggleServer('stop')}>Stop Server</button>
      </div>

      <div>
        <h2>QR Code Data: {qrData}</h2>
        <p>{qrData ? `Received QR Code: ${qrData}` : 'No QR Code data received yet.'}</p>
      </div>

      <div>
        <h2>Available Devices</h2>
        <button onClick={scanForDevices}>Scan for BLE Devices</button>
        <ul>
          {devicesList.map((device, index) => (
            <li key={index}>
              <span>{device.name}</span>
              <button onClick={() => handleConnectDevice(device)}>Connect</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BluetoothComponent;

import React, { useState, useEffect } from "react";
import axios from "axios";

const Scanning = () => {
  const [scanResults, setScanResults] = useState([]);
  const [error, setError] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [videoFeedKey, setVideoFeedKey] = useState(0);  // Thêm key để tái tạo lại video feed

  useEffect(() => {
    let interval;

    const handleScan = async () => {
      try {
        setError(null);
        setScanResults([]);

        const response = await axios.post("http://192.168.1.9:5000/scan");
     
        if (response.data.success) {
          setScanResults(response.data.codes);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Không thể kết nối tới server. Vui lòng kiểm tra lại!");
      }
    };

    if (isCameraOn) {
      interval = setInterval(() => {
        handleScan();
      }, 3000); // Quét mỗi 3 giây
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isCameraOn]);

  const toggleCamera = async () => {
    setIsCameraOn(!isCameraOn);

    if (!isCameraOn) {
      // Gửi yêu cầu tắt camera từ phía frontend
      try {
        await axios.post("http://192.168.1.9:5000/stop_camera");
        console.log("Camera đã tắt");
      } catch (err) {
        setError("Không thể tắt camera");
      }
    } else {
      // Gửi yêu cầu bật lại camera và thay đổi video feed key để tái tạo lại phần tử video feed
      try {
        await axios.post("http://192.168.1.9:5000/start_camera");
        console.log("Camera đã bật lại");
        setVideoFeedKey(prevKey => prevKey + 1);  // Thay đổi key để làm mới video feed
      } catch (err) {
        setError("Không thể bật lại camera");
      }
    }
  };

  const stopServer = async () => {
    try {
      await axios.post("http://192.168.1.9:5000/stop_server");
      console.log("Server đã tắt");
    } catch (err) {
      setError("Không thể tắt server");
    }
  };

  const restartServer = async () => {
    try {
      await axios.post("http://192.168.1.9:5000/restart_server");
      console.log("Server đang khởi động lại");
    } catch (err) {
      setError("Không thể khởi động lại server");
    }
  };

  return (
    <div>
      <h1>Quét mã QR/Barcode</h1>
      <button onClick={toggleCamera} style={{ margin: "10px", padding: "10px" }}>
        {isCameraOn ? "Tắt camera" : "Bật camera"}
      </button>
      <button onClick={stopServer} style={{ margin: "10px", padding: "10px" }}>
        Tắt server
      </button>
      <button onClick={restartServer} style={{ margin: "10px", padding: "10px" }}>
        Khởi động lại server
      </button>

      {error && <p style={{ color: "red" }}>Lỗi: {error}</p>}
      {isCameraOn && (
        <div>
          <h3>Video Feed</h3>
          {/* Thêm key vào phần tử <img> để đảm bảo video feed được tái tạo khi bật lại camera */}
          <img key={videoFeedKey} width="480" height="360" src="http://192.168.1.9:5000/video_feed" alt="video feed" />
        </div>
      )}

      <h3>Kết quả quét:</h3>
      <ul>
        {scanResults.length === 0 ? (
          <p>Đang chờ quét...</p>
        ) : (
          scanResults.map((result, index) => <li key={index}>{result}</li>)
        )}
      </ul>
    </div>
  );
};

export default Scanning;

import { useEffect, useState } from "react";

export default function Assignment_1() {
  const [alpha, setAlpha] = useState(null); // Z-axis rotation
  const [beta, setBeta] = useState(null);   // X-axis rotation
  const [gamma, setGamma] = useState(null); // Y-axis rotation
  const [permissionNeeded, setPermissionNeeded] = useState(false); // Detect if iPhone needs permission

  // Ask for iOS permission
  const requestPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        // Show the iPhone permission popup
        const permission = await DeviceOrientationEvent.requestPermission();
        // If user allowed - start reading sensor data
        if (permission === "granted") {
          startTracking();
        }
      } catch (error) {
        console.log("Permission error:", error);
      }
    }
  };

  //Start tracking orientation
  const startTracking = () => {
    window.addEventListener("deviceorientation", (event) => {
      // Update React state with MDN event properties
      setAlpha(event.alpha); // rotation around Z-axis
      setBeta(event.beta);   // rotation around X-axis
      setGamma(event.gamma); // rotation around Y-axis
    });
  };

  useEffect(() => {
    // Detect if iPhone requires permission
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      setPermissionNeeded(true); // Show the "Enable Motion" button
    } else {
      startTracking(); // start directly on non-iOS
    }
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Device Orientation</h2>

      {permissionNeeded && (
        <button
          onClick={requestPermission}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            marginBottom: "20px",
          }}
        >
          Enable Motion
        </button>
      )}

      <div>
        <p>
          <strong>Alpha (Z-axis rotation):</strong> {alpha !== null ? alpha.toFixed(2) : "N/A"}
        </p>
        <p>
          <strong>Beta (X-axis rotation):</strong> {beta !== null ? beta.toFixed(2) : "N/A"}
        </p>
        <p>
          <strong>Gamma (Y-axis rotation):</strong> {gamma !== null ? gamma.toFixed(2) : "N/A"}
        </p>
      </div>
    </div>
  );
}

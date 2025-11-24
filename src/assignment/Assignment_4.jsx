import { useState, useRef } from "react";

export default function Assignment_4() {
  const [text, setText] = useState(""); // store user-typed text
  const [recognizedText, setRecognizedText] = useState(""); // store converted speech-to-text output
  const recognitionRef = useRef(null); // keep SpeechRecognition instance

  // text speech
  const handleSpeak = () => {
    if (!text.trim()) return alert("Please enter some text!");

    // create speech message
    const msg = new SpeechSynthesisUtterance();
    msg.text = text; // text to speak
    msg.lang = "en-US"; // voice language
    msg.rate = 1; // speaking speed
    msg.pitch = 1; // voice tone

    window.speechSynthesis.speak(msg); // start speaking
  };

  // speech text
  const handleStartRecognition = () => {
    // check if browser supports speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported.");
      return;
    }

    // create recognition instance only once
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // keep listening
      recognitionRef.current.lang = "en-US"; // language
      recognitionRef.current.interimResults = false; // only final results

      // when speech is recognized
      recognitionRef.current.onresult = (event) => {
        const lastResult =
          event.results[event.results.length - 1][0].transcript;

        // add recognized text to output
        setRecognizedText((prev) => prev + " " + lastResult);
      };

      // error handler
      recognitionRef.current.onerror = (e) => {
        console.error("Recognition error:", e);
      };
    }

    recognitionRef.current.start(); // begin listening
  };

  // stop speech recognition
  const handleStopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>Text - Speech</h2>

      <textarea
        rows="4"
        style={{ width: "100%" }}
        placeholder="Type something to speak..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={handleSpeak} style={{ marginTop: "10px" }}>
        Start Speech
      </button>

      <h2>Speech - Text</h2>

      <button onClick={handleStartRecognition}>Start Recognition</button>

      <button onClick={handleStopRecognition} style={{ marginLeft: "10px" }}>
        Stop
      </button>

      <p>
        <strong>Recognized Text:</strong>
      </p>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          minHeight: "80px",
          background: "#fafafa",
        }}
      >
        {recognizedText}
      </div>
    </div>
  );
}

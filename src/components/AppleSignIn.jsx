import React from "react";

const AppleSignIn = () => {
  return (
    <button
      className="apple-sign-in-button"
      style={{
        backgroundColor: "#000",
        color: "#fff",
        border: "none",
        padding: "12px 15px",
        borderRadius: "5px",
        cursor: "not-allowed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        opacity: 0.8,
        fontFamily: "inherit",
        fontSize: "14px",
        fontWeight: "500",
        position: "relative",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }}
      disabled={true}
      aria-label="ورود با اپل - به زودی"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ marginLeft: "12px" }}
      >
        <path d="M19.665 16.811a10.316 10.316 0 0 1-1.021 1.837c-.537.767-.978 1.297-1.316 1.592-.525.482-1.089.73-1.692.744-.432 0-.954-.123-1.562-.373-.61-.249-1.17-.371-1.683-.371-.537 0-1.113.122-1.73.371-.616.25-1.114.381-1.495.393-.578.025-1.154-.229-1.729-.764-.367-.32-.83-.87-1.389-1.652-.594-.82-1.083-1.772-1.462-2.858-.407-1.15-.611-2.265-.611-3.343 0-1.235.264-2.3.794-3.192.417-.713.973-1.274 1.676-1.681.7-.407 1.464-.617 2.29-.631.45 0 1.04.135 1.77.398.726.262 1.193.394 1.4.394.153 0 .673-.137 1.555-.406.835-.25 1.54-.354 2.117-.309 1.564.12 2.739.709 3.514 1.774-1.4.845-2.092 2.03-2.08 3.545.012 1.185.441 2.17 1.287 2.953.384.36.812.64 1.29.838-.103.302-.231.591-.379.867zM15.998 2.38c0 .93-.342 1.8-1.027 2.595-.824.955-1.821 1.505-2.902 1.42-.013-.105-.021-.215-.021-.33 0-.882.384-1.826 1.064-2.594.34-.39.772-.712 1.292-.966.521-.25 1.012-.387 1.477-.409.013.112.022.217.022.315.001-.001.001.009.001.019" />
      </svg>
      <span>ورود با اپل</span>
      <div
        style={{
          position: "absolute",
          top: "-10px",
          right: "-10px",
          background: "linear-gradient(135deg, #D4AF37 0%, #AA8C2C 100%)",
          color: "#000",
          fontSize: "10px",
          padding: "4px 8px",
          borderRadius: "12px",
          fontWeight: "bold",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          zIndex: 2,
          letterSpacing: "0.5px",
        }}
      >
        به زودی
      </div>
    </button>
  );
};

export default AppleSignIn;

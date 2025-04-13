import React from "react";

const AppleSignIn = () => {
  return (
    <button
      className="apple-sign-in-button"
      style={{
        backgroundColor: "#000",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "not-allowed",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        opacity: 0.7,
        position: "relative",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.41-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.05 2.31-.75 3.57-.84 1.51-.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.65 1.48-1.52 2.95-2.53 4.12zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.83 2.48-1.73 4.5-3.74 4.25z" />
      </svg>
      Sign in with Apple
      <span
        style={{
          position: "absolute",
          top: "-25px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#D4AF37",
          color: "#000",
          padding: "2px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          whiteSpace: "nowrap",
        }}
      >
        Coming Soon
      </span>
    </button>
  );
};

export default AppleSignIn;

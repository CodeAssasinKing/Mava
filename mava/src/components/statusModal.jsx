// src/components/ui/StatusModal.jsx
import React from "react";
import ReactDOM from "react-dom";

function StatusModal({ show, type = "success", title, message, onClose }) {
    if (!show) return null;

    const isSuccess = type === "success";
    const accentColor = isSuccess ? "#22c55e" : "#AD1C42";
    const defaultTitle = isSuccess ? "Message sent" : "Something went wrong";
    const defaultMessage = isSuccess
        ? "Your message has been delivered. I will get back to you soon."
        : "There was a problem sending your message. Please try again later.";

    return ReactDOM.createPortal(
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                zIndex: 3000, // выше Canvas и формы
            }}
            onClick={onClose}
        >
            <div
                className="card shadow-lg border-0"
                style={{
                    background: "rgba(0, 0, 0, 0.75)",
                    backdropFilter: "blur(18px)",
                    WebkitBackdropFilter: "blur(18px)",
                    borderRadius: "1.5rem",
                    border: `1px solid ${accentColor}`,
                    maxWidth: "420px",
                    width: "90%",
                    color: "#fff",
                    cursor: "default",
                }}
                onClick={(e) => e.stopPropagation()} // чтобы клик по карточке не закрывал
            >
                <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "999px",
                                border: `2px solid ${accentColor}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: "0.75rem",
                                fontSize: "1.2rem",
                                color: accentColor,
                                background: "rgba(0,0,0,0.6)",
                            }}
                        >
                            {isSuccess ? "✓" : "!"}
                        </div>
                        <h5
                            className="mb-0"
                            style={{ fontWeight: 700, letterSpacing: ".03em" }}
                        >
                            {title || defaultTitle}
                        </h5>
                    </div>

                    <p
                        className="mb-4"
                        style={{ color: "rgba(248,250,252,0.8)", fontSize: "0.95rem" }}
                    >
                        {message || defaultMessage}
                    </p>

                    <div className="d-flex justify-content-end">
                        <button
                            type="button"
                            className="btn px-4"
                            onClick={onClose}
                            style={{
                                borderRadius: "999px",
                                border: `1px solid ${accentColor}`,
                                backgroundColor: accentColor,
                                color: "#000",
                                fontWeight: 600,
                                fontSize: "0.85rem",
                                textTransform: "uppercase",
                                letterSpacing: ".06em",
                            }}
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root") || document.body
    );
}

export default StatusModal;

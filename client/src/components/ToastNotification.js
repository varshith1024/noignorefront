import React, { useEffect, useState } from "react";

function ToastNotification({ message }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      setTimeout(() => setShow(false), 4000);
    }
  }, [message]);

  if (!show) return null;

  return (
    <div
      className="toast show position-fixed top-0 end-0 m-4 shadow"
      style={{ zIndex: 9999 }}
    >
      <div className="toast-header bg-danger text-white">
        <strong className="me-auto">
          <i className="bi bi-exclamation-circle me-2"></i>
          Warning
        </strong>
      </div>
      <div className="toast-body">
        {message}
      </div>
    </div>
  );
}

export default ToastNotification;
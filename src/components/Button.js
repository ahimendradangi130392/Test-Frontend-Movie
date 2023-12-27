import React from "react";

const Button = ({ children, className, type, disabled, onClick, loading }) => {
  return (
    <button
      className={className}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;

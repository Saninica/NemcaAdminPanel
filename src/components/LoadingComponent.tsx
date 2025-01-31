import React from "react";

interface LoadingProps {
  size?: string;
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = "8", color = "text-red-600" }) => {
  return (
    <div className="flex justify-center items-center" aria-live="polite" role="status">
      <svg
        className={`animate-spin h-${size} w-${size} ${color}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3-3-3h4z"
        ></path>
      </svg>
    </div>
  );
};

export default Loading;

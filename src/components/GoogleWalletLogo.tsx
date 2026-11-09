import React from 'react';

interface GoogleWalletLogoProps {
  className?: string;
  variant?: 'icon' | 'full';
  alt?: string;
}

export const GoogleWalletLogo: React.FC<GoogleWalletLogoProps> = ({
  className = 'w-5 h-5',
  variant = 'icon',
  alt = 'Google Wallet',
}) => {
  if (variant === 'full') {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 shrink-0"
          aria-label={alt}
        >
          {/* Green Card */}
          <path
            d="M14 11C14 8.23858 16.2386 6 19 6H29C31.7614 6 34 8.23858 34 11V18H14V11Z"
            fill="#34A853"
          />
          {/* Yellow Card */}
          <path
            d="M11 15C11 12.2386 13.2386 10 16 10H32C34.7614 10 37 12.2386 37 15V22H11V15Z"
            fill="#FBBC04"
          />
          {/* Red Card */}
          <path
            d="M8 20C8 17.2386 10.2386 15 13 15H35C37.7614 15 40 17.2386 40 20V28H8V20Z"
            fill="#EA4335"
          />
          {/* Blue Pocket */}
          <path
            d="M6 21.5C14 21.5 22 26 30 25.5C35 25.2 38.5 23 42 21.5V36C42 39.3137 39.3137 42 36 42H12C8.68629 42 6 39.3137 6 36V21.5Z"
            fill="#4285F4"
          />
        </svg>
        <span className="font-semibold text-white tracking-tight text-base font-sans">
          Google Wallet
        </span>
      </div>
    );
  }

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-label={alt}
    >
      {/* Green Card */}
      <path
        d="M14 11C14 8.23858 16.2386 6 19 6H29C31.7614 6 34 8.23858 34 11V18H14V11Z"
        fill="#34A853"
      />
      {/* Yellow Card */}
      <path
        d="M11 15C11 12.2386 13.2386 10 16 10H32C34.7614 10 37 12.2386 37 15V22H11V15Z"
        fill="#FBBC04"
      />
      {/* Red Card */}
      <path
        d="M8 20C8 17.2386 10.2386 15 13 15H35C37.7614 15 40 17.2386 40 20V28H8V20Z"
        fill="#EA4335"
      />
      {/* Blue Pocket with authentic smooth wave */}
      <path
        d="M6 21.5C14 21.5 22 26 30 25.5C35 25.2 38.5 23 42 21.5V36C42 39.3137 39.3137 42 36 42H12C8.68629 42 6 39.3137 6 36V21.5Z"
        fill="#4285F4"
      />
    </svg>
  );
};

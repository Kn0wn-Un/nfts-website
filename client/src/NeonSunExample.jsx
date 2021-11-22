import * as React from "react";

const NeonSunExample = (props) => (
  <svg
    width={300}
    height={250}
    xmlns="http://www.w3.org/2000/svg"
    style={{
      backgroundColor: "#000",
      marginTop: '20px',
    }}
    {...props}
  >
    <defs>
      <linearGradient id="c" x1={0} y1={0} x2={1} y2={1}>
        <stop stopColor="#f0f" stopOpacity={0.996} offset={0} />
        <stop stopColor="#00f" stopOpacity={0.996} offset={1} />
      </linearGradient>
      <linearGradient id="a" x1={0} y1={0} x2={1} y2={1}>
        <stop stopColor="#f0f" offset={0} />
        <stop stopColor="#00f" stopOpacity={0.996} offset={1} />
        <stop offset={1} stopOpacity={0.988} />
        <stop stopColor={0} stopOpacity={0} offset="NaN" />
        <stop stopColor={0} stopOpacity={0} offset="NaN" />
      </linearGradient>
      <filter id="b" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation={10} />
      </filter>
    </defs>
    <path
      fill="url(#a)"
      filter="url(#b)"
      d="M150 244c-69.06 0-125-55.94-125-125S80.94-6 150-6s125 55.94 125 125-55.94 125-125 125z"
      opacity={0.35}
    />
    <path
      fill="url(#c)"
      opacity="undefined"
      d="M150 214c-49.724 0-90-40.276-90-90s40.276-90 90-90 90 40.276 90 90-40.276 90-90 90z"
    />
    <path
      fill="none"
      stroke="#000"
      d="M0 150h300M0 160h300M0 170h300M0 180h300M0 190h300M0 200h300M0 210h300"
    />
    <text
      fill="#fff"
      stroke="#000"
      strokeWidth={0}
      x={235}
      y={250}
      fontSize={18}
      fontFamily="Caveat"
      xmlSpace="preserve"
    />
  </svg>
);

export default NeonSunExample;
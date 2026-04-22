import React from "react";
import Marquee from "react-fast-marquee";

const DonationDisplay = (props) => {
  const FONTSIZE = props.fontSize + "px";
  const FONTFAMILYNAME = "Roboto Condensed";

  return (
    <div style={{ padding: "16px" }}>
      <Marquee
        style={{
          color: "white",
          fontSize: FONTSIZE,
          fontFamily: FONTFAMILYNAME,
        }}
      >
         Dieses Projekt basiert auf dem Original von NikBLN:{'\u00A0'} 
          <a href="https://github.com/NikBLN/weilSieDichLieben" style={{ color: "white", textDecoration: "underline" }} target="_blank" rel="noopener noreferrer">
            github.com/NikBLN/weilSieDichLieben
          </a>{' '}
          {'\u00A0'}und wurde von berliner63 angepasst. ***{'\u00A0'}
      </Marquee>
    </div>
  );
};

export default DonationDisplay;

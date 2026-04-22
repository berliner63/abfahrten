import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";

const DonationDisplay = (props) => {
  const [donationsList, setDonationsList] = useState([]);
  const FONTSIZE = props.fontSize + "px";
  const FONTFAMILYNAME = "Roboto Condensed";

  const fetchDonations = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/donations.json?t=${timestamp}`);
      const data = await response.json();
      return data.donations;
    } catch (error) {
      console.error("Error fetching donations:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadDonations = async () => {
      const donations = await fetchDonations();
      setDonationsList(donations);
    };

    loadDonations();
  }, []);

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

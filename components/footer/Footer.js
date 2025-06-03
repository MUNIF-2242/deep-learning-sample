import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear(); // 👈 get dynamic year

  return (
    <div className="footer">
      <p>
        Copyright© {currentYear} All Rights Reserved By{" "}
        <span className="text-primary">shellbeehaken</span>
      </p>
    </div>
  );
};

export default Footer;

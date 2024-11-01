import React, { useState } from 'react';
import './Banner.css';

interface BannerProps {
  title: string;
  info: string;
}

const Banner: React.FC<BannerProps> = ({ title, info }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="banner">
      <div className="banner-header" onClick={toggleOpen}>
        <h3>{title}</h3>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>
      {isOpen && <div className="banner-content">{info}</div>}
    </div>
  );
};

export default Banner;

import React from "react";
import { Link } from "react-router-dom";
import "./ImageLinks.css";
import DailyPromoBanner from "../promo/DailyPromoBanner";
import useIsMobile from "../../hooks/useIsMobile";

const images = [
  {
    title: "מגשי אירוח",
    url: "/photos/קורל.jpg",
    link: "/קייטרינג",
    isHostingPlattersModal: true, // סימון
  },
  {
    title: "קייטרינג",
    url: "/photos/מגשיאירוח.jpg",
    link: "/מגשי אירוח",
  },
  {
    title: "אירועים",
    url: "/photos/section.jpeg",
    link: "/אירועים",
  },
  {
    title: "קונדטוריה",
    url: "/photos/אירועים.jpg",
    link: "/קונדטוריה",
  },
  {
    title: "אפיה",
    url: "/photos/לחם.jpg",
    link: "/אפיה",
    isBakery: true, // סימון
  },
];

const ImageLinks = ({ onClick, onBakeryClick, onHostingPlattersModalClick }) => {
  const isMobile = useIsMobile();

  return (
    <div className="image-grid">
      {images.map((img, index) => (
        <React.Fragment key={index}>
          {img.isBakery ? (
            <div className="image-item bakery-click" onClick={onBakeryClick}>
              <div className="image-inner">
                <img src={img.url} alt={img.title} />
              </div>
              <h3>{img.title}</h3>
            </div>
          ) : img.isHostingPlattersModal ? (
            <div className="image-item hosting-click" onClick={onHostingPlattersModalClick}>
              <div className="image-inner">
                <img src={img.url} alt={img.title} />
              </div>
              <h3>{img.title}</h3>
            </div>
          ) : (
            <Link to={img.link} className="image-item">
              <div className="image-inner">
                <img src={img.url} alt={img.title} />
              </div>
              <h3>{img.title}</h3>
            </Link>
          )}

          {(isMobile ? index === 0 : "") && (
            <div className="promo-wrapper">
              <DailyPromoBanner onClick={onClick} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ImageLinks;

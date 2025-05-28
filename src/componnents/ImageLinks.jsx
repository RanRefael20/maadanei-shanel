import React from "react";
import { Link } from "react-router-dom";
import "../styles/ImageLinks.css"; // ודא שהקובץ קיים בתיקייה


const images = [
  {
    title: "מגשי אירוח",
    url: "/photos/קורל.jpg",
    link: "/קייטרינג",
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
    url:"/photos/לחם.jpg",
    link: "/אפיה",
  },
];

const ImageLinks = () => {
  return (
    <div className="image-grid">
      {images.map((img, index) => (
        <Link to={img.link} key={index} className="image-item">
             <div className="image-inner">
          <img src={img.url} alt={img.title} />
          </div>
          <h3>{img.title}</h3>
        </Link>
      ))}
    </div>
  );
};

export default ImageLinks;

import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // ✅ חיבור קישור פנימי
import "../PagesCss/hospitality.css";

const images = {
  "טונה": "/photos/tt.jpg",
  "סלמון": "/photos/סלמון.jpg",
  "טורטיות במילוי טונה": "/photos/טורטיה.jpg",
  "גבינות ואנטי פסטי": "/photos/פטה.jpg",
  "פריקסה": "/photos/פריקסה.jpg",
  "פסטה": "/photos/פסטה.jpg",
  "סלט": "/photos/סלט2.jpg",
  "לחמי כוסמין ושיפון 100%": "/photos/vv.jpg",
  "מגשי פירות מפנקים": "/photos/פירות.jpg",
  "קינוחים": "/photos/קינוחים.jpg",
};

export default function MenuSection() {
  return (
    <section className="menu-section">
      {Object.entries(images).map(([item, imageUrl], index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          className="menu-card"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="menu-overlay">
            {/* קישור לדף קינוחים */}
            {item === "קינוחים" ? (
              <Link to="/desserts" className="menu-title">
                {item}
              </Link>
            ) : (
              <h3 className="menu-title">{item}</h3>
            )}
          </div>
        </motion.div>
      ))}
    </section>
  );
}

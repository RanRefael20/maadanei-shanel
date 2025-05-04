import "../styles/desserts.css";

export default function DessertsPage() {
  return (
    <div className="desserts-page">
      <h1 className="page-title">קינוחים מפנקים</h1>
      <p className="description">כאן תוכל למצוא את מגוון הקינוחים שלנו.</p>
      <div className="dessert-gallery">
        <img src="/photos/קינוח1.jpg" alt="קינוח 1" className="dessert-img" />
        <img src="/photos/קינוח2.jpg" alt="קינוח 2" className="dessert-img" />
        <img src="/photos/קינוח3.jpg" alt="קינוח 3" className="dessert-img" />
      </div>
    </div>
  );
}

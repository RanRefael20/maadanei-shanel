import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import FullMenuSelector from "./FullMenuSelector";
import "../styles/MenuExport.css";

const reverseText = (text) => text.split("").reverse().join("");

const MenuExport = ({ results = [], updateResults }) => {
  const [phone, setPhone] = useState("");
  const [clientName, setClientName] = useState("");
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [customItems, setCustomItems] = useState([]);

  // ודא שהresults תקין ויש בו פריטים
  const fallbackItems = Array.isArray(results) && results[0]?.items?.length > 0 ? results[0].items : [];
  const activeItems = customItems.length > 0 ? customItems : fallbackItems;
  const total = activeItems.reduce((sum, item) => sum + (item.price || 0), 0);

  useEffect(() => {
    if (customItems.length === 0 && fallbackItems.length > 0) {
      setCustomItems(fallbackItems);
    }
  }, [results]);

  const sendToWhatsapp = () => {
    const msg = `📋 תפריט מותאם${clientName ? ` ל-${clientName}` : ""}:\n\n${activeItems
      .map((item) => `• ${item.name} – ${item.price}₪`)
      .join("\n")}\n\nסה"כ: ${total}₪`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/972503225482?text=${encoded}`, "_blank");

    const clean = phone.replace(/\D/g, "");
    if (clean.length >= 9) {
      const full = clean.startsWith("972") ? clean : "972" + clean;
      window.open(`https://wa.me/${full}?text=${encoded}`, "_blank");
    }
  };

  const generatePDF = async () => {
    const element = document.getElementById("menu-pdf-area");
    if (!element) return;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();

    const today = new Date().toLocaleDateString("he-IL");
    pdf.setFont("helvetica");
    pdf.setFontSize(14);
    pdf.text(reverseText(`תאריך: ${today}`), 150, 10, { align: "right" });
    pdf.text(reverseText(`תפריט מותאם${clientName ? ` ל-${clientName}` : ""}`), 105, 20, { align: "center" });
    pdf.addImage(imgData, "PNG", 10, 30, 190, 0);
    pdf.save("תפריט_מותאם.pdf");
  };

  const handleDelete = (index) => {
    const updated = [...activeItems];
    updated.splice(index, 1);
    setCustomItems(updated);
    updateResults && updateResults(updated);
  };

  const handleCheckboxToggle = (item) => {
    const exists = customItems.find((i) => i.name === item.name);
    if (exists) {
      const filtered = customItems.filter((i) => i.name !== item.name);
      setCustomItems(filtered);
      updateResults && updateResults(filtered);
    } else {
      const added = [...customItems, item];
      setCustomItems(added);
      updateResults && updateResults(added);
    }
  };

  return (
    <div className="export-container">
      <div className="export-actions">
        <input
          type="text"
          placeholder="שם הלקוח (אופציונלי)"
          value={clientName ?? ""}
          onChange={(e) => setClientName(e.target.value)}
        />
        <input
          type="tel"
          placeholder="מספר טלפון נוסף"
          value={phone ?? ""}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={sendToWhatsapp}>📤 שלח לוואטסאפ</button>
        <button onClick={generatePDF}>📄 צור PDF</button>
        <button onClick={() => setShowFullMenu(true)}>🧩 ערוך תפריט</button>
      </div>

      {showFullMenu && (
        <FullMenuSelector
          selectedItems={customItems}
          onSubmit={(items) => {
            setCustomItems(items);
            updateResults && updateResults(items);
            setShowFullMenu(false);
          }}
          onClose={() => setShowFullMenu(false)}
        />
      )}

      <div id="menu-pdf-area" className="pdf-preview">
        <p className="pdf-date">📅 {new Date().toLocaleDateString("he-IL")}</p>
        <h2>תפריט מותאם{clientName ? ` ל-${clientName}` : ""}</h2>
        <ul>
          {activeItems.map((item, idx) => (
            <li key={idx}>
              <input
                type="checkbox"
                checked={!!customItems.find((i) => i.name === item.name)}
                onChange={() => handleCheckboxToggle(item)}
              />
              {item.name} – {item.price}₪
              <button className="delete-btn" onClick={() => handleDelete(idx)}>🗑️</button>
            </li>
          ))}
        </ul>
        <p className="pdf-total">סה"כ: {total}₪</p>
        <img src="/LL.png" alt="לוגו" className="pdf-logo" />
      </div>
    </div>
  );
};

export default MenuExport;

           {Object.entries(fullMenu).map(([category, items]) => (
              
<div key={category} className="menu-category">
<h3>
  {budget < 1 && people !== "" && people > 1 && category !== "יינות"
    ? (category === "קינוחים"
        ? `${category} - יתרת נקודות: ${remainingDessertVolume}`
        : `${category} - יתרת נקודות: ${remainingVolume}`)
    : category}
</h3>


                {items
  .filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((item) => {
      const itemWithCategory = { ...item, category };
      return (
     <div key={item.name} className="item-select">
                      <span>
                        {item.name}
                      </span>
  <div className="quantity-controls">
  <button
  onClick={() => {
    setSelectedItem(null)
    const matchingItems = results[0]?.items?.filter(
      (itm) => itm.name.startsWith(item.name)
    );
    if(matchingItems.length<1) setSelectedForRemoval(null)
    if (matchingItems.length > 1) {
      setSelectedForRemoval({ baseName: item.name, options: matchingItems });
    } else if (matchingItems.length === 1) {
      onRemoveItem(matchingItems[0]); // אם יש רק אחד – נמחק ישירות
    }
    
  }}
>
  ➖
</button>
<span className="item-count">
  {Object.entries(itemQuantities).filter(([key]) =>

    key.startsWith(item.name)
  ).reduce((acc, [, count]) => acc + count, 0)}
</span>

             
             <button onClick={() => {setSelectedItem(itemWithCategory)

setSelectedForRemoval(null)
             }}>➕</button>
                        </div>
                    </div>
                  );
                })}

                

                
                
                      {selectedItem && (
          <div className="size-selection-popup">
    <h4>בחר מידה עבור {selectedItem.name}</h4>
    

  
{selectedItem?.sizes ? (
  Object.entries(selectedItem.sizes).map(([sizeKey, sizeData]) => {
  const itemKey = `${selectedItem.name}-${sizeData.label}`;
  const quantity = itemQuantities[itemKey] || 0;

    return (
<div className="size-button-wrapper" key={`${selectedItem.name}-${sizeKey}`}>
  
    <button
    className={`size-button ${activeSize === sizeKey ? "animating" : ""} ${
      activeSizeKey === `${selectedItem.name}-${sizeKey}` ? "has-bubble" : ""
    }`}
    onClick={(e) => {e.stopPropagation()
                handleSizeClick(e, sizeKey, sizeData);

    }}
  >
    <span className="original-label">
      {sizeData.label} - ({sizeData.price}₪)
      {people !== "" && (
        <small style={{ fontSize: "12px", color: "#666", marginRight: "8px" }}>
          {sizeData.volume} נק'
        </small>
      )}
    </span>
  </button>

  <div className="inline-counter" onClick={(e) => e.stopPropagation()}>
    {quantity === 0 ? (
 0
    ) : (
      <>
 
        <span className="item-count-inline">{quantity}</span>
      </>
    )}
  </div>
</div>

    );
  })

) : (
  <button
    onClick={(e) => {
      e.stopPropagation();
      const newItem = {
        name: selectedItem.name,
        price: selectedItem.price,
        category: selectedItem.category,
        volume: 0, // ✅ לא משפיע על ווליום
      };
      onAddItem(newItem);
      setSelectedItem(null);
        setHasMadeSelection(true);

    }}
  >
    {selectedItem.name} - {selectedItem.price}₪
  </button>
)}


    <button onClick={() => {setSelectedItem(null)
      setHasMadeSelection(false)
    }}>{hasMadeSelection ? "סגור" : "ביטול"}</button>
  </div>
)}

              </div>
              
            ))}
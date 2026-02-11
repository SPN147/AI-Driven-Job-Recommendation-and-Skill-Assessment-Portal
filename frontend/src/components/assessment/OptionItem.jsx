const OptionItem = ({ text, isSelected, onClick }) => (
  <div
    onClick={onClick}
    style={{
      border: isSelected ? "2px solid blue" : "1px solid gray",
      padding: "10px",
      marginBottom: "8px",
      cursor: "pointer",
    }}
  >
    {text}
  </div>
);

export default OptionItem;

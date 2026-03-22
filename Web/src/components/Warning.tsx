const WarningSnippet = ({ message }: { message: string }) => {
  const containerStyle = {
    padding: "12px 16px",
    backgroundColor: "#fff1f0", // Light red background
    border: "1px solid #ffa39e", // Border to define the area
    borderRadius: "4px",
    color: "#cf1322", // Deep red for readability
    fontWeight: "bold",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: "10px 0",
  };

  return (
    <div style={containerStyle} role="alert">
      <span>⚠️</span>
      {message}
    </div>
  );
};

export default WarningSnippet;

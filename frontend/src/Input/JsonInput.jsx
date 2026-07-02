function JsonInput({ value, onChange }) {
  return (
    <textarea
      rows="20"
      cols="80"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Paste JSON here..."
    />
  );
}

export default JsonInput;
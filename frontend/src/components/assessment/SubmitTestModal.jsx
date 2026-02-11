const SubmitTestModal = ({ open, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div>
      <p>Are you sure you want to submit?</p>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onCancel}>No</button>
    </div>
  );
};

export default SubmitTestModal;

import React from 'react';
import showToasts from './Toast';

function PublishedModal({ link, onClose }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(link).then(() => {
      showToasts('Link copied to clipboard!', 'success');
    });
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <button style={closeButtonStyle} onClick={() => onClose()}>
          &times;
        </button>
        <h4 style={titleStyle}>Congrats your Quiz is Published!</h4>
        <input
          type="text"
          value={link}
          readOnly
          style={inputStyle}
        />
        <button style={shareButtonStyle} onClick={handleCopy}>
          Share
        </button>
      </div>
    </div>
  );
}

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  maxWidth: '400px',
  width: '100%',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  position: 'relative',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '18px',
  cursor: 'pointer',
};

const titleStyle = {
  margin: '20px 0',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  marginBottom: '20px',
  textAlign: 'center',
};

const shareButtonStyle = {
  backgroundColor: '#28a745',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default PublishedModal;

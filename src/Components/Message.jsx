import React, { useState } from 'react';
import './msg.css';

const Message = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="page-wrapper">
      <div 
        className={`envelope-container ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* The Flap of the envelope */}
        <div className="flap"></div>

        {/* The Main Body of the envelope */}
        <div className="envelope-body">
            {/* A small "stamp" or seal */}
            {!isOpen && <div className="seal">❤</div>}
        </div>

        {/* The Paper Letter */}
        <div className="letter">
          <div className="letter-header">
            <div className="floating-heart"></div>
          </div>
          <div className="letter-body">
            <h2>Really sorry na prachi</h2>
            <p>
              Please maf kar do tumari saari baat manuga please baat karo sorry sorry sorry yar
            </p>
            <div className="divider"></div>
            <p className="footer-text">With love, [Aniket]</p>
          </div>
        </div>
      </div>
      
      <div className="ui-hint">
        {isOpen ? "Click to pack it back" : "Tap the seal to open"}
      </div>
    </div>
  );
};

export default Message;
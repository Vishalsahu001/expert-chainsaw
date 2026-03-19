import React, { useState, useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

const EncryptedText = ({
  text,
  encryptedClassName = '',
  revealedClassName = '',
  revealDelayMs = 50,
  scrambleSpeedMs = 40,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    let iteration = 0;
    const maxIterations = text.length;

    // Start with fully scrambled text
    setDisplayText(
      text
        .split('')
        .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
        .join('')
    );

    // Scramble interval
    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return char; // Revealed characters
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)]; // Scrambled characters
          })
          .join('')
      );

      if (iteration >= maxIterations) {
        clearInterval(intervalRef.current);
        setIsRevealed(true);
      }
      
      iteration += 1 / (revealDelayMs / scrambleSpeedMs);
    }, scrambleSpeedMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, revealDelayMs, scrambleSpeedMs]);

  return (
    <span className={isRevealed ? revealedClassName : encryptedClassName}>
      {displayText}
    </span>
  );
};

export default EncryptedText;

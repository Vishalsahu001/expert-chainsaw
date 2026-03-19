import EncryptedText from '../../../components/ui/EncryptedText.jsx';

const LoadingScreen = () => {
  return (
    <main className="loading-screen immersive-loading">
      <div className="background-glows">
        <div className="glow glow--1"></div>
        <div className="glow glow--2"></div>
      </div>
      
      <div className="scene">
        <div className="cube">
          <div className="cube__face cube__face--front">AI</div>
          <div className="cube__face cube__face--back"></div>
          <div className="cube__face cube__face--right"></div>
          <div className="cube__face cube__face--left"></div>
          <div className="cube__face cube__face--top"></div>
          <div className="cube__face cube__face--bottom"></div>
        </div>
      </div>

      <div className="loading-content">
        <h1 className="loading-text">
          <EncryptedText 
            text="Generating Your Strategy..." 
            revealDelayMs={3000}
            revealedClassName="highlight"
          />
        </h1>
        <p className="loading-subtext">
          <EncryptedText 
            text="Analyzing your profile and the job description to build a winning plan"
            revealDelayMs={5000}
            scrambleSpeedMs={20}
          />
        </p>
        <div className="progress-bar-container">
          <div className="progress-bar"></div>
        </div>
      </div>
    </main>
  );
};

export default LoadingScreen;

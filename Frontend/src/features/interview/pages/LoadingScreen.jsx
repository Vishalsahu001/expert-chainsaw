import React from 'react';
import '../style/loading.scss';

const LoadingScreen = () => {
  return (
    <main className="loading-screen immersive-loading">
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
          Generating Your <span className="highlight">Strategy</span>...
        </h1>
        <p className="loading-subtext">Analyzing your profile and the job description to build a winning plan</p>
        <div className="progress-bar-container">
          <div className="progress-bar"></div>
        </div>
      </div>
    </main>
  );
};

export default LoadingScreen;

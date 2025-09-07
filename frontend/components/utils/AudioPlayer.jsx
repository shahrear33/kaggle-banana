import React, { useRef } from 'react';

const AudioPlayer = ({ src }) => {
  const audioRef = useRef(null);

  const playAudio = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  return (
    <button className="btn btn-primary bg-black text-white" onClick={playAudio}>
      <span role="img" aria-label="Play">
        ▶️
      </span>
      <audio ref={audioRef} src={src} type="audio/mpeg" />
    </button>
  );
};

export default AudioPlayer;

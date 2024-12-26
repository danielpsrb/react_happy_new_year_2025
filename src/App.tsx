import { useState, useRef, useEffect } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import Particles from "react-particles";
import { loadFireworksPreset } from "tsparticles-preset-fireworks";
import { loadHyperspacePreset } from "tsparticles-preset-hyperspace";
import { loadSnowPreset } from "tsparticles-preset-snow";
import { loadStarsPreset } from "tsparticles-preset-stars";
import { Typewriter } from "react-simple-typewriter";

function App() {
  const [newYearMessage, setNewYearMessage] = useState([
    "2024 is Almost Over! ⏳",
    "Goodbye 2024, Hello 2025! 👋",
    "The Final Countdown to 2025 Begins! 🎉",
    "Let’s Celebrate the End of 2024! 🥂",
    "Ready for New Beginnings in 2025! ✨",
  ]);

  const [isCountdownComplete, setIsCountdownComplete] =
    useState<boolean>(false);
  const [particlePreset, setParticlePreset] = useState<string>("default");
  const [particlesKey, setParticlesKey] = useState<number>(0);

  const beforeAudioRef = useRef<HTMLAudioElement | null>(null);
  const newYearAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioReady, setIsAudioReady] = useState<boolean>(false);

  const togglePlayPause = () => {
    if (beforeAudioRef.current) {
      if (isPlaying) {
        beforeAudioRef.current.pause();
      } else {
        beforeAudioRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isAudioReady && newYearAudioRef.current) {
      newYearAudioRef.current
        .play()
        .catch((error) => console.log("Error playing new year audio: ", error));
    }
  }, [isAudioReady]);

  const initParticles = async (engine: any) => {
    await loadHyperspacePreset(engine);
    await loadSnowPreset(engine);
    await loadStarsPreset(engine);
    if (particlePreset === "fireworks") {
      await loadFireworksPreset(engine);
    }
  };

  const getParticlesOptions = () => {
    if (particlePreset === "fireworks") {
      return { preset: "fireworks" };
    }
    return {
      particles: {
        number: { value: 150 },
        shape: { type: ["circle", "star"] },
        size: { value: { min: 1, max: 5 } },
        move: { enable: true, speed: 2 },
        color: { value: ["#ffffff", "#ffcc00", "#00ffcc"] },
      },
    };
  };

  const formatTime = ({
    days,
    hours,
    minutes,
    seconds,
  }: CountdownRenderProps) => {
    if (
      days === 0 &&
      hours === 0 &&
      minutes === 0 &&
      seconds === 38 &&
      !isAudioReady
    ) {
      setIsAudioReady(true); // Trigger audio when 38 seconds remain
    }

    return (
      <div className="grid sm:grid-cols-4 grid-cols-2 gap-4 text-center">
        <div className="flex flex-col p-4 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-lg shadow-lg animate-pulse">
          <span className="text-4xl font-extrabold">{days}</span>
          <span className="text-sm uppercase tracking-wide">Days</span>
        </div>
        <div className="flex flex-col p-4 bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-lg shadow-lg animate-pulse">
          <span className="text-4xl font-extrabold">{hours}</span>
          <span className="text-sm uppercase tracking-wide">Hours</span>
        </div>
        <div className="flex flex-col p-4 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-lg shadow-lg animate-pulse">
          <span className="text-4xl font-extrabold">{minutes}</span>
          <span className="text-sm uppercase tracking-wide">Minutes</span>
        </div>
        <div className="flex flex-col p-4 bg-gradient-to-br from-pink-500 to-red-500 text-white rounded-lg shadow-lg animate-pulse">
          <span className="text-4xl font-extrabold">{seconds}</span>
          <span className="text-sm uppercase tracking-wide">Seconds</span>
        </div>
      </div>
    );
  };

  const timeLeft = () => {
    const newYearDate = new Date("January 1, 2025 00:00:00").getTime();
    const nowDate = new Date().getTime();
    return newYearDate - nowDate;
  };

  const onCountdownComplete = () => {
    setNewYearMessage([
      "🎉 Selamat Datang, Tahun Baru 2025! 🎉",
      "✨ A New Year, A New Journey! ✨",
      "Semoga Tahun 2025 Membawa Kebahagiaan, Kesuksesan, dan Kedamaian bagi Kita Semua 💖",
      "🙏 Tetap Sehat, Bersemangat, dan Selalu dalam Lindungan Tuhan 🌟",
      "🌍 Mari Bersama Menciptakan Tahun yang Luar Biasa! 🚀",
    ]);

    setParticlePreset("fireworks");
    setParticlesKey((prevKey) => prevKey + 1);
    setIsCountdownComplete(true);

    if (beforeAudioRef.current) {
      beforeAudioRef.current.pause();
      beforeAudioRef.current.currentTime = 0;
    }
  };

  return (
    <>
      <audio ref={beforeAudioRef} src="/audio/intro.mp3" loop />
      <audio ref={newYearAudioRef} src="/audio/newyear.mp3" />
      <Particles
        key={particlesKey}
        init={initParticles}
        options={getParticlesOptions()}
      />
      <div className="flex flex-col justify-center items-center min-h-screen gap-4 bg-black">
        <span className="text-color-primary text-4xl font-bold px-5 z-50 text-center text-white">
          <Typewriter
            words={newYearMessage}
            loop={false}
            cursorStyle="_"
            cursor
          />
        </span>
        <button
          onClick={togglePlayPause}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        {!isCountdownComplete && (
          <div className="z-50 text-color-primary font-bold text-2xl">
            <Countdown
              date={Date.now() + timeLeft()}
              renderer={formatTime}
              onComplete={onCountdownComplete}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default App;

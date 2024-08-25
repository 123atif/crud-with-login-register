import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { particleConfig } from "./particleConfig";
const ParticleBackground = (props) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(() => particleConfig, []);

  if (init) {
    return <Particles {...props} id="tsparticles" options={options} />;
  }

  return <></>;
};

export default ParticleBackground;

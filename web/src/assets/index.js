import arecaPalm from "./plants/areca-palm.svg";
import snakePlant from "./plants/snake-plant.svg";
import monstera from "./plants/monstera.svg";
import goldenPothos from "./plants/golden-pothos.svg";
import logoPng from "./branding/NurseryDeskLogo.png";
import logoSvg from "./branding/logo.svg";
import favicon from "./branding/favicon.svg";

export const plantAssets = {
  arecaPalm,
  snakePlant,
  monstera,
  goldenPothos,
};

export const brandingAssets = {
  logo: logoPng,
  logoSvg,
  favicon,
};

export default {
  ...plantAssets,
  ...brandingAssets,
};

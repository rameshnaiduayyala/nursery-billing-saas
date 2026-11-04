import arecaPalm from "./plants/areca-palm.svg";
import snakePlant from "./plants/snake-plant.svg";
import monstera from "./plants/monstera.svg";
import goldenPothos from "./plants/golden-pothos.svg";
import logo from "./branding/logo.svg";
import favicon from "./branding/favicon.svg";

export const plantAssets = {
  arecaPalm,
  snakePlant,
  monstera,
  goldenPothos,
};

export const brandingAssets = {
  logo,
  favicon,
};

export default {
  ...plantAssets,
  ...brandingAssets,
};


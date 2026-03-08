import awsLogo from "@/assets/logos/aws.png";
import azureLogo from "@/assets/logos/azure.png";
import bmoLogo from "@/assets/logos/bmo.png";
import rbcLogo from "@/assets/logos/rbc.png";
import dalhouseLogo from "@/assets/logos/dalhousie.png";
import archilPhoto from "@/assets/archil.jpg";

export const brandLogos: Record<string, string> = {
  AWS: awsLogo,
  Azure: azureLogo,
  BMO: bmoLogo,
  RBC: rbcLogo,
  Dalhousie: dalhouseLogo,
};

export const chapterImages: Record<string, string> = {
  archil: archilPhoto,
};

// Combined career logo - we'll use both RBC and BMO logos
export const careerLogos = {
  RBC: rbcLogo,
  BMO: bmoLogo,
};

import { LucideIcon } from "lucide-react";

export interface AboutValuePillar {
   number: string;
   title: string;
   description: string;
}

export interface AboutSatelliteNodeItem {
   label: string;
}

export interface AboutSatelliteNode {
   id: string;
   title: string;
   icon: LucideIcon;
   iconColor: string;
   status: string;
   positionClass: string;
   items: AboutSatelliteNodeItem[];
}

export interface AboutHeroDataTypes {
   header: string;
   icon: LucideIcon;
   title: string;
   description: string;
   primaryCta: {
      text: string;
      href: string;
   };
   secondaryCta: {
      text: string;
      href: string;
   };
   radarHub: {
      title: string;
   };
   satelliteNodes: AboutSatelliteNode[];
   pillars: AboutValuePillar[];
}

export interface AboutDataTypes {
   hero: AboutHeroDataTypes;
}

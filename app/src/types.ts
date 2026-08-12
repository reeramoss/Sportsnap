import { SPORTS, ART_TYPES } from "./constants";

export type Sport = (typeof SPORTS)[number];
export type ArtType = (typeof ART_TYPES)[number];

export interface BrandProfile {
  clubName: string;
  logoUri: string | null;
  primaryColor: string;
  secondaryColor: string;
  websiteOrInstagram: string;
}

export interface GraphicRequest {
  photoUris: string[];
  sport: Sport | null;
  artType: ArtType | null;
  briefText: string;
  voiceNoteUri: string | null;
}

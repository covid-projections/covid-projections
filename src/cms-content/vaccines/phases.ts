import stateVaccinationInfo from './state-vaccine-phases.json';

export interface RegionPhaseGroup {
  startDate?: string;
  updatedAt: string;
  phase: string;
  tier?: string | null;
  currentlyEligible: boolean;
  description: string; // Markdown
  expandedDefinitionUrl?: string;
}

export interface RegionVaccinePhaseInfo {
  emailAlertVersion: number;
  eligibilityInfoUrl: string;
  locationName: string;
  fips: string;
  notes?: string | null;
  phaseGroups: RegionPhaseGroup[];
}

export const stateVaccinationPhases: RegionVaccinePhaseInfo[] =
  stateVaccinationInfo.regions;

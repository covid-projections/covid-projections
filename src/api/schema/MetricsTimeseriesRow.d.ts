/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Run 'yarn update-api-types' to regenerate.
 */

/**
 * Ratio of people who test positive calculated using a 7-day rolling average.
 */
export type Testpositivityratio = number | null;
/**
 * Method used to determine test positivity ratio.
 */
export type TestPositivityRatioMethod =
  | 'CMSTesting'
  | 'CDCTesting'
  | 'HHSTesting'
  | 'Valorum'
  | 'covid_tracking'
  | 'other';
/**
 * The number of cases per 100k population calculated using a 7-day rolling average.
 */
export type Casedensity = number | null;
/**
 * Ratio of currently hired tracers to estimated tracers needed based on 7-day daily case average.
 */
export type Contacttracercapacityratio = number | null;
/**
 * R_t, or the estimated number of infections arising from a typical case.
 */
export type Infectionrate = number | null;
/**
 * 90th percentile confidence interval upper endpoint of the infection rate.
 */
export type Infectionrateci90 = number | null;
export type Icuheadroomratio = number | null;
/**
 * Current number of covid patients in icu.
 */
export type Currenticucovid = number;
/**
 * Method used to determine number of current ICU patients with covid.
 */
export type CovidPatientsMethod = 'actual' | 'estimated';
/**
 * Current number of covid patients in icu.
 */
export type Currenticunoncovid = number;
/**
 * Method used to determine number of current ICU patients without covid.
 */
export type NonCovidPatientsMethod =
  | 'actual'
  | 'estimated_from_typical_utilization'
  | 'estimated_from_total_icu_actual';
export type Icucapacityratio = number | null;
/**
 * Ratio of population that has initiated vaccination.
 */
export type Vaccinationsinitiatedratio = number | null;
/**
 * Ratio of population that has completed vaccination.
 */
export type Vaccinationscompletedratio = number | null;
/**
 * Date of timeseries data point
 */
export type Date = string;

/**
 * Metrics data for a specific day.
 */
export interface MetricsTimeseriesRow {
  testPositivityRatio: Testpositivityratio;
  testPositivityRatioDetails?: TestPositivityRatioDetails | null;
  caseDensity: Casedensity;
  contactTracerCapacityRatio: Contacttracercapacityratio;
  infectionRate: Infectionrate;
  infectionRateCI90: Infectionrateci90;
  icuHeadroomRatio: Icuheadroomratio;
  icuHeadroomDetails?: ICUHeadroomMetricDetails | null;
  icuCapacityRatio: Icucapacityratio;
  vaccinationsInitiatedRatio?: Vaccinationsinitiatedratio;
  vaccinationsCompletedRatio?: Vaccinationscompletedratio;
  date: Date;
}
/**
 * Details about how the test positivity ratio was calculated.
 */
export interface TestPositivityRatioDetails {
  /**
   * Source data for test positivity ratio.
   */
  source: TestPositivityRatioMethod;
}
/**
 * Details about how the ICU Headroom Metric was calculated.
 */
export interface ICUHeadroomMetricDetails {
  currentIcuCovid: Currenticucovid;
  /**
   * Method used to determine number of current ICU patients with covid.
   */
  currentIcuCovidMethod: CovidPatientsMethod;
  currentIcuNonCovid: Currenticunoncovid;
  /**
   * Method used to determine number of current ICU patients without covid.
   */
  currentIcuNonCovidMethod: NonCovidPatientsMethod;
}

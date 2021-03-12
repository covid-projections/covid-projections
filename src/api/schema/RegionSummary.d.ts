/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Run 'yarn update-api-types' to regenerate.
 */

/**
 * FIPS Code. FIPS codes are either 2-digit state codes, 5-digit county codes, or 5-digit CBSA codes.
 */
export type Fips = string;
/**
 * 2-letter ISO-3166 Country code.
 */
export type Country = string;
/**
 * 2-letter ANSI state code. For CBSA regions, state is omitted.
 */
export type State = string | null;
/**
 * County name
 */
export type County = string | null;
/**
 * An enumeration.
 */
export type AggregationLevel =
  | 'country'
  | 'state'
  | 'county'
  | 'cbsa'
  | 'place';
/**
 * Latitude of point within the state or county. Currently a placeholder.
 */
export type Lat = number | null;
/**
 * Location ID as defined here: https://github.com/covidatlas/li/blob/master/docs/reports-v1.md#general-notes
 */
export type Locationid = string;
/**
 * Longitude of point within the state or county. Currently a placeholder.
 */
export type Long = number | null;
/**
 * Total Population in geographic region.
 */
export type Population = number;
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
 * Current number of covid patients in the ICU.
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
/**
 * Ratio of staffed intensive care unit (ICU) beds that are currently in use.
 */
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
 * Risk levels for region.
 */
export type Risklevels = RiskLevels;
/**
 * COVID Risk Level.
 *
 * ## Risk Level Definitions
 *  *Low* - On track to contain COVID
 *  *Medium* - Slow disease growth
 *  *High* - At risk of outbreak
 *  *Critical* - Active or imminent outbreak
 *  *Unknown* - Risk unknown
 *  *Extreme* - Severe outbreak
 */
export type RiskLevel = 0 | 1 | 2 | 3 | 4 | 5;
/**
 * Cumulative confirmed or suspected cases.
 */
export type Cases = number | null;
/**
 * Cumulative deaths that are suspected or confirmed to have been caused by COVID-19.
 */
export type Deaths = number | null;
/**
 * Cumulative positive test results to date
 */
export type Positivetests = number | null;
/**
 * Cumulative negative test results to date
 */
export type Negativetests = number | null;
/**
 * Number of Contact Tracers
 */
export type Contacttracers = number | null;
/**
 *
 * Information about acute bed utilization details.
 *
 * Fields:
 *  * capacity - Current staffed acute bed capacity.
 *  * currentUsageTotal - Total number of acute beds currently in use
 *  * currentUsageCovid - Number of acute beds currently in use by COVID patients.
 *  * typicalUsageRate - Typical acute bed utilization rate.
 *
 */
export type Hospitalbeds = HospitalResourceUtilization;
/**
 * Total capacity for resource.
 */
export type Capacity = number | null;
/**
 * Currently used capacity for resource by all patients (COVID + Non-COVID)
 */
export type Currentusagetotal = number | null;
/**
 * Currently used capacity for resource by COVID
 */
export type Currentusagecovid = number | null;
/**
 * Typical used capacity rate for resource. This excludes any COVID usage.
 */
export type Typicalusagerate = number | null;
/**
 *
 * Information about ICU bed utilization details.
 *
 * Fields:
 *  * capacity - Current staffed ICU bed capacity.
 *  * currentUsageTotal - Total number of ICU beds currently in use
 *  * currentUsageCovid - Number of ICU beds currently in use by COVID patients.
 *  * typicalUsageRate - Typical ICU utilization rate.
 *
 */
export type Icubeds = HospitalResourceUtilization;
/**
 *
 * New confirmed or suspected cases.
 *
 *
 * New cases are a processed timeseries of cases - summing new cases may not equal
 * the cumulative case count.
 *
 * Processing steps:
 *  1. If a region does not report cases for a period of time but then begins reporting again,
 *     we will exclude the first day that reporting recommences. This first day likely includes
 *     multiple days worth of cases and can be misleading to the overall series.
 *  2. We remove any days with negative new cases.
 *  3. We apply an outlier detection filter to the timeseries, which removes any data
 *     points that seem improbable given recent numbers. Many times this is due to
 *     backfill of previously unreported cases.
 *
 */
export type Newcases = number | null;
/**
 *
 * New confirmed or suspected COVID-19 deaths.
 *
 * New deaths is an estimate of deaths per day; summing new deaths may not equal the
 * cumulative death count.
 *
 * Processing steps:
 *  1. If a region does not report deaths for a period of time but then begins reporting again,
 *     we will exclude the first day that reporting recommences. This first day likely includes
 *     multiple days worth of deaths and can be misleading to the overall series.
 *  2. We remove any days with negative new deaths.
 *  3. We apply an outlier detection filter to the timeseries, which removes any data
 *     points that seem improbable given recent numbers. Many times this is due to
 *     backfill of previously unreported deaths.
 *
 */
export type Newdeaths = number | null;
/**
 * Number of vaccine doses distributed.
 */
export type Vaccinesdistributed = number | null;
/**
 *
 * Number of vaccinations initiated.
 *
 * This value may vary by type of vaccine, but for Moderna and Pfizer this indicates
 * number of people vaccinated with the first dose.
 *
 */
export type Vaccinationsinitiated = number | null;
/**
 *
 * Number of vaccinations completed.
 *
 * This value may vary by type of vaccine, but for Moderna and Pfizer this indicates
 * number of people vaccinated with both the first and second dose.
 *
 */
export type Vaccinationscompleted = number | null;
/**
 * Total number of vaccine doses administered.
 */
export type Vaccinesadministered = number | null;
/**
 * Annotations for cases
 */
export type Cases1 = FieldAnnotations;
/**
 * The data source of a field (metric or actual). This enumeration lists the places from which
 * CAN fetches data. The source is tracked on a per field and region timeseries basis.
 */
export type FieldSourceType =
  | 'NYTimes'
  | 'CMSTesting'
  | 'CDCTesting'
  | 'HHSTesting'
  | 'HHSHospital'
  | 'Valorum'
  | 'covid_tracking'
  | 'USAFacts'
  | 'TestAndTrace'
  | 'CANScrapersStateProviders'
  | 'other';
/**
 * URL of a webpage containing the data at the source
 */
export type Url = string | null;
/**
 * A human readable name of the source
 */
export type Name = string | null;
export type Sources = FieldSource[];
/**
 * Date of anomaly
 */
export type Date = string;
/**
 * The type of the annotation.
 *
 * Each enumeration refers to the method used to generate the annotation.
 */
export type TagType =
  | 'cumulative_tail_truncated'
  | 'cumulative_long_tail_truncated'
  | 'zscore_outlier'
  | 'provenance'
  | 'source_url'
  | 'source';
/**
 * Original value on this date detected as anomalous.
 */
export type OriginalObservation = number;
export type Anomalies = AnomalyAnnotation[];
/**
 * Annotations for deaths
 */
export type Deaths1 = FieldAnnotations;
/**
 * Annotations for positiveTests
 */
export type Positivetests1 = FieldAnnotations;
/**
 * Annotations for negativeTests
 */
export type Negativetests1 = FieldAnnotations;
/**
 * Annotations for contactTracers
 */
export type Contacttracers1 = FieldAnnotations;
/**
 * Annotations for hospitalBeds
 */
export type Hospitalbeds1 = FieldAnnotations;
/**
 * Annotations for icuBeds
 */
export type Icubeds1 = FieldAnnotations;
/**
 * Annotations for newCases
 */
export type Newcases1 = FieldAnnotations;
/**
 * Annotations for newDeaths
 */
export type Newdeaths1 = FieldAnnotations;
/**
 * Annotations for vaccinesAdministered
 */
export type Vaccinesadministered1 = FieldAnnotations;
/**
 * Annotations for vaccinesDistributed
 */
export type Vaccinesdistributed1 = FieldAnnotations;
/**
 * Annotations for vaccinationsInitiated
 */
export type Vaccinationsinitiated1 = FieldAnnotations;
/**
 * Annotations for vaccinationsCompleted
 */
export type Vaccinationscompleted1 = FieldAnnotations;
/**
 * Annotations for testPositivityRatio
 */
export type Testpositivityratio1 = FieldAnnotations;
/**
 * Annotations for caseDensity
 */
export type Casedensity1 = FieldAnnotations;
/**
 * Annotations for contactTracerCapacityRatio
 */
export type Contacttracercapacityratio1 = FieldAnnotations;
/**
 * Annotations for infectionRate
 */
export type Infectionrate1 = FieldAnnotations;
/**
 * Annotations for infectionRateCI90
 */
export type Infectionrateci901 = FieldAnnotations;
/**
 * Annotations for icuHeadroomRatio
 */
export type Icuheadroomratio1 = FieldAnnotations;
/**
 * Annotations for icuCapacityRatio
 */
export type Icucapacityratio1 = FieldAnnotations;
/**
 * Annotations for vaccinationsInitiatedRatio
 */
export type Vaccinationsinitiatedratio1 = FieldAnnotations;
/**
 * Annotations for vaccinationsCompletedRatio
 */
export type Vaccinationscompletedratio1 = FieldAnnotations;
/**
 * Date of latest data
 */
export type Lastupdateddate = string;
/**
 * URL linking to Covid Act Now location page.
 */
export type Url1 = string | null;

/**
 * Summary of actual and prediction data for a single region.
 */
export interface RegionSummary {
  fips: Fips;
  country: Country;
  state: State;
  county: County;
  /**
   * Level of region.
   */
  level: AggregationLevel;
  lat: Lat;
  locationId: Locationid;
  long: Long;
  population: Population;
  metrics: Metrics;
  riskLevels: Risklevels;
  actuals: Actuals;
  annotations: Annotations;
  lastUpdatedDate: Lastupdateddate;
  url: Url1;
}
/**
 * Calculated metrics data based on known actuals.
 */
export interface Metrics {
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
/**
 * COVID risk levels for a region.
 */
export interface RiskLevels {
  /**
   * Overall risk level for region.
   */
  overall: RiskLevel;
  /**
   * Test positivity ratio risk level.
   */
  testPositivityRatio: RiskLevel;
  /**
   * Case density risk level.
   */
  caseDensity: RiskLevel;
  /**
   * Contact tracer capacity ratio risk level.
   */
  contactTracerCapacityRatio: RiskLevel;
  /**
   * Infection rate risk level.
   */
  infectionRate: RiskLevel;
  /**
   * ICU headroom ratio risk level.
   */
  icuHeadroomRatio: RiskLevel;
  /**
   * ICU capacity ratio risk level.
   */
  icuCapacityRatio: RiskLevel;
}
/**
 * Known actuals data.
 */
export interface Actuals {
  cases: Cases;
  deaths: Deaths;
  positiveTests: Positivetests;
  negativeTests: Negativetests;
  contactTracers: Contacttracers;
  hospitalBeds: Hospitalbeds;
  icuBeds: Icubeds;
  newCases: Newcases;
  newDeaths: Newdeaths;
  vaccinesDistributed?: Vaccinesdistributed;
  vaccinationsInitiated?: Vaccinationsinitiated;
  vaccinationsCompleted?: Vaccinationscompleted;
  vaccinesAdministered?: Vaccinesadministered;
}
/**
 * Base model for API output.
 */
export interface HospitalResourceUtilization {
  capacity: Capacity;
  currentUsageTotal: Currentusagetotal;
  currentUsageCovid: Currentusagecovid;
  typicalUsageRate: Typicalusagerate;
}
/**
 * Annotations for each field.
 */
export interface Annotations {
  cases?: Cases1;
  deaths?: Deaths1;
  positiveTests?: Positivetests1;
  negativeTests?: Negativetests1;
  contactTracers?: Contacttracers1;
  hospitalBeds?: Hospitalbeds1;
  icuBeds?: Icubeds1;
  newCases?: Newcases1;
  newDeaths?: Newdeaths1;
  vaccinesAdministered?: Vaccinesadministered1;
  vaccinesDistributed?: Vaccinesdistributed1;
  vaccinationsInitiated?: Vaccinationsinitiated1;
  vaccinationsCompleted?: Vaccinationscompleted1;
  testPositivityRatio?: Testpositivityratio1;
  caseDensity?: Casedensity1;
  contactTracerCapacityRatio?: Contacttracercapacityratio1;
  infectionRate?: Infectionrate1;
  infectionRateCI90?: Infectionrateci901;
  icuHeadroomRatio?: Icuheadroomratio1;
  icuCapacityRatio?: Icucapacityratio1;
  vaccinationsInitiatedRatio?: Vaccinationsinitiatedratio1;
  vaccinationsCompletedRatio?: Vaccinationscompletedratio1;
}
/**
 * Annotations associated with one field.
 */
export interface FieldAnnotations {
  sources: Sources;
  anomalies: Anomalies;
}
/**
 * Base model for API output.
 */
export interface FieldSource {
  /**
   * The type of data source from a CAN list of data source types
   */
  type?: FieldSourceType;
  url?: Url;
  name?: Name;
}
/**
 * Base model for API output.
 */
export interface AnomalyAnnotation {
  date: Date;
  /**
   * Type of annotation
   */
  type: TagType;
  original_observation: OriginalObservation;
}

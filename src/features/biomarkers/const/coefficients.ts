import { BioAgeParams } from '../types/bio-age-params';

export const COEFFICIENTS: BioAgeParams = {
  // calculation format: conversion * value * coefficient
  Albumin: {
    unit: 'g/L',
    databaseUnit: 'g/dL',
    calculateCoefficient: (v: number) => 10 * v * -0.0336,
  },
  Creatinine: {
    unit: 'umol/L',
    databaseUnit: 'mg/dl',
    calculateCoefficient: (v: number) => 88.401 * v * 0.0095,
  },
  Glucose: {
    unit: 'mmol/L',
    databaseUnit: 'mg/dl',
    calculateCoefficient: (v: number) => 0.0555 * v * 0.1953,
  },
  'C-Reactive Protein (CRP)': {
    unit: 'mg/dL',
    databaseUnit: 'Ln(mg/dL)',
    calculateCoefficient: (v: number) => Math.log(0.1 * v) * 0.0954,
  },
  Lymphocytes: {
    unit: '%',
    databaseUnit: '%',
    calculateCoefficient: (v: number) => v * -0.012,
  },
  'Mean Cell Volume (MCV)': {
    unit: 'fL',
    databaseUnit: 'fL',
    calculateCoefficient: (v: number) => v * 0.0268,
  },
  'Red Cell Dist Width (RDW)': {
    unit: '%',
    databaseUnit: '%',
    calculateCoefficient: (v: number) => v * 0.3306,
  },
  'Alkaline Phosphatase (ALP)': {
    unit: 'IU/L',
    databaseUnit: 'IU/L',
    calculateCoefficient: (v: number) => v * 0.0019,
  },
  'White Blood Cells': {
    unit: 'x10E3/uL',
    databaseUnit: 'x10E3/uL',
    calculateCoefficient: (v: number) => v * 0.0554,
  },
};

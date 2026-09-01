import { describe, expect, it } from 'vitest';
import { assessmentSchema } from './schema';

const validAssessment = {
  mrn: 'MRN-004821',
  patientName: 'Sushila Deshpande',
  dateOfBirth: '1966-08-07',
  assessmentDate: '2026-08-07',
  mobility: 'cane',
  barthelIndex: 80,
  medicationCount: 3,
  pharmacistReviewRequested: false,
  followUpDate: '2026-09-04',
  consentObtained: true,
};

describe('assessmentSchema age boundary', () => {
  it('accepts a patient who is exactly 60 on the assessment date', () => {
    const result = assessmentSchema.safeParse(validAssessment);

    expect(result.success).toBe(true);
  });

  it('rejects a patient who is one day short of 60', () => {
    const result = assessmentSchema.safeParse({
      ...validAssessment,
      dateOfBirth: '1966-08-08',
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.issues[0].message).toBe('This pathway is for patients aged 60 and over');
  });
});

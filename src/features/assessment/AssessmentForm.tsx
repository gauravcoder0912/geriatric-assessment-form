import { useState } from 'react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import {
  Alert,
  Button,
  Checkbox,
  Code,
  Container,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { sampleAssessment } from './fixtures';
import { assessmentSchema, MOBILITY, type Assessment } from './schema';

type AssessmentFormProps = {
  onSave?: (assessment: Assessment) => void;
};

type AssessmentFormValues = {
  mrn: string;
  patientName: string;
  dateOfBirth: string;
  assessmentDate: string;
  mobility: Assessment['mobility'] | '';
  barthelIndex: number | '';
  medicationCount: number | '';
  pharmacistReviewRequested: boolean;
  followUpDate: string;
  consentObtained: boolean;
};

const initialValues: AssessmentFormValues = {
  mrn: '',
  patientName: '',
  dateOfBirth: '',
  assessmentDate: '',
  mobility: '',
  barthelIndex: '',
  medicationCount: '',
  pharmacistReviewRequested: false,
  followUpDate: '',
  consentObtained: false,
};

const mobilityOptions = MOBILITY.map((value) => ({
  value,
  label: value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
}));

export function AssessmentForm({ onSave }: AssessmentFormProps) {
  const [savedAssessment, setSavedAssessment] = useState<Assessment | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<AssessmentFormValues>({
    initialValues,
    validate: zod4Resolver(assessmentSchema),
    validateInputOnBlur: true,
  });

  const handleSubmit = async (values: AssessmentFormValues) => {
    const result = assessmentSchema.safeParse(values);

    if (!result.success) {
      return;
    }

    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    setSavedAssessment(result.data);
    onSave?.(result.data);
    setIsSaving(false);
  };

  const loadSamplePatient = () => {
    form.setValues(sampleAssessment);
    form.clearErrors();
  };

  return (
    <Container size="sm" py="xl">
      <Paper withBorder shadow="sm" p="xl">
        <Stack>
          <Title order={1}>Geriatric Care Assessment</Title>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="Medical record number"
                placeholder="MRN-004821"
                {...form.getInputProps('mrn')}
              />

              <TextInput label="Patient name" {...form.getInputProps('patientName')} />

              <DateInput
                label="Date of birth"
                maxDate={new Date()}
                {...form.getInputProps('dateOfBirth')}
              />

              <DateInput
                label="Assessment date"
                maxDate={new Date()}
                {...form.getInputProps('assessmentDate')}
              />

              <Select label="Mobility" data={mobilityOptions} {...form.getInputProps('mobility')} />

              <NumberInput
                label="Barthel Index"
                step={5}
                min={0}
                max={100}
                {...form.getInputProps('barthelIndex')}
              />

              <NumberInput
                label="Regular medications"
                min={0}
                max={30}
                {...form.getInputProps('medicationCount')}
              />

              <Checkbox
                label="Pharmacist review requested"
                {...form.getInputProps('pharmacistReviewRequested', {
                  type: 'checkbox',
                })}
              />

              <DateInput label="Next review date" {...form.getInputProps('followUpDate')} />

              <Checkbox
                label="Patient or representative has given consent"
                {...form.getInputProps('consentObtained', {
                  type: 'checkbox',
                })}
              />

              <Group justify="space-between">
                <Button type="button" variant="light" onClick={loadSamplePatient}>
                  Load sample patient
                </Button>

                <Button type="submit" loading={isSaving} disabled={isSaving}>
                  Save assessment
                </Button>
              </Group>

              {savedAssessment && (
                <Alert title="Assessment saved" color="green">
                  <Code block>{JSON.stringify(savedAssessment, null, 2)}</Code>
                </Alert>
              )}
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}

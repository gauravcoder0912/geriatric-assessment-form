import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AssessmentForm } from './AssessmentForm';
import { sampleAssessment } from './fixtures';

describe('AssessmentForm', () => {
  it('loads the sample patient and submits parsed values', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<AssessmentForm onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: 'Load sample patient' }));

    await user.click(screen.getByRole('button', { name: 'Save assessment' }));

    expect(await screen.findByText('Assessment saved')).toBeInTheDocument();

    expect(onSave).toHaveBeenCalledWith(sampleAssessment);
  });
});

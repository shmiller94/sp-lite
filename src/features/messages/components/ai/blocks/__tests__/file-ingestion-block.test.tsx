import { render, screen } from '@testing-library/react';

import type { FileIngestionDataPart } from '../../../../utils/data-parts';
import { FileIngestionBlock } from '../file-ingestion-block';

function makePart(
  overrides: Partial<FileIngestionDataPart['data']>,
): FileIngestionDataPart {
  return {
    type: 'data-file-ingestion',
    data: {
      fileId: 'f1',
      filename: 'cbc-march-2026.pdf',
      state: 'processing',
      status: 'processing',
      phase: null,
      classification: null,
      writtenCount: null,
      message: null,
      error: null,
      ...overrides,
    },
  };
}

describe('FileIngestionBlock', () => {
  it('renders processing state with shimmer phase label', () => {
    render(
      <FileIngestionBlock
        part={makePart({
          state: 'processing',
          status: 'processing',
          phase: 'extracting',
        })}
      />,
    );
    expect(screen.getByText('cbc-march-2026.pdf')).toBeInTheDocument();
    expect(screen.getByText('Processing')).toBeInTheDocument();
    expect(screen.getByText('Extracting…')).toBeInTheDocument();
  });

  it('ignores unexpected runtime phase values', () => {
    const part = makePart({
      state: 'processing',
      status: 'processing',
      phase: 'extracting',
    });

    Object.defineProperty(part.data, 'phase', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    render(<FileIngestionBlock part={part} />);

    expect(screen.getByText('Processing')).toBeInTheDocument();
    expect(screen.queryByText('undefined…')).not.toBeInTheDocument();
  });

  it('renders registered state with Queued badge', () => {
    render(
      <FileIngestionBlock
        part={makePart({ state: 'processing', status: 'registered' })}
      />,
    );
    expect(screen.getByText('cbc-march-2026.pdf')).toBeInTheDocument();
    expect(screen.getByText('Queued')).toBeInTheDocument();
    expect(screen.queryByText('Processing')).not.toBeInTheDocument();
  });

  it('renders final state with classification and count', () => {
    render(
      <FileIngestionBlock
        part={makePart({
          state: 'complete',
          status: 'final',
          classification: 'lab_results_pathology',
          writtenCount: 12,
        })}
      />,
    );
    expect(screen.getByText('cbc-march-2026.pdf')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText('Lab Results')).toBeInTheDocument();
    expect(screen.getByText('12 results saved')).toBeInTheDocument();
  });

  it('renders classification-specific final messages for non-lab files', () => {
    render(
      <FileIngestionBlock
        part={makePart({
          state: 'complete',
          status: 'final',
          classification: 'clinical_notes',
          message:
            'Identified as clinical notes, so no lab extraction was run.',
        })}
      />,
    );

    expect(screen.getByText('cbc-march-2026.pdf')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText('Clinical Notes')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Identified as clinical notes, so no lab extraction was run.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/results extracted/)).not.toBeInTheDocument();
  });

  it('renders informational final messages for zero-result lab files', () => {
    render(
      <FileIngestionBlock
        part={makePart({
          state: 'complete',
          status: 'final',
          classification: 'lab_results_pathology',
          message:
            'Recognized as a lab report, but no structured lab results could be extracted.',
        })}
      />,
    );

    expect(screen.getByText('cbc-march-2026.pdf')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText('Lab Results')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Recognized as a lab report, but no structured lab results could be extracted.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/results extracted/)).not.toBeInTheDocument();
  });

  it('falls back to the raw classification for unexpected runtime values', () => {
    const part = makePart({
      state: 'complete',
      status: 'final',
      writtenCount: 1,
    });

    Object.defineProperty(part.data, 'classification', {
      value: 'Outside Schema',
      writable: true,
      configurable: true,
    });

    render(<FileIngestionBlock part={part} />);

    expect(screen.getByText('Outside Schema')).toBeInTheDocument();
    expect(screen.getByText('1 result saved')).toBeInTheDocument();
  });

  it('ignores unexpected runtime writtenCount values', () => {
    const part = makePart({
      state: 'complete',
      status: 'final',
      classification: 'lab_results_pathology',
      writtenCount: 1,
    });

    Object.defineProperty(part.data, 'writtenCount', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    render(<FileIngestionBlock part={part} />);

    expect(screen.getByText('Lab Results')).toBeInTheDocument();
    expect(screen.queryByText(/results saved/)).not.toBeInTheDocument();
  });

  it('renders failed state with error details', () => {
    render(
      <FileIngestionBlock
        part={makePart({
          state: 'complete',
          status: 'failed',
          error: 'No processing run was created for this file',
        })}
      />,
    );
    expect(screen.getByText('cbc-march-2026.pdf')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(
      screen.getByText('No processing run was created for this file'),
    ).toBeInTheDocument();
  });

  it('ignores unexpected runtime error values', () => {
    const part = makePart({
      state: 'complete',
      status: 'failed',
      error: 'Parse error: invalid format',
    });

    Object.defineProperty(part.data, 'error', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    expect(() => render(<FileIngestionBlock part={part} />)).not.toThrow();
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(
      screen.queryByText('Parse error: invalid format'),
    ).not.toBeInTheDocument();
  });
});

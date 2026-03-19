import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { render, screen, act } from '@testing-library/react';
import type { ReactNode } from 'react';

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

async function renderWithRouter(ui: ReactNode) {
  const rootRoute = createRootRoute({ component: () => ui });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });
  await router.load();
  await act(async () => {
    render(<RouterProvider router={router} />);
  });
}

describe('FileIngestionBlock', () => {
  it('renders processing state with progress', () => {
    render(
      <FileIngestionBlock
        part={makePart({
          state: 'processing',
          status: 'processing',
          phase: 'extracting',
        })}
      />,
    );
    expect(screen.getByText('Processing documents...')).toBeInTheDocument();
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

    expect(screen.getByText('Processing documents...')).toBeInTheDocument();
    expect(screen.queryByText('undefined…')).not.toBeInTheDocument();
  });

  it('renders registered state as processing', () => {
    render(
      <FileIngestionBlock
        part={makePart({ state: 'processing', status: 'registered' })}
      />,
    );
    expect(screen.getByText('Processing documents...')).toBeInTheDocument();
  });

  it('renders final state with view results summary link', async () => {
    await renderWithRouter(
      <FileIngestionBlock
        part={makePart({
          state: 'complete',
          status: 'final',
          classification: 'lab_results_pathology',
          writtenCount: 12,
        })}
      />,
    );
    expect(screen.getByText('View results summary')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/data');
  });

  it('renders final state for non-lab files with view results summary', async () => {
    await renderWithRouter(
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

    expect(screen.getByText('View results summary')).toBeInTheDocument();
  });

  it('renders final state for zero-result lab files with view results summary', async () => {
    await renderWithRouter(
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

    expect(screen.getByText('View results summary')).toBeInTheDocument();
  });

  it('renders final state with unexpected classification', async () => {
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

    await renderWithRouter(<FileIngestionBlock part={part} />);

    expect(screen.getByText('View results summary')).toBeInTheDocument();
  });

  it('renders final state with unexpected writtenCount', async () => {
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

    await renderWithRouter(<FileIngestionBlock part={part} />);

    expect(screen.getByText('View results summary')).toBeInTheDocument();
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
    expect(screen.getByText('cbc-march-2026.pdf')).toBeInTheDocument();
    expect(
      screen.queryByText('Parse error: invalid format'),
    ).not.toBeInTheDocument();
  });
});

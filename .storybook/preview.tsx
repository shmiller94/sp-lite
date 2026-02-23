import { BrowserRouter as Router } from '@tanstack/react-router';
import React from 'react';

import '../src/index.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators = [
  (Story) => (
    <Router>
      <Story />
    </Router>
  ),
];

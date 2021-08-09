import { PageContent } from '@components/layout';
import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () =>  {
  return (
    <PageContent>
      <h1>Page Not Found</h1>
      <Link to="/">Go Home</Link>
    </PageContent>
  );
}
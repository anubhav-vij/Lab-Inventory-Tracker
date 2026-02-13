'use client';

import { Amplify } from 'aws-amplify';
import config from '../aws-exports';
import { useEffect } from 'react';

Amplify.configure(config, { ssr: true });

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ensure Amplify is configured on client side
    Amplify.configure(config);
  }, []);

  return <>{children}</>;
}
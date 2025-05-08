'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/frame-sdk';


export function FrameInitializer() {
  useEffect(() => {
    // Add a small delay to ensure content is loaded
    const timer = setTimeout(() => {
      sdk.actions.ready();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return null;
}
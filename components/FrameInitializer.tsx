'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/frame-sdk';

export function FrameInitializer() {
  useEffect(() => {
    // Call ready when interface is loaded
    sdk.actions.ready({ disableNativeGestures: true });
  }, []);
  
  // This component doesn't render anything
  return null;
}
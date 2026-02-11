'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: any) => {
      // In development, Next.js handles uncaught exceptions with an overlay.
      // We throw the error to trigger that rich debugging experience.
      if (process.env.NODE_ENV === 'development') {
        throw error;
      } else {
        toast({
          variant: 'destructive',
          title: 'Permission Denied',
          description: 'You do not have permission to perform this action.',
        });
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}

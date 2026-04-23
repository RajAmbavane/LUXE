import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiUrl } from '@/config/environment';

// Processing status hook with better error handling
export function useProcessingStatus() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingCases, setPendingCases] = useState(0);

  useEffect(() => {
    // Check processing status from backend
    const checkStatus = async () => {
      try {
        const response = await fetch(apiUrl('/processing-status'));
        if (response.ok) {
          const data = await response.json();
          setIsProcessing(data.is_processing || false);
          setPendingCases(data.pending_cases || 0);
        }
      } catch (error) {
        // Silently fail - just assume no processing is happening
        setIsProcessing(false);
        setPendingCases(0);
      }
    };

    // Check immediately and then every 5 seconds
    checkStatus();
    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    isProcessing,
    pendingCases
  };
}

export function triggerProcessing() {
  const queryClient = useQueryClient();
  
  return async () => {
    try {
      const response = await fetch(apiUrl('/trigger-processing'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        console.log('Processing triggered successfully');
        // Refresh the cases data
        queryClient.invalidateQueries({ queryKey: ['cases'] });
      } else {
        console.error('Failed to trigger processing');
      }
    } catch (error) {
      console.error('Error triggering processing:', error);
    }
  };
}
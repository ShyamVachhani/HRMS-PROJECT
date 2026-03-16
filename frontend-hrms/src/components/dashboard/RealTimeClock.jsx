import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const RealTimeClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1.5,
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      padding: '8px 16px',
      borderRadius: '12px',
      color: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <AccessTimeIcon />
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          {time.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}
        </Typography>
      </Box>
    </Box>
  );
};

export default RealTimeClock;

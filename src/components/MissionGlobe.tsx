import React, { useRef, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { Mission } from '../services/missionsApi';

interface MissionGlobeProps {
  missions: Mission[];
}

const MissionGlobe: React.FC<MissionGlobeProps> = ({ missions }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();

  const getMissionColor = (mission: Mission) => {
    switch (mission.status) {
      case 'active':
        return theme.palette.success.main;
      case 'completed':
        return theme.palette.info.main;
      case 'planned':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    const draw = () => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set center point
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 50;

      // Draw globe
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = theme.palette.primary.main;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw grid lines
      for (let i = -4; i <= 4; i++) {
        const y = centerY + (radius * i) / 4;
        ctx.beginPath();
        ctx.moveTo(centerX - radius, y);
        ctx.lineTo(centerX + radius, y);
        ctx.strokeStyle = theme.palette.primary.light;
        ctx.globalAlpha = 0.2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Draw missions
      missions.forEach((mission, index) => {
        const angle = (index * Math.PI * 2) / missions.length + rotation;
        const x = centerX + Math.cos(angle) * radius * 0.8;
        const y = centerY + Math.sin(angle) * radius * 0.8;

        // Draw point
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = getMissionColor(mission);
        ctx.fill();

        // Draw name
        ctx.fillStyle = theme.palette.text.primary;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(mission.name, x, y + 20);
      });

      // Update rotation
      rotation += 0.002;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [missions, theme]);

  return (
    <Box
      sx={{
        width: '100%',
        height: 400,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.paper',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </Box>
  );
};

export default MissionGlobe;

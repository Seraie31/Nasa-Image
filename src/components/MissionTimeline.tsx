import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { Mission } from '../services/missionsApi';

interface TimelineItemProps {
  mission: Mission;
  index: number;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ mission, index }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        opacity: 0,
        transform: 'translateX(-50px)',
        animation: 'slideIn 0.5s ease forwards',
        animationDelay: `${index * 0.2}s`,
        '@keyframes slideIn': {
          from: {
            opacity: 0,
            transform: 'translateX(-50px)',
          },
          to: {
            opacity: 1,
            transform: 'translateX(0)',
          },
        },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            left: -20,
            top: '50%',
            width: 20,
            height: 2,
            bgcolor: 'primary.main',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            left: -24,
            top: 'calc(50% - 4px)',
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: (theme) =>
              mission.status === 'active'
                ? theme.palette.success.main
                : mission.status === 'completed'
                ? theme.palette.info.main
                : theme.palette.warning.main,
          },
        }}
      >
        <Box sx={{ minWidth: 120 }}>
          <Typography variant="caption" color="text.secondary">
            {mission.launchDate
              ? new Date(mission.launchDate).toLocaleDateString()
              : 'Date à définir'}
          </Typography>
        </Box>
        <Box sx={{ ml: 2, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            {mission.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {mission.description}
          </Typography>
          {mission.details.objectives && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="primary">
                Objectifs principaux :
              </Typography>
              <ul style={{ margin: '4px 0', paddingLeft: 20 }}>
                {mission.details.objectives.slice(0, 2).map((objective, i) => (
                  <li key={i}>
                    <Typography variant="body2">{objective}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

interface MissionTimelineProps {
  missions: Mission[];
}

const MissionTimeline: React.FC<MissionTimelineProps> = ({ missions }) => {
  const sortedMissions = [...missions].sort((a, b) => {
    if (!a.launchDate) return 1;
    if (!b.launchDate) return -1;
    return new Date(a.launchDate).getTime() - new Date(b.launchDate).getTime();
  });

  return (
    <Box
      sx={{
        ml: 4,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: -2,
          top: 0,
          bottom: 0,
          width: 4,
          bgcolor: 'primary.main',
          borderRadius: 2,
        },
      }}
    >
      {sortedMissions.map((mission, index) => (
        <TimelineItem key={mission.id} mission={mission} index={index} />
      ))}
    </Box>
  );
};

export default MissionTimeline;

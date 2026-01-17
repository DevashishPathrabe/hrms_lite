import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import { employeesAPI, attendanceAPI } from '../services/api';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalAttendance: 0,
    presentToday: 0,
    absentToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      const [employeesRes, attendanceRes, todayAttendanceRes] = await Promise.all([
        employeesAPI.getAll(),
        attendanceAPI.getAll(),
        attendanceAPI.getAll({ date: today }),
      ]);

      const employees = employeesRes.data;
      const allAttendance = attendanceRes.data;
      const todayAttendance = todayAttendanceRes.data;

      const presentToday = todayAttendance.filter((a) => a.is_present).length;
      const absentToday = todayAttendance.filter((a) => !a.is_present).length;

      setStats({
        totalEmployees: employees.length,
        totalAttendance: allAttendance.length,
        presentToday,
        absentToday,
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#9a8568',
      gradient: 'linear-gradient(135deg, #9a8568 0%, #b39d7d 100%)',
    },
    {
      title: 'Total Attendance Records',
      value: stats.totalAttendance,
      icon: <EventIcon sx={{ fontSize: 40 }} />,
      color: '#c4b299',
      gradient: 'linear-gradient(135deg, #c4b299 0%, #d1c2aa 100%)',
    },
    {
      title: 'Present Today',
      value: stats.presentToday,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: '#6b8e5a',
      gradient: 'linear-gradient(135deg, #6b8e5a 0%, #8ba87a 100%)',
    },
    {
      title: 'Absent Today',
      value: stats.absentToday,
      icon: <CancelIcon sx={{ fontSize: 40 }} />,
      color: '#c97d60',
      gradient: 'linear-gradient(135deg, #c97d60 0%, #d99a82 100%)',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: 'text.primary' }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ bgcolor: 'background.paper' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2" sx={{ fontWeight: 500 }}>
                      {card.title}
                    </Typography>
                    <Typography 
                      variant="h4" 
                      component="div" 
                      sx={{ 
                        background: card.gradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontWeight: 'bold',
                      }}
                    >
                      {card.value}
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      color: card.color,
                      background: `linear-gradient(135deg, ${card.color}15 0%, ${card.color}25 100%)`,
                      borderRadius: '12px',
                      p: 1.5,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

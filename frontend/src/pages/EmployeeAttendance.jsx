import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Grid,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { employeesAPI } from '../services/api';

export default function EmployeeAttendance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchEmployeeData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchAttendance();
      fetchSummary();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, startDate, endDate]);

  const fetchEmployeeData = async () => {
    try {
      const response = await employeesAPI.getById(id);
      setEmployee(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load employee');
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      const response = await employeesAPI.getAttendance(id, params);
      setAttendance(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await employeesAPI.getAttendanceSummary(id);
      setSummary(response.data);
    } catch (err) {
      console.error('Failed to load summary:', err);
    }
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  if (loading && !employee) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !employee) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/employees')} sx={{ mt: 2 }}>
          Back to Employees
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/employees')}>
          Back
        </Button>
        <Typography variant="h4" sx={{ color: 'text.primary' }}>
          {employee?.full_name}'s Attendance
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {summary && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, bgcolor: 'background.paper', textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Total Present Days
              </Typography>
              <Typography variant="h4" sx={{ color: '#6b8e5a', fontWeight: 'bold' }}>
                {summary.total_present_days}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, bgcolor: 'background.paper', textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Total Absent Days
              </Typography>
              <Typography variant="h4" sx={{ color: '#c97d60', fontWeight: 'bold' }}>
                {summary.total_absent_days}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Card sx={{ bgcolor: 'background.paper', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filter by Date Range
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            {(startDate || endDate) && (
              <Button variant="outlined" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Attendance Records
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        <Typography variant="body2" color="textSecondary">
                          No attendance records found for the selected period.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendance.map((record) => {
                      const statusLabel = record.is_present ? 'Present' : 'Absent';
                      return (
                        <TableRow key={record.id} hover>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Chip
                              label={statusLabel}
                              size="small"
                              sx={{
                                bgcolor: record.is_present ? '#6b8e5a' : '#c97d60',
                                color: 'white',
                                fontWeight: 500,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

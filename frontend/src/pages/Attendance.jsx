import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { employeesAPI, attendanceAPI } from '../services/api';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    date: '',
    is_present: true,
  });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterEmployee, filterDate]);

  const fetchEmployees = async () => {
    try {
      const response = await employeesAPI.getAll();
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to load employees:', err);
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterEmployee) params.employee_id = filterEmployee;
      if (filterDate) params.date = filterDate;
      const response = await attendanceAPI.getAll(params);
      setAttendance(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    const today = new Date().toISOString().split('T')[0];
    setOpenDialog(true);
    setFormData({ employee_id: '', date: today, is_present: true });
    setFormError(null);
  };

  const handleCloseDialog = () => {
    const today = new Date().toISOString().split('T')[0];
    setOpenDialog(false);
    setFormData({ employee_id: '', date: today, is_present: true });
    setFormError(null);
    setSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'is_present') {
      setFormData((prev) => ({ ...prev, is_present: value === 'Present' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormError(null);
      setSubmitting(true);
      await attendanceAPI.create(formData);
      handleCloseDialog();
      fetchAttendance();
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Failed to mark attendance');
      setSubmitting(false);
    }
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find((e) => e.employee_id === employeeId);
    return employee ? employee.full_name : `Employee ${employeeId}`;
  };

  if (loading && attendance.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: 'text.primary' }}>
          Attendance Records
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ bgcolor: 'primary.main' }}
        >
          Mark Attendance
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card sx={{ bgcolor: 'background.paper', mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} flexWrap="wrap">
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Employee</InputLabel>
              <Select
                value={filterEmployee}
                label="Filter by Employee"
                onChange={(e) => setFilterEmployee(e.target.value)}
              >
                <MenuItem value="">All Employees</MenuItem>
                {employees.map((emp) => (
                  <MenuItem key={emp.employee_id} value={emp.employee_id}>
                    {emp.full_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Filter by Date"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 200 }}
            />
            {(filterEmployee || filterDate) && (
              <Button variant="outlined" onClick={() => { setFilterEmployee(''); setFilterDate(''); }}>
                Clear Filters
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: 'background.paper' }}>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee ID</TableCell>
                    <TableCell>Employee</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="textSecondary">
                          No attendance records found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendance.map((record) => {
                      const statusLabel = record.is_present ? 'Present' : 'Absent';
                      return (
                        <TableRow key={record.id} hover>
                          <TableCell>{record.employee_id}</TableCell>
                          <TableCell>{getEmployeeName(record.employee_id)}</TableCell>
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Mark Attendance</DialogTitle>
          <DialogContent>
            {formError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {formError}
              </Alert>
            )}
            <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
              <InputLabel>Employee</InputLabel>
              <Select
                name="employee_id"
                value={formData.employee_id}
                label="Employee"
                onChange={handleInputChange}
                required
              >
                {employees.map((emp) => (
                  <MenuItem key={emp.employee_id} value={emp.employee_id}>
                    {emp.full_name} - {emp.department} [{emp.employee_id}]
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="date"
              label="Date"
              type="date"
              fullWidth
              variant="outlined"
              value={formData.date}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              required
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="is_present"
                value={formData.is_present ? 'Present' : 'Absent'}
                label="Status"
                onChange={handleInputChange}
                required
              >
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: 'primary.main' }} disabled={submitting}>
              {submitting ? 'Saving...' : 'Mark Attendance'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

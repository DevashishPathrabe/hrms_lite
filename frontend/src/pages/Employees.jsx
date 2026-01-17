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
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { employeesAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeesAPI.getAll();
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setFormData({ employee_id: '', full_name: '', email: '', department: '' });
    setFormError(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ employee_id: '', full_name: '', email: '', department: '' });
    setFormError(null);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormError(null);
      setSubmitting(true);
      await employeesAPI.create(formData);
      handleCloseDialog();
      fetchEmployees();
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Failed to create employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (employeeId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this employee? This will also delete all attendance records.'
      )
    ) {
      try {
        await employeesAPI.delete(employeeId);
        fetchEmployees();
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to delete employee');
      }
    }
  };

  const handleViewAttendance = (employeeId) => {
    navigate(`/employees/${employeeId}/attendance`);
  };

  if (loading) {
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
          Employees
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ bgcolor: 'primary.main' }}
        >
          Add Employee
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card sx={{ bgcolor: 'background.paper' }}>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="textSecondary">
                        No employees found. Add your first employee!
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.employee_id} hover>
                      <TableCell>{employee.employee_id}</TableCell>
                      <TableCell>{employee.full_name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>
                        <Chip label={employee.department} size="small" sx={{ bgcolor: 'secondary.light' }} />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleViewAttendance(employee.employee_id)}
                          sx={{ color: 'primary.main' }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(employee.employee_id)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogContent>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              name="employee_id"
              label="Employee ID"
              fullWidth
              variant="outlined"
              value={formData.employee_id}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              autoFocus
              margin="dense"
              name="full_name"
              label="Full Name"
              fullWidth
              variant="outlined"
              value={formData.full_name}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="department"
              label="Department"
              fullWidth
              variant="outlined"
              value={formData.department}
              onChange={handleInputChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: 'primary.main' }} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

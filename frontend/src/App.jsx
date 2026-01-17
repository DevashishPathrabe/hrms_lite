import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import theme from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import EmployeeAttendance from './pages/EmployeeAttendance';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default', py: 3, boxSizing: 'border-box' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/employees/:id/attendance" element={<EmployeeAttendance />} />
            </Routes>
          </Box>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;

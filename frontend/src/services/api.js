const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function for API calls
const apiCall = async (endpoint, method = 'GET', data = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const token = getAuthToken();
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const responseData = await response.json();

    if (!response.ok) {
      if (response.status === 401 && responseData.message === 'Invalid token') {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
      }
      throw new Error(responseData.message || 'API Error');
    }

    return responseData;
  } catch (error) {
    throw error;
  }
};

// AUTH ENDPOINTS
export const authAPI = {
  signup: (userData) => apiCall('/auth/signup', 'POST', userData),
  login: (credentials) => apiCall('/auth/login', 'POST', credentials),
  getMe: () => apiCall('/auth/me', 'GET'),
  updateProfile: (profileData) => apiCall('/auth/profile', 'PUT', profileData),
};

// NOTES ENDPOINTS
export const notesAPI = {
  createNote: (noteData) => apiCall('/notes', 'POST', noteData),
  getPublicNotes: () => apiCall('/notes/public', 'GET'),
  getMyNotes: () => apiCall('/notes/my-notes', 'GET'),
  getNoteById: (id) => apiCall(`/notes/${id}`, 'GET'),
  updateNote: (id, noteData) => apiCall(`/notes/${id}`, 'PUT', noteData),
  deleteNote: (id) => apiCall(`/notes/${id}`, 'DELETE'),
  shareNote: (id, userId) => apiCall(`/notes/${id}/share`, 'POST', { userId }),
};

// ASSIGNMENTS ENDPOINTS
export const assignmentsAPI = {
  createAssignment: (assignmentData) => apiCall('/assignments', 'POST', assignmentData),
  getClassAssignments: () => apiCall('/assignments/class', 'GET'),
  getMyAssignments: () => apiCall('/assignments/my-assignments', 'GET'),
  getAssignmentById: (id) => apiCall(`/assignments/${id}`, 'GET'),
  updateAssignment: (id, assignmentData) => apiCall(`/assignments/${id}`, 'PUT', assignmentData),
  submitAssignment: (id, submissionUrl) => apiCall(`/assignments/${id}/submit`, 'PUT', { submissionUrl }),
  deleteAssignment: (id) => apiCall(`/assignments/${id}`, 'DELETE'),
  addComment: (id, text) => apiCall(`/assignments/${id}/comment`, 'POST', { text }),
};

// TASKS ENDPOINTS
export const tasksAPI = {
  createTask: (taskData) => apiCall('/tasks', 'POST', taskData),
  getAllTasks: () => apiCall('/tasks', 'GET'),
  getPendingTasks: () => apiCall('/tasks/pending', 'GET'),
  getCompletedTasks: () => apiCall('/tasks/completed', 'GET'),
  getTaskById: (id) => apiCall(`/tasks/${id}`, 'GET'),
  updateTask: (id, taskData) => apiCall(`/tasks/${id}`, 'PUT', taskData),
  markTaskComplete: (id) => apiCall(`/tasks/${id}/complete`, 'PUT'),
  addSubtask: (id, subtaskData) => apiCall(`/tasks/${id}/subtask`, 'POST', subtaskData),
  updateSubtask: (id, subtaskId, subtaskData) => apiCall(`/tasks/${id}/subtask/${subtaskId}`, 'PUT', subtaskData),
  deleteTask: (id) => apiCall(`/tasks/${id}`, 'DELETE'),
};

// EXPENSES ENDPOINTS
export const expensesAPI = {
  createExpense: (expenseData) => apiCall('/expenses', 'POST', expenseData),
  getAllExpenses: () => apiCall('/expenses', 'GET'),
  getExpenseById: (id) => apiCall(`/expenses/${id}`, 'GET'),
  updateExpense: (id, expenseData) => apiCall(`/expenses/${id}`, 'PUT', expenseData),
  deleteExpense: (id) => apiCall(`/expenses/${id}`, 'DELETE'),
  getExpenseSummary: () => apiCall('/expenses/summary', 'GET'),
};

// SUBJECTS ENDPOINTS
export const subjectsAPI = {
  createSubject: (subjectData) => apiCall('/subjects', 'POST', subjectData),
  getAllSubjects: () => apiCall('/subjects', 'GET'),
  getSubjectById: (id) => apiCall(`/subjects/${id}`, 'GET'),
  updateSubject: (id, subjectData) => apiCall(`/subjects/${id}`, 'PUT', subjectData),
  deleteSubject: (id) => apiCall(`/subjects/${id}`, 'DELETE'),
};

// TIMETABLE ENDPOINTS
export const timetableAPI = {
  saveTimetable: (timetableData) => apiCall('/timetable', 'POST', timetableData),
  getCompleteTimetable: () => apiCall('/timetable', 'GET'),
  getTimetableForDay: (day) => apiCall(`/timetable/${day}`, 'GET'),
  updateTimetable: (id, classData) => apiCall(`/timetable/${id}`, 'PUT', classData),
  deleteClass: (id, classIndex) => apiCall(`/timetable/${id}`, 'DELETE', { classIndex }),
};

export default {
  authAPI,
  notesAPI,
  assignmentsAPI,
  tasksAPI,
  expensesAPI,
  subjectsAPI,
  timetableAPI,
};

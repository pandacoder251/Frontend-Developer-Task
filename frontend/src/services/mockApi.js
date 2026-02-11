// Mock API Service using localStorage
// This simulates the backend API for demo purposes without MongoDB

const DELAY = 300; // Simulate network delay

// Utility to simulate async API calls
const simulateDelay = (data = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), DELAY);
  });
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get users from localStorage
const getUsers = () => {
  const users = localStorage.getItem('mock_users');
  return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem('mock_users', JSON.stringify(users));
};

// Get tasks from localStorage
const getTasks = () => {
  const tasks = localStorage.getItem('mock_tasks');
  return tasks ? JSON.parse(tasks) : [];
};

// Save tasks to localStorage
const saveTasks = (tasks) => {
  localStorage.setItem('mock_tasks', JSON.stringify(tasks));
};

// Get current user from localStorage
const getCurrentUser = () => {
  const user = localStorage.getItem('mock_currentUser');
  return user ? JSON.parse(user) : null;
};

// Set current user
const setCurrentUser = (user) => {
  localStorage.setItem('mock_currentUser', JSON.stringify(user));
};

// Clear current user
const clearCurrentUser = () => {
  localStorage.removeItem('mock_currentUser');
};

// Hash password (simple mock - in real app use bcrypt)
const hashPassword = (password) => {
  return btoa(password);
};

// Verify password
const verifyPassword = (password, hashed) => {
  return btoa(password) === hashed;
};

// AUTH API
export const mockAuthAPI = {
  signup: async (userData) => {
    const users = getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
      return simulateDelay({
        success: false,
        message: 'Email already registered'
      });
    }
    
    const newUser = {
      _id: generateId(),
      name: userData.name,
      email: userData.email,
      password: hashPassword(userData.password),
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    const { password, ...userWithoutPassword } = newUser;
    const token = generateId();
    
    localStorage.setItem('mock_token', token);
    setCurrentUser(userWithoutPassword);
    
    return simulateDelay({
      success: true,
      data: {
        token,
        user: userWithoutPassword
      }
    });
  },
  
  login: async (credentials) => {
    const users = getUsers();
    const user = users.find(u => u.email === credentials.email);
    
    if (!user || !verifyPassword(credentials.password, user.password)) {
      return simulateDelay({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    const { password, ...userWithoutPassword } = user;
    const token = generateId();
    
    localStorage.setItem('mock_token', token);
    setCurrentUser(userWithoutPassword);
    
    return simulateDelay({
      success: true,
      data: {
        token,
        user: userWithoutPassword
      }
    });
  },
  
  getMe: async () => {
    const user = getCurrentUser();
    
    if (!user) {
      return simulateDelay({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    return simulateDelay({
      success: true,
      data: user
    });
  },
  
  updateProfile: async (userData) => {
    const user = getCurrentUser();
    
    if (!user) {
      return simulateDelay({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    const updatedUser = { ...user, ...userData };
    setCurrentUser(updatedUser);
    
    // Also update in users array
    const users = getUsers();
    const userIndex = users.findIndex(u => u._id === user._id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...userData };
      saveUsers(users);
    }
    
    return simulateDelay({
      success: true,
      data: updatedUser
    });
  },
  
  changePassword: async (passwordData) => {
    const user = getCurrentUser();
    
    if (!user) {
      return simulateDelay({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u._id === user._id);
    
    if (userIndex !== -1) {
      if (!verifyPassword(passwordData.currentPassword, users[userIndex].password)) {
        return simulateDelay({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      
      users[userIndex].password = hashPassword(passwordData.newPassword);
      saveUsers(users);
    }
    
    return simulateDelay({
      success: true,
      message: 'Password changed successfully'
    });
  },
  
  deleteAccount: async () => {
    const user = getCurrentUser();
    
    if (!user) {
      return simulateDelay({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    // Remove user from users array
    const users = getUsers();
    const filteredUsers = users.filter(u => u._id !== user._id);
    saveUsers(filteredUsers);
    
    // Remove user's tasks
    const tasks = getTasks();
    const filteredTasks = tasks.filter(t => t.userId !== user._id);
    saveTasks(filteredTasks);
    
    clearCurrentUser();
    localStorage.removeItem('mock_token');
    
    return simulateDelay({
      success: true,
      message: 'Account deleted successfully'
    });
  },
  
  logout: async () => {
    clearCurrentUser();
    localStorage.removeItem('mock_token');
    
    return simulateDelay({
      success: true,
      message: 'Logged out successfully'
    });
  }
};

// TASK API
export const mockTaskAPI = {
  getAll: async (params = {}) => {
    let tasks = getTasks();
    const user = getCurrentUser();
    
    if (!user) {
      return simulateDelay({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    // Filter by user
    tasks = tasks.filter(t => t.userId === user._id);
    
    // Apply filters
    if (params.status && params.status !== 'all') {
      tasks = tasks.filter(t => t.status === params.status);
    }
    
    if (params.priority && params.priority !== 'all') {
      tasks = tasks.filter(t => t.priority === params.priority);
    }
    
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(searchLower) ||
        (t.description && t.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    if (params.sort) {
      switch (params.sort) {
        case 'newest':
          tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'oldest':
          tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case 'title':
          tasks.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'priority':
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
          break;
        default:
          break;
      }
    }
    
    return simulateDelay({
      success: true,
      data: {
        data: tasks,
        total: tasks.length
      }
    });
  },
  
  getOne: async (id) => {
    const tasks = getTasks();
    const user = getCurrentUser();
    const task = tasks.find(t => t._id === id && t.userId === user._id);
    
    if (!task) {
      return simulateDelay({
        success: false,
        message: 'Task not found'
      });
    }
    
    return simulateDelay({
      success: true,
      data: task
    });
  },
  
  create: async (taskData) => {
    const user = getCurrentUser();
    
    if (!user) {
      return simulateDelay({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    const tasks = getTasks();
    
    const newTask = {
      _id: generateId(),
      userId: user._id,
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks(tasks);
    
    return simulateDelay({
      success: true,
      data: newTask
    });
  },
  
  update: async (id, taskData) => {
    const tasks = getTasks();
    const user = getCurrentUser();
    const taskIndex = tasks.findIndex(t => t._id === id && t.userId === user._id);
    
    if (taskIndex === -1) {
      return simulateDelay({
        success: false,
        message: 'Task not found'
      });
    }
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...taskData,
      updatedAt: new Date().toISOString()
    };
    
    saveTasks(tasks);
    
    return simulateDelay({
      success: true,
      data: tasks[taskIndex]
    });
  },
  
  delete: async (id) => {
    const tasks = getTasks();
    const user = getCurrentUser();
    const taskIndex = tasks.findIndex(t => t._id === id && t.userId === user._id);
    
    if (taskIndex === -1) {
      return simulateDelay({
        success: false,
        message: 'Task not found'
      });
    }
    
    tasks.splice(taskIndex, 1);
    saveTasks(tasks);
    
    return simulateDelay({
      success: true,
      message: 'Task deleted successfully'
    });
  },
  
  getStats: async () => {
    const tasks = getTasks();
    const user = getCurrentUser();
    const userTasks = tasks.filter(t => t.userId === user._id);
    
    const stats = {
      total: userTasks.length,
      pending: userTasks.filter(t => t.status === 'pending').length,
      'in-progress': userTasks.filter(t => t.status === 'in-progress').length,
      completed: userTasks.filter(t => t.status === 'completed').length
    };
    
    return simulateDelay({
      success: true,
      data: stats
    });
  }
};

// Initialize with some sample data for demo
export const initializeMockData = () => {
  if (!localStorage.getItem('mock_initialized')) {
    // Add sample tasks for demo user
    const user = getCurrentUser();
    if (user) {
      const sampleTasks = [
        {
          _id: generateId(),
          userId: user._id,
          title: 'Welcome to Task Manager!',
          description: 'This is a sample task to get you started. You can edit or delete it.',
          status: 'pending',
          priority: 'high',
          dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: generateId(),
          userId: user._id,
          title: 'Try creating a new task',
          description: 'Click the "Add Task" button to create your own tasks.',
          status: 'in-progress',
          priority: 'medium',
          dueDate: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      const tasks = getTasks();
      tasks.push(...sampleTasks);
      saveTasks(tasks);
    }
    
    localStorage.setItem('mock_initialized', 'true');
  }
};

export default { mockAuthAPI, mockTaskAPI, initializeMockData };


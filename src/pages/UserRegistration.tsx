import React, { useState } from 'react';
import { UserService } from '../services/userService';
import { AppService } from '../services/appService';
import { RoleService } from '../services/roleService';

const UserRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    appId: '',
    roleId: ''
  });
  const [apps, setApps] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load apps and roles on component mount
  React.useEffect(() => {
    loadAppsAndRoles();
  }, []);

  const loadAppsAndRoles = async () => {
    try {
      const apps = await AppService.getAllApps();
      setApps(apps);
      console.log('Loaded apps:', apps);
    } catch (error) {
      console.error('Error loading apps:', error);
      setError('Error loading applications. Please try again.');
    }
  };

  const loadRolesForApp = async (appId: string) => {
    try {
      setError('');
      // Get roles from the API for this specific app
      const roles = await RoleService.getAllRoles();
      setRoles(roles);
    } catch (error) {
      console.error('Error loading roles for app:', error);
      setError('Error loading roles for this application.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If app is selected, load roles for that app
    if (name === 'appId' && value) {
      loadRolesForApp(value);
      // Reset role selection when app changes
      setFormData(prev => ({
        ...prev,
        roleId: ''
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (!formData.appId || !formData.roleId) {
      setError('Please select an app and role');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        apps: [{
          role: formData.roleId,
          app: formData.appId
        }]
      };

      // Create user using the service
      await UserService.createUser(userData);
      setSuccess('User created successfully! Verification code has been sent to your email.');
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        appId: '',
        roleId: ''
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error creating user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register New User
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create a new user account with access to specific applications
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
                         {success && (
               <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                 {success}
               </div>
             )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

                         <div>
               <label htmlFor="appId" className="block text-sm font-medium text-gray-700">
                 Application
               </label>
                               <select
                  id="appId"
                  name="appId"
                  required
                  value={formData.appId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select an application</option>
                  {apps.map(app => (
                    <option key={app._id} value={app._id}>
                      {app.name}
                    </option>
                  ))}
                </select>
             </div>

                         <div>
               <label htmlFor="roleId" className="block text-sm font-medium text-gray-700">
                 Role
               </label>
               <select
                 id="roleId"
                 name="roleId"
                 required
                 value={formData.roleId}
                 onChange={handleInputChange}
                 disabled={!formData.appId}
                 className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
               >
                 <option value="">
                   {formData.appId ? 'Select a role' : 'Select an application first'}
                 </option>
                 {roles.map(role => (
                   <option key={role._id} value={role._id}>
                     {role.name}
                   </option>
                 ))}
               </select>
               {!formData.appId && (
                 <p className="mt-1 text-sm text-gray-500">
                   Please select an application first to see available roles
                 </p>
               )}
             </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Creating User...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;

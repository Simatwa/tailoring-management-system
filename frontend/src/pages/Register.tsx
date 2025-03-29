import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { register, checkUsername } from '../api';
import { User, Mail, Phone, MapPin, Calendar, UserCheck, Lock, AlertTriangle } from 'lucide-react';
import type { RegisterFormData } from '../types';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'M',
    username: '',
    email: '',
    phone_number: '',
    location: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Check username availability when username field changes
    if (name === 'username' && value.length > 0) {
      checkUsernameAvailability(value);
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) return;
    
    setCheckingUsername(true);
    try {
      const response = await checkUsername(username);
      setUsernameAvailable(!response.detail);
    } catch (error) {
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameAvailable) {
      toast.error('Please choose a different username');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            👋 Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 flex items-center">
                  <UserCheck className="h-4 w-4 mr-1 text-gray-400" />
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 flex items-center">
                  <UserCheck className="h-4 w-4 mr-1 text-gray-400" />
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                id="date_of_birth"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 flex items-center">
                <User className="h-4 w-4 mr-1 text-gray-400" />
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 flex items-center">
                <User className="h-4 w-4 mr-1 text-gray-400" />
                Username
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  name="username"
                  id="username"
                  required
                  className={`block w-full px-3 py-2 border ${
                    usernameAvailable === true ? 'border-green-300' :
                    usernameAvailable === false ? 'border-red-300' :
                    'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  value={formData.username}
                  onChange={handleChange}
                />
                {checkingUsername && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
                  </div>
                )}
                {!checkingUsername && usernameAvailable !== null && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {usernameAvailable ? (
                      <UserCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {!checkingUsername && usernameAvailable === false && (
                <p className="mt-1 text-sm text-red-600">
                  Username is already taken
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center">
                <Mail className="h-4 w-4 mr-1 text-gray-400" />
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 flex items-center">
                <Phone className="h-4 w-4 mr-1 text-gray-400" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                id="phone_number"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 flex items-center">
                <Lock className="h-4 w-4 mr-1 text-gray-400" />
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || usernameAvailable === false}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
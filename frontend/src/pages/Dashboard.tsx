import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Trash2, Edit, Plus, X, Eye, User, Phone, Mail, MapPin, Ruler, Calendar, UserCheck, Package2, Clock, AlertTriangle } from 'lucide-react';
import { getProfile, getMeasurements, updateProfile, updateMeasurements, getOrders, createOrder, updateOrder, deleteOrder, getOrderDetails, getServicesOffered } from '../api';
import { useAuth } from '../components/AuthContext';
import type { UserMeasurements, ShallowUserOrderDetails, UserOrderDetails, NewOrderData, ServiceOffered } from '../types';

export const Dashboard: React.FC = () => {
  const { user, setUser } = useAuth();
  const [measurements, setMeasurements] = useState<UserMeasurements | null>(null);
  const [orders, setOrders] = useState<ShallowUserOrderDetails[]>([]);
  const [services, setServices] = useState<ServiceOffered[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<UserOrderDetails | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newOrder, setNewOrder] = useState<NewOrderData>({
    service_name: '',
    details: '',
    material_type: '',
    fabric_required: false,
    quantity: 1,
    urgency: 'Medium',
  });
  const [referenceImage, setReferenceImage] = useState<File | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileData, measurementsData, ordersData, servicesData] = await Promise.all([
          getProfile(),
          getMeasurements(),
          getOrders(),
          getServicesOffered(),
        ]);
        setUser(profileData);
        setMeasurements(measurementsData);
        setOrders(ordersData);
        setServices(servicesData);
      } catch (error: any) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedProfile = await updateProfile({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        location: user?.location || '',
      });
      setUser(updatedProfile);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error('Failed to update profile');
    }
  };

  const handleMeasurementsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!measurements) return;

    try {
      const updatedMeasurements = await updateMeasurements(measurements);
      setMeasurements(updatedMeasurements);
      toast.success('Measurements updated successfully');
    } catch (error: any) {
      toast.error('Failed to update measurements');
    }
  };

  const handleOrderCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderData = { ...newOrder };
      if (referenceImage) {
        orderData.reference_image = referenceImage;
      }
      const createdOrder = await createOrder(orderData);
      setOrders([createdOrder, ...orders]);
      setIsNewOrderModalOpen(false);
      setNewOrder({
        service_name: '',
        details: '',
        material_type: '',
        fabric_required: false,
        quantity: 1,
        urgency: 'Medium',
      });
      setReferenceImage(null);
      toast.success('Order created successfully');
    } catch (error: any) {
      toast.error('Failed to create order');
    }
  };

  const handleOrderUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const orderData = { ...newOrder };
      if (referenceImage) {
        orderData.reference_image = referenceImage;
      }
      const updatedOrder = await updateOrder(selectedOrder.id, orderData);
      setOrders(orders.map(order => order.id === updatedOrder.id ? updatedOrder : order));
      setIsEditOrderModalOpen(false);
      setSelectedOrder(null);
      setNewOrder({
        service_name: '',
        details: '',
        material_type: '',
        fabric_required: false,
        quantity: 1,
        urgency: 'Medium',
      });
      setReferenceImage(null);
      toast.success('Order updated successfully');
    } catch (error: any) {
      toast.error('Failed to update order');
    }
  };

  const handleOrderDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await deleteOrder(id);
      setOrders(orders.filter(order => order.id !== id));
      toast.success('Order deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete order');
    }
  };

  const handleViewOrderDetails = async (id: number) => {
    try {
      const orderDetails = await getOrderDetails(id);
      setSelectedOrder(orderDetails);
      setIsOrderDetailsModalOpen(true);
    } catch (error: any) {
      toast.error('Failed to load order details');
    }
  };

  const handleEditOrder = (order: ShallowUserOrderDetails) => {
    setSelectedOrder(order);
    setNewOrder({
      service_name: order.service_name,
      details: '',
      material_type: '',
      fabric_required: false,
      quantity: order.quantity,
      urgency: 'Medium',
    });
    setIsEditOrderModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6">
            {/* Orders Section */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <div className="md:flex md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                      <Package2 className="h-5 w-5 mr-2 text-indigo-600" />
                      Orders
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage your orders here
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <button
                      onClick={() => setIsNewOrderModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Order
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Charges
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {order.service_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.charges ? `Ksh ${order.charges.toLocaleString()}` : 'Pending'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleViewOrderDetails(order.id)}
                                  className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                                  title="View Details"
                                >
                                  <Eye className="h-5 w-5" />
                                </button>
                                {order.status === 'Pending' && (
                                  <>
                                    <button
                                      onClick={() => handleEditOrder(order)}
                                      className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                      title="Edit Order"
                                    >
                                      <Edit className="h-5 w-5" />
                                    </button>
                                    <button
                                      onClick={() => handleOrderDelete(order.id)}
                                      className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                      title="Delete Order"
                                    >
                                      <Trash2 className="h-5 w-5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Section */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                  <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                      <User className="h-5 w-5 mr-2 text-indigo-600" />
                      Profile
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Update your personal information
                    </p>
                  </div>
                  <div className="mt-5 md:mt-0 md:col-span-2">
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 flex items-center">
                            <UserCheck className="h-4 w-4 mr-1 text-gray-400" />
                            First name
                          </label>
                          <input
                            type="text"
                            name="first_name"
                            id="first_name"
                            value={user?.first_name || ''}
                            onChange={(e) => setUser(user ? { ...user, first_name: e.target.value } : null)}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 flex items-center">
                            <UserCheck className="h-4 w-4 mr-1 text-gray-400" />
                            Last name
                          </label>
                          <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            value={user?.last_name || ''}
                            onChange={(e) => setUser(user ? { ...user, last_name: e.target.value } : null)}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-4">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center">
                            <Mail className="h-4 w-4 mr-1 text-gray-400" />
                            Email address
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={user?.email || ''}
                            onChange={(e) => setUser(user ? { ...user, email: e.target.value } : null)}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 flex items-center">
                            <Phone className="h-4 w-4 mr-1 text-gray-400" />
                            Phone number
                          </label>
                          <input
                            type="tel"
                            name="phone_number"
                            id="phone_number"
                            value={user?.phone_number || ''}
                            onChange={(e) => setUser(user ? { ...user, phone_number: e.target.value } : null)}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>

                        <div className="col-span-6">
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700 flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            id="location"
                            value={user?.location || ''}
                            onChange={(e) => setUser(user ? { ...user, location: e.target.value } : null)}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Save Profile
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Measurements Section */}
            {measurements && (
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                        <Ruler className="h-5 w-5 mr-2 text-indigo-600" />
                        Measurements
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Update your body measurements for better fitting
                      </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <form onSubmit={handleMeasurementsUpdate} className="space-y-6">
                        <div className="grid grid-cols-6 gap-6">
                          {Object.entries(measurements).map(([key, value]) => {
                            if (key === 'date_created' || key === 'date_updated') return null;
                            if (key === 'hips' && user?.gender === 'M') return null;
                            
                            return (
                              <div key={key} className="col-span-6 sm:col-span-3">
                                <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">
                                  {key.replace('_', ' ')}
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                  <input
                                    type="number"
                                    step="0.1"
                                    name={key}
                                    id={key}
                                    value={value}
                                    onChange={(e) => setMeasurements({ ...measurements, [key]: parseFloat(e.target.value) })}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                                  />
                                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">cm</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div>
                          <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Save Measurements
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {isOrderDetailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => {
              setIsOrderDetailsModalOpen(false);
              setSelectedOrder(null);
            }}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => {
                    setIsOrderDetailsModalOpen(false);
                    setSelectedOrder(null);
                  }}
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div>
                <div className="mt-3 sm:mt-0 text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <Package2 className="h-5 w-5 mr-2 text-indigo-600" />
                    Order Details
                  </h3>

                  <div className="mt-4 space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <Package2 className="h-4 w-4 mr-1 text-gray-400" />
                        Service
                      </h4>
                      <p className="text-gray-500">{selectedOrder.service_name}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Details</h4>
                      <p className="text-gray-500">{selectedOrder.details}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Material Type</h4>
                      <p className="text-gray-500">{selectedOrder.material_type}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Quantity</h4>
                      <p className="text-gray-500">{selectedOrder.quantity}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        Urgency
                      </h4>
                      <p className="text-gray-500">{selectedOrder.urgency}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Status</h4>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Charges</h4>
                      <p className="text-gray-500">
                        {selectedOrder.charges ? `Ksh ${selectedOrder.charges.toLocaleString()}` : 'Pending'}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Charges Paid</h4>
                      <p className="text-gray-500">Ksh {selectedOrder.charges_paid.toLocaleString()}</p>
                    </div>

                    {selectedOrder.reference_image && (
                      <div>
                        <h4 className="font-medium text-gray-900">Reference Image</h4>
                        <img
                          src={selectedOrder.reference_image}
                          alt="Reference"
                          className="mt-2 w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        Created At
                      </h4>
                      <p className="text-gray-500">
                        {new Date(selectedOrder.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        Last Updated
                      </h4>
                      <p className="text-gray-500">
                        {new Date(selectedOrder.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ... rest of the existing modals ... */}
    </div>
  );
};
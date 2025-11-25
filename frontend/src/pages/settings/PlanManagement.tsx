import React, { useState } from 'react';
import {
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} from "@/redux/api/planApi";
import { Trash2, Mail, MessageSquare, Server, Smartphone } from 'lucide-react';
import PlanFormModal from './planFormModel';


// In your planApi.ts file, make sure you export the types:
export interface CreatePlanRequest {
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  description: string;
  features: string[];
  emailsPerMonth: number;
  smsPerMonth: number;
  smtpConfigs: number;
  androidGateways: number;
  isActive?: boolean;
}

export interface Plan {
  _id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  description: string;
  features: string[];
  emailsPerMonth: number;
  smsPerMonth: number;
  smtpConfigs: number;
  androidGateways: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
// Plan utilities
const planUtils = {
  // Check if a feature is unlimited
  isUnlimited: (value: number): boolean => value === -1,

  // Format usage display
  formatUsage: (value: number): string =>
    value === -1 ? 'Unlimited' : value.toLocaleString(),

  // Format price display
  formatPrice: (plan: Plan): string => {
    if (plan.price === 0) return 'Free';

    const formattedPrice = (plan.price / 100).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    return `₹${formattedPrice}/${plan.interval}`;
  },

  // Get plan by ID from cached data
  getPlanById: (plans: Plan[], id: string): Plan | undefined =>
    plans.find(plan => plan._id === id),

  // Sort plans by price
  sortByPrice: (plans: Plan[], ascending: boolean = true): Plan[] =>
    [...plans].sort((a, b) =>
      ascending ? a.price - b.price : b.price - a.price
    ),

  // Filter active plans
  getActivePlans: (plans: Plan[]): Plan[] =>
    plans.filter(plan => plan.isActive),
};

const PlanManagement: React.FC = () => {
  const { data, isLoading, error, refetch } = useGetPlansQuery(null);
  const [deletePlan] = useDeletePlanMutation();
  const [openForm, setOpenForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);


  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (planId: string) => {
    try {
      await deletePlan(planId).unwrap();
      setDeleteConfirm(null);
      refetch();
    } catch (error) {
      console.error('Failed to delete plan:', error);
      alert('Failed to delete plan. Please try again.');
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mx-6 mt-6">
      Error loading plans. Please try again later.
    </div>
  );

  const plans = data?.data || [];


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plan Management</h1>
          <p className="text-gray-600 mt-1">Manage your subscription plans and pricing</p>
        </div>
      </div>

      {/* Plan List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans?.map(plan => (
          <div
            key={plan._id}
            className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md ${!plan.isActive ? 'opacity-70' : ''
              }`}
          >
            {/* Plan Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="text-2xl font-bold text-yellow-600 mt-2">
                  {planUtils.formatPrice(plan)}
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${plan.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
                }`}>
                {plan.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">{plan.description}</p>

            {/* Usage Limits */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail size={16} className="text-blue-500" />
                  <span>Emails/month</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {planUtils.formatUsage(plan.emailsPerMonth)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <MessageSquare size={16} className="text-green-500" />
                  <span>SMS/month</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {planUtils.formatUsage(plan.smsPerMonth)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Server size={16} className="text-purple-500" />
                  <span>SMTP Configs</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {planUtils.formatUsage(plan.smtpConfigs)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Smartphone size={16} className="text-orange-500" />
                  <span>Android Gateways</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {planUtils.formatUsage(plan.androidGateways)}
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Features</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setEditingPlan(plan);
                  setOpenForm(true);
                }}
                className="flex-1 bg-blue-50 text-blue-700 px-3 py-2.5 rounded-lg font-medium hover:bg-blue-100 transition-colors text-sm flex items-center justify-center gap-2"
              >
                Edit
              </button>

              <button
                onClick={() => setDeleteConfirm(plan._id)}
                className="flex-1 bg-red-50 text-red-700 px-3 py-2.5 rounded-lg font-medium hover:bg-red-100 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Empty State */}
      {(!plans || plans.length === 0) && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No plans available</h3>
          <p className="text-gray-600 mb-6">There are no subscription plans configured yet.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Plan</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this plan? This action cannot be undone and will affect existing subscribers.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {openForm && (
        <PlanFormModal
          initialData={editingPlan}
          onClose={() => {
            setOpenForm(false);
            setEditingPlan(null);
          }}
          onSuccess={() => {
            setOpenForm(false);
            setEditingPlan(null);
            refetch();
          }}
        />
      )}

    </div>
  );
};

export default PlanManagement;
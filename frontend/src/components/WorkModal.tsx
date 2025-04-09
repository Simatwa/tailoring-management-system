import React from 'react';
import { X } from 'lucide-react';
import type { CompletedOrderDetail } from '../types';

interface WorkModalProps {
  work: CompletedOrderDetail | null;
  onClose: () => void;
}

export const WorkModal: React.FC<WorkModalProps> = ({ work, onClose }) => {
  if (!work) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div>
            <div className="mt-3 sm:mt-0 text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {work.service_name}
              </h3>
              
              <div className="mt-4">
                <img src={work.picture} alt={work.service_name} className="w-full h-64 object-cover rounded-lg" />
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Details</h4>
                  <p className="text-gray-500">{work.details}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Material Type</h4>
                  <p className="text-gray-500">{work.material_type}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Fabric Required</h4>
                  <p className="text-gray-500">{work.fabric_required ? 'Yes' : 'No'}</p>
                </div>

                {work.reference_image && (
                  <div>
                    <h4 className="font-medium text-gray-900">Reference Image</h4>
                    <img src={work.reference_image} alt="Reference" className="mt-2 w-full h-48 object-cover rounded-lg" />
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900">Charges</h4>
                  <p className="text-gray-500">Ksh {work.charges.toLocaleString()}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Completed On</h4>
                  <p className="text-gray-500">{new Date(work.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
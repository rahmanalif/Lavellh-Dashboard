import React, { useState } from "react";
import { X } from "lucide-react";

const SubscriptionConfig = () => {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Basic",
      price: "45",
      description: "Affordable entry to virtual EMDR therapy",
      sessions: "4 sessions/month",
      status: "Get Started",
    },
    {
      id: 2,
      name: "Standard",
      price: "45",
      description: "Affordable entry to virtual EMDR therapy",
      sessions: "4 sessions/month",
      status: "Get Started",
    },
    {
      id: 3,
      name: "Premium",
      price: "45",
      description: "Affordable entry to virtual EMDR therapy",
      sessions: "4 sessions/month",
      status: "Get Started",
    },
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);


  const handleEditClick = (plan) => {
    setCurrentPlan({ ...plan });
    setIsEditModalOpen(true);
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPlan({ ...currentPlan, [name]: value });
  };


  const handleConfirm = () => {
    setPlans(plans.map((p) => (p.id === currentPlan.id ? currentPlan : p)));
    setIsEditModalOpen(false);
  };

  return (
    <div className="p-10 bg-[#f8faf9]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Subscription Configuration
        </h1>
        <p className="text-gray-500">
          Manage your service Subscription and session durations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b">
              <h2 className="text-2xl font-medium text-gray-800">
                {plan.name}
              </h2>
            </div>
            <div className="p-6 flex-grow">
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold">£{plan.price}</span>
                <span className="text-gray-400 text-sm">/price</span>
              </div>
              <p className="text-teal-600 text-sm mb-6">{plan.description}</p>

              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <span className="text-teal-600">✓</span> {plan.sessions}
                </li>
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <span className="text-teal-600">✓</span> {plan.status}
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleEditClick(plan)}
              className="m-4 bg-[#1b4d3e] text-white py-3 rounded-xl font-medium hover:bg-teal-900 transition"
            >
              Edit
            </button>
          </div>
        ))}
      </div>


      {isEditModalOpen && currentPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-[#f4f9fc] w-full max-w-md rounded-3xl shadow-2xl relative overflow-hidden">

            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-0 right-0 bg-[#bc3414] p-3 rounded-bl-3xl text-white hover:bg-red-700 transition"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                Edit
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  name="price"
                  value={currentPlan.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-teal-500"
                />
                <input
                  type="text"
                  name="sessions"
                  value={currentPlan.sessions}
                  onChange={handleInputChange}
                  placeholder="Sessions"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-teal-500"
                />
                <input
                  type="text"
                  name="status"
                  value={currentPlan.status}
                  onChange={handleInputChange}
                  placeholder="Status Text"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-teal-500"
                />
                <input
                  type="text"
                  name="description"
                  value={currentPlan.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-teal-500"
                />
                <input
                  type="text"
                  placeholder="..."
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-teal-500"
                />
              </div>

              <button
                onClick={handleConfirm}
                className="w-full mt-8 bg-[#1b4d3e] text-white py-4 rounded-2xl font-bold text-lg hover:bg-teal-900 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionConfig;

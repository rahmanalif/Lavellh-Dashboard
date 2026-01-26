import React, { useState } from 'react';

const subscriptionData = [
  {
    id: 1,
    title: "Basic",
    count: 740,
    providers: [
      { id: 101, name: "Arafat Rahman", location: "Dhanmondi, Dhaka 1209", rating: 4.0, reviews: 120, price: 100, image: "https://images.pexels.com/photos/6195129/pexels-photo-6195129.jpeg" },
      { id: 102, name: "Arafat Rahman", location: "Dhanmondi, Dhaka 1209", rating: 4.0, reviews: 120, price: 100, image: "https://images.pexels.com/photos/6195129/pexels-photo-6195129.jpeg" },
    ]
  },
  {
    id: 2,
    title: "Standard",
    count: 6500,
    providers: [] 
  },
  {
    id: 3,
    title: "Premium",
    count: 740,
    providers: [] 
  }
];

const  SubOverview = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const handleViewAll = (category) => {
    setSelectedData(category);
    setIsOpen(true);
  };

  return (
    <div className="p-10 bg-gray-50  font-sans">
      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionData.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-xl mb-1">{item.title}</p>
              <h2 className="text-4xl font-bold text-[#1b4d3e]">{item.count}</h2>
            </div>
            <button 
              onClick={() => handleViewAll(item)}
              className="bg-[#1b4d3e] text-white px-6 py-2 rounded-2xl hover:bg-teal-900 transition-colors"
            >
              View All
            </button>
          </div>
        ))}
      </div>


      {isOpen && selectedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            
            {/* মডাল হেডার */}
            <div className="flex items-center p-6 border-b">
              <button 
                onClick={() => setIsOpen(false)}
                className="text-2xl mr-4 hover:bg-gray-100 p-2 rounded-full transition"
              >
                ←
              </button>
              <h1 className="text-2xl font-semibold text-gray-800">
                {selectedData.title} Subscription List
              </h1>
            </div>

            {/* মডাল কন্টেন্ট (লিস্ট) */}
            <div className="p-8 max-h-[70vh] overflow-y-auto bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {selectedData.providers.length > 0 ? (
                  selectedData.providers.map((provider) => (
                    <div key={provider.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                      {/* প্রোভাইডার ইমেজ */}
                      <div className="relative h-48">
                        <img 
                          src={provider.image} 
                          alt="Provider" 
                          className="w-full h-full object-cover"
                        />
                        <button className="absolute top-4 right-4 bg-white/90 text-gray-700 px-4 py-1 rounded-lg text-sm font-medium">
                          Edit
                        </button>
                      </div>

                      {/* প্রোভাইডার ডিটেইলস */}
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <img 
                            src="https://via.placeholder.com/40" 
                            className="w-12 h-12 rounded-full border-2 border-teal-500" 
                            alt="avatar"
                          />
                          <div>
                            <h3 className="font-bold text-lg text-gray-800 leading-tight">{provider.name}</h3>
                            <p className="text-sm text-gray-500">📍 {provider.location}</p>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                          I take care of every corner, deep cleaning every room with care, 
                          leaving your home fresh and perfectly tidy for you.
                        </p>

                        <div className="flex justify-between items-center pt-2">
                          <div className="flex items-center gap-1">
                            <span className="text-orange-400 text-xl">★★★★★</span>
                            <span className="font-bold text-gray-800 ml-1">{provider.rating.toFixed(2)}</span>
                            <span className="text-gray-400 text-sm">({provider.reviews})</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-black text-gray-900">From ${provider.price}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="col-span-2 text-center py-10 text-gray-500">No data found in this category.</p>
                )}
              </div>
            </div>

            {/* ক্লোজ করার জন্য নিচের অংশ */}
            <div className="p-4 border-t flex justify-end">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 text-gray-600 hover:text-red-500 font-medium"
                >
                  Close
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubOverview;
import React, { useState } from 'react';
import { Eye, Trash2, Search, ChevronLeft, ChevronRight, X, ArrowLeft, Camera } from 'lucide-react';

const EventManagerSection = () => {
  // --- States for Modal Flow ---
  const [activeModal, setActiveModal] = useState(null); // 'manager', 'eventList', 'eventDetail'
  const [selectedItem, setSelectedItem] = useState(null);

  // --- Dummy Data ---
const managers = Array.from({ length: 9 }, () => ({
  id: 1, 
  name: 'Rokey', 
  email: 'xeno@yandex.ru', 
  number: '(+33)7 35 5 46 14', 
  date: '16 Apr 2024',
  birthday: '10/3/2026', 
  address: 'South Dakota 83475', 
  occupation: 'Born', 
  refId: 'Born',
  bank: 'Asia Bank', 
  accNo: '29 Jun 2025', 
  accHolder: 'Rokey', 
  joining: '29 Jun 2025'
}));

  const events = Array.from({ length: 4 }, (_, i) => ({
    id: i, title: 'Happy New Year Fest', date: '30/12/2025', time: '11:00 PM', 
    sold: 200, price: '$50.00', place: 'St Stadium Jouers Preto, San Fransisco Florida, United States'
  }));

  const closeModals = () => { setActiveModal(null); setSelectedItem(null); };

  return (
    <div className="p-6 bg-[#f9fbf9] min-h-screen font-sans">
      {/* --- Main Table: Event manager --- */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Event manager</h2>
        <div className="relative flex items-center">
          <input type="text" placeholder="User Name" className="border rounded-full py-2 px-6 w-72 focus:outline-none shadow-sm" />
          <div className="absolute right-1 bg-[#1a4d3c] p-2.5 rounded-full text-white cursor-pointer"><Search size={18} /></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1a4d3c] text-white">
            <tr>
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Event manager</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Number</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {managers.map((m, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-600">{m.id}</td>
                <td className="p-4 text-gray-700">{m.name}</td>
                <td className="p-4 text-gray-600">{m.email}</td>
                <td className="p-4 text-gray-600">{m.number}</td>
                <td className="p-4 text-gray-600">{m.date}</td>
                <td className="p-4 flex justify-center gap-4">
                  <button onClick={() => { setSelectedItem(m); setActiveModal('manager'); }} className="text-gray-400 hover:text-emerald-600 transition-transform active:scale-90">
                    <Eye size={22} />
                  </button>
                  <button className="text-gray-400 hover:text-red-500"><Trash2 size={22} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="mt-8 flex justify-center items-center gap-2">
        <button className="flex items-center px-4 py-2 border rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={18} className="mr-1"/> Back</button>
        <button className="w-10 h-10 border rounded-lg text-gray-600">1</button>
        <span className="px-1 text-gray-400">...</span>
        <button className="w-10 h-10 bg-[#1a4d3c] text-white rounded-lg">12</button>
        <button className="w-10 h-10 border rounded-lg text-gray-600">13</button>
        <button className="w-10 h-10 border rounded-lg text-gray-600">14</button>
        <button className="flex items-center px-4 py-2 bg-[#1a4d3c] text-white rounded-lg hover:bg-emerald-900 shadow-md">Next <ChevronRight size={18} className="ml-1"/></button>
        <div className="ml-4 flex items-center gap-2 text-gray-500 text-sm">Page <input type="text" value="15" readOnly className="w-10 border rounded text-center py-1 bg-white" /> Go</div>
      </div>

      {/* --- 1st Modal: Event manager Details --- */}
      {activeModal === 'manager' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
            <div className="p-3 border-b flex justify-between items-center">
              <span className="flex-1 text-center font-bold text-gray-700">Event manager Details</span>
              <button onClick={closeModals} className="bg-[#c0392b] p-1.5 rounded-lg text-white hover:bg-red-700 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-0.5 border rounded-lg overflow-hidden mb-5">
                <DetailRow label="User name" value={selectedItem?.name} />
                <DetailRow label="Birthday" value={selectedItem?.birthday} />
                <DetailRow label="Email" value={selectedItem?.email} />
                <DetailRow label="Phone Number" value={selectedItem?.number} />
                <DetailRow label="Address" value={selectedItem?.address} />
                <DetailRow label="occupation" value={selectedItem?.occupation} />
                <DetailRow label="Reference Id" value={selectedItem?.refId} />
                <DetailRow label="Bank Name" value={selectedItem?.bank} />
                <DetailRow label="A/C number" value={selectedItem?.accNo} />
                <DetailRow label="A/C holder name" value={selectedItem?.accHolder} />
                <DetailRow label="Joining Date" value={selectedItem?.joining} />
              </div>
              
              <button onClick={() => setActiveModal('eventList')} className="w-full border-2 border-[#1a4d3c] text-[#1a4d3c] py-2.5 rounded-full hover:bg-emerald-50 font-bold transition-all mb-6">View All Event</button>
              
              <p className="text-gray-700 font-bold mb-3 text-sm">NID</p>
              <div className="grid grid-cols-2 gap-4">
                <NidBox label="ID Card Front" />
                <NidBox label="ID Card Back" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- 2nd Modal: Event List (Center Modal instead of Fullscreen) --- */}
      {activeModal === 'eventList' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl animate-in slide-in-from-bottom-4 overflow-hidden flex flex-col">
            <div className="p-5 flex justify-between items-center border-b sticky top-0 bg-white">
              <div className="flex items-center gap-4">
                <button onClick={() => setActiveModal('manager')} className="text-gray-500 hover:text-[#1a4d3c] transition-colors"><ArrowLeft size={24}/></button>
                <h3 className="text-xl font-bold text-gray-800">Event List</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input type="text" placeholder="User Name" className="border rounded-full px-4 py-1.5 text-sm focus:ring-1 focus:ring-emerald-500 outline-none w-48" />
                  <div className="absolute right-0 top-0 bg-[#1a4d3c] p-2 rounded-full text-white"><Search size={14}/></div>
                </div>
                <button onClick={closeModals} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8 custom-scrollbar">
              {events.map((ev, i) => (
                <div 
                    key={i} 
                    onClick={() => { setSelectedItem(ev); setActiveModal('eventDetail'); }}
                    className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=500" alt="event" className="w-full h-44 object-cover rounded-[1.5rem] mb-4" />
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-[10px] font-bold uppercase">Event Name</p>
                      <h4 className="text-lg font-bold text-gray-800">{ev.title}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4">
                      <div><p className="text-gray-400 text-[10px] font-bold">Date</p><p className="text-sm font-bold text-gray-700">{ev.date}</p></div>
                      <div><p className="text-gray-400 text-[10px] font-bold">Time</p><p className="text-sm font-bold text-gray-700">{ev.time}</p></div>
                      <div><p className="text-gray-400 text-[10px] font-bold">Tickets sold</p><p className="text-sm font-bold text-gray-700">{ev.sold}</p></div>
                      <div><p className="text-gray-400 text-[10px] font-bold">Ticket price</p><p className="text-sm font-bold text-gray-700">{ev.price}</p></div>
                    </div>
                    <div className="pt-3 border-t">
                      <p className="text-gray-400 text-[10px] font-bold">Place</p>
                      <p className="text-[12px] font-semibold text-gray-500 leading-snug">{ev.place}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- 3rd Modal: Event Details (From Event List) --- */}
      {activeModal === 'eventDetail' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[80] p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl animate-in zoom-in duration-150 overflow-hidden">
            <div className="p-3 bg-gray-50 flex justify-between items-center border-b">
              <span className="flex-1 text-center font-bold text-[#1a4d3c]">Event Details</span>
              <button onClick={() => setActiveModal('eventList')} className="bg-[#c0392b] text-white p-1 rounded hover:bg-red-700 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-1">
              <DetailRow label="Event Name" value={selectedItem?.title} />
              <DetailRow label="Date" value={selectedItem?.date} />
              <DetailRow label="Time" value={selectedItem?.time} />
              <DetailRow label="Price" value={selectedItem?.price} />
              <DetailRow label="Location" value="St Stadium, Florida" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-2.5 px-3 border-b border-gray-100 last:border-0 items-center">
    <span className="text-gray-500 font-medium text-[13px]">{label} :</span>
    <span className="text-gray-800 font-bold text-[13px]">{value}</span>
  </div>
);

const NidBox = ({ label }) => (
  <div className="text-center">
    <div className="h-28 bg-gray-200 rounded-xl mb-2 overflow-hidden border border-gray-100 shadow-inner">
        <img src="https://via.placeholder.com/200x120?text=ID+CARD" className="w-full h-full object-cover" alt="nid" />
    </div>
    <span className="text-[10px] text-gray-400 font-bold uppercase">{label}</span>
  </div>
);

export default EventManagerSection;
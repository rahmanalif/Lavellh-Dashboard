import React, { useEffect, useMemo, useState } from 'react';
import { Eye, Trash2, Search, ChevronLeft, ChevronRight, X, ArrowLeft } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEventManagers,
  fetchEventManagerById,
  toggleEventManagerStatus,
  deleteEventManager,
  selectEventManagers,
  selectEventManagersError,
  selectEventManagersStatus,
  selectEventManagersTotalPages,
  selectSelectedEventManager,
  selectSelectedEventManagerError,
  selectSelectedEventManagerStatus,
  selectToggleEventManagerStatus,
  selectToggleEventManagerError,
  selectDeleteEventManagerStatus,
  selectDeleteEventManagerError,
} from "@/store/eventManagersSlice";
import { selectAdminPermissions } from "@/store/adminAuthSlice";
import {
  fetchEventsByManager,
  selectManagerEvents,
  selectManagerEventsError,
  selectManagerEventsStatus,
  selectManagerEventsTotalPages,
} from "@/store/eventManagerEventsSlice";

const EventManagerSection = () => {
  // --- States for Modal Flow ---
  const [activeModal, setActiveModal] = useState(null); // 'manager', 'eventList', 'eventDetail'
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const dispatch = useDispatch();
  const managers = useSelector(selectEventManagers);
  const status = useSelector(selectEventManagersStatus);
  const error = useSelector(selectEventManagersError);
  const totalPages = useSelector(selectEventManagersTotalPages);
  const selectedManagerData = useSelector(selectSelectedEventManager);
  const selectedManagerStatus = useSelector(selectSelectedEventManagerStatus);
  const selectedManagerError = useSelector(selectSelectedEventManagerError);
  const toggleStatus = useSelector(selectToggleEventManagerStatus);
  const toggleError = useSelector(selectToggleEventManagerError);
  const deleteStatus = useSelector(selectDeleteEventManagerStatus);
  const deleteError = useSelector(selectDeleteEventManagerError);
  const permissions = useSelector(selectAdminPermissions);
  const canManageProviders = permissions?.canManageProviders ?? true;

  const [searchName, setSearchName] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const itemsPerPage = 9;

  const events = useSelector(selectManagerEvents);
  const eventsStatus = useSelector(selectManagerEventsStatus);
  const eventsError = useSelector(selectManagerEventsError);
  const eventsTotalPages = useSelector(selectManagerEventsTotalPages);

  const [eventPage, setEventPage] = useState(1);
  const [eventSearch, setEventSearch] = useState("");
  const [eventSearchActive, setEventSearchActive] = useState("");
  const [eventStatusFilter, setEventStatusFilter] = useState("");

  const closeModals = () => { setActiveModal(null); setSelectedManager(null); setSelectedEvent(null); };

  const handleToggleStatus = async () => {
    const id = selectedManagerData?._id || selectedManager?._id || selectedManager?.id;
    if (!id) return;
    try {
      await dispatch(toggleEventManagerStatus(id)).unwrap();
    } catch {
      // handled in slice
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      await dispatch(deleteEventManager(deleteDialog.id)).unwrap();
      setDeleteDialog({ open: false, id: null });
      if (
        selectedManager &&
        (selectedManager._id || selectedManager.id) === deleteDialog.id
      ) {
        closeModals();
      }
    } catch {
      // handled in slice
    }
  };

  useEffect(() => {
    dispatch(
      fetchEventManagers({
        page: currentPage,
        limit: itemsPerPage,
        search: activeSearch,
      })
    );
  }, [activeSearch, currentPage, dispatch]);

  const currentManagers = useMemo(() => managers, [managers]);

  const handleSearch = () => {
    setCurrentPage(1);
    setActiveSearch(searchName.trim());
  };

  useEffect(() => {
    if (activeModal !== "eventList") return;
    const managerId = selectedManager?._id || selectedManager?.id;
    if (!managerId) return;
    dispatch(
      fetchEventsByManager({
        managerId,
        page: eventPage,
        limit: 6,
        search: eventSearchActive,
        status: eventStatusFilter,
      })
    );
  }, [activeModal, dispatch, eventPage, eventSearchActive, eventStatusFilter, selectedManager]);

  return (
    <div className="p-6 bg-[#f9fbf9] min-h-screen font-sans">
      {/* --- Main Table: Event manager --- */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Event manager</h2>
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="User Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border rounded-full py-2 px-6 w-72 focus:outline-none shadow-sm"
          />
          <button
            className="absolute right-1 bg-[#1a4d3c] p-2.5 rounded-full text-white cursor-pointer"
            onClick={handleSearch}
          >
            <Search size={18} />
          </button>
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
            {status === "loading" && currentManagers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Loading event managers...
                </td>
              </tr>
            ) : currentManagers.length > 0 ? (
              currentManagers.map((m, idx) => {
                const user = m.userId || m.user || {};
                return (
                  <tr key={m._id || m.id || idx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-600">{m._id || m.id || "—"}</td>
                    <td className="p-4 text-gray-700">{user.fullName || m.fullName || "—"}</td>
                    <td className="p-4 text-gray-600">{user.email || m.email || "—"}</td>
                    <td className="p-4 text-gray-600">{user.phoneNumber || m.phoneNumber || "—"}</td>
                    <td className="p-4 text-gray-600">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : m.createdAt
                        ? new Date(m.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-4 flex justify-center gap-4">
                      <button
                        onClick={() => {
                          const id = m._id || m.id;
                          if (id) {
                            dispatch(fetchEventManagerById(id));
                          }
                          setSelectedManager(m);
                          setSelectedEvent(null);
                          setActiveModal('manager');
                        }}
                        className="text-gray-400 hover:text-emerald-600 transition-transform active:scale-90"
                      >
                        <Eye size={22} />
                      </button>
                      {canManageProviders && (
                        <button
                          className="text-gray-400 hover:text-red-500"
                          onClick={() =>
                            setDeleteDialog({ open: true, id: m._id || m.id })
                          }
                        >
                          <Trash2 size={22} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  {error || "No event managers found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="mt-8 flex justify-center items-center gap-2">
        <button
          className="flex items-center px-4 py-2 border rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={18} className="mr-1" /> Back
        </button>
        {[...Array(totalPages)].map((_, i) =>
          i + 1 === 1 ||
          i + 1 === totalPages ||
          (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1) ? (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-lg border font-medium ${
                currentPage === i + 1
                  ? "bg-[#1a4d3c] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ) : i + 1 === currentPage - 2 || i + 1 === currentPage + 2 ? (
            <span key={i} className="px-1 text-gray-400">
              ...
            </span>
          ) : null
        )}
        <button
          className="flex items-center px-4 py-2 bg-[#1a4d3c] text-white rounded-lg hover:bg-emerald-900 shadow-md"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next <ChevronRight size={18} className="ml-1" />
        </button>
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
                {selectedManagerStatus === "loading" && (
                  <DetailRow label="Loading" value="Please wait..." />
                )}
                {selectedManagerError && (
                  <DetailRow label="Error" value={selectedManagerError} />
                )}
                {toggleError && (
                  <DetailRow label="Status error" value={toggleError} />
                )}
                {deleteError && (
                  <DetailRow label="Delete error" value={deleteError} />
                )}
                {selectedManagerData && selectedManagerStatus === "succeeded" && (
                  <>
                    <DetailRow label="User name" value={selectedManagerData?.userId?.fullName || selectedManagerData?.fullName || "?"} />
                    <DetailRow label="Email" value={selectedManagerData?.userId?.email || selectedManagerData?.email || "?"} />
                    <DetailRow label="Phone Number" value={selectedManagerData?.userId?.phoneNumber || selectedManagerData?.phoneNumber || "?"} />
                    <DetailRow label="Address" value={selectedManagerData?.userId?.location?.address || "?"} />
                    <DetailRow label="Occupation" value={selectedManagerData?.occupation || "?"} />
                    <DetailRow label="Reference Id" value={selectedManagerData?.referenceId || "?"} />
                    <DetailRow label="Joining Date" value={selectedManagerData?.createdAt ? new Date(selectedManagerData.createdAt).toLocaleDateString() : "?"} />
                  </>
                )}
              </div>
              
              <button
                onClick={() => {
                  setEventPage(1);
                  setEventSearch("");
                  setEventSearchActive("");
                  setEventStatusFilter("");
                  setActiveModal('eventList');
                }}
                className="w-full border-2 border-[#1a4d3c] text-[#1a4d3c] py-2.5 rounded-full hover:bg-emerald-50 font-bold transition-all mb-4"
              >
                View All Event
              </button>

              {canManageProviders && (
                <>
                  <button
                    onClick={handleToggleStatus}
                    disabled={toggleStatus === "loading"}
                    className="w-full border-2 border-[#1a4d3c] text-[#1a4d3c] py-2.5 rounded-full hover:bg-emerald-50 font-bold transition-all mb-6 disabled:opacity-60"
                  >
                    {toggleStatus === "loading"
                      ? "Updating..."
                      : selectedManagerData?.userId?.isActive
                      ? "Block Event Manager"
                      : "Unblock Event Manager"}
                  </button>

                  <button
                    onClick={() =>
                      setDeleteDialog({
                        open: true,
                        id: selectedManagerData?._id || selectedManagerData?.id,
                      })
                    }
                    disabled={deleteStatus === "loading"}
                    className="w-full border-2 border-red-500 text-red-600 py-2.5 rounded-full hover:bg-red-50 font-bold transition-all mb-6 disabled:opacity-60"
                  >
                    {deleteStatus === "loading"
                      ? "Deleting..."
                      : "Delete Event Manager"}
                  </button>
                </>
              )}
              
              <p className="text-gray-700 font-bold mb-3 text-sm">NID</p>
              <div className="grid grid-cols-2 gap-4">
                <NidBox label="ID Card Front" image={selectedManagerData?.idCard?.frontImage} />
                <NidBox label="ID Card Back" image={selectedManagerData?.idCard?.backImage} />
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
                  <input
                    type="text"
                    placeholder="Event Name"
                    value={eventSearch}
                    onChange={(e) => setEventSearch(e.target.value)}
                    className="border rounded-full px-4 py-1.5 text-sm focus:ring-1 focus:ring-emerald-500 outline-none w-48"
                  />
                  <button
                    className="absolute right-0 top-0 bg-[#1a4d3c] p-2 rounded-full text-white"
                    onClick={() => {
                      setEventPage(1);
                      setEventSearchActive(eventSearch.trim());
                    }}
                  >
                    <Search size={14}/>
                  </button>
                </div>
                <select
                  className="border rounded-full px-3 py-1.5 text-sm"
                  value={eventStatusFilter}
                  onChange={(e) => {
                    setEventPage(1);
                    setEventStatusFilter(e.target.value);
                  }}
                >
                  <option value="">All</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
                <button onClick={closeModals} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8 custom-scrollbar">
              {eventsStatus === "loading" && events.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">
                  Loading events...
                </div>
              ) : events.length > 0 ? (
                events.map((ev, i) => (
                <div 
                    key={i} 
                    onClick={() => { setSelectedEvent(ev); setActiveModal('eventDetail'); }}
                    className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  <img src={ev.eventImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=500"} alt="event" className="w-full h-44 object-cover rounded-[1.5rem] mb-4" />
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-[10px] font-bold uppercase">Event Name</p>
                      <h4 className="text-lg font-bold text-gray-800">{ev.eventName || ev.title}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4">
                      <div><p className="text-gray-400 text-[10px] font-bold">Date</p><p className="text-sm font-bold text-gray-700">{ev.eventStartDateTime ? new Date(ev.eventStartDateTime).toLocaleDateString() : "—"}</p></div>
                      <div><p className="text-gray-400 text-[10px] font-bold">Time</p><p className="text-sm font-bold text-gray-700">{ev.eventStartDateTime ? new Date(ev.eventStartDateTime).toLocaleTimeString() : "—"}</p></div>
                      <div><p className="text-gray-400 text-[10px] font-bold">Tickets sold</p><p className="text-sm font-bold text-gray-700">{ev.ticketsSold ?? 0}</p></div>
                      <div><p className="text-gray-400 text-[10px] font-bold">Ticket price</p><p className="text-sm font-bold text-gray-700">{ev.ticketPrice ?? "—"}</p></div>
                    </div>
                    <div className="pt-3 border-t">
                      <p className="text-gray-400 text-[10px] font-bold">Place</p>
                      <p className="text-[12px] font-semibold text-gray-500 leading-snug">{ev.eventLocation || "—"}</p>
                    </div>
                    <div className="pt-2 text-xs font-semibold text-gray-500 uppercase">
                      {ev.status || "—"}
                    </div>
                  </div>
                </div>
              ))
              ) : (
                <div className="col-span-full text-center text-gray-500">
                  {eventsError || "No events found"}
                </div>
              )}
            </div>
            <div className="p-4 flex items-center justify-center gap-2 border-t">
              <button
                onClick={() => setEventPage((p) => Math.max(1, p - 1))}
                disabled={eventPage === 1}
                className={`flex items-center px-4 py-2 border rounded-lg bg-white ${
                  eventPage === 1
                    ? "text-gray-300"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft size={18} /> Back
              </button>
              {[...Array(eventsTotalPages)].map((_, i) =>
                i + 1 === 1 ||
                i + 1 === eventsTotalPages ||
                (i + 1 >= eventPage - 1 && i + 1 <= eventPage + 1) ? (
                  <button
                    key={i}
                    onClick={() => setEventPage(i + 1)}
                    className={`w-10 h-10 rounded-lg border font-medium ${
                      eventPage === i + 1
                        ? "bg-[#1a4d3c] text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ) : i + 1 === eventPage - 2 || i + 1 === eventPage + 2 ? (
                  <span key={i} className="px-1 text-gray-400">
                    ...
                  </span>
                ) : null
              )}
              <button
                onClick={() =>
                  setEventPage((p) => Math.min(eventsTotalPages, p + 1))
                }
                disabled={eventPage === eventsTotalPages}
                className="flex items-center px-4 py-2 bg-[#1a4d3c] text-white rounded-lg hover:bg-emerald-900 transition-colors"
              >
                Next <ChevronRight size={18} className="ml-1" />
              </button>
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
              <DetailRow label="Event Name" value={selectedEvent?.eventName || selectedEvent?.title} />
              <DetailRow label="Date" value={selectedEvent?.eventStartDateTime ? new Date(selectedEvent.eventStartDateTime).toLocaleDateString() : "—"} />
              <DetailRow label="Time" value={selectedEvent?.eventStartDateTime ? new Date(selectedEvent.eventStartDateTime).toLocaleTimeString() : "—"} />
              <DetailRow label="Price" value={selectedEvent?.ticketPrice ?? "—"} />
              <DetailRow label="Location" value={selectedEvent?.eventLocation || "—"} />
            </div>
          </div>
        </div>
      )}

      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, id: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete event manager?</AlertDialogTitle>
          </AlertDialogHeader>
          {deleteError && (
            <p className="text-sm text-red-500">{deleteError}</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteStatus === "loading"}
            >
              {deleteStatus === "loading" ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

const NidBox = ({ label, image }) => (
  <div className="text-center">
    <div className="h-28 bg-gray-200 rounded-xl mb-2 overflow-hidden border border-gray-100 shadow-inner">
      {image ? (
        <img src={image} className="w-full h-full object-cover" alt="nid" />
      ) : (
        <img
          src="https://via.placeholder.com/200x120?text=ID+CARD"
          className="w-full h-full object-cover"
          alt="nid"
        />
      )}
    </div>
    <span className="text-[10px] text-gray-400 font-bold uppercase">{label}</span>
  </div>
);

export default EventManagerSection;

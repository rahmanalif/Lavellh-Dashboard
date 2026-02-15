const ReviewModerationTabs = ({ allowedTabs, activeTab, onChange }) => (
  <div className="inline-flex h-9 items-center rounded-lg bg-gray-100 p-1">
    {allowedTabs.includes("providers") && (
      <button
        type="button"
        onClick={() => onChange("providers")}
        className={`rounded-md px-3 py-1 text-sm ${
          activeTab === "providers" ? "bg-white shadow-sm" : "text-gray-600"
        }`}
      >
        Providers
      </button>
    )}
    {allowedTabs.includes("businesses") && (
      <button
        type="button"
        onClick={() => onChange("businesses")}
        className={`rounded-md px-3 py-1 text-sm ${
          activeTab === "businesses" ? "bg-white shadow-sm" : "text-gray-600"
        }`}
      >
        Businesses
      </button>
    )}
  </div>
);

export default ReviewModerationTabs;

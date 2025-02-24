const { useState, useEffect } = React;

// A simple MapView component using Leaflet to render location markers.
const MapView = ({ locations }) => {
  useEffect(() => {
    // If there is an existing map, remove it before creating a new one.
    if (window._leafletMap) {
      window._leafletMap.remove();
    }
    if (locations && locations.length > 0) {
      // Use the first location with coordinates to center the map.
      const first = locations.find((loc) => loc.coords);
      if (first && first.coords) {
        const map = L.map("map").setView(
          [first.coords.lat, first.coords.lon],
          5
        );
        window._leafletMap = map; // save globally for cleanup

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        // Add markers for each location with coordinates.
        locations.forEach((loc) => {
          if (loc.coords) {
            L.marker([loc.coords.lat, loc.coords.lon])
              .addTo(map)
              .bindPopup(`<strong>${loc.name}</strong>`);
          }
        });
      }
    }
    return () => {
      if (window._leafletMap) {
        window._leafletMap.remove();
        window._leafletMap = null;
      }
    };
  }, [locations]);

  return <div id="map" style={{ height: "400px" }} />;
};

// Collapsible list card for themes, entities, etc.
const ListCard = ({ title, items, type = "simple" }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedItems = showAll ? items : items.slice(0, 10);

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="font-semibold text-gray-700 mb-2">{title}</h3>
      <div className="space-y-2">
        {displayedItems.map((item, idx) => {
          if (type === "simple") {
            return (
              <div key={idx} className="text-gray-700">
                {item}
              </div>
            );
          } else if (type === "enhanced") {
            return (
              <div
                key={idx}
                className="flex justify-between text-gray-700 border-b pb-1"
              >
                <span>{item.name || item.theme || item.quote}</span>
                <span className="text-gray-500">Offset: {item.offset}</span>
              </div>
            );
          }
        })}
      </div>
      {items.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-500 text-sm mt-2"
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

// Quotation Card component for displaying quotes in the metadata section
const QuotationCard = ({ quotations }) => {
  if (!quotations || quotations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="font-semibold text-gray-700 mb-2">Key Quotations</h3>
      <div className="space-y-3">
        {quotations.map((quote, idx) => (
          <div key={idx} className="text-gray-700 italic border-l-4 border-gray-300 pl-4 py-1">
            "{quote}"
          </div>
        ))}
      </div>
    </div>
  );
};

// Tone Analysis component using a standardized scale.
const ToneAnalysis = ({ tone }) => {
  if (!tone) {
    return (
      <div className="bg-white p-4 rounded-lg shadow mb-4 text-gray-700">
        No tone data available for this version.
      </div>
    );
  }
  // Render a gradient bar with a marker.
  const renderBar = (value) => {
    const clamped = Math.max(Math.min(value, 10), -10);
    const normalized = ((clamped + 10) / 20) * 100;
    return (
      <div className="relative h-2 bg-gradient-to-r from-red-500 via-gray-200 to-blue-500 rounded">
        <div
          className="absolute"
          style={{
            left: normalized + "%",
            transform: "translateX(-50%)",
          }}
        >
          ▲
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="font-semibold text-gray-700 mb-4">Tone Analysis</h3>
      <p className="text-sm text-gray-600 mb-4">
        Metrics are scaled from -10 (negative) to +10 (positive). Higher
        polarity indicates more emotional intensity.
      </p>
      {Object.entries(tone).map(([key, value]) => {
        if (key === "wordCount") {
          return (
            <div key={key} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{key}</span>
                <span className="text-gray-800">{value}</span>
              </div>
            </div>
          );
        }
        return (
          <div key={key} className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">{key}</span>
              <span className="text-gray-800">{value.toFixed(2)}</span>
            </div>
            {renderBar(value)}
          </div>
        );
      })}
    </div>
  );
};

const GdeltRecordViewer = () => {
  const [records, setRecords] = useState({});
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeTab, setActiveTab] = useState("metadata");
  const [activeVersion, setActiveVersion] = useState("v1");
  const [searchTerm, setSearchTerm] = useState("");

  // Load records from the JSON file.
  useEffect(() => {
    fetch("/data/gdelt-gkg.json")
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);
        // Set first record as default.
        const firstKey = Object.keys(data)[0];
        setSelectedRecord(firstKey);
      })
      .catch((err) => console.error("Failed to load records:", err));
  }, []);

  const versionTooltips = {
    v1: "Basic record data",
    v2: "Enhanced data with offsets",
    v2_1: "Includes quotations and additional metadata",
  };

  // Filter records based on search term (matching source or date).
  const filteredRecordKeys = Object.keys(records).filter((id) => {
    const rec = records[id];
    const source = rec.metadata.sourceCommonName.toLowerCase();
    const date = rec.metadata.date;
    return (
      source.includes(searchTerm.toLowerCase()) || date.includes(searchTerm)
    );
  });

  // Render metadata as a grid table.
  const renderMetadataGrid = (metadata) => (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(metadata).map(([key, value]) => {
          if (key === "quotations") return null; // Skip quotations, we'll render them separately
          
          return (
            <div key={key} className="text-gray-700">
              <span className="font-semibold">{key}:</span>{" "}
              {key === "documentIdentifier" ? (
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {value}
                </a>
              ) : (
                <span>{value}</span>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Render the quotations separately if they exist */}
      {metadata.quotations && <QuotationCard quotations={metadata.quotations} />}
    </div>
  );

  // Render content based on the active tab.
  const renderContent = () => {
    if (!selectedRecord) return <p>Loading record...</p>;
    const record = records[selectedRecord];
    const versionData = record[activeVersion];

    switch (activeTab) {
      case "metadata":
        return renderMetadataGrid(record.metadata);
      case "themes":
        if (activeVersion === "v1") {
          return (
            <div className="flex flex-wrap gap-2">
              {versionData.themes.map((theme, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 px-2 py-1 rounded text-gray-700 cursor-pointer"
                >
                  #{theme}
                </span>
              ))}
            </div>
          );
        } else if (activeVersion === "v2") {
          return (
            <div className="flex flex-wrap gap-2">
              {versionData.enhancedThemes.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 px-2 py-1 rounded text-gray-700 cursor-pointer"
                >
                  #{item.theme} (Offset: {item.offset})
                </span>
              ))}
            </div>
          );
        } else {
          // Fallback to v1 themes.
          return (
            <div className="flex flex-wrap gap-2">
              {record.v1.themes.map((theme, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 px-2 py-1 rounded text-gray-700 cursor-pointer"
                >
                  #{theme}
                </span>
              ))}
            </div>
          );
        }
      case "entities":
        if (activeVersion === "v1") {
          return (
            <>
              <ListCard title="Persons" items={versionData.persons} />
              <ListCard
                title="Organizations"
                items={versionData.organizations}
              />
            </>
          );
        } else if (activeVersion === "v2") {
          return (
            <>
              <ListCard
                title="Enhanced Persons"
                items={versionData.enhancedPersons}
                type="enhanced"
              />
              <ListCard
                title="Enhanced Organizations"
                items={versionData.enhancedOrganizations}
                type="enhanced"
              />
            </>
          );
        } else if (activeVersion === "v2_1") {
          return (
            <>
              <ListCard
                title="Quotations"
                items={versionData.quotations}
                type="enhanced"
              />
              <ListCard title="All Names" items={versionData.allNames} />
              <ListCard
                title="Amounts"
                items={versionData.amounts}
                type="enhanced"
              />
            </>
          );
        }
      case "tone":
        return <ToneAnalysis tone={versionData.tone} />;
      case "map":
        // Use locations from v1 if available.
        return record.v1.locations ? (
          <MapView locations={record.v1.locations} />
        ) : (
          <p className="text-gray-700">No location data available.</p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg">
        {/* Left Sidebar: Record List & Search */}
        <div
          className="w-full md:w-64 p-4 bg-gray-50 border-r overflow-y-auto"
          style={{ maxHeight: "80vh" }}
        >
          <h2 className="font-bold text-gray-700 mb-4">Records</h2>
          <input
            type="text"
            placeholder="Search by source or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded mb-4 text-gray-700"
          />
          {filteredRecordKeys.map((id) => {
            const rec = records[id];
            const primaryLocation =
              rec.v1.locations && rec.v1.locations.length > 0
                ? rec.v1.locations[0].name
                : "No location";
            return (
              <div
                key={id}
                onClick={() => {
                  setSelectedRecord(id);
                  setActiveTab("metadata");
                }}
                className={`cursor-pointer p-2 mb-2 rounded ${
                  selectedRecord === id
                    ? "bg-blue-100 border-l-4 border-blue-500"
                    : "hover:bg-gray-100"
                }`}
              >
                <h3 className="font-semibold text-gray-800">
                  {rec.metadata.sourceCommonName}
                </h3>
                <p className="text-sm text-gray-600">{rec.metadata.date}</p>
                <p className="text-xs text-gray-500">
                  Location: {primaryLocation}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <div className="sticky-tabs border-b mb-4">
            {["metadata", "themes", "entities", "tone", "map"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<GdeltRecordViewer />, document.getElementById("root"));
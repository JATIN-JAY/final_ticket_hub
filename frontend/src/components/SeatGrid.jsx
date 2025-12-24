import { useState, useEffect } from "react";

const SeatGrid = ({
  seatMap,
  rows,
  columns,
  onSeatSelect,
  selectedSeats = [],
  sections = [],
}) => {
  const [localSelectedSeats, setLocalSelectedSeats] = useState(selectedSeats);

  useEffect(() => {
    setLocalSelectedSeats(selectedSeats);
  }, [selectedSeats]);

  const getSeatId = (rowIndex, colIndex) => {
    const rowLetter = String.fromCharCode(65 + rowIndex); // A, B, C...
    const seatNumber = colIndex + 1;
    return `${rowLetter}${seatNumber}`;
  };

  const getSeatStatus = (rowIndex, colIndex) => {
    const seatId = getSeatId(rowIndex, colIndex);
    if (localSelectedSeats.includes(seatId)) return "selected";
    return seatMap[rowIndex][colIndex];
  };

  const getSeatSection = (rowIndex, colIndex) => {
    const seatValue = seatMap[rowIndex][colIndex];
    return sections.find((s) => s.id === seatValue);
  };

  const handleSeatClick = (rowIndex, colIndex) => {
    const seatId = getSeatId(rowIndex, colIndex);
    const seatStatus = seatMap[rowIndex][colIndex];

    // Don't allow clicking booked, null, or stage seats
    if (
      seatStatus === "booked" ||
      seatStatus === null ||
      seatStatus === "stage"
    )
      return;

    let newSelectedSeats;
    if (localSelectedSeats.includes(seatId)) {
      // Deselect seat
      newSelectedSeats = localSelectedSeats.filter((id) => id !== seatId);
    } else {
      // Select seat
      newSelectedSeats = [...localSelectedSeats, seatId];
    }

    setLocalSelectedSeats(newSelectedSeats);
    onSeatSelect(newSelectedSeats);
  };

  const getSeatClass = (status, section) => {
    const baseClass =
      "w-10 h-10 m-1 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200 font-semibold text-xs";

    if (status === "stage") {
      return `${baseClass} bg-stone-100 text-stone-600 cursor-not-allowed border border-stone-200`;
    }

    if (status === null) {
      return "w-10 h-10 m-1"; // Empty space
    }

    switch (status) {
      case "available":
        if (section) {
          return `${baseClass} text-white hover:opacity-80 border border-opacity-50`;
        }
        return `${baseClass} bg-white text-stone-900 hover:bg-stone-100 border-2 border-stone-300 hover:border-stone-900`;
      case "booked":
        return `${baseClass} bg-stone-200 text-stone-500 cursor-not-allowed border border-stone-300 opacity-60`;
      case "selected":
        return `${baseClass} bg-stone-900 text-white border-2 border-stone-900 scale-105 shadow-md`;
      default:
        if (section) {
          return `${baseClass} text-white hover:opacity-80 border border-opacity-50`;
        }
        return baseClass;
    }
  };

  return (
    <div className="w-full overflow-auto">
      {/* Screen indicator */}
      <div className="mb-8">
        <div className="bg-stone-100 text-stone-900 text-center py-3 rounded-lg border border-stone-200">
          <span className="text-sm font-bold tracking-wider">
            SCREEN / STAGE
          </span>
        </div>
        <div className="h-1 bg-stone-900 mt-2 rounded-full"></div>
      </div>

      {/* Seat grid */}
      <div className="flex justify-center overflow-x-auto pb-4">
        <div className="inline-block">
          {seatMap.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center">
              {/* Row label */}
              <div className="w-8 text-center font-bold text-stone-600 text-sm">
                {String.fromCharCode(65 + rowIndex)}
              </div>

              {/* Seats */}
              <div className="flex">
                {row.map((seat, colIndex) => {
                  const status = getSeatStatus(rowIndex, colIndex);
                  const seatId = getSeatId(rowIndex, colIndex);
                  const section = getSeatSection(rowIndex, colIndex);

                  if (seat === null) {
                    return <div key={colIndex} className="w-10 h-10 m-1"></div>;
                  }

                  if (seat === "stage") {
                    return (
                      <div
                        key={colIndex}
                        className={getSeatClass("stage")}
                        title="Stage"
                      >
                        <span>🎭</span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={colIndex}
                      className={getSeatClass(status, section)}
                      style={
                        section && status !== "selected"
                          ? { backgroundColor: section.color }
                          : {}
                      }
                      onClick={() => handleSeatClick(rowIndex, colIndex)}
                      title={`Seat ${seatId} - ${
                        section ? `${section.name} ($${section.price})` : status
                      }`}
                    >
                      <span>{colIndex + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {sections && sections.length > 0 ? (
          <>
            {sections.map((section) => (
              <div
                key={section.id}
                className="flex items-center space-x-2 bg-stone-100 px-3 py-2 rounded-lg border border-stone-200"
              >
                <div
                  className="w-5 h-5 rounded"
                  style={{ backgroundColor: section.color }}
                ></div>
                <span className="text-sm font-medium text-stone-900">
                  {section.name} (₹{section.price})
                </span>
              </div>
            ))}
            <div className="flex items-center space-x-2 bg-stone-100 px-3 py-2 rounded-lg border border-stone-200">
              <div className="w-5 h-5 bg-stone-900 rounded"></div>
              <span className="text-sm font-medium text-stone-900">
                Selected
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-stone-100 px-3 py-2 rounded-lg border border-stone-200">
              <div className="w-5 h-5 bg-stone-200 rounded opacity-60"></div>
              <span className="text-sm font-medium text-stone-900">Booked</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-2 bg-stone-100 px-3 py-2 rounded-lg border border-stone-200">
              <div className="w-5 h-5 bg-white border-2 border-stone-300 rounded"></div>
              <span className="text-sm font-medium text-stone-900">
                Available
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-stone-100 px-3 py-2 rounded-lg border border-stone-200">
              <div className="w-5 h-5 bg-stone-900 rounded"></div>
              <span className="text-sm font-medium text-stone-900">
                Selected
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-stone-100 px-3 py-2 rounded-lg border border-stone-200">
              <div className="w-5 h-5 bg-stone-200 rounded opacity-60"></div>
              <span className="text-sm font-medium text-stone-900">Booked</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SeatGrid;

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface MyDatePickerProps {
  completedOn: Date | null;
}

const MyDatePicker: React.FC<MyDatePickerProps> = ({ completedOn }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(completedOn);

  /*************  ✨ Codeium Command ⭐  *************/
  /**
 * Updates the selected date state with the provided date.
 * 

/******  0be76657-bfbb-4533-86de-5687f1c9db18  *******/
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date ? date : null);
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      console.log("Formatted Date:", formattedDate);
    }

    console.log("completed on changed date", date);
  };

  useEffect(() => {
    setSelectedDate(completedOn);
  }, [completedOn]);

  return (
    <div className="childc">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        showYearDropdown
        yearDropdownItemNumber={100}
      />
    </div>
  );
};

export default MyDatePicker;

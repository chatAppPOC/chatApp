import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface MyDatePickerProps {
  completedOn: Date | null;
  startedDt: Date | null;
  onChange: (selectedDate: Date | null) => void;
}

const MyDatePicker: React.FC<MyDatePickerProps> = ({
  completedOn,
  startedDt,
  onChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(startedDt);
  const [selectedCompltedDate, setSelectedCompletedDate] =
    useState<Date | null>(completedOn);
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedCompletedDate(date);
    onChange(date);
  };

  useEffect(() => {
    setSelectedDate(startedDt);
    setSelectedCompletedDate(completedOn);
  }, [startedDt, completedOn]);

  return (
    <div className="childc">
      <DatePicker
        selected={selectedDate ? selectedDate : completedOn}
        onChange={handleDateChange}
        showYearDropdown
        yearDropdownItemNumber={100}
      />
    </div>
  );
};

export default MyDatePicker;

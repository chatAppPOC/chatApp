import { s } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
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
    if (!date || !startedDt || date !== null || date > startedDt) {
      setSelectedDate(date);
      onChange(date);
      setSelectedCompletedDate(date);
    }
    onChange(date);
  };

  useEffect(() => {
    if (!startedDt || completedOn !== null || completedOn > startedDt) {
      setSelectedDate(startedDt);
      setSelectedCompletedDate(completedOn);
    }
  }, [startedDt, completedOn]);

  return (
    <>
      <div className="childs datePicker">
        <DatePicker
          selected={startedDt ? startedDt : completedOn}
          // selected={
          //   selectedCompltedDate !== null
          //     ? selectedCompltedDate && selectedDate
          //     : null
          // }
          onChange={handleDateChange}
          showYearDropdown
          yearDropdownItemNumber={100}
        />
      </div>
    </>
  );
};

export default MyDatePicker;

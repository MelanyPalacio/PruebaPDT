import { TextField } from "@mui/material";
import React from "react";

const PassengerSelector = ({ value, onChange }) => {
  const handleInputChange = (event) => {
    const newValue = Math.min(Math.max(Number(event.target.value), 1), 9);
    onChange({ ...value, adults: newValue });
  };

  return (
    <TextField
      fullWidth
      label="Número de Adultos"
      type="number"
      inputProps={{ min: 1, max: 9 }}
      value={value.adults}
      onChange={handleInputChange}
    />
  );
};

export default PassengerSelector;

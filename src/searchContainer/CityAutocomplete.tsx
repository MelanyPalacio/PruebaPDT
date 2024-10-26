import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Autocomplete, 
  Box, 
  Typography, 
  CircularProgress 
} from '@mui/material';

const CityAutocomplete = ({ 
  label, 
  value, 
  onChange,
  icon: Icon,
  placeholder = "Buscar ciudad..."
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCities = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://staging.travelflight.aiop.com.co/api/airports/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: searchTerm }),
      });

      if (!response.ok) {
        throw new Error('Error al buscar ciudades');
      }

      const data = await response.json();
      // Adaptamos el formato de respuesta de acuerdo a la estructura recibida
      const cities = data.cities.map((city) => ({
        label: city.nameCity,
        country: city.new_country?.nameCountry || "Desconocido",
        code: city.codeIataCity,
        timezone: city.timezone,
      }));
      
      setOptions(cities);
    } catch (error) {
      console.error('Error:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCities(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, value) => option.code === value?.code}
      getOptionLabel={(option) => option.label || ''}
      options={options}
      loading={loading}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                {Icon && <Icon sx={{ mr: 1, color: 'action.active' }} />}
                {params.InputProps.startAdornment}
              </>
            ),
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          fullWidth
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Box>
            <Typography variant="body1">
              {option.label} ({option.code})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {option.country}
            </Typography>
          </Box>
        </Box>
      )}
      noOptionsText="No se encontraron ciudades"
      loadingText="Buscando..."
    />
  );
};

export default CityAutocomplete;

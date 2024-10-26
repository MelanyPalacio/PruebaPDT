import React, { useState } from 'react';
import { 
  Paper, 
  Button, 
  Grid, 
  Typography, 
  Container, 
  Box,
} from '@mui/material';
import { 
  FlightTakeoff as FlightTakeoffIcon,
  FlightLand as FlightLandIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {es} from 'date-fns/locale/es';  
import CityAutocomplete from './CityAutocomplete';
import PassengerSelector from './PassengerSelector';

const FlightSearchForm = () => {
  const [searchData, setSearchData] = useState({
    origin: null,
    destination: null,
    date: new Date(),
    passengers: {
      adults: 1,
      children: 0,
      infants: 0
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos de búsqueda:', searchData);
  };

  const handleDateChange = (date) => {
    console.log(date)
    if(date)
      setSearchData({ ...searchData, date: date })
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Búsqueda de Vuelos
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <CityAutocomplete
                  label="Ciudad de Origen"
                  value={searchData.origin}
                  onChange={(newValue) => setSearchData({ ...searchData, origin: newValue })}
                  icon={FlightTakeoffIcon}
                  placeholder="¿Desde dónde viajas?"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CityAutocomplete
                  label="Ciudad de Destino"
                  value={searchData.destination}
                  onChange={(newValue) => setSearchData({ ...searchData, destination: newValue })}
                  icon={FlightLandIcon}
                  placeholder="¿A dónde viajas?"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Fecha del Vuelo"
                  value={searchData.date}
                  minDate={new Date()}
                  onChange={(date) => handleDateChange(date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <PassengerSelector
                  value={searchData.passengers}
                  onChange={(passengers) => setSearchData({ ...searchData, passengers })}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    type="submit"
                    sx={{ mt: 2 }}
                  >
                    Buscar Vuelos
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default FlightSearchForm;
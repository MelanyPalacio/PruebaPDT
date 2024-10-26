import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Grid, 
  Typography, 
  Box, 
  Divider,
  CircularProgress, 
  Button,
  Modal
} from '@mui/material';
import { 
  FlightTakeoff as FlightTakeoffIcon, 
  FlightLand as FlightLandIcon 
} from '@mui/icons-material';

const FlightList = ({ searchData }) => {
    console.log({searchData})
    const [flights, setFlights] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [openReceipt, setOpenReceipt] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState(null);

  const fetchFlights = async () => {
    setLoading(true);

    try {
      const response = await fetch('https://staging.travelflight.aiop.com.co/api/flights/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          direct: false,
          currency: "COP",
          searchs: 50,
          class: false,
          qtyPassengers: searchData.passengers.adults + searchData.passengers.children + searchData.passengers.infants,
          adult: searchData.passengers.adults,
          child: searchData.passengers.children,
          baby: searchData.passengers.infants,
          seat: 0,
          itinerary: [
            {
              departureCity: searchData.origin.code,
              arrivalCity: searchData.destination.code,
              hour: searchData.date.toISOString(),
            },
          ],
        }),
      });

      const data = await response.json();
      if (data.status === 200) {
        setFlights(data.data.Seg1.map((segment) => segment.segments));
      } else {
        console.error('Error en la respuesta de la API:', data);
      }
    } catch (error) {
      console.error('Error al buscar vuelos:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchFlights();
  }, [searchData]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!flights || flights.length === 0) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        No se encontraron vuelos.
      </Typography>
    );
  }

  const handleOpenModal = (flight) => {
    console.log(flight)
    setSelectedFlight(flight);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFlight(null);
  };
  
  const handlePay = () => {
    if(selectedFlight){
        console.log(selectedFlight)
        const lastSegment = selectedFlight[selectedFlight.length - 1];
        setPaymentInfo({
          flightNumber: selectedFlight[0].flightOrtrainNumber,
          departure: `${selectedFlight[0].productDateTime.dateFormatDeparture} ${selectedFlight[0].productDateTime.timeOfDeparture}`,
          arrival: `${lastSegment.productDateTime.dateFormatArrival} ${lastSegment.productDateTime.timeOfArrival}`,
          airline: selectedFlight[0].companyId.marketingCarrier,
          passengers: searchData.passengers.adults + searchData.passengers.children + searchData.passengers.infants,
          total: 300000 
        });
        setOpenModal(false);
        setOpenReceipt(true);
    }
  };

  const handleCloseReceipt = () => {
    setOpenReceipt(false);
    setPaymentInfo(null);
    setSelectedFlight(null);
  };
  return (
    <Grid container spacing={3} sx={{ mt: 4 }}>
      {flights.map((segments, index) => (
        <Grid item xs={12} key={index}>
          <Paper elevation={3} sx={{ p: 3 }}>
            {segments.map((segment, idx) => (
              <Box key={idx} mb={2}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <FlightTakeoffIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {segment.location[0].locationName} ({segment.location[0].locationId})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {segment.productDateTime.timeOfDeparture} - {segment.productDateTime.dateFormatDeparture}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <FlightLandIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {segment.location[1].locationName} ({segment.location[1].locationId})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {segment.productDateTime.timeOfArrival} - {segment.productDateTime.dateFormatArrival}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">
                    Vuelo: {segment.companyId.marketingCarrier} {segment.flightOrtrainNumber} - {segment.equipment}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    Duración: {segment.attributeDetail.attributeDescription}
                  </Typography>
                </Box>
              </Box>
            ))}
                  <Button variant="contained" onClick={() => handleOpenModal(segments)}>
              Comprar Vuelo
            </Button>
          </Paper>
        </Grid>
      ))}
    <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ 
          width: 400, 
          bgcolor: 'background.paper', 
          p: 4, 
          borderRadius: 1, 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)' 
        }}>
          {selectedFlight && (
            <>
              <Typography variant="h6">Detalles del Vuelo</Typography>
              
              {selectedFlight.map((segment, idx) => (
              <Box key={idx} mb={2}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <FlightTakeoffIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {segment.location[0].locationName} ({segment.location[0].locationId})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {segment.productDateTime.timeOfDeparture} - {segment.productDateTime.dateFormatDeparture}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <FlightLandIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {segment.location[1].locationName} ({segment.location[1].locationId})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {segment.productDateTime.timeOfArrival} - {segment.productDateTime.dateFormatArrival}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">
                    Vuelo: {segment.companyId.marketingCarrier} {segment.flightOrtrainNumber} - {segment.equipment}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    Duración: {segment.attributeDetail.attributeDescription}
                  </Typography>
                </Box>
              </Box>
            ))}
            <Button variant="contained" sx={{ mt: 2 }} onClick={handlePay}>
                Pagar
              </Button>
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleCloseModal}>
                Cerrar
              </Button>
              {/* Agrega aquí más detalles si es necesario */}
            </>
          )}
        </Box>
      </Modal>

       {/* Modal para mostrar el recibo de pago */}
       <Modal open={openReceipt} onClose={handleCloseReceipt}>
        <Box sx={{ 
          width: 400, 
          bgcolor: 'background.paper', 
          p: 4, 
          borderRadius: 1, 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)' 
        }}>
          {paymentInfo && (
            <>
              <Typography variant="h6">Recibo de Pago</Typography>
              <Typography variant="body1">Número de Vuelo: {paymentInfo.flightNumber}</Typography>
              <Typography variant="body1">Salida: {paymentInfo.departure}</Typography>
              <Typography variant="body1">Llegada: {paymentInfo.arrival}</Typography>
              <Typography variant="body1">Aerolínea: {paymentInfo.airline}</Typography>
              <Typography variant="body1">Pasajeros: {paymentInfo.passengers}</Typography>
              <Typography variant="h6">Total: ${paymentInfo.total.toLocaleString('es-CO')}</Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleCloseReceipt}>
                Cerrar
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Grid>

    
  );
};

export default FlightList;

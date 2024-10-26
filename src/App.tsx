
import React from 'react';
import FlightSearchForm from './searchContainer/FligthSearchForm';
import FlightList from './Flights/FlightList';



function App() {



  return (
    <>
    <FlightSearchForm/>
    
    </>
    );
  //     <Box
  //       display="flex"
  //       flexDirection="column"
  //       alignItems="center"
  //       justifyContent="center"
  //       padding={2}
  //       bgcolor="#f5f5f5"
  //       height="100vh"
  //     >
  //       <h1>City Search</h1>
  //       <Box
  //         display="flex"
  //         flexDirection="row"
  //         gap={4}
  //         width="100%"
  //         maxWidth="800px"
  //         justifyContent="center"
  //       >
  //         <CitySelect value={selectedOriginCity} 
  //       onChange={setOriginSelectedCity}></CitySelect>
  //         <CitySelect value={selectedDestionationCity} 
  //       onChange={setDestinationSelectedCity}></CitySelect>
  //       </Box>
  //     </Box>
  // );
}

export default App;

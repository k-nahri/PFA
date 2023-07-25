import {
  Box,
  Container,
  HStack,
  TableContainer,
  Thead,
  Table,
  Tr,
  Th,
  Tbody,
  VStack,
  Heading,
  Spacer,
  Divider,
  Button
} from "@chakra-ui/react";
import { FaCreditCard } from "react-icons/fa";


import LoadingSpinner from "../components/ui/loading-spinner";
import ProfileDrawer from "../components/ui/profile-drawer";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import RentItem from "../components/ui/RentItem";
import axiosClient from "../context/axiosClient";
import {useStateContext} from "../context/ContextProvider";
import Swal from "sweetalert2";


function Profile() {


  const [rents, setrents] = useState([])
  const [loading, setloading] = useState(true)
  const [cars, setCars] = useState([])



  const { user } = useStateContext() 

  // fetching the current user rents
  useEffect(()=>{
    const fetchRents = async ()=>{
      const {data} = await axiosClient.get(`http://127.0.0.1:8000/api/my-rents/${user?.id}`)
    //  console.log('rentals',data)
      setloading(false)
      setrents(data)
    }

   
    fetchRents()
   
  },[user])


  useEffect(()=>{
    const fetchCars = async ()=>{
      const {data} = await axios.get('http://127.0.0.1:8000/api/cars')
     // console.log('cars',data.data)
      setCars(data.data)
    }
    fetchCars()
  },[])



  const deleteRent = async (id)=>{
    Swal.fire({
      title: "Are you sure?",
      text: "You may not be able to rent this car again",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async(result) => {
      if (result.isConfirmed) {
        await axiosClient.delete(`http://127.0.0.1:8000/api/rents/${id}`)
        Swal.fire("Deleted!", "", "success");
        setrents(rents.filter(rent => rent.id !== id))
      }
    });
  }

  const update = async(updated)=>{

    
    const id = updated.id

    await axiosClient.put(`http://127.0.0.1:8000/api/rents/${id}`,updated)

    const car = cars.filter((car)=> car.id === updated.car_id)

    if (!car){
      return
    }

    const updatedRent = {
        id,
        car_id : car[0].id,
        brand : car[0].brand,
        model : car[0].model,
        gearbox : car[0].gearbox,
        fuel_type : car[0].fuel_type,
        price : updated.price,
        rental_date : updated.rental_date,
        return_date : updated.return_date,
        user_id : updated.user_id
      }

   

    setrents(prevRents =>
    prevRents.map(rent => {
      if (rent.id === id) {
        return updatedRent; // Replace the whole object with the new one
      }
      return rent; // Return unchanged objects
    })

    
    );



  }


  const checkout = async ()=>{
    try{
      const { data } = await axios.post(
        "http://127.0.0.1:8000/api/checkout"
      );
      console.log(data)
    }catch(e){
      console.error(e)
    }
  }

 
  
  if (loading) return <LoadingSpinner />;

  if (rents?.length <= 0) return <Container>
    <h1 className="text-center mt-5 text-danger">You dont have any rents🤕</h1>
    </Container>



  return (
    <Container h="100vh" maxW="100vw" py={20}>
      <VStack>
        <Box w={"90%"}>
          <HStack>
            <Heading size={["lg", "xl"]}>
              List of all Mr.
              <strong className="text-success">{user?.firstname}</strong>{" "}
              rentals
            </Heading>
            <Spacer />
            <ProfileDrawer user={user} />
          </HStack>
          <Divider my={5} />
          <TableContainer>
            <Table variant="striped" size={["md", "md", "lg"]}>
              <Thead>
                <Tr>
                  <Th>Photo</Th>
                  <Th>brand</Th>
                  <Th>model</Th>
                  <Th>type</Th>
                  <Th>price</Th>
                  <Th>rental date</Th>
                  <Th>return date</Th>
                  <Th>edit</Th>
                  <Th>delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rents?.map((r) => (
                  <RentItem
                    rent={r}
                    cars={cars}
                    update={update}
                    deleteRent={deleteRent}
                    key={r.id}
                  />
                ))}
              </Tbody>
            </Table>
            <Button
              rightIcon={<FaCreditCard />}
              colorScheme="teal"
              variant="solid"
              size="md"
              float="right"
              my={3}
              onClick={()=>checkout()}
            >
              Checkout
            </Button>
          </TableContainer>
        </Box>
      </VStack>
    </Container>
  );
}

export default Profile;

import React from "react";
import "./App.css";
import { useRoutes } from 'react-router-dom';

import Home from "./components/home/home";
import UserRegister from "./components/register/userRegister" ;
import UserLogin from "./components/login/login";


import ForgotPassword from "./components/login/forgotPassword";
import ResetPassword from "./components/login/resetPassword";

import PetRegister from "./components/pets/petRegister";

import ShowCustomers from "./components/customers/customersShow";
import ShowVeterinarians from  "./components/veterinarians/veterinariansShow";
import ShowDogs from "./components/dogs/dogsShow";
import ShowCats from "./components/cats/catsShow";



import AddFood from "./components/foodItems/addFood";
import ShowFoods from "./components/foodItems/showFoods";

import DietPlan from "./components/dietPlan/dietPlan";


import Message from "./components/messages/messages";



//Dashboards
import AdminDash from "./components/dashboards/adminDash"
import ManagerDash from "./components/dashboards/managerDash"
import CustomerDash from "./components/dashboards/customerDash"
import VeterinarianDash from "./components/dashboards/veterinarianDash"


//Ecommerce - Admin Panel
import ViewAllItem from './components/Ecommerce/adminPanel/viewAllItem';
import ViewAllPet from './components/Ecommerce/adminPanel/viewAllPet';
import CreateItem from './components/Ecommerce/adminPanel/createItem';
import CreatePet from './components/Ecommerce/adminPanel/createPet';

//Ecommerce - User Panel
import AvailableItems from './components/Ecommerce/userPanel/availableItems';


//auction
import CreateAuction from './components/auction/createAuction';
import AuctionList from './components/auction/auctionList';

//navbars
import AdminNav from "./components/navigation/adminNav"
import CustomerNav from "./components/navigation/customerNav";

//profiles
import UserProfile from "./components/profiles/userProfile";
import PetProfile from "./components/profiles/petProfile";


//samples
import Session from "./components/samples/session";


const App = () => {
  const routes = useRoutes([
    {path: '/', element: <Home /> },
    {path: '/userRegister', element: <UserRegister /> },
    {path: '/Login', element: <UserLogin /> },
    {path: '/forgot-password', element: <ForgotPassword /> },
    {path: '/reset-password/:token', element: <ResetPassword /> },
   
    {path: '/dogs', element: <ShowDogs /> },
    {path: '/dogs/:id', element: <PetProfile/> },
    {path: '/cats', element: <ShowCats /> },
    {path: '/customers', element: <ShowCustomers /> },
    {path: '/veterinarians', element: <ShowVeterinarians /> },

    //pets
    {path: '/petRegister', element: <PetRegister /> },

    //Food Items
    {path: '/addFood', element: <AddFood /> },
    {path: '/showFoods', element: <ShowFoods /> },

    //Diet Plan
    {path: '/dietPlan', element: <DietPlan /> },

    //Dashboards
    {path:'/adminDash', element: <AdminDash />},
    {path:'/managerDash', element: <ManagerDash />},
    {path:'/customerDash', element: <CustomerDash />},
    {path:'/veterinarianDash', element: <VeterinarianDash />},

    //navbars
    {path:'/adminNav', element: <AdminNav />},
    {path:'/customerNav', element: <CustomerNav />},

    //profiles
    {path:'/MyProfile', element: <UserProfile />},
    {path:'/PetProfile', element: <PetProfile />},
   
    

    



    //messages
    {path:'/Messages', element: <Message />},

        //Ecommerce - Admin Panel
        {path:'/viewAllItem', element: <ViewAllItem />},
        {path:'/viewAllPet', element: <ViewAllPet />},
        {path:'/createItem', element: <CreateItem />},
        {path:'/createPet', element: <CreatePet />},

        //Ecommerce - User Panel
        {path:'/availableItems', element: <AvailableItems />},



        //auction
        {path: '/CreateAuction', element: <CreateAuction />},
        {path: '/AuctionList', element: <AuctionList />},
        


  ]);

  return routes;
};

export default App;
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



//Dashboards
import AdminDash from "./components/dashboards/adminDash"
import ManagerDash from "./components/dashboards/managerDash"
import CustomerDash from "./components/dashboards/customerDash"
import VeterinarianDash from "./components/dashboards/veterinarianDash"

//navbars
import AdminNav from "./components/navigation/adminNav"
import CustomerNav from "./components/navigation/customerNav";

//profiles
import UserProfile from "./components/profiles/userProfile";


const App = () => {
  const routes = useRoutes([
    {path: '/', element: <Home /> },
    {path: '/adminDash/userRegister', element: <UserRegister /> },
    {path: '/userRegister', element: <UserRegister /> },
    {path: '/Login', element: <UserLogin /> },
    {path: '/forgot-password', element: <ForgotPassword /> },
    {path: '/reset-password/:token', element: <ResetPassword /> },
    {path: '/dogs', element: <ShowDogs /> },
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
    {path:'/Me', element: <UserProfile />},


  ]);

  return routes;
};

export default App;
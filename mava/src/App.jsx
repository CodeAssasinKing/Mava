import React from "react";
import "./App.css";
import {Routes, Route} from "react-router-dom";
import Main from "./pages/main.jsx";
import ErrorPage from "./pages/404.jsx";
import Contact from "./pages/contacts.jsx";
import Truck from "./pages/truck.jsx";
import AfterTruck from "./pages/afterTruck.jsx";
import Car from "./pages/car.jsx";
import Airplane from "./pages/airplane.jsx";
import After_car from "./pages/after_car.jsx";
function App() {

    return(
        <>

            <Routes>
                <Route path="/" element={<Main/>} />
                <Route path="/contact/" element={<Contact/>} />
                <Route path="/truck/" element={<Truck/>} />
                <Route path="/after-truck/" element={<AfterTruck/>} />
                <Route path="/car/" element={<Car/>} />
                <Route path="/after-car/" element={<After_car/>}/>
                <Route  path={"/airplane/"} element={<Airplane/>} />
                <Route path="*" element={<ErrorPage/>} />
            </Routes>

        </>
    )
}

export default App;
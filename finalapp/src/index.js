import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './js/App';
import {createBrowserRouter,
        createRoutesFromElements,
        Route,
        RouterProvider,
} from "react-router-dom"
import Checkin from './js/Checkin';
import Success from './js/Success';
import Media from './js/Media'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<App/>}/>
    <Route path="/checkin" element={<Checkin/>}/>
    <Route path="/media" element={<Media/>}/>
    <Route path="/success" element={<Success/>}></Route>
    </>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);

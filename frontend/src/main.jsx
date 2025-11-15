import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

import DashboardMap from './components/DashboardMap.jsx';
import Layout from './components/layout.jsx'
import Home from './Pages/Home/Home.jsx'
import Login from './Pages/Sign/LoginPage.jsx'

import 'leaflet/dist/leaflet.css';
import DashboardPage from './Pages/DashboardPage.jsx';
import ReportPage from './Pages/ReportPage.jsx';
import ClimateDashboard from './Pages/ClimateDashboard.jsx';
import RecordPage from './Pages/RecordPage.jsx';
import CommunityPage from './Pages/CommunityPage.jsx';
import AboutPage from './Pages/AboutUs.jsx';
import ProfilePage from './Pages/ProfilePage.jsx';
import NormalPage from './Pages/NormalPage.jsx'
import NormalPopulation from './Pages/Population/NormalPopulation.jsx'
import VerifiedMatrix from './Pages/Population/VerfiedPopulation.jsx';
import Climate from './Pages/ClimatePage/ClimatePage.jsx'
import UploadDocumentPage from './Pages/UploadDocument.jsx';
// FIX 1: Fetch Client ID from environment variables (must be prefixed with VITE_)
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Basic check to ensure the Client ID is loaded
if (!CLIENT_ID) {
  console.error("VITE_GOOGLE_CLIENT_ID is not set. Check your .env file!");
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<Home />} />
      <Route path='/login' element={<Login />} />
      
      <Route path='/home' element={<DashboardPage/>} />
      <Route path='/report' element={<ReportPage/>} />
      <Route path='/record' element={<RecordPage/>}/>
      <Route path='/climate' element={<ClimateDashboard/>} />
      <Route path='/community' element={<CommunityPage/>}/>
      <Route path='/about' element={<AboutPage/>}/>
      <Route path='/profile' element={<ProfilePage/>} />
      <Route path='/profilen' element={<NormalPage/>} />
      <Route path='/climaten' element={<Climate />} />
      <Route path='/population' element={<VerifiedMatrix />} />
      <Route path='/population-n' element={<NormalPopulation/>} />
      <Route path='/upload-document' element={<UploadDocumentPage/>} />
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* FIX 2: Wrap the application with GoogleOAuthProvider, passing the Client ID */}
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>,
);
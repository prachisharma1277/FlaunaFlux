import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Navbar from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Heatmap from '../components/Heatmap';


  export default function ClimateDashboard(){
  return (
    <>
     <Navbar/>
    <Heatmap/>
    <Footer/>
    </>
  );
}
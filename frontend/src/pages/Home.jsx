import React from 'react'
import Banner from '../components/Banners'
import about from '../assets/about.png'
import { FaHouseTsunami } from "react-icons/fa6";
import HomeAparts from '../components/HomeAparts';
import Servicii from '../components/Servicii';
import FastLinks from '../components/FastLinks';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>LVG Imob | Agenție imobiliară în Moldova – Apartamente, Case, Spații Comerciale și Terenuri</title>
        <meta name="description" 
          content="Găsește casa ideală în Chișinău și întreaga Moldovă. LVG Imob oferă apartamente, case, spații comerciale și terenuri de vânzare sau închiriere, cu servicii transparente și consultanță profesionistă." />
      </Helmet>

      <section className='py-[60px] sm:py-[80px] px-[12px] flex flex-col gap-[40px] xl:gap-[80px] justify-between sm:container sm:mx-auto'>
        <Banner />

        <FastLinks />

        <div className="flex flex-col lg:flex-row gap-[40px] mt-[60px]">
          <div className="bg-red-100 p-[35px] xs:p-[50px] mx-auto rounded-[5px] w-full lg:w-2/5">
            <img src={about} alt="" className="w-full" />
          </div>
          <div className="lg:px-[50px] justify-center rounded-[5px] w-full lg:w-3/5 flex flex-col gap-[30px]">
            <p className="text-[#d5ab63] uppercase font-[500] font-poppins tracking-wide text-[14px] sm:text-[18px]">Despre noi</p>
            <h2 className="font-[500] font-heading tracking-wide text-[28px] xs:text-[32px] sm:text-[40px]">
              Fiecare proprietate are o poveste, iar misiunea noastră este să o conectăm cu persoana potrivită.
            </h2>
            <div className="border-[1px] border-gray-300 rounded-[5px] p-[25px] flex flex-row gap-[20px] ">
              <div className=""><FaHouseTsunami className="text-[#d5ab63] text-[25px] xs:text-[30px] mt-[10px] xs:mt-0" /></div>
              <div className="flex flex-col gap-[10px]">
                <p className="font-poppins text-[18px] xs:text-[20px] font-[500]">Casa perfectă te așteaptă</p>
                <p className="font-body text-[13px] font-[500] text-gray-700">
                  Punem accent pe încredere, transparență și rezultate reale. Fie că ești proprietar și vrei să vinzi rapid,
                  fie că ești în căutarea casei perfecte pentru familie, suntem alături de tine în fiecare etapă.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeAparts />

      <Servicii />
    </>
  )
}

export default Home

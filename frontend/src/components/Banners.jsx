import React, { useState, useEffect } from 'react';
import '../styles/Banner.css';
import bannerImg from '../assets/banner.png';
import shapeCircle from '../assets/circle.png';
import shapeTriangle from '../assets/triangle.png';
import shapeMoon from '../assets/moon.png';
import api from '../api';
import { useNavigate } from 'react-router';

const Banner = () => {
    const [locations, setLocations] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const navigate = useNavigate()

    const [saleType, setSaleType] = useState(1);
    const [location, setLocation] = useState('');
    const [sector, setSector] = useState('');
    const [propertyType, setPropertyType] = useState('');

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await api.get('/api/v1/locations/');
                setLocations(res.data);
            } catch (error) {
                navigate('404')
            }
        }

        const fetchSectors = async () => {
            try {
                const res = await api.get('/api/v1/sectors/');
                setSectors(res.data);
            } catch (error) {
                navigate('404')
            }
        }

        const fetchTypes = async () => {
            try {
                const res = await api.get('/api/v1/property-types/');
                setPropertyTypes(res.data);
            } catch (error) {
                navigate('404')
            }
        }

        fetchLocations();
        fetchSectors();
        fetchTypes();
    }, [])

    return (
        <div className="relative flex flex-col xl:flex-row justify-between w-full">
            <div className="xl:w-1/2 order-1 text-center xl:text-left">
                <h5 className="text-[14px] font-body tracking-wider font-bold uppercase mb-4">
                    LVG Imob
                </h5>
                <h1 className="text-[24px] xs:text-[38px] sm:text-[48px] md:text-[62px] text-gray-800 font-bold font-poppins leading-snug text-black mb-4">
                    LVG Imob – Partenerul Tău de Încredere <span className=' whitespace-nowrap'> în <span className='text-[#d5ab63]'>Imobiliare</span></span>
                </h1>
                <p className="text-[#181616] font-body max-w-[450px] mx-auto xl:mx-0">
                    Vinde sau cumpără proprietăți în Moldova, fără complicații. La LVG Imob, îți oferim o experiență imobiliară completă – fie că vinzi, cumperi sau doar cauți consultanță de specialitate.
                </p>

            </div>

            <div className="xl:w-1/2 order-3 relative mt-12 xl:mt-0 flex justify-center xl:justify-end">
                <img src={bannerImg} alt="Grid building" className="w-full" />

                <img src={shapeCircle} className="shape shape-circle absolute w-[60px] top-[25%] right-[59%] lg:w-[80px] lg:top-[23%] lg:right-[48%]" alt="circle" />
                <img src={shapeTriangle} className="shape shape-triangle absolute  w-[40px] top-[15%] right-[87%] lg:w-[60px] lg:top-[15%] lg:right-[75%]" alt="triangle" />
                <img src={shapeMoon} className="shape shape-moon absolute w-[60px] top-[30%] right-[12%] lg:w-[80px] lg:top-[29%] lg:right-[22%] xl:right-[1%]" alt="moon" />
            </div>

            <div className="flex order-2 flex-col my-[50px] lg:my-[0px] gap-[20px] xl:absolute top-[500px] 2xl:top-[440px]">
                <div className="flex gap-[20px]">
                    <button onClick={() => setSaleType(2)} className={`${saleType === 2 ? 'btn-main text-white' : ' bg-white text-[#181616] hover:bg-gray-200 transition-all duration-100 ease-in border-[1px] border-gray-300'}  px-[30px] py-[12px] rounded-[5px] cursor-pointer`}>Chirie</button>
                    <button onClick={() => setSaleType(1)} className={`${saleType === 1 ? 'btn-main text-white' : ' bg-white text-[#181616] hover:bg-gray-200 transition-all duration-100 ease-in border-[1px] border-gray-300'}  px-[30px] py-[12px] rounded-[5px] cursor-pointer`}>Vânzare</button>
                </div>
                <div className="bg-white shadow-lg flex flex-col lg:flex-row gap-[30px] z-[49] justify-between lg:gap-[60px] p-[40px] rounded-[5px]">
                    <select
                        name="locationSector"
                        id="locationSector"
                        className="font-body px-[30px] py-[12px] text-[#181616] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px] min-w-[220px]"
                        value={
                            sector ? `sector-${sector}` :
                                location ? `location-${location}` :
                                    ''
                        }
                        onChange={(e) => {
                            const selectedValue = e.target.value;

                            if (selectedValue.startsWith('sector-')) {
                                const id = parseInt(selectedValue.replace('sector-', ''));
                                setLocation(1);
                                setSector(id);
                            } else if (selectedValue.startsWith('location-')) {
                                const id = parseInt(selectedValue.replace('location-', ''));
                                setLocation(id);
                                setSector('');
                            } else {
                                setLocation('');
                                setSector('');
                            }
                        }}

                    >
                        <option value="" disabled>
                            Locație
                        </option>

                        <optgroup label="Chișinău">
                            {sectors.map((sector) => (
                                <option key={`sector-${sector.id}`} value={`sector-${sector.id}`}>
                                    {sector.sector}
                                </option>
                            ))}
                        </optgroup>

                        <optgroup label="Altele">
                            {locations
                                .filter((loc) => loc.id !== 1)
                                .map((loc) => (
                                    <option key={`location-${loc.id}`} value={`location-${loc.id}`}>
                                        {loc.location}
                                    </option>
                                ))}
                        </optgroup>

                    </select>

                    <select
                        name="locationSector"
                        id="locationSector"
                        className="font-body px-[30px] py-[12px] text-[#181616] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px] min-w-[220px]"
                        value={propertyType}
                        onChange={(e) => {setPropertyType(e.target.value)}}
                    >
                        <option value="" disabled>Tipul proprietăți</option>
                        {
                            propertyTypes && propertyTypes.map((type) => (
                                <option  key={type.id} value={type.id == 1 ? 'apartamente' : type.id == 2 ? 'case' : type.id == 3 ? 'spatii-comerciale' : 'terenuri'}>{type.type}</option>
                            ))
                        }
                    </select>

                    <button onClick={() => {
                        if (propertyType && location && saleType) {
                            navigate(`/${propertyType}?sale_type=${saleType}&location=${location}&sector=${sector}`)
                        }
                    }} className='btn-main text-white px-[45px] py-[12px] rounded-[5px] cursor-pointer'>Caută</button>
                </div>
            </div>
        </div>
    );
};

export default Banner;

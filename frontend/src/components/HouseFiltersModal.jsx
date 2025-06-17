import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";

const HouseFiltersModal = ({
    onClose,
    locations,
    sectors,
    location,
    setLocation,
    sector,
    setSector,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    minSurface,
    setMinSurface,
    maxSurface,
    setMaxSurface,
    minLandSurface,
    setMinLandSurface,
    maxLandSurface,
    setMaxLandSurface,
    minRooms,
    setMinRooms,
    maxRooms,
    setMaxRooms,
    floors,
    setFloors,
    bathrooms,
    setBathrooms,
    hasWater,
    setHasWater,
    hasGas,
    setHasGas,
    hasSewerage,
    setHasSewerage
}) => {
    const resetFilters = () => {
        setMinSurface('');
        setMaxSurface('');
        setMinPrice('');
        setMaxPrice('');
        setLocation('');
        setSector('');
        setMinLandSurface('');
        setMaxLandSurface('');
        setMinRooms('');
        setMaxRooms('');
        setFloors('');
        setBathrooms('');
        setHasWater('');
        setHasGas('');
        setHasSewerage('');
    };

    return (
        <>
            <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60" onClick={onClose} style={{ cursor: "url('/cursors/cross.cur') 6 6, pointer" }}>
                <div
                    className="w-full max-w-[400px] max-h-[90vh] bg-white rounded-[5px] flex flex-col overflow-hidden cursor-default"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-end p-[10px] border-b border-gray-200 shrink-0">
                        <IoMdClose
                            onClick={onClose}
                            className="text-3xl bg-gray-300 rounded-full p-[5px] hover:bg-black hover:text-white transition-all duration-100 ease-in cursor-pointer"
                        />
                    </div>
                    <div className="overflow-y-auto px-[30px] pt-[20px] pb-[10px] flex flex-col gap-[15px]">
                        <div className="flex flex-col w-full gap-[5px]">
                            <p className='text-[14px] font-poppins font-[500]'>Suprafața - m²</p>
                            <div className="flex justify-between gap-[10px] flex-wrap">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder='De la'
                                    value={minSurface}
                                    onChange={(e) => {
                                        const numeric = e.target.value.replace(/\D/g, '');
                                        setMinSurface(numeric);
                                    }}
                                    className="font-body  px-[12px] py-[6px] rounded-[5px] outline-none border-[1px] border-gray-300 max-w-[47%] flex-grow"
                                />
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder='Până la'
                                    value={maxSurface}
                                    onChange={(e) => {
                                        const numeric = e.target.value.replace(/\D/g, '');
                                        setMaxSurface(numeric)
                                    }}
                                    className="font-body px-[12px] py-[6px] rounded-[5px] outline-none border-[1px] border-gray-300 max-w-[47%] flex-grow"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col w-full gap-[5px]">
                            <p className='text-[14px] font-poppins font-[500]'>Suprafața terenului - ari</p>
                            <div className="flex justify-between gap-[10px] flex-wrap">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder='De la'
                                    value={minLandSurface}
                                    onChange={(e) => {
                                        let newValue = e.target.value.replace(/[^0-9.]/g, '');
                                        const parts = newValue.split('.');
                                        if (parts.length > 2) {
                                            newValue = parts[0] + '.' + parts.slice(1).join('');
                                        }
                                        setMinLandSurface(newValue);
                                    }}
                                    className="font-body  px-[12px] py-[6px] rounded-[5px] outline-none border-[1px] border-gray-300 max-w-[47%] flex-grow"
                                />
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder='Până la'
                                    value={maxLandSurface}
                                    onChange={(e) => {
                                        let newValue = e.target.value.replace(/[^0-9.]/g, '');
                                        const parts = newValue.split('.');
                                        if (parts.length > 2) {
                                            newValue = parts[0] + '.' + parts.slice(1).join('');
                                        }
                                        setMaxLandSurface(newValue)
                                    }}
                                    className="font-body px-[12px] py-[6px] rounded-[5px] outline-none border-[1px] border-gray-300 max-w-[47%] flex-grow"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col w-full gap-[5px]" >
                            <p className='text-[14px] font-poppins font-[500]'>Preț - €</p>
                            <div className="flex justify-between gap-[10px] flex-wrap">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder='De la'
                                    value={minPrice}
                                    onChange={(e) => {
                                        const numeric = e.target.value.replace(/\D/g, '');
                                        setMinPrice(numeric)
                                    }}
                                    className="font-body  px-[12px] py-[6px] rounded-[5px] outline-none border-[1px] border-gray-300 max-w-[47%] flex-grow"
                                />
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder='Până la'
                                    value={maxPrice}
                                    onChange={(e) => {
                                        const numeric = e.target.value.replace(/\D/g, '');
                                        setMaxPrice(numeric)
                                    }}
                                    className="font-body px-[12px] py-[6px] rounded-[5px] outline-none border-[1px] border-gray-300 max-w-[47%] flex-grow"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-[5px] w-full w-1/2">
                            <p className='text-[14px] font-poppins font-[500]'>Locație</p>
                            <select
                                name="locationSector"
                                id="locationSector"
                                className="font-body px-[24px] py-[10px] text-[#181616] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]"
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
                                <option value="" >
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
                        </div>

                        <div className="flex flex-col gap-[5px] w-full">
                            <p className='text-[14px] font-poppins font-[500]'>Nr. de camere</p>
                            <div className="flex gap-[10px] flex-wrap">
                                <div
                                    onClick={() => {setMinRooms(''); setMaxRooms('')}}
                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[6px] cursor-pointer transition-all duration-100 ease-in ${(minRooms === '' && maxRooms === '') ? 'bg-[#d5ab63] !border-[#d5ab63] text-white' : 'hover:bg-gray-200'}`}
                                >
                                    Nu contează
                                </div>
                                <div
                                    onClick={() => {setMinRooms(1); setMaxRooms(1)}}
                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[6px] cursor-pointer transition-all duration-100 ease-in ${(minRooms === 1 && maxRooms === 1) ? 'bg-[#d5ab63] !border-[#d5ab63] text-white' : 'hover:bg-gray-200'}`}
                                >
                                    1
                                </div>
                                <div
                                    onClick={() => {setMinRooms(2); setMaxRooms(2)}}
                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[6px] cursor-pointer transition-all duration-100 ease-in ${(minRooms === 2 && maxRooms === 2) ? 'bg-[#d5ab63] !border-[#d5ab63] text-white' : 'hover:bg-gray-200'}`}
                                >
                                    2
                                </div>
                                <div
                                    onClick={() => {setMinRooms(3); setMaxRooms(3)}}
                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[6px] cursor-pointer transition-all duration-100 ease-in ${(minRooms === 3 && maxRooms === 3) ? 'bg-[#d5ab63] !border-[#d5ab63] text-white' : 'hover:bg-gray-200'}`}
                                >
                                    3
                                </div>
                                <div
                                    onClick={() => {setMinRooms(4); setMaxRooms(4)}}
                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[6px] cursor-pointer transition-all duration-100 ease-in ${(minRooms === 4 && maxRooms === 4) ? 'bg-[#d5ab63] !border-[#d5ab63] text-white' : 'hover:bg-gray-200'}`}
                                >
                                    4
                                </div>
                                <div
                                    onClick={() => {setMinRooms(5); setMaxRooms('')}}
                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[6px] cursor-pointer transition-all duration-100 ease-in ${(minRooms === 5 && maxRooms === '') ? 'bg-[#d5ab63] !border-[#d5ab63] text-white' : 'hover:bg-gray-200'}`}
                                >
                                    5 sau mai multe
                                </div>
                            </div>

                        </div>

                        <div className="flex justify-between gap-[10px]">
                            <div className="flex flex-col w-full gap-[5px] max-w-[47%] flex-grow" >
                                <p className='text-[14px] font-poppins font-[500]'>Nr. de etaje</p>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder='Nr. de etaje'
                                    value={floors}
                                    onChange={(e) => {
                                        const numeric = e.target.value.replace(/\D/g, '');
                                        setFloors(numeric)
                                    }}
                                    className="font-body  px-[12px] py-[6px] rounded-[5px] outline-none border-[1px] border-gray-300 "
                                />
                            </div>
                            <div className="flex flex-col w-full gap-[5px] max-w-[47%] flex-grow" >
                                <p className='text-[14px] font-poppins font-[500]'>Nr. de băi</p>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder='Nr. de băi'
                                    value={bathrooms}
                                    onChange={(e) => {
                                        const numeric = e.target.value.replace(/\D/g, '');
                                        setBathrooms(numeric)
                                    }}
                                    className="font-body  px-[12px] py-[6px] rounded-[5px] outline-none border-[1px] border-gray-300 "
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-[5px] w-full">
                            <p className='text-[14px] font-poppins font-[500]'>Instalație de apă</p>
                            <div className="flex gap-[10px] flex-wrap">
                                <div
                                    onClick={() => setHasWater('')}
                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[6px] cursor-pointer transition-all duration-100 ease-in ${hasWater === '' ? 'bg-[#d5ab63] !border-[#d5ab63] text-white' : 'hover:bg-gray-200'}`}
                                >
                                    Nu contează
                                </div>
                                <div
                                    onClick={() => setHasWater(true)}
                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[6px] cursor-pointer transition-all duration-100 ease-in ${hasWater === true ? 'bg-[#d5ab63] !border-[#d5ab63] text-white' : 'hover:bg-gray-200'}`}
                                >
                                    Da
                                </div>
                                <div
                                    onClick={() => setHasWater(false)}
                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[6px] cursor-pointer transition-all duration-100 ease-in ${hasWater === false ? 'bg-[#d5ab63] !border-[#d5ab63] text-white' : 'hover:bg-gray-200'}`}
                                >
                                    Nu
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-[5px] w-full">
                            <p className='text-[14px] font-poppins font-[500]'>Gazificare</p>
                            <div className="flex gap-[10px] flex-wrap">
                                <div
                                    onClick={() => setHasGas('')}
                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[6px] cursor-pointer transition-all duration-100 ease-in ${hasGas === '' ? 'bg-[#d5ab63] !border-[#d5ab63] text-white' : 'hover:bg-gray-200'}`}
                                >
                                    Nu contează
                                </div>
                                <div
                                    onClick={() => setHasGas(true)}
                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[6px] cursor-pointer transition-all duration-100 ease-in ${hasGas === true ? 'bg-[#d5ab63] !border-[#d5ab63] text-white' : 'hover:bg-gray-200'}`}
                                >
                                    Da
                                </div>
                                <div
                                    onClick={() => setHasGas(false)}
                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[6px] cursor-pointer transition-all duration-100 ease-in ${hasGas === false ? 'bg-[#d5ab63] !border-[#d5ab63] text-white' : 'hover:bg-gray-200'}`}
                                >
                                    Nu
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-[5px] w-full">
                            <p className='text-[14px] font-poppins font-[500]'>Canalizare</p>
                            <div className="flex gap-[10px] flex-wrap">
                                <div
                                    onClick={() => setHasSewerage('')}
                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[6px] cursor-pointer transition-all duration-100 ease-in ${hasSewerage === '' ? 'bg-[#d5ab63] !border-[#d5ab63] text-white' : 'hover:bg-gray-200'}`}
                                >
                                    Nu contează
                                </div>
                                <div
                                    onClick={() => setHasSewerage(true)}
                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[6px] cursor-pointer transition-all duration-100 ease-in ${hasSewerage === true ? 'bg-[#d5ab63] !border-[#d5ab63] text-white' : 'hover:bg-gray-200'}`}
                                >
                                    Da
                                </div>
                                <div
                                    onClick={() => setHasSewerage(false)}
                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[6px] cursor-pointer transition-all duration-100 ease-in ${hasSewerage === false ? 'bg-[#d5ab63] !border-[#d5ab63] text-white' : 'hover:bg-gray-200'}`}
                                >
                                    Nu
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full border-t border-gray-300 flex justify-center shrink-0">
                        <button
                            className="font-body font-[500] text-[#181616] hover:text-gray-600 cursor-pointer transition-all duration-100 ease-in my-[20px]"
                            onClick={resetFilters}
                        >
                            Șterge filtrele
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HouseFiltersModal;
import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";

const LandFiltersModal = ({
    onClose,
    locations,
    sectors,
    surfaceTypes,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    minSurface,
    setMinSurface,
    maxSurface,
    setMaxSurface,
    location,
    setLocation,
    sector,
    setSector,
    surfaceType,
    setSurfaceType
}) => {
    const resetFilters = () => {
        setMinSurface('');
        setMaxSurface('');
        setMinPrice('');
        setMaxPrice('');
        setLocation('');
        setSector('');
        setSurfaceType('');
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
                            <p className='text-[14px] font-poppins font-[500]'>Suprafața - ari</p>
                            <div className="flex justify-between gap-[10px] flex-wrap">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder='De la'
                                    value={minSurface}
                                    onChange={(e) => {
                                        let newValue = e.target.value.replace(/[^0-9.]/g, '');
                                        const parts = newValue.split('.');
                                        if (parts.length > 2) {
                                            newValue = parts[0] + '.' + parts.slice(1).join('');
                                        }
                                        setMinSurface(newValue);
                                    }}
                                    className="font-body  px-[12px] py-[6px] rounded-[5px] outline-none border-[1px] border-gray-300 max-w-[47%] flex-grow"
                                />
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder='Până la'
                                    value={maxSurface}
                                    onChange={(e) => {
                                        let newValue = e.target.value.replace(/[^0-9.]/g, '');
                                        const parts = newValue.split('.');
                                        if (parts.length > 2) {
                                            newValue = parts[0] + '.' + parts.slice(1).join('');
                                        }
                                        setMaxSurface(newValue)
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

                        <div className="flex flex-col gap-[5px] w-full">
                            <p className='text-[14px] font-poppins font-[500]'>Tip suprafață</p>
                            <div className="flex gap-[10px] flex-wrap">
                                <div
                                    onClick={() => setSurfaceType('')}
                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[6px] cursor-pointer transition-all duration-100 ease-in ${surfaceType === '' ? 'bg-[#d5ab63] !border-[#d5ab63] text-white' : 'hover:bg-gray-200'}`}
                                >
                                    Nu contează
                                </div>
                                {surfaceTypes.map((type) => (
                                    <div
                                        key={type.id}
                                        onClick={() => setSurfaceType(type.id)}
                                        className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[6px] cursor-pointer transition-all duration-100 ease-in ${surfaceType === type.id ? 'bg-[#d5ab63] !border-[#d5ab63] text-white' : 'hover:bg-gray-200'}`}
                                        style={{ flexBasis: 'auto', flexGrow: 1 }}
                                    >
                                        {type.type}
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* Location */}
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

export default LandFiltersModal;

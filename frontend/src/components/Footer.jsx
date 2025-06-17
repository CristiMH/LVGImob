import React from 'react'
import { HiChevronDoubleRight } from "react-icons/hi";
import logo from '../assets/logo_bg.png'
import { FaInstagram } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { FaFacebookSquare } from "react-icons/fa";
import { Link } from 'react-router-dom';

const footer = () => {
    return (
        <footer className='bg-[#181616] px-[12px] pt-[60px] sm:pt-[80px] lg:pt-[120px]'>
            <div className="sm:container sm:mx-auto flex flex-col">
                <div className="flex flex-col justify-center gap-[60px] pb-[60px] sm:pb-[80px] lg:pb-[120px]">
                    <div className="flex flex-col max-w-[400px] mx-auto lg:mx-0">
                        <img src={logo} alt="LVG Imob - Agenție imobiliară - Logo" className="w-[110px] lg:w-[150px] rounded-[5px] mx-auto sm:mx-0" />
                        <h2 className='font-body text-[18px] text-white text-center sm:text-left'>
                            LVG Imob este agenția ta imobiliară de încredere, dedicată să ofere servicii complete și personalizate pentru cumpărarea, vânzarea și închirierea proprietăților în Republica Moldova.
                        </h2>
                    </div>

                    <div className="flex flex-col gap-[50px]">
                        <p className='font-poppins text-[20px] font-[500] text-white tracking-wide text-center'>Servicii</p>
                        <div className="grid grid-rows-3 grid-cols-2 sm:grid-rows-2 sm:grid-cols-3 lg:grid-rows-1 lg:grid-cols-6 gap-[20px] font-body text-[14px] text-white justify-center">
                            <div className="flex flex-col gap-[15px]">
                                <Link to={'/apartamente/balti/vanzare'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='min-w-[16px] text-[#d5ab63]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Vânzare apartamente în Bălți</h2>
                                </Link>
                                <Link to={'/case/balti/vanzare'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='min-w-[16px] text-[#d5ab63]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Vânzare case în Bălți</h2>
                                </Link>
                                <Link to={'/spatii-comerciale/balti/vanzare'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='min-w-[16px] text-[#d5ab63]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Vânzare spații comerciale în Bălți</h2>
                                </Link>
                                <Link to={'/terenuri/balti/vanzare'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='min-w-[16px] text-[#d5ab63]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Vânzare terenuri în Bălți</h2>
                                </Link>
                            </div>

                            <div className="flex flex-col gap-[15px]">
                                <Link to={'/apartamente/balti/chirie'}className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='text-[#d5ab63] min-w-[16px]'  />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Chirie apartamente în Bălți</h2>
                                </Link>
                                <Link to={'/case/balti/chirie'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='text-[#d5ab63] min-w-[16px]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Chirie case în Bălți</h2>
                                </Link>
                                <Link to={'/spatii-comerciale/balti/chirie'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='text-[#d5ab63] min-w-[16px]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Chirie spații comerciale în Bălți</h2>
                                </Link>
                                <Link to={'/terenuri/balti/chirie'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='text-[#d5ab63] min-w-[16px]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Chirie terenuri în Bălți</h2>
                                </Link>
                            </div>

                            <div className="flex flex-col gap-[15px]">
                                <Link to={'/apartamente/ungheni/vanzare'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='text-[#d5ab63] min-w-[16px]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Vânzare apartamente în Ungheni</h2>
                                </Link>
                                <Link to={'/case/ungheni/vanzare'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='text-[#d5ab63] min-w-[16px]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Vânzare case în Ungheni</h2>
                                </Link>
                                <Link to={'/spatii-comerciale/ungheni/vanzare'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='text-[#d5ab63] min-w-[16px]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Vânzare spații comerciale în Ungheni</h2>
                                </Link>
                                <Link to={'/terenuri/ungheni/vanzare'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='text-[#d5ab63] min-w-[16px]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Vânzare terenuri în Ungheni</h2>
                                </Link>
                            </div>

                            <div className="flex flex-col gap-[15px]">
                                <Link to={'/apartamente/ungheni/chirie'}className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='text-[#d5ab63] min-w-[16px]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Chirie apartamente în Ungheni</h2>
                                </Link>
                                <Link to={'/case/ungheni/chirie'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='text-[#d5ab63] min-w-[16px]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Chirie case în Ungheni</h2>
                                </Link>
                                <Link to={'/spatii-comerciale/ungheni/chirie'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='text-[#d5ab63] min-w-[16px]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Chirie spații comerciale în Ungheni</h2>
                                </Link>
                                <Link to={'/terenuri/ungheni/chirie'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='text-[#d5ab63] min-w-[16px]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Chirie terenuri în Ungheni</h2>
                                </Link>
                            </div>

                            <div className="flex flex-col gap-[15px]">
                                <Link to={'/apartamente/chisinau/vanzare'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='text-[#d5ab63] min-w-[16px]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Vânzare apartamente în Chișinău</h2>
                                </Link>
                                <Link to={'/case/chisinau/vanzare'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='text-[#d5ab63] min-w-[16px] min-w-[16px]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Vânzare case în Chișinău</h2>
                                </Link>
                                <Link to={'/spatii-comerciale/chisinau/vanzare'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='text-[#d5ab63] min-w-[16px]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Vânzare spații comerciale în Chișinău</h2>
                                </Link>
                                <Link to={'/terenuri/chisinau/vanzare'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='text-[#d5ab63] min-w-[16px]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Vânzare terenuri în Chișinău</h2>
                                </Link>
                            </div>

                            <div className="flex flex-col gap-[15px]">
                                <Link to={'/apartamente/chisinau/chirie'}className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='text-[#d5ab63] min-w-[16px]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Chirie apartamente în Chișinău</h2>
                                </Link>
                                <Link to={'/case/chisinau/chirie'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='text-[#d5ab63] min-w-[16px]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Chirie case în Chișinău</h2>
                                </Link>
                                <Link to={'/spatii-comerciale/chisinau/chirie'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='text-[#d5ab63] min-w-[16px]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Chirie spații comerciale în Chișinău</h2>
                                </Link>
                                <Link to={'/terenuri/chisinau/chirie'} className="flex gap-[5px] group">
                                    <HiChevronDoubleRight className='text-[#d5ab63] min-w-[16px]' />
                                    <h2 className='group-hover:text-[#d5ab63] transition-all duration-100 ease-in'>Chirie terenuri în Chișinău</h2>
                                </Link>
                            </div>
                        </div>
                    </div>

                    
                </div>

                <hr className='text-gray-300 opacity-[0.5]'/>

                <div className="py-[30px] flex justify-center items-center sm:items-start sm:justify-between gap-[20px] sm:gap-[50px] opacity-[0.7] flex-col sm:flex-row ">
                    <h3 className='font-poppins text-gray-300 text-[18px] text-center'>© LVG Imob | Toate drepturile rezervate | <a href="https://icode.md/ro/" className='text-[#d5ab63]' target='_blank'>Site creat de iCode</a></h3>
                    <div className="mx-auto xl:mx-0">
                        <div className="flex gap-[30px] text-white border-[1px] border-gray-100 p-[12px] rounded-[7px] text-2xl relative top-1/2">
                            <a href="https://www.instagram.com/lvgimob/" target='_blank' rel="noopener noreferrer" aria-label="Instagram LVG Imob"><FaInstagram className='hover:text-[#d5ab63] transition-all duration-100 ease-in'/></a>
                            <a href="https://www.tiktok.com/@lvg.imob1" target='_blank' rel="noopener noreferrer" aria-label="TikTok LVG Imob"><AiFillTikTok className='hover:text-[#d5ab63] transition-all duration-100 ease-in'/></a>
                            <a href="https://www.facebook.com/nicnicolas.nicnicolas/" target='_blank' rel="noopener noreferrer" aria-label="Facebook LVG Imob"><FaFacebookSquare className='hover:text-[#d5ab63] transition-all duration-100 ease-in'/></a>
                        </div>
                    </div>
                    <Link to={'/contacte'} className='font-poppins text-gray-300 text-[18px] hover:text-[#d5ab63] transition-all duration-100 ease-in'>Contacte</Link>
                </div>
            </div>
        </footer>
    )
}

export default footer

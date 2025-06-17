import { useState, useEffect, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/logo_bg.png'
import { IoIosLogIn } from "react-icons/io"
import { FaArrowRight } from "react-icons/fa6"
import { IoMdClose } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { FaFacebookSquare } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

const LocationMenu = ({ showLocation, setShowLocation }) => {
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1024) {
                setShowLocation(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            <div onClick={() => { setShowLocation(false); }} style={{ cursor: "url('/cursors/cross.cur') 6 6, pointer" }} className={`fixed top-0 z-[998] h-[100vh] w-full bg-black/60 ${showLocation ? 'right-0' : '-right-full'}  transition-all duration-150 ease-in`}></div>

            <div className={`w-[350px] top-0 fixed z-[999] bg-[#181616] h-[100vh] pt-[14px] pb-[50px] px-[24px] ${showLocation ? 'right-0 overflow-y-auto' : '-right-[200%]'}  transition-all duration-150 ease-in`}>
                <div className="flex justify-between items-center">
                    <NavLink to="/" end onClick={() => { setShowLocation(false); }} className={'max-w-[140px]'}>
                        <img src={logo} alt="LVG Imob - Vânzarea și închirierea apartamentelor, caselor, spațiilor comerciale și a terenurilor." className='max-w-[140px]' />
                    </NavLink>
                    <IoMdClose onClick={() => { setShowLocation(false); }} className='text-3xl bg-gray-600 rounded-full p-[5px] ml-auto hover:bg-gray-400 text-white transition-all duration-100 ease-in cursor-pointer'/>
                </div>

                <div className="mt-[40px] flex flex-col gap-[25px]">
                    <div className="flex gap-[15px] items-center">
                        <div className="rounded-full border-[1px] border-gray-600 w-[40px] h-[40px] flex justify-center items-center">
                            <IoLocationSharp className='text-white text-xl'/>
                        </div>
                        <a className='text-white font-body tracking-wide hover:text-[#d5ab63] hover:underline transition-all duration-75 ease-in' href="https://www.google.com/maps/place/Agen%C8%9Bie+Imobiliar%C4%83+Ungheni+-+Lvgimob/@47.2206114,27.7975545,563m/data=!3m2!1e3!4b1!4m6!3m5!1s0x40cb010073c8c953:0x4a526c713659f665!8m2!3d47.2206078!4d27.8001294!16s%2Fg%2F11wwq2qrbk?entry=ttu&g_ep=EgoyMDI1MDUxMy4xIKXMDSoASAFQAw%3D%3D" target='_blank' >
                            Ungheni, Strada Ion Creangă 4
                        </a>
                    </div>
                    <div className="flex gap-[15px] items-center">
                        <div className="rounded-full border-[1px] border-gray-600 w-[40px] h-[40px] flex justify-center items-center">
                            <FaPhoneAlt className='text-white text-lg'/>
                        </div>
                         <a href="tel:+37369003757" className='text-white font-body hover:text-[#d5ab63] hover:underline transition-all duration-75 ease-in'>+373 690 03 757</a>
                    </div>
                    <div className="flex gap-[15px] items-center">
                        <div className="rounded-full border-[1px] border-gray-600 w-[40px] h-[40px] flex justify-center items-center">
                            <IoIosMail className='text-white text-xl'/>
                        </div>
                        <a href="mailto:lvgimob1@gmail.com" className='text-white font-body hover:text-[#d5ab63] hover:underline transition-all duration-75 ease-in'>lvgimob1@gmail.com</a>
                    </div>
                </div>

                <div className="mt-[40px] w-full">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2452.2225038066495!2d27.797554475862736!3d47.2206114145529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40cb010073c8c953%3A0x4a526c713659f665!2sAgen%C8%9Bie%20Imobiliar%C4%83%20Ungheni%20-%20Lvgimob!5e1!3m2!1sen!2s!4v1747379980505!5m2!1sen!2s" className='w-full h-full rounded-[5px] min-h-[550px] outline-none' style={{ border: 0 }} allowFullScreen referrerPolicy="no-referrer-when-downgrade" loading="lazy"></iframe>
                </div>

                <div className="flex gap-[30px] text-white border-[1px] border-gray-500 p-[10px] rounded-[5px] text-2xl mt-[40px] max-w-[154px]">
                    <a href="https://www.instagram.com/lvgimob/" target='_blank' rel="noopener noreferrer" aria-label="Instagram LVG Imob"><FaInstagram className='hover:text-[#d5ab63] transition-all duration-100 ease-in' /></a>
                    <a href="https://www.tiktok.com/@lvg.imob1" target='_blank' rel="noopener noreferrer" aria-label="TikTok LVG Imob"><AiFillTikTok className='hover:text-[#d5ab63] transition-all duration-100 ease-in' /></a>
                    <a href="https://www.facebook.com/nicnicolas.nicnicolas/" target='_blank' rel="noopener noreferrer" aria-label="Facebook LVG Imob"><FaFacebookSquare className='hover:text-[#d5ab63] transition-all duration-100 ease-in' /></a>
                </div>
            </div>
        </>
    )
}

export default LocationMenu

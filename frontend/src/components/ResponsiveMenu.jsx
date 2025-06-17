import { useState, useEffect, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/logo_bg.png'
import { IoIosLogIn } from "react-icons/io"
import { FaArrowRight } from "react-icons/fa6"
import { IoMdClose } from "react-icons/io";

const ResponsiveMenu = ({ showRespMenu, setShowRespMenu, saleType }) => {

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setShowRespMenu(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const linkBase =
        "text-[16px] font-[500] tracking-wider transition-colors duration-100 ease-in"

    return (
        <>
            <div onClick={() => { setShowRespMenu(false); }} style={{ cursor: "url('/cursors/cross.cur') 6 6, pointer" }} className={`fixed top-0 z-[998] h-[100vh] w-full bg-black/60 ${showRespMenu ? 'left-0' : '-left-full'}  transition-all duration-150 ease-in`}></div>

            <div className={`w-[270px] top-0 fixed z-[999] xxs:w-[300px] bg-[#f7f7f7] h-[100vh] flex flex-col p-[24px] ${showRespMenu ? 'left-0 overflow-y-auto' : '-left-[120%]'}  transition-all duration-150 ease-in`}>
                <IoMdClose onClick={() => { setShowRespMenu(false); }} className='text-3xl bg-gray-300 rounded-full p-[5px] ml-auto hover:bg-black hover:text-white transition-all duration-100 ease-in cursor-pointer'/>
                
                <NavLink to="/" end onClick={() => { setShowRespMenu(false); }} className={'w-[132px]'}>
                    <img src={logo} alt="LVG Imob - Companie imobiliară - Logo" className='w-[132px]' />
                </NavLink>
                
                <ul className='flex flex-col font-body mt-[15px]'>
                    <li className='text-[#181616] cursor-pointer duration-75 ease-in transition-all relative'>
                        <NavLink to="/" end className={({ isActive }) => `block w-full py-[15px] ${linkBase} ${isActive ? "text-[#d5ab63]" : "hover:text-[#d5ab63]"}`} onClick={() => { setShowRespMenu(false); }}>
                            Acasă
                        </NavLink>
                        <span className='block absolute bottom-0 left-0 border-t-[1px] bg-gray-300 opacity-[0.2] w-full'></span>
                    </li>
                    <li className='text-[#181616] cursor-pointer duration-75 ease-in transition-all relative'>
                        <NavLink to="/apartamente?sale_type=2" onClick={() => { setShowRespMenu(false); }} className={`block w-full py-[15px] ${linkBase} ${saleType === '2' ? 'text-[#d5ab63]' : 'hover:text-[#d5ab63]'}`}>
                            Chirie
                        </NavLink>
                        <span className='block absolute bottom-0 left-0 border-t-[1px] bg-gray-300 opacity-[0.2] w-full'></span>
                    </li>
                    <li className='text-[#181616] cursor-pointer duration-75 ease-in transition-all  relative'>
                        <NavLink to="/apartamente?sale_type=1" onClick={() => { setShowRespMenu(false); }} className={`block w-full py-[15px] ${linkBase} ${saleType === '1' ? 'text-[#d5ab63]' : 'hover:text-[#d5ab63]'}`}>
                            Vânzare
                        </NavLink>
                        <span className='block absolute bottom-0 left-0 border-t-[1px] bg-gray-300 opacity-[0.2] w-full'></span>
                    </li>
                    <li className='text-[#181616] cursor-pointer duration-75 ease-in transition-all relative'>
                        <NavLink to="/contacte" onClick={() => { setShowRespMenu(false); }} className={({ isActive }) => `block w-full py-[15px] ${linkBase} ${isActive ? "text-[#d5ab63]" : "hover:text-[#d5ab63]"}`}>
                            Contacte
                        </NavLink>
                        <span className='block absolute bottom-0 left-0 border-t-[1px] bg-gray-300 opacity-[0.2] w-full'></span>
                    </li>
                    <li className='mt-[50px]'>
                        <NavLink to="/cerere"
                            className={`flex gap-[10px] justify-center items-center uppercase font-[500] text-[14px] px-[30px] py-[18px] rounded-[5px] transition-all duration-100 ease-in border-[1px] border-gray-300 text-[#181616] hover:bg-gray-300`}
                            onClick={() => { setShowRespMenu(false); }}
                        >
                            <span>Vreau să vând</span>
                            <FaArrowRight className="text-lg text-[#d5ab63]" />
                        </NavLink>
                    </li>
                </ul>
            </div >
        </>
    )
}

export default ResponsiveMenu;
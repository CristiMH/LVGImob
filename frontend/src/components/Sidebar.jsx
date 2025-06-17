import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FaUsers, FaClipboardList } from 'react-icons/fa';
import { BiSolidLogOut } from "react-icons/bi";
import { MdMessage, MdRequestQuote, MdConstruction } from "react-icons/md";
import { FaWarehouse, FaHotjar, FaBuilding } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { RiLandscapeAiFill } from "react-icons/ri";
import { MdTerrain } from "react-icons/md";
import logo from '../assets/logo_bg.png';
import { BsBuildingsFill } from "react-icons/bs";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { IoLocationSharp } from "react-icons/io5";

const Sidebar = ({ isMobileVisible, user_type_id = null }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path) => {
    if (location.pathname === path.split('?')[0]) return;

    navigate(path);
  };


  const SidebarLink = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to.split('?')[0];
    return (
      <button
        onClick={() => handleNavClick(to)}
        className={`flex items-center gap-[20px] p-[10px] rounded-[5px] cursor-pointer transition-all duration-75 ease-in w-full text-left ${
          isActive ? 'bg-[#d5ab63]' : 'hover:bg-[#d5ab63]'
        }`}
      >
        <Icon className="text-[20px]" />
        <p className="font-poppins text-[16px] font-[500] tracking-wide">{label}</p>
      </button>
    );
  };

  const renderLinks = () => (
    <>
      <SidebarLink to="/utilizatori?page=1" icon={FaUsers} label="Utilizatori" />
      <SidebarLink to="/mesaje?page=1" icon={MdMessage} label="Mesaje" />
      <SidebarLink to="/cereri?page=1" icon={MdRequestQuote} label="Cereri" />
      <SidebarLink to="/admin/terenuri?page=1" icon={MdTerrain} label="Terenuri" />
      <SidebarLink to="/admin/case?page=1" icon={FaHouse} label="Case" />
      <SidebarLink to="/admin/apartamente?page=1" icon={BsBuildingsFill} label="Apartamente" />
      <SidebarLink to="/admin/spatii-comerciale?page=1" icon={HiMiniBuildingOffice2 } label="Spații comerciale" />

      {user_type_id && user_type_id !== 3 && (
        <>
          <hr />
          <SidebarLink to="/conditii" icon={FaWarehouse} label="Condiții" />
          <SidebarLink to="/incalzire" icon={FaHotjar} label="Încălzire" />
          <SidebarLink to="/planificare" icon={FaBuilding} label="Planificare" />
          <SidebarLink to="/constructie" icon={MdConstruction} label="Construcție" />
          <SidebarLink to="/suprafata" icon={RiLandscapeAiFill} label="Teren" />
          <SidebarLink to="/locatie" icon={IoLocationSharp } label="Locație" />
          <SidebarLink to="/sectoare" icon={IoLocationSharp } label="Sectoare" />
        </>
      )}

      <hr />
      <SidebarLink to="/logout" icon={BiSolidLogOut} label="Ieși" />
      <hr />
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden xl:flex flex-col gap-[25px] bg-[#0f1115] text-white w-[300px] p-[20px] shadow-lg rounded-[5px]">
        <img src={logo} alt="LVGIMOB" className="max-w-[100px] h-[65px] mx-auto" />
        <nav className="flex flex-col gap-[15px]">
          {renderLinks()}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`xl:hidden ${isMobileVisible ? 'flex' : 'hidden'} flex-col gap-[25px] bg-[#0f1115] min-w-[280px] text-white p-[19px] shadow-lg rounded-[5px]`}>
        <img src={logo} alt="LVGIMOB" className="max-w-[100px] h-[65px] mx-auto" />
        <nav className="flex flex-col gap-[15px]">
          {renderLinks()}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

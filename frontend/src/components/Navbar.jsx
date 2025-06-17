import { useState, useEffect, useContext } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import logo from '../assets/logo_bg.png'
import scrollContext from '../contexts/scrollContext'
import { FaArrowRight } from "react-icons/fa6"
import { RxHamburgerMenu } from "react-icons/rx";
import ResponsiveMenu from './ResponsiveMenu'
import { CgMenuRight } from "react-icons/cg";
import LocationMenu from './LocationMenu'

const Navbar = () => {
  const [showRespMenu, setShowRespMenu] = useState(false)
  const [showLocation, setShowLocation] = useState(false)
  const [isFixedVisible, setIsFixedVisible] = useState(false)
  const { enableScroll, disableScroll } = useContext(scrollContext)
  const [saleType, setSaleType] = useState(null);
  const location = useLocation()

  useEffect(() => {
  const params = new URLSearchParams(location.search)
  setSaleType(params.get('sale_type') ?? '')
}, [location.search])

  useEffect(() => {
    if (!showRespMenu) {
      enableScroll()
    } else {
      disableScroll()
    }
  }, [showRespMenu])

  useEffect(() => {
    if (!showLocation) {
      enableScroll()
    } else {
      disableScroll()
    }
  }, [showLocation])

  useEffect(() => {
    const handleScroll = () => {
      setIsFixedVisible(window.scrollY > 80)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const linkBase =
    "text-[18px] font-[500] tracking-wider transition-colors duration-100 ease-in"

  const NavContent = () => (
    <nav className="sm:container sm:mx-auto flex justify-between px-[12px] lg:py-[5px] items-center">
      <NavLink to="/" className="inline-block">
        <img
          src={logo}
          alt="LVG Imob - Companie imobiliară - Logo"
          className="h-[65px] lg:h-[78px] rounded-[5px]"
        />
      </NavLink>

      <ul className="hidden lg:flex gap-[35px] xl:gap-[55px] text-[#181616]">
        <li className="group relative">
          <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? "text-[#d5ab63]" : "hover:text-[#d5ab63]"}` }>
            Acasă
          </NavLink>
          <span className="block absolute -bottom-1 left-0 w-0 h-[1.5px] opacity-[0.8] bg-[#d5ab63] transition-all duration-150 ease-in group-hover:w-full"></span>
        </li>

        <li className="group relative">
          <NavLink to="/apartamente?sale_type=2" className={`${linkBase} ${saleType === '2' ? 'text-[#d5ab63]' : 'hover:text-[#d5ab63]'}`}>
            Chirie
          </NavLink>
          <span className="block absolute -bottom-1 left-0 w-0 h-[1.5px] opacity-[0.8] bg-[#d5ab63] transition-all duration-150 ease-in group-hover:w-full"></span>
        </li>

        <li className="group relative">
          <NavLink to="/apartamente?sale_type=1" className={`${linkBase} ${saleType === '1' ? 'text-[#d5ab63]' : 'hover:text-[#d5ab63]'}`}>
            Vânzare
          </NavLink>

          <span className="block absolute -bottom-1 left-0 w-0 h-[1.5px] opacity-[0.8] bg-[#d5ab63] transition-all duration-150 ease-in group-hover:w-full"></span>
        </li>

        <li className="group relative">
          <NavLink to="/contacte" className={({ isActive }) => `${linkBase} ${isActive ? "text-[#d5ab63]" : "hover:text-[#d5ab63]"}`}>
            Contacte
          </NavLink>
          <span className="block absolute -bottom-1 left-0 w-0 h-[1.5px] opacity-[0.8] bg-[#d5ab63] transition-all duration-150 ease-in group-hover:w-full"></span>
        </li>
      </ul>

      <div className="hidden lg:flex gap-[20px] xl:gap-[35px] items-center">
        <CgMenuRight
         onClick={() => setShowLocation(true)}
         className='text-4xl transition-colors duration-100 ease-in cursor-pointer text-[#181616] hover:text-[#d5ab63]'/>

        <div>
          <NavLink to="/cerere"
            className={`flex gap-[10px] items-center uppercase font-[500] text-[14px] px-[30px] py-[18px] rounded-[5px] transition-all duration-100 ease-in border-[1px] border-gray-300 text-[#181616] hover:bg-gray-300`}
          >
            <span>Vreau să vând</span>
            <FaArrowRight className="text-lg text-[#d5ab63]" />
          </NavLink>
        </div>
      </div>

      <RxHamburgerMenu  className='lg:hidden text-4xl cursor-pointer' onClick={() => setShowRespMenu(true)}/>
    </nav>
  )

  return (
    <>
      <header className="font-body bg-white w-full relative z-10 shadow-md">
        {NavContent()}
      </header>

      <header className={`font-body bg-white w-full fixed top-0 left-0 z-50 shadow-md transition-transform duration-300 ease-in-out ${isFixedVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        {NavContent()}
      </header>

      <ResponsiveMenu showRespMenu={showRespMenu} setShowRespMenu={setShowRespMenu} saleType={saleType}/>
      <LocationMenu showLocation={showLocation} setShowLocation={setShowLocation} />
    </>
  )
}

export default Navbar
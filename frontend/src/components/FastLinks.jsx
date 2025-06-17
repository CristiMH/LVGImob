import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { MdApartment } from "react-icons/md";

const FastLinks = () => {
    return (
        <section className="pt-[60px] px-[12px] sm:container sm:mx-auto">
            <div className="grid gap-4 md:gap-8 grid-cols-2 grid-rows-2 md:grid-cols-4 md:grid-rows-2 font-body w-full">
                <Link to={'/apartamente?sale_type=1&location=2'} className="bg-[#ececec] rounded-[5px] p-6 text-left hover:shadow-lg transition duration-100 ease-in w-full">
                    <div className="bg-[#d5ab63] w-14 h-14 flex items-center justify-center rounded-full mb-4 mx-auto">
                        <MdApartment className="text-white text-2xl " />
                    </div>
                    <h4 className="text-[14px] cstmvvv:text-[16px] cstmvvv:font-[500] lg:text-lg lg:font-semibold mb-2 text-center">Vânzare<br />apartamente în Bălți</h4>
                </Link>
                <Link to={'/apartamente?sale_type=1&location=3'} className="bg-[#ececec] rounded-[5px] p-6 text-left hover:shadow-lg transition duration-100 ease-in w-full">
                    <div className="bg-[#d5ab63] w-14 h-14 flex items-center justify-center rounded-full mb-4 mx-auto">
                        <MdApartment className="text-white text-2xl " />
                    </div>
                    <h4 className="text-[14px] cstmvvv:text-[16px] cstmvvv:font-[500] lg:text-lg lg:font-semibold mb-2 text-center">Vânzare<br />apartamente în Ungheni</h4>
                </Link>
                <Link to={'/apartamente?sale_type=2&location=2'} className="bg-[#ececec] rounded-[5px] p-6 text-left hover:shadow-lg transition duration-100 ease-in w-full">
                    <div className="bg-[#d5ab63] w-14 h-14 flex items-center justify-center rounded-full mb-4 mx-auto">
                        <MdApartment className="text-white text-2xl " />
                    </div>
                    <h4 className="text-[14px] cstmvvv:text-[16px] cstmvvv:font-[500] lg:text-lg lg:font-semibold mb-2 text-center">Chirie<br />apartamente în Bălți</h4>
                </Link>
                <Link to={'/apartamente?sale_type=2&location=3'} className="bg-[#ececec] rounded-[5px] p-6 text-left hover:shadow-lg transition duration-100 ease-in w-full">
                    <div className="bg-[#d5ab63] w-14 h-14 flex items-center justify-center rounded-full mb-4 mx-auto">
                        <MdApartment className="text-white text-2xl " />
                    </div>
                    <h4 className="text-[14px] cstmvvv:text-[16px] cstmvvv:font-[500] lg:text-lg lg:font-semibold mb-2 text-center">Chirie<br />apartamente în Ungheni</h4>
                </Link>
                <Link to={'/case?sale_type=1&location=2'} className="bg-[#ececec] rounded-[5px] p-6 text-left hover:shadow-lg transition duration-100 ease-in w-full">
                    <div className="bg-[#d5ab63] w-14 h-14 flex items-center justify-center rounded-full mb-4 mx-auto">
                        <FaHome className="text-white text-2xl " />
                    </div>
                    <h4 className="text-[14px] cstmvvv:text-[16px] cstmvvv:font-[500] lg:text-lg lg:font-semibold mb-2 text-center">Vânzare<br />case în Bălți</h4>
                </Link>
                <Link to={'/case?sale_type=1&location=3'} className="bg-[#ececec] rounded-[5px] p-6 text-left hover:shadow-lg transition duration-100 ease-in w-full">
                    <div className="bg-[#d5ab63] w-14 h-14 flex items-center justify-center rounded-full mb-4 mx-auto">
                        <FaHome className="text-white text-2xl " />
                    </div>
                    <h4 className="text-[14px] cstmvvv:text-[16px] cstmvvv:font-[500] lg:text-lg lg:font-semibold mb-2 text-center">Vânzare<br />case în Ungheni</h4>
                </Link>
                <Link to={'/case?sale_type=2&location=2'} className="bg-[#ececec] rounded-[5px] p-6 text-left hover:shadow-lg transition duration-100 ease-in w-full">
                    <div className="bg-[#d5ab63] w-14 h-14 flex items-center justify-center rounded-full mb-4 mx-auto">
                        <FaHome className="text-white text-2xl " />
                    </div>
                    <h4 className="text-[14px] cstmvvv:text-[16px] cstmvvv:font-[500] lg:text-lg lg:font-semibold mb-2 text-center">Chirie<br />case în Bălți</h4>
                </Link>
                <Link to={'/case?sale_type=2&location=3'} className="bg-[#ececec] rounded-[5px] p-6 text-left hover:shadow-lg transition duration-100 ease-in w-full">
                    <div className="bg-[#d5ab63] w-14 h-14 flex items-center justify-center rounded-full mb-4 mx-auto">
                        <FaHome className="text-white text-2xl " />
                    </div>
                    <h4 className="text-[14px] cstmvvv:text-[16px] cstmvvv:font-[500] lg:text-lg lg:font-semibold mb-2 text-center">Chirie<br />case în Ungheni</h4>
                </Link>
            </div>
        </section>
    )
}

export default FastLinks

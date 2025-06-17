import React, { useState, useEffect } from 'react'
import api from '../api'
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import ApartmentCard from './ApartmentCard'

const HomeAparts = () => {
    const [apartments, setApartments] = useState([])
    const [loading, setLoading] = useState(false);

    function cleanAndBuildUrl(baseUrl, allParams) {
        const searchParams = new URLSearchParams();

        for (const [key, value] of Object.entries(allParams)) {
            if (value !== null && value !== undefined && value !== '') {
                searchParams.append(key, value);
            }
        }

        return `${baseUrl}?${searchParams.toString()}`;
    }

    const fetchApartments = async (page = 1, sort = '-listing__created_at') => {
        setLoading(true);
        try {
            const filters = {
                page: page.toString(),
                ordering: sort,
                sale_type: 1,
                availability: true
            };

            const url = cleanAndBuildUrl('/api/v1/apartments/', filters);

            const [apartRes] = await Promise.all([
                api.get(`${url}`)
            ]);

            if (apartRes.status === 200) {
                setApartments(apartRes.data.results);
            }
        } catch (error) {
            toast.error('Nu s-a putut încărca informația, încercați mai târziu.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApartments()
    }, [])


    return (
        <section className='bg-[#181616]'>
            <div className="py-[60px] sm:py-[80px] px-[12px] flex flex-col gap-[30px] justify-between sm:container sm:mx-auto ">
                <div className="flex flex-col md:flex-row md:justify-between gap-[10px]">
                    <p className='font-heading text-[28px] xs:text-[30px] tracking-wide font-[500] text-white'>Cele mai noi anunțuri de apartamente</p>
                    <div className="mr-auto md:mr-0"><Link to={'/apartamente'} className='flex btn-main text-white  items-center gap-[10px] px-[20px] py-[12px] font-body rounded-[5px]'>Vezi și restul <FaArrowRight /></Link></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[30px] text-black">
                    {apartments.map((item, idx) => (
                        <ApartmentCard key={idx} listing={item} theme='black'/>
                    ))}
                </div>
                <div className="mx-auto mt-[30px]">
                    <Link to={'/apartamente'} className='flex btn-main text-white  items-center gap-[20px] px-[50px] py-[12px] font-body rounded-[5px]'>Vezi toate <FaArrowRight /></Link>
                </div>
            </div>
        </section>
    )
}

export default HomeAparts

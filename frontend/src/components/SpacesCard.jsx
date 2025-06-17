import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import "../styles/swiper.css"
import { RxDimensions } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';

const SpacesCard = ({ listing }) => {

    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/spatii-comerciale/${listing.id}`);
    };

    return (
        <div className="flex flex-col bg-white shadow-lg rounded-[5px]">
            <div className="relative swiper-fixed-height group">
                <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={true}
                    pagination={{ clickable: true }}
                    navigation={true}
                    modules={[Pagination, Navigation]}
                    className="mySwiper h-full rounded-[5px]"
                >
                    {listing.listing.images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                        <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={handleCardClick}
                        />
                    </SwiperSlide>
                    ))}
                </Swiper>
                </div>

            <div className="flex flex-col gap-[10px] p-[10px] cursor-pointer pt-[10px]"  onClick={handleCardClick}>
                <div className="flex flex-col gap-[5px]">
                    <div className="flex justify-between flex-wrap gap-[5px]">
                        <p className='text-[20px] font-poppins font-[500] truncate max-w-[70%]'>{listing.listing.street}</p>
                        <div className="flex gap-[5px] items-center font-body text-[14px] ">
                            <RxDimensions className='text-[#d5ab63] text-lg' />
                            <p>{listing.surface} m²</p>
                        </div>
                    </div>
                    <p className='text-[18px] font-body text-gray-700'>etaj {listing.floor}, {listing.offices == 1 ? `${listing.offices} birou` : `${listing.offices} birouri`} </p>
                </div>

                <div className="flex gap-[3px] text-[20px] font-[500] font-poppins">
                    <p>{new Intl.NumberFormat('ro-RO').format(listing.listing.price)}</p>
                    <p>€</p>
                </div>
            </div>
        </div>
    )
}

export default SpacesCard

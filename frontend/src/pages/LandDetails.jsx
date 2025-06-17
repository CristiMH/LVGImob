import { useEffect, useState, useRef } from 'react'
import "../styles/gradientButton.css"
import { useParams, useNavigate } from 'react-router'
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import Lightbox from 'yet-another-react-lightbox';
import { Zoom } from 'yet-another-react-lightbox/plugins';
import { RxDimensions } from "react-icons/rx";
import Editor from '../editors/Editor'
import api from '../api';
import ApartmentCard from '../components/ApartmentCard'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import 'yet-another-react-lightbox/styles.css';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import '../styles/gallery.css'
import 'quill/dist/quill.snow.css';

const LandDetails = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [listing, setListing] = useState(null);
    const [likeListing, setLikeListings] = useState([]);
    const [index, setIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const quillRef = useRef();
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await api.get(`api/v1/lands/${id}/`);
                setListing(res.data);
            } catch (error) {
                navigate('/404');
            }
        };

        const fetchLikeListings = async () => {

        }

        fetchListing();
    }, [id]);

    useEffect(() => {

        const fetchLikeListings = async () => {
            try {
                const res = await api.get(`api/v1/lands/?sale_type=${listing?.listing?.sale_type?.id}`);
                setLikeListings(res.data.results);
            } catch (error) {
                navigate('/404');
            }
        }

        if (listing) {
            fetchLikeListings();
        }

    }, [listing])

    return (
        <>
            {listing && (
            <Helmet>
                <title>{`${listing?.listing?.street} - ${listing?.land_surface} ari teren | LVG Imob`}</title>
                <meta
                name="description"
                content={`Teren de ${listing?.land_surface} ari în ${listing?.listing?.sector?.sector || listing?.listing?.location?.location}. Tip: ${listing?.surface_type?.type}. Preț: ${new Intl.NumberFormat('ro-RO').format(listing?.listing?.price)} €. Contact direct și detalii pe LVG Imob.`}
                />
                <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />

                <meta property="og:title" content={`${listing?.listing?.street} - Teren de vânzare | LVG Imob`} />
                <meta property="og:description" content={`Teren de ${listing?.land_surface} ari în ${listing?.listing?.sector?.sector || listing?.listing?.location?.location}. Tip: ${listing?.surface_type?.type}.`} />
                <meta property="og:image" content={listing?.listing?.images?.[0]} />
                <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
                <meta property="og:type" content="article" />
            </Helmet>
            )}

            <section className="py-[60px] sm:py-[80px] px-[12px] sm:container flex flex-col sm:gap-[35px] gap-[25px] sm:mx-auto" style={{ minHeight: "calc(100vh - 88px - 561px)" }}>
                <div className=" xl:grid xl:grid-cols-12 justify-between gap-[40px]">
                    <div className=" xl:col-span-8 flex flex-col sm:gap-[35px] gap-[25px] w-full">
                        <div className="gallery w-full">
                            <Swiper
                                style={{
                                    '--swiper-navigation-color': '#fff',
                                    '--swiper-pagination-color': '#fff',
                                }}
                                spaceBetween={10}
                                navigation={true}
                                thumbs={{ swiper: thumbsSwiper }}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mySwiper2 w-full"
                            >
                                {
                                    listing?.listing?.images.map((img, idx) => (
                                        <SwiperSlide key={idx}>
                                            <img onClick={() => {
                                                setIndex(idx);
                                                setOpen(true);
                                            }} src={img} alt={`Apartament ${listing?.listing?.street}`} className='min-h-[200px] cursor-pointer' />
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={10}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mySwiper"
                            >
                                {
                                    listing?.listing?.images.map((img, idx) => (
                                        <SwiperSlide key={idx}>
                                            <img src={img} alt={`Apartament ${listing?.listing?.street}`} className='min-h-[60px] cursor-pointer' />
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                        </div>
                        <div className="flex flex-col gap-[5px]">
                            <div className="grid grid-cols-10 justify-between items-center gap-[5px]">
                                <p className="text-[20px] col-span-7 font-poppins font-[500] sm:text-[22px]">
                                    {listing?.listing?.street}
                                </p>
                                <div className="flex gap-[5px] col-span-3 items-center justify-end font-body sm:font-poppins text-[16px] sm:text-[20px] font-[500]">
                                    <RxDimensions className="text-[#d5ab63] text-xl sm:text-3xl" />
                                    <p>{listing?.land_surface} ari</p>
                                </div>
                            </div>
                            <p className='text-[18px] font-body text-gray-700 sm:text-[20px]'>{listing?.surface_type?.type}</p>
                        </div>

                        <span className='w-full h-[1px] bg-gray-300'></span>

                        <div className="flex flex-col gap-[15px]">
                            <p className="text-[20px] col-span-7 font-poppins font-[500] sm:text-[22px]">
                                Descriere
                            </p>
                            {
                                listing?.listing?.description && (
                                    <Editor
                                        ref={quillRef}
                                        readOnly={true}
                                        visible={true}
                                        defaultValue={listing.listing.description}
                                    />
                                )
                            }
                        </div>

                        <span className='w-full h-[1px] bg-gray-300'></span>

                        <div className="flex flex-col gap-[25px]">
                            <p className="text-[20px] col-span-7 font-poppins font-[500] sm:text-[22px]">
                                Caracteristici
                            </p>
                            <div className="flex sm:gap-[200px] gap-[15px] sm:flex-row flex-col">
                                <ul className='flex flex-col gap-[15px]'>
                                    <li>
                                        <div className="flex flex-col">
                                            <p className='text-[16px] font-body text-gray-700'>Locația</p>
                                            <p className='text-[16px] font-body font-[500]'>{listing?.listing?.sector?.sector ? listing.listing.sector.sector : listing?.listing?.location?.location}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="flex flex-col">
                                            <p className='text-[16px] font-body text-gray-700'>Suprafața</p>
                                            <p className='text-[16px] font-body font-[500]'>{listing?.land_surface} ari</p>
                                        </div>
                                    </li>
                                </ul>

                                <ul className='flex flex-col gap-[15px]'>
                                    <li>
                                        <div className="flex flex-col">
                                            <p className='text-[16px] font-body text-gray-700'>Tipul de suprafață</p>
                                            <p className='text-[16px] font-body font-[500]'>{listing?.surface_type?.type}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="xl:h-full xl:col-span-4 xl:block xl:w-auto xl:relative fixed w-full left-0 bottom-0 z-[50] xl:z-1">
                        <div className="hidden xl:block xl:sticky  top-[110px] ">
                            <div className="flex flex-col gap-[25px] bg-[#ececec] p-[30px] rounded-[5px]">
                                <p className='font-poppins text-[18px] font-[500] tracking-wider'>Preț <span className='text-[#d5ab63]'>& Contacte</span> </p>
                                <div className="flex flex-col gap-[15px]">

                                    <div className="flex flex-col gap-[15px] border border-gray-300 shadow rounded-[5px] p-[20px]">
                                        <div className="flex gap-[3px] items-center text-[24px] font-[500] font-poppins tracking-wider">
                                            <p>{new Intl.NumberFormat('ro-RO').format(listing?.listing?.price)}</p>
                                            <p>€</p>
                                            <p>{`${listing?.listing?.availability  ? '' : '- Indisponibil'}`}</p>
                                        </div>
                                        <span className='w-full h-[1px] bg-gray-300'></span>
                                        <div className="flex gap-[3px] justify-between items-center text-[18px] font-[500] font-poppins tracking-wider ">
                                            <div className="flex flex-col gap-[5px]">
                                                <p>{listing?.listing?.user?.last_name} {listing?.listing?.user?.first_name}</p>
                                                <a href={`tel:${listing?.listing?.user?.phone}`} className='text-[18px] text-[#d5ab63] hover:underline'>{listing?.listing?.user?.phone}</a>
                                            </div>
                                            <a href={`tel:${listing?.listing?.user?.phone}`} className='btn-main rounded-[5px] text-white text-[16px] px-[20px] py-[7px]'>Apel</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex xl:hidden bg-[#ececec] flex-col gap-[8px] border border-gray-300 rounded-t-[5px] px-[20px] py-[10px]">
                            <div className="flex gap-[3px] items-center text-[22px] font-[500] font-poppins tracking-wider">
                                <p>{new Intl.NumberFormat('ro-RO').format(listing?.listing?.price)}</p>
                                <p>€</p>
                                <p>{`${listing?.listing?.availability  ? '' : '- Indisponibil'}`}</p>
                            </div>
                            <span className='w-full h-[1px] bg-gray-300'></span>
                            <div className="flex gap-[3px] justify-between items-center text-[16px] font-[500] font-poppins tracking-wider ">
                                <div className="flex flex-col gap-[5px]">
                                    <p>{listing?.listing?.user?.last_name} {listing?.listing?.user?.first_name}</p>
                                    <a href={`tel:${listing?.listing?.user?.phone}`} className='text-[16px] text-[#d5ab63] hover:underline'>{listing?.listing?.user?.phone}</a>
                                </div>
                                <a href={`tel:${listing?.listing?.user?.phone}`} className='btn-main rounded-[5px] text-white text-[14px] px-[20px] py-[7px]'>Apel</a>
                            </div>
                        </div>
                    </div>
                </div>

                <span className='w-full h-[1px] bg-gray-300 -mt-[15px]'></span>

                <div className="flex flex-col gap-[10px]">
                    <p className="text-[20px] col-span-7 font-poppins font-[500] sm:text-[22px]">
                        Locația
                    </p>
                    <p className='text-[18px] font-body text-gray-700 sm:text-[20px]'>{listing?.listing?.street}</p>
                    <iframe
                        title="Location Map"
                        className='w-full h-full rounded-[5px] min-h-[450px] outline-none' style={{ border: 0 }} allowFullScreen referrerPolicy="no-referrer-when-downgrade" loading="lazy"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(listing?.listing?.street || '')}&output=embed`}
                    />
                </div>

                <span className='w-full h-[1px] bg-gray-300 -mt-[15px]'></span>

                <div className="flex flex-col gap-[10px]">
                    <p className="text-[20px] col-span-7 font-poppins font-[500] sm:text-[22px]">
                        Anunțuri asemănătoare
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[30px] text-black">
                        {
                            likeListing
                                .filter((item) => item.id !== listing.id)
                                .slice(0, 4)
                                .map((item, idx) => (
                                    <ApartmentCard key={idx} listing={item} />
                                ))
                        }
                    </div>
                    <div className="mx-auto mt-[15px]">
                        <Link to={`/apartamente?sale_type=${listing?.listing?.sale_type?.id}`} className='btn-main rounded-[5px] text-white text-[16px] px-[20px] py-[7px]'>Vezi toate</Link>
                    </div>
                </div>
            </section>
            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={index}
                slides={listing?.listing?.images.map((img) => ({ src: img }))}
                plugins={[Zoom]}
            />
        </>
    )
}

export default LandDetails

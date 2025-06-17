import { useState, useEffect, useContext, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import api from '../api';
import "../styles/gradientButton.css"
import scrollContext from '../contexts/scrollContext'
import Reordering from '../components/Reordering';
import { useSearchParams, useLocation } from 'react-router-dom';
import { FaFilter } from "react-icons/fa6";
import UseDebounce from '../hooks/useDebounce'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import '../styles/changeButton.css'
import SpacesFiltersModal from '../components/SpacesFiltersModal';
import SpacesCard from '../components/SpacesCard';
import { TbMapPinSearch } from "react-icons/tb";
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const AdminSpaces = () => {
    const hasMounted = useRef(false);

    const [spaces, setSpaces] = useState([])
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const { enableScroll, disableScroll } = useContext(scrollContext)

    const [locations, setLocations] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [saleTypes, setSaleTypes] = useState([]);
    const [conditions, setConditions] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const currentPageFromUrl = parseInt(searchParams.get('page')) || 1;
    const initialOrdering = searchParams.get('ordering') || '-listing__created_at';

    const [ordering, setOrdering] = useState(initialOrdering);

    const toIntOrEmpty = (v) => {
        const num = parseInt(v);
        return isNaN(num) ? '' : num;
    };

    const locationHook = useLocation();

    const [minSurface, setMinSurface] = useState(() => searchParams.get('min_surface') || '');
    const [maxSurface, setMaxSurface] = useState(() => searchParams.get('max_surface') || '');
    const [minFloor, setMinFloor] = useState(() => searchParams.get('min_floor') || '');
    const [maxFloor, setMaxFloor] = useState(() => searchParams.get('max_floor') || '');
    const [minOffices, setMinOffices] = useState(() => toIntOrEmpty(searchParams.get('min_offices')));
    const [maxOffices, setMaxOffices] = useState(() => toIntOrEmpty(searchParams.get('max_offices')));
    const [bathrooms, setBathrooms] = useState(() => searchParams.get('bathrooms') || '');
    const [condition, setCondition] = useState(() => toIntOrEmpty(searchParams.get('condition')) || '');
    const [minPrice, setMinPrice] = useState(() => searchParams.get('price_min') || '');
    const [maxPrice, setMaxPrice] = useState(() => searchParams.get('price_max') || '');
    const [location, setLocation] = useState(() => searchParams.get('location') || '');
    const [sector, setSector] = useState(() => searchParams.get('sector') || '');
    const [saleType, setSaleType] = useState(() => toIntOrEmpty(searchParams.get('sale_type')) || 1);

    const debouncedMinPrice = UseDebounce(minPrice, 500);
    const debouncedMaxPrice = UseDebounce(maxPrice, 500);
    const debouncedMinSurface = UseDebounce(minSurface, 500);
    const debouncedMaxSurface = UseDebounce(maxSurface, 500);
    const debouncedMinFloor = UseDebounce(minFloor, 500);
    const debouncedMaxFloor = UseDebounce(maxFloor, 500);
    const debouncedBathrooms = UseDebounce(bathrooms, 500);
    const debouncedMinOffices = UseDebounce(minOffices, 500);
    const debouncedMaxOffices = UseDebounce(maxOffices, 500);

    useEffect(() => {
        const params = new URLSearchParams(locationHook.search);
        const newSaleType = toIntOrEmpty(params.get('sale_type')) || 1;
        setSaleType(newSaleType);
    }, [locationHook.search]);

    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
        current: currentPageFromUrl,
    });

    useEffect(() => {
        if (!showFilterModal) {
            enableScroll()
        } else {
            disableScroll()
        }
    }, [showFilterModal])

    function cleanAndBuildUrl(baseUrl, allParams) {
        const searchParams = new URLSearchParams();

        for (const [key, value] of Object.entries(allParams)) {
            if (value !== null && value !== undefined && value !== '') {
                searchParams.append(key, value);
            }
        }

        return `${baseUrl}?${searchParams.toString()}`;
    }

    const fetchSpaces = async (page = 1, sort = ordering) => {
        setLoading(true);
        try {
            const filters = {
                page: page.toString(),
                ordering: sort,
                sale_type: saleType,
                availability: true,
                min_surface: debouncedMinSurface,
                max_surface: debouncedMaxSurface,
                min_offices: debouncedMinOffices,
                max_offices: debouncedMaxOffices,
                min_floor: debouncedMinFloor,
                max_floor: debouncedMaxFloor,
                bathrooms: debouncedBathrooms,
                price_min: debouncedMinPrice,
                price_max: debouncedMaxPrice,
                condition,
                location,
                sector,
            };

            const url = cleanAndBuildUrl('/api/v1/commercial-spaces/', filters);

            const [spaceRes] = await Promise.all([
                api.get(`${url}`)
            ]);

            if (spaceRes.status === 200) {
                setSpaces(spaceRes.data.results);
                setPagination({
                    count: spaceRes.data.count,
                    next: spaceRes.data.next,
                    previous: spaceRes.data.previous,
                    current: page,
                });

                setSearchParams({ page: page.toString(), ordering: sort, ...filters });
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }

            setTimeout(() => setLoading(false), 500);
        } catch (error) {
            toast.error('Nu s-a putut încărca informația, încercați mai târziu.');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasMounted.current) {
            fetchSpaces(1, ordering);
        }
    }, [
        debouncedMinSurface,
        debouncedMaxSurface,
        debouncedMinOffices,
        debouncedMaxOffices,
        debouncedMinFloor,
        debouncedMaxFloor,
        debouncedBathrooms,
        debouncedMinPrice,
        debouncedMaxPrice,
        location,
        sector,
        saleType,
        ordering,
        condition
    ]);

    useEffect(() => {
        fetchSpaces(currentPageFromUrl, ordering);
        hasMounted.current = true;
    }, []);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [locationsRes, sectorsRes, saleTypesRes, conditionRes] = await Promise.all([
                    api.get('/api/v1/locations/'),
                    api.get('/api/v1/sectors/'),
                    api.get('/api/v1/sale-types/'),
                    api.get('/api/v1/conditions/')
                ]);

                if (
                    locationsRes.status === 200 &&
                    sectorsRes.status === 200 &&
                    saleTypesRes.status === 200 &&
                    conditionRes.status === 200
                ) {
                    setLocations(locationsRes.data);
                    setSectors(sectorsRes.data);
                    setSaleTypes(saleTypesRes.data);
                    setConditions(conditionRes.data);
                    setTimeout(() => setShow(true), 500);
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                } else {
                    throw new Error('Eroare');
                }
            } catch (error) {
                toast.error('Nu s-a putut încărca informația, încercați mai târziu.');
                setShow(false);
            }
        };

        fetchAllData();
    }, []);

    const totalPages = Math.ceil(pagination.count / 15);

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const buttons = [];

        const getButton = (page) => (
            <button
                key={page}
                onClick={() => fetchSpaces(page)}
                className={`px-3 py-1 bg-[#0f1115] rounded cursor-pointer font-body hover:scale-[1.03] transition-all duration-75 ease-in ${pagination.current === page ? 'bg-[#d5ab63] text-white' : 'text-white'
                    }`}
            >
                {page}
            </button>
        );

        if (pagination.current > 1) {
            buttons.push(
                <button key="first" onClick={() => fetchSpaces(1)} className='cursor-pointer hover:scale-[1.03] transition-all duration-75 ease-in'>
                    «
                </button>
            );
            buttons.push(
                <button key="prev" onClick={() => fetchSpaces(pagination.current - 1)} className='cursor-pointer hover:scale-[1.03] transition-all duration-75 ease-in'>
                    ‹
                </button>
            );
        }

        let start = pagination.current - 1;
        let end = pagination.current + 1;

        if (pagination.current === 1) {
            start = 1;
            end = Math.min(3, totalPages);
        } else if (pagination.current === totalPages) {
            end = totalPages;
            start = Math.max(1, totalPages - 2);
        }

        for (let i = start; i <= end; i++) {
            buttons.push(getButton(i));
        }

        if (pagination.current < totalPages) {
            buttons.push(
                <button key="next" onClick={() => fetchSpaces(pagination.current + 1)} className='cursor-pointer hover:scale-[1.03] transition-all duration-75 ease-in'>
                    ›
                </button>
            );
            buttons.push(
                <button key="last" onClick={() => fetchSpaces(totalPages)} className='cursor-pointer hover:scale-[1.03] transition-all duration-75 ease-in'>
                    »
                </button>
            );
        }

        return (
            <div className="flex gap-[10px] mt-[20px] flex-wrap text-[14px] justify-center items-center">
                {buttons}
            </div>
        );
    };

    const saleTypeText = saleTypes.find(t => t.id === saleType)?.type || '';
    const locationText = locations.find(l => l.id === Number(location))?.location || 'Moldova';
    const sectorText = sectors.find(s => s.id === Number(sector))?.sector || '';
    const title = show ? `${saleTypeText} spații comerciale în ${sectorText !== '' ? `${sectorText}, ` : ''} ${locationText} | LVG Imob` : 'Spații comerciale în Moldova | LVG Imob';
    const description = show ? `Vezi cele mai noi oferte ${saleTypeText.toLowerCase()} pentru spații comerciale în ${sectorText !== '' ? `${sectorText}, ` : ''} ${locationText}. Consultanță imobiliară profesionistă, filtre avansate și suport complet de la LVG Imob.` : 'Descoperă spații comerciale disponibile în întreaga Moldovă. Consultanță imobiliară profesionistă, filtre avansate și suport complet de la LVG Imob.';

    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
            </Helmet>

            <ToastContainer position="bottom-left" autoClose={5000} />
            <section className='py-[60px] sm:py-[80px] px-[12px] flex flex-col sm:container sm:mx-auto' style={{ minHeight: "calc(100vh - 88px - 561px)" }}>

                <div className="flex flex-row gap-[20px] xl:gap-[50px] justify-between overflow-hidden">
                    {
                        (show) ? (
                            <>
                                <div className="w-full">
                                    <div className="flex flex-col gap-[25px]">
                                        <div className="flex xl:flex-row flex-col gap-4 xl:justify-between mb-4">
                                            <div className="flex xl:hidden gap-[10px] flex-wrap font-body">
                                                <Link to={`/apartamente?sale_type=${saleType}`}
                                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[15px] py-[10.5px] cursor-pointer transition-all duration-100 ease-in hover:bg-gray-200`}
                                                >
                                                    Apartamente
                                                </Link>
                                                <Link to={`/case?sale_type=${saleType}`}
                                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[15px] py-[10.5px] cursor-pointer transition-all duration-100 ease-in hover:bg-gray-200`}
                                                >
                                                    Case
                                                </Link>
                                                <Link to={`/terenuri?sale_type=${saleType}`}
                                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[15px] py-[10.5px] cursor-pointer transition-all duration-100 ease-in hover:bg-gray-200`}
                                                >
                                                    Terenuri
                                                </Link>
                                                <div
                                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[15px] py-[10.5px] cursor-pointer transition-all duration-100 ease-in bg-[#181616] !border-[#181616] text-white`}
                                                >
                                                    Spații comerciale
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 xl:w-full">
                                                <div className="xl:flex hidden gap-[10px] flex-wrap font-body">
                                                    <Link to={`/apartamente?sale_type=${saleType}`}
                                                        style={{ flexBasis: 'auto', flexGrow: 1 }}
                                                        className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[15px] py-[10.5px] cursor-pointer transition-all duration-100 ease-in hover:bg-gray-200`}
                                                    >
                                                        Apartamente
                                                    </Link>
                                                    <Link to={`/case?sale_type=${saleType}`}
                                                        style={{ flexBasis: 'auto', flexGrow: 1 }}
                                                        className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[15px] py-[10.5px] cursor-pointer transition-all duration-100 ease-in hover:bg-gray-200`}
                                                    >
                                                        Case
                                                    </Link>
                                                    <Link to={`/terenuri?sale_type=${saleType}`}
                                                        style={{ flexBasis: 'auto', flexGrow: 1 }}
                                                        className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[15px] py-[10.5px] cursor-pointer transition-all duration-100 ease-in hover:bg-gray-200`}
                                                    >
                                                        Terenuri
                                                    </Link>
                                                    <div
                                                        style={{ flexBasis: 'auto', flexGrow: 1 }}
                                                        className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[15px] py-[10.5px] cursor-pointer transition-all duration-100 ease-in bg-[#181616] !border-[#181616] text-white`}
                                                    >
                                                        Spații comerciale
                                                    </div>
                                                </div>

                                                <div className="flex items-center mx-auto xs:mx-0">
                                                    <Box sx={{ display: "flex" }}>
                                                        <Box className="mask-box">
                                                            <Box
                                                                className="mask"
                                                                style={{
                                                                    transform: `translateX(${saleType === saleTypes[0]?.id ? 0 : "100px"})`
                                                                }}
                                                            />
                                                            {saleTypes.map((type) => (
                                                                <Button
                                                                    key={type.id}
                                                                    disableRipple
                                                                    variant="text"
                                                                    sx={{
                                                                        color: saleType === type.id ? "#ffffff" : "#0f1115",
                                                                        fontFamily: "Jost, sans-serif",
                                                                        textTransform: "none"
                                                                    }}
                                                                    onClick={() => setSaleType(type.id)}
                                                                >
                                                                    {type.type}
                                                                </Button>
                                                            ))}
                                                        </Box>
                                                    </Box>
                                                </div>

                                                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4">
                                                    <select
                                                        className="font-body px-[16px] py-[10px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px] min-w-[250px]"
                                                        onChange={(e) => setOrdering(e.target.value)}
                                                        value={ordering}
                                                    >
                                                        <option value="listing__price">Ieftin - Scump</option>
                                                        <option value="-listing__price">Scump - Ieftin</option>
                                                        <option value="-listing__created_at">Cele mai noi</option>
                                                    </select>

                                                    <button
                                                        onClick={() => setShowFilterModal(true)}
                                                        className="bg-[#0f1115] justify-center font-body flex gap-[10px] items-center text-white px-[16px] py-[10px] border-[1px] border-[#0f1115] rounded-[5px] cursor-pointer hover:bg-[#d5ab63] hover:border-[#d5ab63] transition-all duration-75 ease-in"
                                                    >
                                                        <FaFilter />
                                                        <p>Filtre</p>
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                        <p className="text-[16px] font-poppins mb-[10px] order-2 sm:order-1">{pagination.count} rezultate ale căutării </p>
                                    </div>
                                    {
                                        loading ? (
                                            <div className="flex justify-center items-center w-full mt-[50px]">
                                                <Reordering />
                                            </div>
                                        ) : (
                                            <>
                                                {
                                                    spaces.length === 0 && (
                                                        <div className="flex flex-col gap-[20px] items-center w-full h-full mt-[100px]">
                                                            <TbMapPinSearch className='text-[#d5ab63] text-[100px]' />
                                                            <p className='text-[18px] font-poppins text-center'>Nu a fost găsit nimic pentru căutarea dvs.</p>
                                                            <button onClick={() => {
                                                                setMinSurface('');
                                                                setMaxSurface('');
                                                                setMinPrice('');
                                                                setMaxPrice('');
                                                                setLocation('');
                                                                setSector('');
                                                                setMinFloor('');
                                                                setMaxFloor('');
                                                                setMinOffices('');
                                                                setMaxOffices('');
                                                                setBathrooms('');
                                                                setCondition('');
                                                            }} className='btn-main text-[14px] text-white px-[30px] py-[7px] cursor-pointer rounded-[5px] font-poppins'>Șterge filtrele</button>
                                                        </div>
                                                    )
                                                }
                                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[30px] text-black">
                                                    {spaces.map((item, idx) => (
                                                        <SpacesCard key={idx} listing={item} />
                                                    ))}
                                                </div>
                                                {renderPagination()}
                                            </>
                                        )
                                    }
                                    {
                                        showFilterModal && (
                                            <SpacesFiltersModal
                                                onClose={() => setShowFilterModal(false)}
                                                locations={locations}
                                                sectors={sectors}
                                                conditions={conditions}

                                                location={location}
                                                setLocation={setLocation}
                                                sector={sector}
                                                setSector={setSector}
                                                minPrice={minPrice}
                                                setMinPrice={setMinPrice}
                                                maxPrice={maxPrice}
                                                setMaxPrice={setMaxPrice}

                                                minOffices={minOffices}
                                                setMinOffices={setMinOffices}
                                                maxOffices={maxOffices}
                                                setMaxOffices={setMaxOffices}
                                                minSurface={minSurface}
                                                setMinSurface={setMinSurface}
                                                maxSurface={maxSurface}
                                                setMaxSurface={setMaxSurface}
                                                minFloor={minFloor}
                                                setMinFloor={setMinFloor}
                                                maxFloor={maxFloor}
                                                setMaxFloor={setMaxFloor}
                                                bathrooms={bathrooms}
                                                setBathrooms={setBathrooms}
                                                condition={condition}
                                                setCondition={setCondition}
                                            />
                                        )}
                                </div>
                            </>
                        ) : (
                            <div className="w-full justify-center items-center flex mt-[50px] xl:mt-0">
                                <Reordering />
                            </div>
                        )
                    }
                </div>
            </section>
        </>
    )
}

export default AdminSpaces
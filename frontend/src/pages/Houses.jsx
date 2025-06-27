import { useState, useEffect, useContext, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import api from '../api';
import "../styles/gradientButton.css"
import scrollContext from '../contexts/scrollContext'
import Reordering from '../components/Reordering';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { FaFilter } from "react-icons/fa6";
import UseDebounce from '../hooks/useDebounce'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import '../styles/changeButton.css'
import HouseCard from '../components/HouseCard';
import HouseFiltersModal from '../components/HouseFiltersModal';
import { TbMapPinSearch } from "react-icons/tb";
import { Helmet } from 'react-helmet-async';

const Houses = () => {
    const hasMounted = useRef(false);

    const [houses, setHouses] = useState([])
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const { enableScroll, disableScroll } = useContext(scrollContext)

    const [locations, setLocations] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [saleTypes, setSaleTypes] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const currentPageFromUrl = parseInt(searchParams.get('page')) || 1;
    const initialOrdering = searchParams.get('ordering') || '-listing__created_at';

    const [ordering, setOrdering] = useState(initialOrdering);

    const toBool = (v) => v === 'true' ? true : v === 'false' ? false : '';
    const toIntOrEmpty = (v) => {
        const num = parseInt(v);
        return isNaN(num) ? '' : num;
    };

    const locationHook = useLocation();

    const [minSurface, setMinSurface] = useState(() => searchParams.get('min_surface') || '');
    const [maxSurface, setMaxSurface] = useState(() => searchParams.get('max_surface') || '');
    const [minLandSurface, setMinLandSurface] = useState(() => searchParams.get('min_land_surface') || '');
    const [maxLandSurface, setMaxLandSurface] = useState(() => searchParams.get('max_land_surface') || '');
    const [minRooms, setMinRooms] = useState(() => toIntOrEmpty(searchParams.get('min_rooms')));
    const [maxRooms, setMaxRooms] = useState(() => toIntOrEmpty(searchParams.get('max_rooms')));
    const [floors, setFloors] = useState(() => searchParams.get('total_floors') || '');
    const [bathrooms, setBathrooms] = useState(() => searchParams.get('bathrooms') || '');
    const [hasWater, setHasWater] = useState(() => toBool(searchParams.get('water_installation')));
    const [hasGas, setHasGas] = useState(() => toBool(searchParams.get('gas_installation')));
    const [hasSewerage, setHasSewerage] = useState(() => toBool(searchParams.get('sewerage_installation')));
    const [minPrice, setMinPrice] = useState(() => searchParams.get('price_min') || '');
    const [maxPrice, setMaxPrice] = useState(() => searchParams.get('price_max') || '');
    const [location, setLocation] = useState(() => searchParams.get('location') || '');
    const [sector, setSector] = useState(() => searchParams.get('sector') || '');
    const [saleType, setSaleType] = useState(() => parseInt(searchParams.get('sale_type')) || 1);

    const debouncedMinPrice = UseDebounce(minPrice, 500);
    const debouncedMaxPrice = UseDebounce(maxPrice, 500);
    const debouncedMinSurface = UseDebounce(minSurface, 500);
    const debouncedMaxSurface = UseDebounce(maxSurface, 500);
    const debouncedMinLandSurface = UseDebounce(minLandSurface, 500);
    const debouncedMaxLandSurface = UseDebounce(maxLandSurface, 500);
    const debouncedFloors = UseDebounce(floors, 500);
    const debouncedBathrooms = UseDebounce(bathrooms, 500);

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

    const fetchHouses = async (page = 1, sort = ordering) => {
        setLoading(true);
        try {
            const filters = {
                page: page.toString(),
                ordering: sort,
                sale_type: saleType,
                availability: true,
                min_surface: debouncedMinSurface,
                max_surface: debouncedMaxSurface,
                min_land_surface: debouncedMinLandSurface,
                max_land_surface: debouncedMaxLandSurface,
                min_rooms: minRooms,
                max_rooms: maxRooms,
                total_floors: debouncedFloors,
                bathrooms: debouncedBathrooms,
                water_installation: hasWater,
                gas_installation: hasGas,
                sewerage_installation: hasSewerage,
                price_min: debouncedMinPrice,
                price_max: debouncedMaxPrice,
                location,
                sector,
            };

            const url = cleanAndBuildUrl('/api/v1/houses/', filters);

            const [housesRes] = await Promise.all([
                api.get(`${url}`)
            ]);

            if (housesRes.status === 200) {
                setHouses(housesRes.data.results);
                setPagination({
                    count: housesRes.data.count,
                    next: housesRes.data.next,
                    previous: housesRes.data.previous,
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
        fetchHouses(1, ordering,);
    }, [
        debouncedMinSurface,
        debouncedMaxSurface,
        debouncedMinLandSurface,
        debouncedMaxLandSurface,
        minRooms,
        maxRooms,
        debouncedFloors,
        debouncedBathrooms,
        debouncedMinPrice,
        debouncedMaxPrice,
        hasWater,
        hasGas,
        hasSewerage,
        location,
        sector,
        saleType,
        ordering
    ]);

    useEffect(() => {
        fetchHouses(currentPageFromUrl, ordering);
        hasMounted.current = true;
    }, []);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [locationsRes, sectorsRes, saleTypesRes] = await Promise.all([
                    api.get('/api/v1/locations/'),
                    api.get('/api/v1/sectors/'),
                    api.get('/api/v1/sale-types/')
                ]);

                if (
                    locationsRes.status === 200 &&
                    sectorsRes.status === 200 &&
                    saleTypesRes.status === 200
                ) {
                    setLocations(locationsRes.data);
                    setSectors(sectorsRes.data);
                    setSaleTypes(saleTypesRes.data);
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
                onClick={() => fetchHouses(page)}
                className={`px-3 py-1 bg-[#0f1115] rounded cursor-pointer font-body hover:scale-[1.03] transition-all duration-75 ease-in ${pagination.current === page ? 'bg-[#d5ab63] text-white' : 'text-white'
                    }`}
            >
                {page}
            </button>
        );

        if (pagination.current > 1) {
            buttons.push(
                <button key="first" onClick={() => fetchHouses(1)} className='cursor-pointer hover:scale-[1.03] transition-all duration-75 ease-in'>
                    «
                </button>
            );
            buttons.push(
                <button key="prev" onClick={() => fetchHouses(pagination.current - 1)} className='cursor-pointer hover:scale-[1.03] transition-all duration-75 ease-in'>
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
                <button key="next" onClick={() => fetchHouses(pagination.current + 1)} className='cursor-pointer hover:scale-[1.03] transition-all duration-75 ease-in'>
                    ›
                </button>
            );
            buttons.push(
                <button key="last" onClick={() => fetchHouses(totalPages)} className='cursor-pointer hover:scale-[1.03] transition-all duration-75 ease-in'>
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
    const title = show ? `${saleTypeText} case în ${sectorText !== '' ? `${sectorText}, ` : ''} ${locationText} | LVG Imob` : 'Case în Moldova | LVG Imob';
    const description = show ? `Vezi cele mai noi oferte ${saleTypeText.toLowerCase()} pentru case în ${sectorText !== '' ? `${sectorText}, ` : ''} ${locationText}. Consultanță imobiliară profesionistă, filtre avansate și suport complet de la LVG Imob.` : 'Descoperă case disponibile în întreaga Moldovă. Consultanță imobiliară profesionistă, filtre avansate și suport complet de la LVG Imob.';

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
                                        <h1 class="text-[20px] font-[500]">{`${saleTypeText} case în ${sectorText !== '' ? `${sectorText}, ` : ''} ${locationText}`}</h1>
                                        <div className="flex xl:flex-row flex-col gap-4 xl:justify-between mb-4">
                                            <div className="flex xl:hidden gap-[10px] flex-wrap font-body">
                                                <Link to={`/apartamente?sale_type=${saleType}`}
                                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[10.5px] cursor-pointer transition-all duration-100 ease-in hover:bg-gray-200 `}
                                                >
                                                    Apartamente
                                                </Link>
                                                <div
                                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[10.5px] cursor-pointer transition-all duration-100 ease-in bg-[#181616] !border-[#181616] text-white`}
                                                >
                                                    Case
                                                </div>
                                                <Link to={`/terenuri?sale_type=${saleType}`}
                                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[10.5px] cursor-pointer transition-all duration-100 ease-in hover:bg-gray-200`}
                                                >
                                                    Terenuri
                                                </Link>
                                                <Link to={`/spatii-comerciale?sale_type=${saleType}`}
                                                    style={{ flexBasis: 'auto', flexGrow: 1 }}
                                                    className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[10.5px] cursor-pointer transition-all duration-100 ease-in hover:bg-gray-200`}
                                                >
                                                    Spații comerciale
                                                </Link>
                                            </div>

                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 xl:w-full">
                                                <div className="xl:flex hidden gap-[10px] flex-wrap font-body">
                                                    <Link to={`/apartamente?sale_type=${saleType}`}
                                                        style={{ flexBasis: 'auto', flexGrow: 1 }}
                                                        className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[10.5px] cursor-pointer transition-all duration-100 ease-in hover:bg-gray-200 `}
                                                    >
                                                        Apartamente
                                                    </Link>
                                                    <div
                                                        style={{ flexBasis: 'auto', flexGrow: 1 }}
                                                        className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[10.5px] cursor-pointer transition-all duration-100 ease-in bg-[#181616] !border-[#181616] text-white`}
                                                    >
                                                        Case
                                                    </div>
                                                    <Link to={`/terenuri?sale_type=${saleType}`}
                                                        style={{ flexBasis: 'auto', flexGrow: 1 }}
                                                        className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[10.5px] cursor-pointer transition-all duration-100 ease-in hover:bg-gray-200`}
                                                    >
                                                        Terenuri
                                                    </Link>
                                                    <Link to={`/spatii-comerciale?sale_type=${saleType}`}
                                                        style={{ flexBasis: 'auto', flexGrow: 1 }}
                                                        className={`border-[1px] border-gray-300 font-body text-center rounded-[5px] px-[12px] py-[10.5px] cursor-pointer transition-all duration-100 ease-in hover:bg-gray-200`}
                                                    >
                                                        Spații comerciale
                                                    </Link>
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

                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                                                    houses.length === 0 && (
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
                                                                setMinLandSurface('');
                                                                setMaxLandSurface('');
                                                                setMinRooms('');
                                                                setMaxRooms('');
                                                                setFloors('');
                                                                setBathrooms('');
                                                                setHasWater('');
                                                                setHasGas('');
                                                                setHasSewerage('');
                                                            }} className='btn-main text-[14px] text-white px-[30px] py-[7px] cursor-pointer rounded-[5px] font-poppins'>Șterge filtrele</button>
                                                        </div>
                                                    )
                                                }
                                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[30px] text-black">
                                                    {houses.map((item, idx) => (
                                                        <HouseCard key={idx} listing={item} />
                                                    ))}
                                                </div>
                                                {renderPagination()}
                                            </>
                                        )
                                    }
                                    {
                                        showFilterModal && (
                                            <HouseFiltersModal
                                                onClose={() => setShowFilterModal(false)}
                                                locations={locations}
                                                sectors={sectors}

                                                location={location}
                                                setLocation={setLocation}
                                                sector={sector}
                                                setSector={setSector}
                                                minPrice={minPrice}
                                                setMinPrice={setMinPrice}
                                                maxPrice={maxPrice}
                                                setMaxPrice={setMaxPrice}

                                                minSurface={minSurface}
                                                setMinSurface={setMinSurface}
                                                maxSurface={maxSurface}
                                                setMaxSurface={setMaxSurface}
                                                minLandSurface={minLandSurface}
                                                setMinLandSurface={setMinLandSurface}
                                                maxLandSurface={maxLandSurface}
                                                setMaxLandSurface={setMaxLandSurface}
                                                minRooms={minRooms}
                                                setMinRooms={setMinRooms}
                                                maxRooms={maxRooms}
                                                setMaxRooms={setMaxRooms}
                                                floors={floors}
                                                setFloors={setFloors}
                                                bathrooms={bathrooms}
                                                setBathrooms={setBathrooms}
                                                hasWater={hasWater}
                                                setHasWater={setHasWater}
                                                hasGas={hasGas}
                                                setHasGas={setHasGas}
                                                hasSewerage={hasSewerage}
                                                setHasSewerage={setHasSewerage}
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

export default Houses

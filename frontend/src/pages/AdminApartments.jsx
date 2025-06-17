import { useState, useEffect, useContext, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import api from '../api';
import "../styles/gradientButton.css"
import Sidebar from '../components/Sidebar';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog';
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import scrollContext from '../contexts/scrollContext'
import Reordering from '../components/Reordering';
import { useSearchParams } from 'react-router-dom';
import { FaFilter } from "react-icons/fa6";
import UseDebounce from '../hooks/useDebounce'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import '../styles/changeButton.css'
import ApartmentCard from '../components/ApartmentCard';
import ApartmentModal from '../components/ApartmentModal';
import ApartmentFiltersModal from '../components/ApartmentFiltersModal';
import { TbMapPinSearch } from "react-icons/tb";

const AdminApartments = () => {
    const hasMounted = useRef(false);

    const [apartments, setApartments] = useState([])
    const [show, setShow] = useState(false);
    const [editingApartment, setEditingApartment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [showApartmentModal, setShowApartmentModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const { enableScroll, disableScroll } = useContext(scrollContext)

    const [locations, setLocations] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [saleTypes, setSaleTypes] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [constructionTypes, setConstructionTypes] = useState([]);
    const [plannings, setPlannings] = useState([]);
    const [heatingTypes, setHeatingTypes] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const currentPageFromUrl = parseInt(searchParams.get('page')) || 1;
    const initialOrdering = searchParams.get('ordering') || '-listing__created_at';

    const [ordering, setOrdering] = useState(initialOrdering);

    const toBool = (v) => v === 'true' ? true : v === 'false' ? false : '';
    const toIntOrEmpty = (v) => {
        const num = parseInt(v);
        return isNaN(num) ? '' : num;
    };

    const [minSurface, setMinSurface] = useState(() => searchParams.get('min_surface') || '');
    const [maxSurface, setMaxSurface] = useState(() => searchParams.get('max_surface') || '');
    const [minRooms, setMinRooms] = useState(() => toIntOrEmpty(searchParams.get('min_rooms')));
    const [maxRooms, setMaxRooms] = useState(() => toIntOrEmpty(searchParams.get('max_rooms')));
    const [floors, setFloors] = useState(() => searchParams.get('total_floors') || '');
    const [minFloor, setMinFloor] = useState(() => searchParams.get('min_floor') || '');
    const [maxFloor, setMaxFloor] = useState(() => searchParams.get('max_floor') || '');
    const [bathrooms, setBathrooms] = useState(() => searchParams.get('bathrooms') || '');
    const [condition, setCondition] = useState(() => toIntOrEmpty(searchParams.get('condition')) || '');
    const [constructionType, setConstructionType] = useState(() => toIntOrEmpty(searchParams.get('construction_type')) || '');
    const [planning, setPlanning] = useState(() => toIntOrEmpty(searchParams.get('planning_type')) || '');
    const [heatingType, setHeatingType] = useState(() => toIntOrEmpty(searchParams.get('heating_type')) || '');
    const [minPrice, setMinPrice] = useState(() => searchParams.get('price_min') || '');
    const [maxPrice, setMaxPrice] = useState(() => searchParams.get('price_max') || '');
    const [availability, setAvailability] = useState(() => toBool(searchParams.get('availability')) !== '' ? toBool(searchParams.get('availability')) : true);
    const [location, setLocation] = useState(() => searchParams.get('location') || '');
    const [sector, setSector] = useState(() => searchParams.get('sector') || '');
    const [saleType, setSaleType] = useState(() => toIntOrEmpty(searchParams.get('sale_type')) || 1);

    const debouncedMinPrice = UseDebounce(minPrice, 500);
    const debouncedMaxPrice = UseDebounce(maxPrice, 500);
    const debouncedMinSurface = UseDebounce(minSurface, 500);
    const debouncedMaxSurface = UseDebounce(maxSurface, 500);
    const debouncedFloors = UseDebounce(floors, 500);
    const debouncedMinFloor = UseDebounce(minFloor, 500);
    const debouncedMaxFloor = UseDebounce(maxFloor, 500);
    const debouncedBathrooms = UseDebounce(bathrooms, 500);


    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
        current: currentPageFromUrl,
    });

    useEffect(() => {
        if (!showApartmentModal) {
            enableScroll()
        } else {
            disableScroll()
        }
    }, [showApartmentModal])

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

    const fetchApartments = async (page = 1, sort = ordering) => {
        setLoading(true);
        try {
            const filters = {
                page: page.toString(),
                ordering: sort,
                sale_type: saleType,
                availability,
                min_surface: debouncedMinSurface,
                max_surface: debouncedMaxSurface,
                min_rooms: minRooms,
                max_rooms: maxRooms,
                total_floors: debouncedFloors,
                min_floor: debouncedMinFloor,
                max_floor: debouncedMaxFloor,
                bathrooms: debouncedBathrooms,
                price_min: debouncedMinPrice,
                price_max: debouncedMaxPrice,
                condition,
                location,
                sector,
                construction_type: constructionType,
                planning_type: planning,
                heating_type: heatingType
            };

            const url = cleanAndBuildUrl('/api/v1/apartments/', filters);

            const [apartRes] = await Promise.all([
                api.get(`${url}`)
            ]);

            if (apartRes.status === 200) {
                setApartments(apartRes.data.results);
                setPagination({
                    count: apartRes.data.count,
                    next: apartRes.data.next,
                    previous: apartRes.data.previous,
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
            fetchApartments(1, ordering);
        }
    }, [
        debouncedMinSurface,
        debouncedMaxSurface,
        minRooms,
        maxRooms,
        debouncedFloors,
        debouncedMinFloor,
        debouncedMaxFloor,
        debouncedBathrooms,
        debouncedMinPrice,
        debouncedMaxPrice,
        location,
        sector,
        availability,
        saleType,
        ordering,
        condition,
        constructionType,
        heatingType,
        planning
    ]);

    useEffect(() => {
        fetchApartments(currentPageFromUrl, ordering);
        hasMounted.current = true;
    }, []);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [userRes, locationsRes, sectorsRes, saleTypesRes, conditionRes, consTypesRes, planRes, heatRes] = await Promise.all([
                    api.get('/api/v1/me/'),
                    api.get('/api/v1/locations/'),
                    api.get('/api/v1/sectors/'),
                    api.get('/api/v1/sale-types/'),
                    api.get('/api/v1/conditions/'),
                    api.get('/api/v1/construction-types/'),
                    api.get('/api/v1/planning-types/'),
                    api.get('/api/v1/heating-types/')
                ]);

                if (
                    userRes.status === 200 &&
                    locationsRes.status === 200 &&
                    sectorsRes.status === 200 &&
                    saleTypesRes.status === 200 &&
                    conditionRes.status === 200 &&
                    consTypesRes.status === 200 &&
                    planRes.status === 200 &&
                    heatRes.status === 200
                ) {
                    setUser(userRes.data)
                    setLocations(locationsRes.data);
                    setSectors(sectorsRes.data);
                    setSaleTypes(saleTypesRes.data);
                    setConditions(conditionRes.data);
                    setConstructionTypes(consTypesRes.data);
                    setPlannings(planRes.data);
                    setHeatingTypes(heatRes.data);
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

    const deleteApartment = async (listingId) => {
        setLoading(true);
        try {
            await api.delete(`/api/v1/delete-apartment/${listingId}/`);
            toast.success("Anunțul a fost șters.");

            const newCount = pagination.count - 1;
            const pageSize = 15;
            const newTotalPages = Math.ceil(newCount / pageSize);

            const pageToFetch = pagination.current > newTotalPages ? newTotalPages : pagination.current;

            fetchApartments(pageToFetch > 0 ? pageToFetch : 1, ordering)
        } catch (error) {
            toast.error("Eroare la ștergerea anunțului.");
            setLoading(false);
        }
    };


    const handleEdit = (apartment) => {
        setEditingApartment(apartment);
        setShowApartmentModal(true);
    };

    const handleAdd = () => {
        setEditingApartment(null);
        setShowApartmentModal(true);
    };

    const confirm = (event, apartment) => {
        confirmDialog({
            trigger: event.currentTarget,
            message: `Sigur dorești să ștergi acest anunț?`,
            header: 'Confirmare',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Da',
            rejectLabel: 'Nu',
            accept: () => { deleteApartment(apartment.listing.id) }
        });
    }

    const totalPages = Math.ceil(pagination.count / 15);

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const buttons = [];

        const getButton = (page) => (
            <button
                key={page}
                onClick={() => fetchApartments(page)}
                className={`px-3 py-1 bg-[#0f1115] rounded cursor-pointer font-body hover:scale-[1.03] transition-all duration-75 ease-in ${pagination.current === page ? 'bg-[#d5ab63] text-white' : 'text-white'
                    }`}
            >
                {page}
            </button>
        );

        if (pagination.current > 1) {
            buttons.push(
                <button key="first" onClick={() => fetchApartments(1)} className='cursor-pointer hover:scale-[1.03] transition-all duration-75 ease-in'>
                    «
                </button>
            );
            buttons.push(
                <button key="prev" onClick={() => fetchApartments(pagination.current - 1)} className='cursor-pointer hover:scale-[1.03] transition-all duration-75 ease-in'>
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
                <button key="next" onClick={() => fetchApartments(pagination.current + 1)} className='cursor-pointer hover:scale-[1.03] transition-all duration-75 ease-in'>
                    ›
                </button>
            );
            buttons.push(
                <button key="last" onClick={() => fetchApartments(totalPages)} className='cursor-pointer hover:scale-[1.03] transition-all duration-75 ease-in'>
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

    return (
        <>
            <ToastContainer position="bottom-left" autoClose={5000} />
            <ConfirmDialog />
            <section className='py-[60px] sm:py-[80px] px-[12px] flex flex-col sm:container sm:mx-auto' style={{ minHeight: "calc(100vh - 88px - 561px)" }}>
                <button
                    className="xl:hidden btn-main text-white font-body text-[18px] tracking-wide font-[500] px-4 py-2 rounded mb-4 cursor-pointer"
                    onClick={() => setSidebarVisible(v => !v)}
                >
                    {sidebarVisible ? 'Ascunde meniul' : 'Afișează meniul'}
                </button>

                <div className="flex flex-row gap-[20px] xl:gap-[50px] justify-between overflow-hidden">
                    {
                        (show) ? (
                            <>
                                <Sidebar isMobileVisible={sidebarVisible} user_type_id={user?.user_type?.id} />
                                <div className="w-full">
                                    <div className="flex flex-col sm:flex-row justify-between">
                                        <p className="text-[22px] font-[500] tracking-wide font-poppins mb-[10px] order-2 sm:order-1">Apartamente ({pagination.count})</p>
                                        <p className="text-[22px] font-[500] tracking-wide font-poppins mb-[10px] order-1 sm:order-2">{user.last_name} {user.first_name}</p>
                                    </div>
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                                        <button
                                            onClick={handleAdd}
                                            className="min-w-[140px] bg-[#0f1115] font-body text-white px-[16px] py-[10px] border-[1px] border-[#0f1115] rounded-[5px] cursor-pointer hover:bg-[#d5ab63] hover:border-[#d5ab63] transition-all duration-75 ease-in"
                                        >
                                            + Adaugă apartament
                                        </button>

                                        <div className="flex mx-auto xs:mx-0 flex-col xs:flex-row xs:justify-between gap-4">
                                            <div className="flex items-center">
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

                                            <div className="flex items-center">
                                                <Box sx={{ display: "flex" }}>
                                                    <Box className="mask-box">
                                                        <Box
                                                            className="mask"
                                                            style={{
                                                                transform: `translateX(${availability ? 0 : "100px"})`
                                                            }}
                                                        />
                                                        <Button
                                                            disableRipple
                                                            variant="text"
                                                            sx={{
                                                                color: availability ? "#ffffff" : "#0f1115",
                                                                fontFamily: "Jost, sans-serif",
                                                                textTransform: "none"
                                                            }}
                                                            onClick={() => setAvailability(true)}
                                                        >
                                                            Disponibile
                                                        </Button>
                                                        <Button
                                                            disableRipple
                                                            variant="text"
                                                            sx={{
                                                                color: !availability ? "#ffffff" : "#0f1115",
                                                                fontFamily: "Jost, sans-serif",
                                                                textTransform: "none"
                                                            }}
                                                            onClick={() => setAvailability(false)}
                                                        >
                                                            Indisponibile
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </div>
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
                                    {
                                        loading ? (
                                            <div className="flex justify-center items-center w-full mt-[50px]">
                                                <Reordering />
                                            </div>
                                        ) : (
                                            <>
                                                {
                                                    apartments.length === 0 && (
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
                                                                setMinRooms('');
                                                                setMaxRooms('');
                                                                setMinFloor('');
                                                                setMaxFloor('');
                                                                setFloors('');
                                                                setBathrooms('');
                                                                setCondition('');
                                                                setConstructionType('');
                                                                setPlanning('');
                                                                setHeatingType('');
                                                            }} className='btn-main text-[14px] text-white px-[30px] py-[7px] cursor-pointer rounded-[5px] font-poppins'>Șterge filtrele</button>
                                                        </div>
                                                    )
                                                }
                                                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-[30px] text-black">
                                                    {apartments.map((item, idx) => (
                                                        <div key={idx} className='flex flex-col gap-[10px]'>
                                                            <ApartmentCard listing={item} />
                                                            <div className="flex flex-wrap gap-[5px] justify-center">
                                                                <button
                                                                    className="bg-blue-500 text-white cursor-pointer rounded-[5px] px-[6px] py-[2px] hover:bg-blue-700 transition-all duration-75 ease-in"
                                                                    onClick={() => handleEdit(item)}
                                                                >
                                                                    Modifică
                                                                </button>
                                                                <button
                                                                    className="bg-red-500 text-white ml-[20px] cursor-pointer rounded-[5px] px-[6px] py-[2px] hover:bg-red-700 transition-all duration-75 ease-in"
                                                                    onClick={(e) => confirm(e, item)}
                                                                >
                                                                    Elimină
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {renderPagination()}
                                            </>
                                        )
                                    }
                                    {
                                        showApartmentModal && <ApartmentModal
                                            visible={showApartmentModal}
                                            onClose={() => setShowApartmentModal(false)}
                                            onSaved={() => fetchApartments(pagination.current, ordering)}
                                            listingToEdit={editingApartment}
                                            saleTypes={saleTypes}
                                            locations={locations}
                                            sectors={sectors}
                                            conditions={conditions}
                                            heatingTypes={heatingTypes}
                                            constructionTypes={constructionTypes}
                                            plannings={plannings}
                                            user={user}
                                        />
                                    }
                                    {
                                        showFilterModal && (
                                            <ApartmentFiltersModal
                                                onClose={() => setShowFilterModal(false)}
                                                locations={locations}
                                                sectors={sectors}
                                                constructionTypes={constructionTypes}
                                                heatingTypes={heatingTypes}
                                                plannings={plannings}
                                                conditions={conditions}

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
                                                minRooms={minRooms}
                                                setMinRooms={setMinRooms}
                                                maxRooms={maxRooms}
                                                setMaxRooms={setMaxRooms}
                                                minFloor={minFloor}
                                                setMinFloor={setMinFloor}
                                                maxFloor={maxFloor}
                                                setMaxFloor={setMaxFloor}
                                                floors={floors}
                                                setFloors={setFloors}
                                                bathrooms={bathrooms}
                                                setBathrooms={setBathrooms}
                                                condition={condition}
                                                setCondition={setCondition}
                                                constructionType={constructionType}
                                                setConstructionType={setConstructionType}
                                                planning={planning}
                                                setPlanning={setPlanning}
                                                heatingType={heatingType}
                                                setHeatingType={setHeatingType}
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

export default AdminApartments
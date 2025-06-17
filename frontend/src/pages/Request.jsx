import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import api from '../api';
import Reordering from '../components/Reordering';
import { IoIosSend } from "react-icons/io";
import '../styles/select.css'
import { HiClipboardCheck, HiOutlineSearch, HiOutlineCreditCard, HiOutlinePencilAlt } from 'react-icons/hi';
import { Helmet } from 'react-helmet-async';

const Request = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState(0);
    const [sector, setSector] = useState(0);
    const [propertyType, setPropertyType] = useState(0);
    const [price, setPrice] = useState(0);
    const [condition, setCondition] = useState(0);
    const [note, setNote] = useState('');

    const [locations, setLocations] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [conditions, setConditions] = useState([]);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [locationsRes, sectorsRes, propertyTypesRes, conditionsRes] = await Promise.all([
                    api.get('/api/v1/locations/'),
                    api.get('/api/v1/sectors/'),
                    api.get('/api/v1/property-types/'),
                    api.get('/api/v1/conditions/')
                ]);

                if (
                    locationsRes.status === 200 &&
                    sectorsRes.status === 200 &&
                    propertyTypesRes.status === 200 &&
                    conditionsRes.status === 200
                ) {
                    setLocations(locationsRes.data);
                    setSectors(sectorsRes.data);
                    setPropertyTypes(propertyTypesRes.data);
                    setConditions(conditionsRes.data);
                    setShow(true);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const res = await api.post('/api/v1/requests/', {
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                email: email,
                location_id: location,
                sector_id: sector,
                property_type_id: propertyType,
                estimated_price: price,
                condition_id: condition,
                note: note
            })

            if (res.status === 201) {
                toast.success('Cerere creată cu succes.')
                setFirstName('');
                setLastName('');
                setPhone('');
                setEmail('');
                setLocation(0);
                setSector(0)
                setNote('');
                setCondition(0);
                setPrice(0);
                setPropertyType(0);
                setErrors({});
            } else {
                setErrors(res.data);
            }
        } catch (error) {
            if (error?.response?.data) {
                setErrors(error.response.data);
            } else {
                setErrors(prev => ({ ...prev, form: 'Încercați mai târziu' }));
            }
        } finally {
            setLoading(false);
        }
    }

    const steps = [
        {
            icon: <HiClipboardCheck className="text-white text-2xl" />,
            text: '1. Semnăm contractul Servicii de brokeraj imobiliar',
        },
        {
            icon: <HiOutlineSearch className="text-white text-2xl" />,
            text: '2. Identificăm potențialii cumpărători',
        },
        {
            icon: <HiOutlineCreditCard className="text-white text-2xl" />,
            text: '3. Stabilim detaliile procesului de vânzare',
        },
        {
            icon: <HiOutlinePencilAlt className="text-white text-2xl" />,
            text: '4. Finalizăm tranzacția',
        },
    ];

    return (
        <>
            <Helmet>
                <title>Vinde-ți proprietatea rapid | Cerere vânzare - LVG Imob</title>
                <meta name="description" content="Completează o cerere de vânzare pentru apartament, casă, spațiu comercial sau teren. Obține consultanță imobiliară profesionistă și găsește cumpărători rapid cu ajutorul echipei LVG Imob." />
                <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
            </Helmet>

            <ToastContainer position="bottom-left" autoClose={5000} />
            <section className='py-[60px] sm:py-[80px] px-[12px] flex flex-col md:flex-row gap-[40px] xl:gap-[80px] justify-between sm:container sm:mx-auto' style={{ minHeight: "calc(100vh - 88px - 561px)" }}>
                {
                    !show && (
                        <div className={`w-full h-full flex justify-center items-center pointer-events-none`}>
                            <Reordering />
                        </div>
                    )
                }

                {
                    show && (
                        <>
                            <div className="flex flex-col gap-[30px] w-full md:max-w-[60%]">
                                <div className="flex flex-col">
                                    <p className='font-poppins text-[#181616] text-[26px] xxs:text-[30px] font-[500]'>Completați cererea</p>
                                    <p className='font-body text-[#181616] tracking-wide text-[14px]'>Primiți un răspuns în cel mai scurt timp.</p>
                                </div>
                                <div className="relative min-h-[400px]">
                                    <form
                                        onSubmit={handleSubmit}
                                        className={`flex flex-col gap-[10px] ${loading ? 'opacity-0' : 'opacity-100'}`}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:gap-[20px]">
                                            <div className="flex flex-col gap-[5px] w-full w-1/2">
                                                <p className='text-[14px] font-poppins font-[500]'>Prenume</p>
                                                <input type="text" name="prenume" id="prenume"
                                                    className='font-body px-[24px] py-[17px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                                                    placeholder='Prenume'
                                                    value={firstName}
                                                    onChange={(e) => { setFirstName(e.target.value); const { first_name, ...rest } = errors; setErrors(rest); }} />
                                                <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.first_name ? 'opacity-100' : 'opacity-0'}`}>{errors.first_name || '.'}</p>
                                            </div>
                                            <div className="flex flex-col gap-[5px] w-full w-1/2">
                                                <p className='text-[14px] font-poppins font-[500]'>Nume</p>
                                                <input type="text" name="nume" id="nume"
                                                    className='font-body px-[24px] py-[17px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                                                    placeholder='Nume'
                                                    value={lastName}
                                                    onChange={(e) => { setLastName(e.target.value); const { last_name, ...rest } = errors; setErrors(rest); }} />
                                                <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.last_name ? 'opacity-100' : 'opacity-0'}`}>{errors.last_name || '.'}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col lg:flex-row lg:gap-[20px]">
                                            <div className="flex flex-col gap-[5px] w-full w-1/2">
                                                <p className='text-[14px] font-poppins font-[500]'>Adresă de email</p>
                                                <input type="email" name="email" id="email"
                                                    className='font-body px-[24px] py-[17px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                                                    placeholder='Adresă de email'
                                                    value={email}
                                                    onChange={(e) => { setEmail(e.target.value); const { email, ...rest } = errors; setErrors(rest); }} />
                                                <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.email ? 'opacity-100' : 'opacity-0'}`}>{errors.email || '.'}</p>
                                            </div>
                                            <div className="flex flex-col gap-[5px] w-full w-1/2">
                                                <p className='text-[14px] font-poppins font-[500]'>Număr de telefon</p>
                                                <input type="tel" name="phone" id="phone" 
                                                    inputMode="numeric"
                                                    pattern="^\+?\d{0,15}$"
                                                    className='font-body px-[24px] py-[17px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px] num'
                                                    placeholder='Număr de telefon'
                                                    value={phone}
                                                    onChange={(e) => {
                                                        const input = e.target.value;
                                                        const formatted = input.replace(/(?!^\+)[^\d]/g, '');
                                                        setPhone(formatted);
                                                        const { phone, ...rest } = errors;
                                                        setErrors(rest);
                                                    }} 
                                                />
                                                <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.phone ? 'opacity-100' : 'opacity-0'}`}>{errors.phone || '.'}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col lg:flex-row lg:gap-[20px]">
                                            <div className="flex flex-col gap-[5px] w-full w-1/2">
                                                <p className='text-[14px] font-poppins font-[500]'>Tipul proprietății</p>
                                                <select name="propertyType" id="propertyType"
                                                    className='font-body px-[24px] py-[17px] text-[#181616] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                                                    value={propertyType || ''}
                                                    onChange={(e) => { setPropertyType(e.target.value); const { property_type_id, ...rest } = errors; setErrors(rest); }}>
                                                    <option value="" disabled>Tipul proprietății</option>
                                                    {propertyTypes.map((type) => (
                                                        <option key={type.id} value={type.id}>
                                                            {type.type}
                                                        </option>
                                                    ))}
                                                </select>
                                                <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.property_type_id ? 'opacity-100' : 'opacity-0'}`}>{errors.property_type_id || '.'}</p>
                                            </div>
                                            <div className="flex flex-col gap-[5px] w-full w-1/2">
                                                <p className='text-[14px] font-poppins font-[500]'>Locație</p>
                                                <select
                                                    name="locationSector"
                                                    id="locationSector"
                                                    className="font-body px-[24px] py-[17px] text-[#181616] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]"
                                                    value={
                                                        sector ? `sector-${sector}` :
                                                            location ? `location-${location}` :
                                                                ''
                                                    }
                                                    onChange={(e) => {
                                                        const selectedValue = e.target.value;

                                                        if (selectedValue.startsWith('sector-')) {
                                                            const id = parseInt(selectedValue.replace('sector-', ''));
                                                            setLocation(1);
                                                            setSector(id);
                                                        } else if (selectedValue.startsWith('location-')) {
                                                            const id = parseInt(selectedValue.replace('location-', ''));
                                                            setLocation(id);
                                                            setSector(null);
                                                        }

                                                        const { location: locErr, sector: sectorErr, ...rest } = errors;
                                                        setErrors(rest);
                                                    }}

                                                >
                                                    <option value="" disabled>
                                                        Locație
                                                    </option>

                                                    <optgroup label="Chișinău">
                                                        {sectors.map((sector) => (
                                                            <option key={`sector-${sector.id}`} value={`sector-${sector.id}`}>
                                                                {sector.sector}
                                                            </option>
                                                        ))}
                                                    </optgroup>

                                                    <optgroup label="Altele">
                                                        {locations
                                                            .filter((loc) => loc.id !== 1)
                                                            .map((loc) => (
                                                                <option key={`location-${loc.id}`} value={`location-${loc.id}`}>
                                                                    {loc.location}
                                                                </option>
                                                            ))}
                                                    </optgroup>

                                                </select>
                                                <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${(errors?.location_id || errors?.sector_id) ? 'opacity-100' : 'opacity-0'}`}>{errors.location_id || errors.sector_id || '.'}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col lg:flex-row lg:gap-[20px]">
                                            <div className="flex flex-col gap-[5px] w-full w-1/2">
                                                <p className='text-[14px] font-poppins font-[500]'>Condiție</p>
                                                <select name="condition" id="condition"
                                                    className='font-body px-[24px] py-[17px] text-[#181616] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                                                    value={condition || ''}
                                                    onChange={(e) => { setCondition(e.target.value); const { condition_id, ...rest } = errors; setErrors(rest); }}>
                                                    <option value="" disabled>Condiție</option>
                                                    {conditions.map((con) => (
                                                        <option key={con.id} value={con.id}>
                                                            {con.condition}
                                                        </option>
                                                    ))}
                                                </select>
                                                <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.condition_id ? 'opacity-100' : 'opacity-0'}`}>{errors.condition_id || '.'}</p>
                                            </div>
                                            <div className="flex flex-col gap-[5px] w-full w-1/2">
                                                <p className='text-[14px] font-poppins font-[500]'>Preț estimativ</p>
                                                <div className="font-body flex gap-[5px] px-[24px] py-[17px] rounded-[5px] border-[1px] border-gray-300 text-[17px]">
                                                    <p>€</p>
                                                    <input
                                                    type="text"
                                                    name="price"
                                                    id="price"
                                                    inputMode="numeric"
                                                    pattern="\d*"
                                                    className='outline-none w-full'
                                                    placeholder='Preț estimativ'
                                                    value={price}
                                                    onChange={(e) => {
                                                        let input = e.target.value.replace(/[^\d]/g, '');

                                                        if (input.length > 1 && input.startsWith('0')) {
                                                            input = input.replace(/^0+/, '');
                                                        }

                                                        if (input === '') {
                                                            setPrice(0);
                                                        } else {
                                                            setPrice(input);
                                                        }

                                                        const { estimated_price, ...rest } = errors;
                                                        setErrors(rest);
                                                    }}
                                                    />
                                                </div>
                                                <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.estimated_price ? 'opacity-100' : 'opacity-0'}`}>{errors.estimated_price || '.'}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-[5px]">
                                            <p className='text-[14px]  font-poppins font-[500]'>Note</p>
                                            <textarea name="note" id="note"
                                                className='font-body px-[24px] py-[17px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px] min-h-[90px]'
                                                placeholder='Note'
                                                value={note}
                                                onChange={(e) => { setNote(e.target.value); const { note, ...rest } = errors; setErrors(rest); }}></textarea>
                                            <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.note ? 'opacity-100' : 'opacity-0'}`}>{errors.note || '.'}</p>
                                        </div>
                                        <button type="submit" className='py-[20px] rounded-[5px] font-[500] cursor-pointer uppercase text-white text-[15px] font-body flex items-center justify-center gap-[10px] transition-all duration-150 ease-in btn btn-main'>
                                            Trimite
                                            <IoIosSend className='text-2xl' />
                                        </button>
                                        <p className={`text-[14px] text-red-400 text-center mt-[10px] transition-opacity font-body duration-150 ease-in ${errors?.form ? 'opacity-100' : 'opacity-0'}`}>{errors.form || '.'}</p>
                                    </form>

                                    <div className={`absolute top-0 left-0 w-full h-full flex justify-center items-center ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                        <Reordering />
                                    </div>
                                </div>

                            </div>

                            <div className="max-w-md mx-auto space-y-[8px] md:mt-[120px]">
                                {steps.map(({ icon, text }, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="relative flex flex-col items-center">
                                            <div
                                                className="flex items-center justify-center rounded-[5px] p-[11px]"
                                                style={{ backgroundColor: '#d5ab63' }}
                                            >
                                                {React.cloneElement(icon, { className: 'text-white text-3xl' })}
                                            </div>

                                            {idx !== steps.length - 1 && (
                                                <span
                                                    className="block w-[2px] bg-[#d5ab63] flex-grow mt-2"
                                                    style={{ minHeight: '40px' }}
                                                />
                                            )}
                                        </div>

                                        <p className="text-[#181616] font-poppins text-[16px] cstmv:text-[18px] font-[500] tracking-wide">{text}</p>
                                    </div>
                                ))}
                            </div>

                        </>
                    )
                }
            </section>
        </>
    )
}

export default Request

import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import api from '../api';
import "../styles/gradientButton.css"
import { IoIosSend } from "react-icons/io";
import Reordering from '../components/Reordering';
import { Helmet } from 'react-helmet-async';

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            const res = await api.post('/api/v1/messages/', {
                name, email, phone, subject, message
            })

            if (res.status === 201) {
                toast.success('Mesaj trimis cu succes.')
                setName('');
                setEmail('');
                setPhone('');
                setSubject('');
                setMessage('');
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

    return (
        <>
            <Helmet>
                <title>Contactează-ne | LVG Imob</title>
                <meta name="description" content='Consultanță imobiliară profesionistă și suport complet de la LVG Imob' />
                <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
            </Helmet>

            <ToastContainer position="bottom-left" autoClose={5000} />
            <section className='py-[60px] sm:py-[80px] px-[12px] flex flex-col md:flex-row gap-[40px] xl:gap-[80px] justify-between sm:container sm:mx-auto' style={{ minHeight: "calc(100vh - 88px - 561px)" }}>
                <div className="flex flex-col gap-[30px] w-full md:max-w-1/2">
                    <div className="flex flex-col">
                        <p className='font-poppins text-[#181616] text-[26px] xxs:text-[30px] font-[500]'>Contactează-ne</p>
                        <p className='font-body text-[#181616] tracking-wide text-[14px]'>Pentru întrebări sau sugestii, nu ezista să ne contactezi. Suntem aici să te ajutăm!</p>
                    </div>
                    <div className="relative min-h-[400px]">
                        <form
                            onSubmit={handleSubmit}
                            className={`flex flex-col gap-[10px] ${loading ? 'opacity-0' : 'opacity-100'}`}
                        >
                            <div className="flex flex-col gap-[5px]">
                                <p className='text-[14px] font-poppins font-[500]'>Nume</p>
                                <input type="text" name="username" id="username"
                                    className='font-body px-[24px] py-[17px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                                    placeholder='Nume'
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); const { name, ...rest } = errors; setErrors(rest); }} />
                                <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.name ? 'opacity-100' : 'opacity-0'}`}>{errors.name || '.'}</p>
                            </div>
                            <div className="flex flex-col gap-[5px]">
                                <p className='text-[14px] font-poppins font-[500]'>Adresă de email</p>
                                <input type="email" name="email" id="email"
                                    className='font-body px-[24px] py-[17px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                                    placeholder='Adresă de email'
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); const { email, ...rest } = errors; setErrors(rest); }} />
                                <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.email ? 'opacity-100' : 'opacity-0'}`}>{errors.email || '.'}</p>
                            </div>
                            <div className="flex flex-col gap-[5px]">
                                <p className='text-[14px] font-poppins font-[500]'>Număr de telefon</p>
                                <input type="tel" name="phone" id="phone" 
                                    inputMode="numeric"
                                    pattern="^\+?\d{0,15}$"
                                    className='font-body px-[24px] py-[17px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
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
                            <div className="flex flex-col gap-[5px]">
                                <p className='text-[14px] font-poppins font-[500]'>Subiect</p>
                                <input type="text" name="subject" id="subject"
                                    className='font-body px-[24px] py-[17px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                                    placeholder='Subiect'
                                    value={subject}
                                    onChange={(e) => { setSubject(e.target.value); const { subject, ...rest } = errors; setErrors(rest); }} />
                                <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.subject ? 'opacity-100' : 'opacity-0'}`}>{errors.subject || '.'}</p>
                            </div>
                            <div className="flex flex-col gap-[5px]">
                                <p className='text-[14px] font-poppins font-[500]'>Mesaj</p>
                                <textarea name="subject" id="subject"
                                    className='font-body px-[24px] py-[17px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px] min-h-[90px]'
                                    placeholder='Mesaj'
                                    value={message}
                                    onChange={(e) => { setMessage(e.target.value); const { message, ...rest } = errors; setErrors(rest); }}></textarea>
                                <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.message ? 'opacity-100' : 'opacity-0'}`}>{errors.message || '.'}</p>
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

                <hr className='md:hidden -mt-[10px]' />

                <div className="flex flex-col gap-[40px] xl:gap-[50px] w-full md:w-1/2">
                    <div className="flex flex-col gap-[10px]">
                        <p className='font-poppins text-[#181616] text-[24px] xxs:text-[28px] font-[500] '>Contactele noastre</p>
                        <div className="flex flex-col xl:flex-row gap-[15px] xl:gap-[20px] justify-between w-full">
                            <div className="flex flex-col">
                                <p className='text-[14px] text-[#181616] font-poppins font-[500] opacity-[0.8]'>Telefon</p>
                                <a href="tel:+37369003757" className='text-[#181616] font-body hover:text-[#d5ab63] hover:underline transition-all duration-75 ease-in'>+373 690 03 757</a>
                            </div>
                            <div className="flex flex-col">
                                <p className='text-[14px] text-[#181616] font-poppins font-[500] opacity-[0.8]'>Email</p>
                                <a href="mailto:lvgimob1@gmail.com" className='text-[#181616] font-body hover:text-[#d5ab63] hover:underline transition-all duration-75 ease-in'>lvgimob1@gmail.com</a>
                            </div>
                            <div className="flex flex-col">
                                <p className='text-[14px] text-[#181616] font-poppins font-[500] opacity-[0.8]'>Adresă</p>
                                <a href="https://www.google.com/maps/place/Agen%C8%9Bie+Imobiliar%C4%83+Ungheni+-+Lvgimob/@47.2206114,27.7975545,563m/data=!3m2!1e3!4b1!4m6!3m5!1s0x40cb010073c8c953:0x4a526c713659f665!8m2!3d47.2206078!4d27.8001294!16s%2Fg%2F11wwq2qrbk?entry=ttu&g_ep=EgoyMDI1MDUxMy4xIKXMDSoASAFQAw%3D%3D" target='_blank' className='text-[#181616] font-body hover:text-[#d5ab63] hover:underline transition-all duration-75 ease-in'>
                                    Ungheni, Strada Ion Creangă 4
                                </a>
                            </div>
                        </div>
                    </div>

                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2452.2225038066495!2d27.797554475862736!3d47.2206114145529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40cb010073c8c953%3A0x4a526c713659f665!2sAgen%C8%9Bie%20Imobiliar%C4%83%20Ungheni%20-%20Lvgimob!5e1!3m2!1sen!2s!4v1747379980505!5m2!1sen!2s" className='w-full h-full rounded-[5px] min-h-[350px] outline-none' style={{ border: 0 }} allowFullScreen referrerPolicy="no-referrer-when-downgrade" loading="lazy"></iframe>
                </div>
            </section>
        </>
    )
}

export default Contact

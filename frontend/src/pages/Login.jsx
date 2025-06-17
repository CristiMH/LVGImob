import { useState, useEffect, useContext } from 'react'
import banner from '../assets/login-img.png'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { SiSimplelogin } from "react-icons/si";
import scrollContext from '../contexts/scrollContext'
import "../styles/gradientButton.css"
import { useCookies } from 'react-cookie';
import api from '../api';
import { useNavigate } from 'react-router';
import Reordering from '../components/Reordering';
import EmailModal from '../components/EmailModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import { Helmet } from 'react-helmet-async';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inputType, setInputType] = useState('password')
  const [cookies, setCookie] = useCookies(['acc', 'ref']);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { enableScroll, disableScroll } = useContext(scrollContext)

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');

  const [emailModal, setEmailModal] = useState(false);

  useEffect(() => {
    if (!emailModal) {
      enableScroll()
    } else {
      disableScroll()
    }
  }, [emailModal])

  useEffect(() => {
    if (cookies.acc) {
      navigate('/utilizatori');
    }
  }, [cookies, navigate]);

  const validateForm = () => {
    let isValid = true;

    if (!username) {
      setUsernameError('Acest câmp este obligatoriu');
      setFormError('');
      isValid = false;
    } else {
      setUsernameError('');
    }

    if (!password) {
      setPasswordError('Acest câmp este obligatoriu');
      setFormError('');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        const res = await api.post('/api/v1/token/', { username, password });
        if (res.data.access && res.data.refresh) {
          setCookie('acc', res.data.access, { path: '/' });
          setCookie('ref', res.data.refresh, { path: '/' });
          navigate('/utilizatori?page=1');
        }
      } catch (error) {
        setFormError("Username sau parolă greșită");
        setPassword('')
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin LVG Imob</title>
        <meta name="description" content='Panou de administrare pentru LVG Imob' />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
      </Helmet>

      <ToastContainer position="bottom-left" autoClose={5000} />
      <section className='py-[60px] sm:py-[80px] xl:py-[120px] px-[12px] sm:container sm:mx-auto' style={{ minHeight: "calc(100vh - 88px - 561px)" }}>
        <div className="shadow-[0_4.8px_24.4px_rgba(19,16,34,0.15)] rounded-[5px] bg-white p-[24px] flex flex-col lg:flex-row gap-[36px] border-[1px] border-gray-100 relative">
          <img src={banner} loading="lazy" className='w-full lg:max-w-1/2 object-cover rounded-[5px]' />

          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-10">
              <Reordering />
            </div>
          )}

          <form onSubmit={handleSubmit} className={`w-full lg:max-w-1/2 flex flex-col gap-[40px] text-[#181616] ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-150 ease-in`}>
            <h3 className='font-poppins text-[27px] xxs:text-[30px] cstm:text-[36px] font-[400]'>Autentificare <span className='whitespace-nowrap'>LVG Imob</span></h3>

            <div className="flex flex-col gap-[10px]">
              <p className='text-[14px] font-poppins font-[500]'>Username</p>
              <input type="text" name="username" id="username"
                className='font-body px-[24px] py-[17px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                placeholder='Username'
                value={username}
                onChange={(e) => { setUsername(e.target.value); setUsernameError(''); }} />
              <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${usernameError ? 'opacity-100' : 'opacity-0'}`}>{usernameError ? usernameError : '.'}</p>
            </div>

            <div className="flex flex-col gap-[10px] -mt-[15px]">
              <p className='text-[14px] font-poppins font-[500]'>Parola</p>
              <div className="flex pr-[24px] rounded-[5px] border-[1px] border-gray-300 items-center text-[17px]">
                <input type={inputType} name="password" id="password"
                  className='font-body w-full outline-none pr-[12px] pl-[24px] py-[17px]'
                  placeholder='Parola'
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }} />
                {
                  inputType === 'text'
                    ? (<FaEyeSlash onClick={() => setInputType('password')} className='text-xl text-gray-500 cursor-pointer' />)
                    : (<FaEye onClick={() => setInputType('text')} className='text-xl text-gray-500 cursor-pointer' />)
                }
              </div>
              <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${passwordError ? 'opacity-100' : 'opacity-0'}`}>{passwordError ? passwordError : '.'}</p>
            </div>

            <button type="submit" className='-mt-[15px] py-[20px] rounded-[5px] font-[500] cursor-pointer uppercase text-white text-[15px] font-body flex items-center justify-center gap-[10px] transition-all duration-150 ease-in btn btn-main'>
              Login
              <SiSimplelogin className='text-2xl' />
            </button>
            <p className={`text-[14px] text-red-400 text-center -mt-[20px] transition-opacity font-body duration-150 ease-in ${formError ? 'opacity-100' : 'opacity-0'}`}>{formError ? formError : '.'}</p>

            <div className="text-center text-gray-500 font-body -mt-[10px]">
              Ai uitat parola? <span className='underline text-[#d5ab63] cursor-pointer whitespace-nowrap' onClick={() => setEmailModal(true)}>Reseteaz-o</span>
            </div>
          </form>
        </div>
      </section>

      {
        emailModal && (
          <>
            <div
              onClick={() => setEmailModal(false)}
              style={{ cursor: "url('/cursors/cross.cur') 6 6, pointer" }}
              className="fixed top-0 left-0 z-[998] h-screen w-full bg-black/60"
            ></div>

            <div className="fixed top-1/2 left-1/2 z-[999] w-full max-w-[350px] transform -translate-x-1/2 -translate-y-1/2">
              <EmailModal setEmailModal={setEmailModal} />
            </div>
          </>
        )
      }
    </>
  )
}

export default Login
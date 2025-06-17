import { useState, useEffect } from 'react';
import api from '../api';
import '../styles/select.css';
import Reordering from '../components/Reordering';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { IoMdClose } from "react-icons/io";

const UserModal = ({ visible, onClose, onSaved, userToEdit, userTypes }) => {
  const isEdit = Boolean(userToEdit);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    user_type_id: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState('password')

  useEffect(() => {
    if (userToEdit) {
      setForm({
        first_name: userToEdit.first_name || '',
        last_name: userToEdit.last_name || '',
        email: userToEdit.email || '',
        phone: userToEdit.phone || '',
        user_type_id: userToEdit.user_type?.id || '',
        username: userToEdit.username || '',
        password: userToEdit.password || ''
      });
    } else {
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        user_type_id: '',
        username: '',
        password: ''
      });
    }
  }, [userToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formatted = name === 'phone' ? value.replace(/(?!^\+)[^\d]/g, '') : value;

    setForm((prev) => ({ ...prev, [name]: formatted }));

    setErrors((prev) => {
      const { [name]: removed, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...form };
      let res;
      if (isEdit) {
        delete payload.password;
        res = await api.patch(`/api/v1/users/${userToEdit.id}/`, payload);
      } else {
        res = await api.post(`/api/v1/users/`, payload);
      }

      if (res.status === 201) {
        toast.success("Utilizatorul a fost creat.")
      } else {
        toast.success("Utilizatorul a fost modificat.")
      }

      onSaved();
      onClose();
    } catch (error) {
      if (error?.response?.data) {
        setErrors(error.response.data);
        if (error?.response?.data?.detail) {
          setErrors(prev => ({ ...prev, form: `${error.response.data.detail}` }));
        }
      } else {
        setErrors(prev => ({ ...prev, form: 'Încercați mai târziu' }));
      }
    } finally {
      setLoading(false);
    }
  };


  if (!visible) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{ cursor: "url('/cursors/cross.cur') 6 6, pointer" }}
        className="fixed top-0 left-0 z-[998] h-screen w-full bg-black/60"
      />
      <div className="fixed top-1/2 left-1/2 z-[999] w-full max-w-[400px] overflow-y-auto max-h-[100vh] transform -translate-x-1/2 -translate-y-1/2">
        <form onSubmit={handleSubmit} className="bg-white rounded-[5px] p-[30px] w-full flex flex-col gap-[3px] h-full">
          <div className="flex justify-end p-[10px]">
            <IoMdClose
              onClick={onClose}
              className="text-3xl bg-gray-300 rounded-full p-[5px] hover:bg-black hover:text-white transition-all duration-100 ease-in cursor-pointer"
            />
          </div>
          <h2 className="text-[20px] font-poppins font-[500] mb-[10px]">{isEdit ? 'Modifică utilizator' : 'Adaugă utilizator'}</h2>

          {loading ? (
            <div className="py-[60px] flex justify-center items-center">
              <Reordering />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-[3px]">
                <div className="flex flex-col gap-[5px]">
                  <p className='text-[14px] font-poppins font-[500]'>Prenume</p>
                  <input type="text" name="first_name" id="first_name"
                    className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                    placeholder='Prenume'
                    value={form.first_name}
                    onChange={handleChange} />
                  <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.first_name ? 'opacity-100' : 'opacity-0'}`}>{errors.first_name || '.'}</p>
                </div>

                <div className="flex flex-col">
                  <p className='text-[14px] font-poppins font-[500]'>Nume</p>
                  <input type="text" name="last_name" id="last_name"
                    className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                    placeholder='Nume'
                    value={form.last_name}
                    onChange={handleChange} />
                  <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.last_name ? 'opacity-100' : 'opacity-0'}`}>{errors.last_name || '.'}</p>
                </div>

                <div className="flex flex-col">
                  <p className='text-[14px] font-poppins font-[500]'>Username</p>
                  <input type="text" name="username" id="username"
                    className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                    placeholder='Username'
                    value={form.username}
                    onChange={handleChange} />
                  <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.username ? 'opacity-100' : 'opacity-0'}`}>{errors.username ? errors.username : '.'}</p>
                </div>

                {!isEdit && (
                  <div className="flex flex-col">
                    <p className='text-[14px] font-poppins font-[500]'>Parola</p>
                    <div className="flex pr-[24px] rounded-[5px] border-[1px] border-gray-300 items-center text-[17px]">
                      <input type={inputType} name="password" id="password"
                        className='font-body w-full outline-none pr-[12px] pl-[24px] py-[13px]'
                        placeholder='Parola'
                        value={form.password}
                        onChange={handleChange} />
                      {
                        inputType === 'text'
                          ? (<FaEyeSlash onClick={() => setInputType('password')} className='text-xl text-gray-500 cursor-pointer' />)
                          : (<FaEye onClick={() => setInputType('text')} className='text-xl text-gray-500 cursor-pointer' />)
                      }
                    </div>
                    <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.password ? 'opacity-100' : 'opacity-0'}`}>{errors.password || '.'}</p>
                  </div>
                )}

                <div className="flex flex-col">
                  <p className='text-[14px] font-poppins font-[500]'>Email</p>
                  <input type="email" name="email" id="email"
                    className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                    placeholder='Email'
                    value={form.email}
                    onChange={handleChange} />
                  <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.email ? 'opacity-100' : 'opacity-0'}`}>{errors.email || '.'}</p>
                </div>

                <div className="flex flex-col">
                  <p className='text-[14px] font-poppins font-[500]'>Număr de telefon</p>
                  <input type="tel" name="phone" id="phone"
                    inputMode="numeric"
                    pattern="^\+?\d{0,15}$"
                    className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                    placeholder='Număr de telefon'
                    value={form.phone}
                    onChange={handleChange} />
                  <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.phone ? 'opacity-100' : 'opacity-0'}`}>{errors.phone || '.'}</p>
                </div>

                <div className="flex flex-col gap-[5px] w-full w-1/2">
                  <p className='text-[14px] font-poppins font-[500]'>Funcția</p>
                  <select name="user_type_id" id="user_type_id"
                    className='font-body px-[24px] py-[13px] text-[#181616] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                    value={form.user_type_id}
                    onChange={handleChange}>
                    <option value="" disabled>Funcția</option>
                    {userTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.type}</option>
                    ))}
                  </select>
                  <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.user_type_id ? 'opacity-100' : 'opacity-0'}`}>{errors.user_type_id || '.'}</p>
                </div>
              </div>

              <div className="flex justify-end gap-[15px]">
                <p onClick={onClose} className="text-gray-600 items-center flex cursor-pointer hover:text-gray-900 transition-all duration-75 ease-in">Anulează</p>
                <button type="submit" disabled={loading} className='px-[20px] py-[9px] rounded-[5px] font-[500] cursor-pointer uppercase text-white text-[15px] font-body flex items-center justify-center gap-[10px] transition-all duration-150 ease-in btn btn-main'>
                  {isEdit ? 'Salvează' : 'Adaugă'}
                </button>
              </div>
              <p className={`text-[14px] text-red-400 text-center mt-[10px] transition-opacity font-body duration-150 ease-in ${errors?.form ? 'opacity-100' : 'opacity-0'}`}>{errors.form || '.'}</p>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default UserModal;

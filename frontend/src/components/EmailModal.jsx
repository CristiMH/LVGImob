import { useState } from "react"
import { IoIosSend } from "react-icons/io";
import api from '../api';
import Reordering from '../components/Reordering';
import { IoMdClose } from "react-icons/io";
import { toast } from 'react-toastify';

const EmailModal = ({ setEmailModal }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            const res = await api.post('/api/v1/password-reset/request/', { email });
            if (res.status === 200) {
                toast.success(res.data.detail);
                setEmailModal(false);
            }
        } catch (error) {
            setError(error.response.data.email);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-w-[260px] max-w-[350px] w-full pb-[40px] pt-[15px] px-[15px] flex flex-col gap-[15px] bg-white rounded-[5px]'>
            <IoMdClose onClick={() => { setEmailModal(false); }} className='text-3xl bg-gray-300 rounded-full p-[5px] ml-auto hover:bg-black hover:text-white transition-all duration-100 ease-in cursor-pointer' />

            {
                !loading && (
                    <p className='text-[18px] font-poppins font-[500] text-center -mt-[20px]'>Email</p>
                )
            }

            {loading ? (
                <div className="flex justify-center items-center">
                    <Reordering />
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex pr-[24px] rounded-[5px] border-[1px] border-gray-300 items-center text-[17px] max-w-[300px] w-full mx-auto">
                    <input
                        type='email'
                        name="email"
                        id="email"
                        className='font-body w-full outline-none pr-[12px] pl-[24px] py-[17px]'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError('') }}
                    />
                    <button type="submit">
                        <IoIosSend className='text-2xl text-gray-500 cursor-pointer hover:text-black transition-all duration-100 ease-in' />
                    </button>
                </form>
            )}

            <p className={`text-[14px] text-red-400 transition-opacity font-body duration-150 ease-in ${error ? 'opacity-100' : 'opacity-0'} text-center`}>{error}</p>
        </div>
    )
}

export default EmailModal;
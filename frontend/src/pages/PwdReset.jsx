import { useState } from 'react'
import { useParams } from 'react-router'
import api from '../api'
import Reordering from '../components/Reordering'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import { FaEye } from "react-icons/fa"
import { FaEyeSlash } from "react-icons/fa"
import "../styles/gradientButton.css"
import { SiSimplelogin } from "react-icons/si"

const PwdReset = () => {
  const [password, setPassword] = useState('')
  const [inputType, setInputType] = useState('password')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { uid, token } = useParams()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    try {
      const res = await api.post(`/api/v1/password-reset/confirm/${uid}/${token}/`, { new_password: password })
      if (res.status === 200) {
        toast.success(res.data.detail)
        setPassword('');
      }
    } catch (error) {
      if (error.response?.data?.new_password) {
        setError(error.response.data.new_password)
      } else {
        setError(error.response?.data?.detail || 'Eroare')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer position="bottom-left" autoClose={5000} />
      <section className="py-[60px] sm:py-[80px] xl:py-[120px] px-[12px] sm:container sm:mx-auto" style={{ minHeight: "calc(100vh - 88px - 561px)" }}>
        <form
          onSubmit={handleSubmit}
          className="shadow-[0_4.8px_24.4px_rgba(19,16,34,0.15)] py-[25px] rounded-[5px] bg-white px-[24px] flex flex-col gap-[15px] border-[1px] border-gray-100 relative max-w-[350px] w-full mx-auto"
        >
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center z-10 rounded-[5px]">
              <Reordering />
            </div>
          )}

          <p className="text-[14px] font-poppins font-[500]">Password</p>
          <div className="flex pr-[24px] rounded-[5px] border-[1px] border-gray-300 items-center text-[17px]">
            <input
              type={inputType}
              name="password"
              id="password"
              className="font-body w-full outline-none pr-[12px] pl-[24px] py-[17px]"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              disabled={loading}
            />
            {inputType === 'text' ? (
              <FaEyeSlash
                onClick={() => setInputType('password')}
                className="text-xl text-gray-500 cursor-pointer"
              />
            ) : (
              <FaEye onClick={() => setInputType('text')} className="text-xl text-gray-500 cursor-pointer" />
            )}
          </div>
          <p
            className={`text-[14px] text-red-400 transition-opacity duration-150 ease-in font-body ${
              error ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {error}
          </p>
          <button
            type="submit"
            disabled={loading}
            className="py-[15px] rounded-[5px] font-[500] cursor-pointer uppercase text-white text-[15px] font-body flex items-center justify-center gap-[10px] transition-all duration-150 ease-in btn btn-main"
          >
            Confirmă
            <SiSimplelogin className="text-2xl" />
          </button>
        </form>
      </section>
    </>
  )
}

export default PwdReset
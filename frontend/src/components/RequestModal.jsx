import { useState, useEffect } from 'react';
import api from '../api';
import '../styles/select.css';
import Reordering from '../components/Reordering';
import { toast } from 'react-toastify';
import { confirmDialog } from 'primereact/confirmdialog';
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { IoMdClose } from "react-icons/io";

const RequestModal = ({ visible, onClose, onSave, request, setRequest, onDelete }) => {
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(null)

  if (!visible) return null;

  useEffect(() => {
    const createdAt = new Date(request.created_at);
    const day = String(createdAt.getDate()).padStart(2, '0');
    const month = String(createdAt.getMonth() + 1).padStart(2, '0');
    const year = createdAt.getFullYear();
    const hours = String(createdAt.getHours()).padStart(2, '0');
    const minutes = String(createdAt.getMinutes()).padStart(2, '0');

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
    setDate(formattedDate);
  }, [request])

  const confirm = (event) => {
    confirmDialog({
      trigger: event.currentTarget,
      message: `Sigur dorești să ștergi cererea?`,
      header: 'Confirmare',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Da',
      rejectLabel: 'Nu',
      accept: () => { onDelete(); onClose(); }
    });
  }

  const updateStatus = async (id, value) => {
    setLoading(true);

    try {
      const res = await api.patch(`/api/v1/requests/${id}/`, { approved: value });
      setRequest(res.data);
      onSave();
      setTimeout(() => setLoading(false), 500);
    } catch (error) {
      toast.error('Eroare la modificarea status-ului')
      console.log(error)
      setLoading(false);
    }
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{ cursor: "url('/cursors/cross.cur') 6 6, pointer" }}
        className="fixed top-0 left-0 z-[998] h-screen w-full bg-black/60"
      />
      <div className="fixed top-1/2 left-1/2 z-[999] w-full max-w-[400px] overflow-y-auto max-h-[100vh] transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-white rounded-[5px] p-[30px] w-full flex flex-col gap-[10px] h-full">
          <div className="flex justify-end p-[10px]">
            <IoMdClose
              onClick={onClose}
              className="text-3xl bg-gray-300 rounded-full p-[5px] hover:bg-black hover:text-white transition-all duration-100 ease-in cursor-pointer"
            />
          </div>
          {
            loading ? (
              <div className="flex items-center justify-center">
                <Reordering />
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-[3px]">
                  <div className="flex flex-col gap-[5px]">
                    <p className='text-[14px] font-poppins font-[500]'>Nume</p>
                    <input type="text" name="Nume" id="Nume"
                      className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                      placeholder='Nume'
                      value={request.last_name}
                      readOnly />
                  </div>
                </div>
                <div className="flex flex-col gap-[3px]">
                  <div className="flex flex-col gap-[5px]">
                    <p className='text-[14px] font-poppins font-[500]'>Prenume</p>
                    <input type="text" name="prenume" id="prenume"
                      className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                      placeholder='Prenume'
                      value={request.first_name}
                      readOnly />
                  </div>
                </div>
                <div className="flex flex-col gap-[3px]">
                  <div className="flex flex-col gap-[5px]">
                    <p className='text-[14px] font-poppins font-[500]'>Număr de telefon</p>
                    <input type="text" name="phone" id="phone"
                      className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                      placeholder='Număr de telefon'
                      value={request.phone}
                      readOnly />
                  </div>
                </div>
                <div className="flex flex-col gap-[3px]">
                  <div className="flex flex-col gap-[5px]">
                    <p className='text-[14px] font-poppins font-[500]'>Email</p>
                    <input type="email" name="email" id="email"
                      className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                      placeholder='Email'
                      value={request.email}
                      readOnly />
                  </div>
                </div>
                <div className="flex flex-col gap-[3px]">
                  <div className="flex flex-col gap-[5px]">
                    <p className='text-[14px] font-poppins font-[500]'>Locație</p>
                    <input type="text" name="location" id="location"
                      className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                      placeholder='Locație'
                      value={`${request.location.location} ${request?.sector ? `- ${request?.sector?.sector}` : ''}`}
                      readOnly />
                  </div>
                </div>
                <div className="flex flex-col gap-[3px]">
                  <div className="flex flex-col gap-[5px]">
                    <p className='text-[14px] font-poppins font-[500]'>Tipul proprietății</p>
                    <input type="text" name="type" id="type"
                      className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                      placeholder='Tipul proprietății'
                      value={request.property_type.type}
                      readOnly />
                  </div>
                </div>
                <div className="flex flex-col gap-[3px]">
                  <div className="flex flex-col gap-[5px]">
                    <p className='text-[14px] font-poppins font-[500]'>Preț estimativ</p>
                    <input type="text" name="price" id="price"
                      className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                      placeholder='Preț estimativ'
                      value={`€ ${request.estimated_price}`}
                      readOnly />
                  </div>
                </div>
                <div className="flex flex-col gap-[3px]">
                  <div className="flex flex-col gap-[5px]">
                    <p className='text-[14px] font-poppins font-[500]'>Condiție</p>
                    <input type="text" name="condition" id="condition"
                      className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                      placeholder='Condiție'
                      value={request.condition.condition}
                      readOnly />
                  </div>
                </div>
                <div className="flex flex-col gap-[3px]">
                  <div className="flex flex-col gap-[5px]">
                    <p className='text-[14px] font-poppins font-[500]'>Note</p>
                    <textarea type="text" name="notes" id="notes"
                      className='font-body px-[24px] min-h-[70px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                      placeholder='Note'
                      value={request.note}
                      readOnly />
                  </div>
                </div>
                <div className="flex flex-col gap-[3px]">
                  <div className="flex flex-col gap-[5px]">
                    <p className='text-[14px] font-poppins font-[500]'>Creată la</p>
                    <input type="text" name="created" id="created"
                      className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                      placeholder='Trimis la'
                      value={date}
                      readOnly />
                  </div>
                </div>

                <div className="flex flex-col gap-[3px]">
                  <p className='text-[14px] font-poppins font-[500]'>Status</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="approved"
                        value="true"
                        checked={request.approved === true}
                        onChange={() => { updateStatus(request.id, true) }}
                      />
                      Aprobată
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="approved"
                        value="false"
                        checked={request.approved === false}
                        onChange={() => { updateStatus(request.id, false) }}
                      />
                      Neaprobată
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-[15px]">
                  <p onClick={onClose} className="text-gray-600 items-center flex cursor-pointer hover:text-gray-900 transition-all duration-75 ease-in">Anulează</p>
                  <button
                    className="bg-red-500 text-white cursor-pointer rounded-[5px] px-[15px] py-[5px] hover:bg-red-700 transition-all duration-75 ease-in"
                    onClick={(e) => confirm(e)}
                  >
                    Șterge
                  </button>
                </div>

              </>
            )
          }
        </div>
      </div >
    </>
  );
}

export default RequestModal

import { useState, useEffect } from 'react';
import { confirmDialog } from 'primereact/confirmdialog';
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { IoMdClose } from "react-icons/io";

const MessageModal = ({ visible, onClose, message, onDelete }) => {
    const [date, setDate] = useState('')

    if (!visible) return null;

    useEffect(() => {
        const createdAt = new Date(message.created_at);
        const day = String(createdAt.getDate()).padStart(2, '0');
        const month = String(createdAt.getMonth() + 1).padStart(2, '0');
        const year = createdAt.getFullYear();
        const hours = String(createdAt.getHours()).padStart(2, '0');
        const minutes = String(createdAt.getMinutes()).padStart(2, '0');

        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
        setDate(formattedDate);
    }, [message])

    const confirm = (event) => {
        confirmDialog({
            trigger: event.currentTarget,
            message: `Sigur dorești să ștergi mesajul?`,
            header: 'Confirmare',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Da',
            rejectLabel: 'Nu',
            accept: () => { onDelete(); onClose();  }
        });
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

                    <div className="flex flex-col gap-[3px]">
                        <div className="flex flex-col gap-[5px]">
                            <p className='text-[14px] font-poppins font-[500]'>Nume</p>
                            <input type="text" name="Nume" id="Nume"
                                className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                                placeholder='Nume'
                                value={message.name}
                                readOnly />
                        </div>
                    </div>
                    <div className="flex flex-col gap-[3px]">
                        <div className="flex flex-col gap-[5px]">
                            <p className='text-[14px] font-poppins font-[500]'>Email</p>
                            <input type="email" name="email" id="email"
                                className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                                placeholder='Email'
                                value={message.email}
                                readOnly />
                        </div>
                    </div>
                    <div className="flex flex-col gap-[3px]">
                        <div className="flex flex-col gap-[5px]">
                            <p className='text-[14px] font-poppins font-[500]'>Număr de telefon</p>
                            <input type="text" name="phone" id="phone"
                                className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                                placeholder='Număr de telefon'
                                value={message.phone}
                                readOnly />
                        </div>
                    </div>
                    <div className="flex flex-col gap-[3px]">
                        <div className="flex flex-col gap-[5px]">
                            <p className='text-[14px] font-poppins font-[500]'>Subiect</p>
                            <input type="text" name="subject" id="subject"
                                className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                                placeholder='Subiect'
                                value={message.subject}
                                readOnly />
                        </div>
                    </div>
                    <div className="flex flex-col gap-[3px]">
                        <div className="flex flex-col gap-[5px]">
                            <p className='text-[14px] font-poppins font-[500]'>Mesaj</p>
                            <textarea type="text" name="message" id="message"
                                className='font-body px-[24px] min-h-[70px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                                placeholder='Note'
                                value={message.message}
                                readOnly />
                        </div>
                    </div>
                    <div className="flex flex-col gap-[3px]">
                        <div className="flex flex-col gap-[5px]">
                            <p className='text-[14px] font-poppins font-[500]'>Trimis la</p>
                            <input type="text" name="created" id="created"
                                className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                                placeholder='Trimis la'
                                value={date}
                                readOnly />
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
                </div>
            </div>
        </>
    );
}

export default MessageModal

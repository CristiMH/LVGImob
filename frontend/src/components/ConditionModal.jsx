import { useState, useEffect } from 'react';
import api from '../api';
import '../styles/select.css';
import Reordering from '../components/Reordering';
import { toast } from 'react-toastify';

const ConditionModal = ({ visible, onClose, onSaved, conditionToEdit }) => {
    const isEdit = Boolean(conditionToEdit);
    const [condition, setCondition] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (conditionToEdit) {
            setCondition(conditionToEdit.condition)
        } else {
            setCondition('')
        }
    }, [conditionToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let res;
            if (isEdit) {
                res = await api.patch(`/api/v1/conditions/${conditionToEdit.id}/`, { condition: condition });
            } else {
                res = await api.post(`/api/v1/conditions/`, { condition: condition });
            }

            if (res.status === 201) {
                toast.success("Condiția a fost creată.")
            } else {
                toast.success("Condiția a fost modificată.")
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
                    <h2 className="text-[20px] font-poppins font-[500] mb-[10px]">{isEdit ? 'Modifică condiția' : 'Adaugă condiție'}</h2>

                    {loading ? (
                        <div className="py-[60px] flex justify-center items-center">
                            <Reordering />
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-[5px]">
                                <p className='text-[14px] font-poppins font-[500]'>Condiție</p>
                                <input type="text" name="condition" id="condition"
                                    className='font-body px-[24px] py-[13px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px]'
                                    placeholder='Condiție'
                                    value={condition}
                                    onChange={(e) => {setCondition(e.target.value); const { condition, ...rest } = errors; setErrors(rest); }} />
                                <p className={`text-[14px] text-red-400 transition-opacity duration-150 font-body ease-in ${errors?.condition ? 'opacity-100' : 'opacity-0'}`}>{errors.condition || '.'}</p>
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

export default ConditionModal

import { useState, useEffect, useContext } from 'react'
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
import HeatingModal from '../components/HeatingModal';

const Heating = () => {
  const [heatingTypes, setHeatingTypes] = useState([]);
  const [show, setShow] = useState(false);
  const [showHeatModal, setShowHeatModal] = useState(false);
  const [editingHeatingType, setEditingHeatingType] = useState(null);
  const { enableScroll, disableScroll } = useContext(scrollContext)
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    if (!showHeatModal) {
      enableScroll()
    } else {
      disableScroll()
    }
  }, [showHeatModal])

  const fetchHeatingTypes = async () => {
    setLoading(true);

    try {
      const res = await api.get(`/api/v1/heating-types/`);
      setHeatingTypes(res.data);
      setTimeout(() => setLoading(false), 500);
    } catch (error) {
      toast.error('Nu s-a putut încărca informația, încercați mai târziu.');
      setLoading(false)
    }
  };

  useEffect(() => {

    const fetchUser = async () => {
      try {
        const res = await api.get("api/v1/me/");
        setUser(res.data);
        return true;
      } catch (error) {
        toast.error('Nu s-au putut încărca datele utilizatorului.');
        return false;
      }
    };

    const loadAll = async () => {
      const ok = await fetchUser();

      setShow(ok);
    };

    loadAll();
    fetchHeatingTypes();
  }, []);


  const deleteHeatingType = async (id) => {
    setLoading(true);

    try {
      await api.delete(`api/v1/heating-types/${id}/`);
      toast.success("Tipul a fost șters.");
      fetchHeatingTypes()
    } catch (err) {
      toast.error("Eroare la ștergerea tipului.");
      setLoading(false);
    }
  };

  const confirm = (event, heatingType) => {
    confirmDialog({
      trigger: event.currentTarget,
      message: `Sigur dorești să ștergi tipul?`,
      header: 'Confirmare',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Da',
      rejectLabel: 'Nu',
      accept: () => { deleteHeatingType(heatingType.id) }
    });
  }

  const handleEdit = (type) => {
    setEditingHeatingType(type);
    setShowHeatModal(true);
  };

  const handleAdd = () => {
    setEditingHeatingType(null);
    setShowHeatModal(true);
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
            (show && !loading) ? (
              <>
                <Sidebar isMobileVisible={sidebarVisible} user_type_id={user?.user_type?.id} />
                <div className="w-full">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <p className="text-[22px] font-[500] tracking-wide font-poppins mb-[10px] order-2 sm:order-1">Încălzire</p>
                    <p className="text-[22px] font-[500] tracking-wide font-poppins mb-[10px] order-1 sm:order-2">{user.last_name} {user.first_name}</p>
                  </div>
                  <button
                    onClick={handleAdd}
                    className="bg-[#0f1115] text-white px-[16px] mb-2 py-[10px] border-[1px] border-[#0f1115] rounded-[5px] cursor-pointer hover:bg-[#d5ab63] hover:border-[#d5ab63] transition-all duration-75 ease-in"
                  >
                    + Adaugă tip
                  </button>
                  <div className="overflow-x-auto">
                    <table className="w-full border rounded-[5px] overflow-hidden min-w-[980px]">
                      <thead className="bg-[#0f1115] text-white font-body">
                        <tr>
                          <th className="py-[6px]">Tip</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {heatingTypes.map((row, idx) => {

                          return (
                            <tr
                              key={row.id}
                              className={`font-body ${idx % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300'} `}
                            >
                              <td className="py-[10px] text-center">{row.type}</td>
                              <td className="text-center">
                                <button
                                  className="bg-blue-500 text-white cursor-pointer rounded-[5px] px-[6px] py-[2px] hover:bg-blue-700 transition-all duration-75 ease-in"
                                  onClick={() => handleEdit(row)}
                                >
                                  Modifică
                                </button>
                                <button
                                  className="bg-red-500 text-white ml-[20px] cursor-pointer rounded-[5px] px-[6px] py-[2px] hover:bg-red-700 transition-all duration-75 ease-in"
                                  onClick={(e) => confirm(e, row)}
                                >
                                  Șterge
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {
                    showHeatModal && <HeatingModal
                      visible={showHeatModal}
                      onClose={() => setShowHeatModal(false)}
                      onSaved={() => fetchHeatingTypes()}
                      heatingToEdit={editingHeatingType}
                    />
                  }
                </div>
              </>
            ) : (
              <div className="w-full justify-center items-center flex  mt-[50px] xl:mt-0">
                <Reordering />
              </div>
            )
          }
        </div>
      </section>
    </>
  )
}

export default Heating
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
import { useSearchParams } from 'react-router-dom';
import RequestModal from '../components/RequestModal';

const Requests = () => {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showReqModal, setShowReqModal] = useState(false);
  const [user, setUser] = useState({});
  const [requests, setRequests] = useState([]);
  const [request, setRequest] = useState({});
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const { enableScroll, disableScroll } = useContext(scrollContext)

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPageFromUrl = parseInt(searchParams.get('page')) || 1;

  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    current: currentPageFromUrl,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("api/v1/me/");
        setUser(res.data);
        setShow(true);
      } catch (error) {
        toast.error('Nu s-au putut încărca datele utilizatorului.');
        setShow(false);
      }
    };

    fetchUser()
  }, [])

  useEffect(() => {
    if (!showReqModal) {
      enableScroll()
    } else {
      disableScroll()
    }
  }, [showReqModal])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchRequests(currentPageFromUrl);
  }, [currentPageFromUrl]);

  const confirm = (event, request) => {
    confirmDialog({
      trigger: event.currentTarget,
      message: `Sigur dorești să ștergi cererea?`,
      header: 'Confirmare',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Da',
      rejectLabel: 'Nu',
      accept: () => { deleteRequest(request.id) }
    });
  }

  const fetchRequests = async (page = 1) => {
    setLoading(true);

    try {
      const params = new URLSearchParams({ page: page.toString() });
      const res = await api.get(`/api/v1/requests/?${params.toString()}`);

      setRequests(res.data.results);
      setPagination({
        count: res.data.count,
        next: res.data.next,
        previous: res.data.previous,
        current: page,
      });
      setSearchParams({ page: page.toString() });

      setTimeout(() => setLoading(false), 500);
    } catch (error) {
      console.log(error);
      toast.error('Nu s-a putut încărca informația, încercați mai târziu.');
      setLoading(false);
    }
  }

  const deleteRequest = async (id) => {
    setLoading(true);

    try {
      await api.delete(`api/v1/requests/${id}/`);
      toast.success("Cererea a fost ștearsă.");

      const newCount = pagination.count - 1;
      const pageSize = 15;
      const newTotalPages = Math.ceil(newCount / pageSize);

      const pageToFetch = pagination.current > newTotalPages ? newTotalPages : pagination.current;

      fetchRequests(pageToFetch > 0 ? pageToFetch : 1);

    } catch (err) {
      toast.error("Eroare la ștergerea cererii.");
      setLoading(false);
    }
  };

  const onSave = () => {
    fetchRequests(pagination.current)
  }

  const totalPages = Math.ceil(pagination.count / 15);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const buttons = [];

    const getButton = (page) => (
      <button
        key={page}
        onClick={() => fetchRequests(page)}
        className={`px-3 py-1 bg-[#0f1115] rounded cursor-pointer font-body hover:scale-[1.03] transition-all duration-75 ease-in ${pagination.current === page ? 'bg-[#d5ab63] text-white' : 'text-white'
          }`}
      >
        {page}
      </button>
    );

    if (pagination.current > 1) {
      buttons.push(
        <button key="first" onClick={() => fetchRequests(1)} className='cursor-pointer hover:scale-[1.03] transition-all duration-75 ease-in'>
          «
        </button>
      );
      buttons.push(
        <button key="prev" onClick={() => fetchRequests(pagination.current - 1)} className='cursor-pointer hover:scale-[1.03] transition-all duration-75 ease-in'>
          ‹
        </button>
      );
    }

    let start = pagination.current - 1;
    let end = pagination.current + 1;

    if (pagination.current === 1) {
      start = 1;
      end = Math.min(3, totalPages);
    } else if (pagination.current === totalPages) {
      end = totalPages;
      start = Math.max(1, totalPages - 2);
    }

    for (let i = start; i <= end; i++) {
      buttons.push(getButton(i));
    }

    if (pagination.current < totalPages) {
      buttons.push(
        <button key="next" onClick={() => fetchRequests(pagination.current + 1)} className='cursor-pointer hover:scale-[1.03] transition-all duration-75 ease-in'>
          ›
        </button>
      );
      buttons.push(
        <button key="last" onClick={() => fetchRequests(totalPages)} className='cursor-pointer hover:scale-[1.03] transition-all duration-75 ease-in'>
          »
        </button>
      );
    }

    return (
      <div className="flex gap-[10px] mt-[20px] flex-wrap text-[14px] justify-center items-center">
        {buttons}
      </div>
    );
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
                <div className="w-full min-h-[415px]">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <p className="text-[22px] font-[500] tracking-wide font-poppins mb-[10px] order-2 sm:order-1">Cereri ({pagination.count})</p>
                    <p className="text-[22px] font-[500] tracking-wide font-poppins mb-[10px] order-1 sm:order-2">{user.last_name} {user.first_name}</p>
                  </div>
                  {
                    false ? (
                      <div className="flex justify-center items-center w-full">
                        <Reordering />
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full border rounded-[5px] overflow-hidden min-w-[980px]">
                            <thead className="bg-[#0f1115] text-white font-body">
                              <tr>
                                <th className="p-[6px]">Nume</th>
                                <th>Prenume</th>
                                <th>Tipul proprietății</th>
                                <th>Status</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {requests.map((row, idx) => {
                                return (
                                  <tr
                                    key={idx}
                                    className={`font-body cursor-pointer ${idx % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300'}`}
                                    onClick={() => {
                                      setRequest(row);
                                      setShowReqModal(true);
                                    }}
                                  >
                                    <td className="py-[10px] text-center">{row.last_name}</td>
                                    <td className="text-center">{row.first_name}</td>
                                    <td className="text-center">{row.property_type.type}</td>
                                    <td className="text-center">{row.approved ? 'Aprobată' : 'Neaprobată'}</td>
                                    <td className="text-center">
                                      <button
                                        className="bg-red-500 text-white ml-[20px] cursor-pointer rounded-[5px] px-[6px] py-[2px] hover:bg-red-700 transition-all duration-75 ease-in"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          confirm(e, row)
                                        }}
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
                        {renderPagination()}
                      </>
                    )
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
      {
        showReqModal && <RequestModal
          visible={showReqModal}
          onClose={() => setShowReqModal(false)}
          request={request}
          onSave={onSave}
          setRequest={setRequest}
          onDelete={() => deleteRequest(request.id)}
        />
      }
    </>
  )
}

export default Requests

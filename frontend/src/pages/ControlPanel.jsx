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
import { useSearchParams } from 'react-router-dom';
import UserModal from '../components/UserModal';
import scrollContext from '../contexts/scrollContext'
import Reordering from '../components/Reordering';

const ControlPanel = () => {
    const [users, setUsers] = useState([]);
    const [userTypes, setUserTypes] = useState([]);
    const [show, setShow] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const { enableScroll, disableScroll } = useContext(scrollContext)
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const currentPageFromUrl = parseInt(searchParams.get('page')) || 1;
    const initialSearch = searchParams.get('search') || '';
    const initialOrdering = searchParams.get('ordering') || 'last_name';

    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [ordering, setOrdering] = useState(initialOrdering);

    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
        current: currentPageFromUrl,
    });

    useEffect(() => {
        if (!showUserModal) {
            enableScroll()
        } else {
            disableScroll()
        }
    }, [showUserModal])

    const fetchUsers = async (page = 1, search = searchTerm, sort = ordering) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                ordering: sort,
            });
            if (search.trim() !== '') {
                params.append('search', search.trim());
            }

            const res = await api.get(`/api/v1/users/?${params.toString()}`);
            setUsers(res.data.results);
            setPagination({
                count: res.data.count,
                next: res.data.next,
                previous: res.data.previous,
                current: page,
            });

            setSearchParams({ page: page.toString(), search: search.trim(), ordering: sort });

            setTimeout(() => setLoading(false), 500);
        } catch (error) {
            toast.error('Nu s-a putut încărca informația, încercați mai târziu.');
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchUsers(currentPageFromUrl);
    }, [currentPageFromUrl]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchUsers(1, searchTerm, ordering);
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchTerm, ordering]);

    useEffect(() => {
        const fetchUserTypes = async () => {
            try {
                const res = await api.get("api/v1/user-types/");
                setUserTypes(res.data);
                return true;
            } catch (error) {
                toast.error('Nu s-a putut încărca funcțiile utilizatorului.');
                return false;
            }
        };

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
            const ok1 = await fetchUserTypes();
            const ok2 = await fetchUser();

            setShow(ok1 && ok2);
        };

        loadAll();
    }, []);


    const deleteUser = async (id) => {
        setLoading(true);

        try {
            await api.delete(`api/v1/users/${id}/`);
            toast.success("Utilizatorul a fost șters.");

            const newCount = pagination.count - 1;
            const pageSize = 15;
            const newTotalPages = Math.ceil(newCount / pageSize);

            const pageToFetch = pagination.current > newTotalPages ? newTotalPages : pagination.current;

            fetchUsers(pageToFetch > 0 ? pageToFetch : 1);
        } catch (err) {
            toast.error("Eroare la ștergerea utilizatorului.");
            setLoading(false);
        }
    };

    const confirm = (event, user) => {
        confirmDialog({
            trigger: event.currentTarget,
            message: `Sigur dorești să ștergi utlizatorul ${user.last_name} ${user.first_name}?`,
            header: 'Confirmare',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Da',
            rejectLabel: 'Nu',
            accept: () => { deleteUser(user.id) }
        });
    }

    const handleEdit = (user) => {
        setEditingUser(user);
        setShowUserModal(true);
    };

    const handleAdd = () => {
        setEditingUser(null);
        setShowUserModal(true);
    };

    const totalPages = Math.ceil(pagination.count / 15);

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const buttons = [];

        const getButton = (page) => (
            <button
                key={page}
                onClick={() => fetchUsers(page)}
                className={`px-3 py-1 bg-[#0f1115] rounded cursor-pointer font-body hover:scale-[1.03] transition-all duration-75 ease-in ${pagination.current === page ? 'bg-[#d5ab63] text-white' : 'text-white'
                    }`}
            >
                {page}
            </button>
        );

        // First and Previous buttons
        if (pagination.current > 1) {
            buttons.push(
                <button key="first" onClick={() => fetchUsers(1)} className='cursor-pointer hover:scale-[1.03] transition-all duration-75 ease-in'>
                    «
                </button>
            );
            buttons.push(
                <button key="prev" onClick={() => fetchUsers(pagination.current - 1)} className='cursor-pointer hover:scale-[1.03] transition-all duration-75 ease-in'>
                    ‹
                </button>
            );
        }

        // Center pages logic
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

        // Next and Last buttons
        if (pagination.current < totalPages) {
            buttons.push(
                <button key="next" onClick={() => fetchUsers(pagination.current + 1)} className='cursor-pointer hover:scale-[1.03] transition-all duration-75 ease-in'>
                    ›
                </button>
            );
            buttons.push(
                <button key="last" onClick={() => fetchUsers(totalPages)} className='cursor-pointer hover:scale-[1.03] transition-all duration-75 ease-in'>
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
                        (show) ? (
                            <>
                                <Sidebar isMobileVisible={sidebarVisible} user_type_id={user?.user_type?.id}/>
                                <div className="w-full">
                                    <div className="flex flex-col sm:flex-row justify-between">
                                        <p className="text-[22px] font-[500] tracking-wide font-poppins mb-[10px] order-2 sm:order-1">Utilizatori ({pagination.count})</p>
                                        <p className="text-[22px] font-[500] tracking-wide font-poppins mb-[10px] order-1 sm:order-2">{user.last_name} {user.first_name}</p>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <input
                                            type="text"
                                            placeholder="Caută utilizator..."
                                            className='font-body px-[16px] py-[10px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px] min-w-[250px]'
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)} />
                                        {
                                            (user?.user_type?.id === 1 || user?.user_type?.id === 2) && (
                                                <button
                                                    onClick={handleAdd}
                                                    className="bg-[#0f1115] text-white px-[16px] py-[10px] border-[1px] border-[#0f1115] rounded-[5px] cursor-pointer hover:bg-[#d5ab63] hover:border-[#d5ab63] transition-all duration-75 ease-in"
                                                >
                                                    + Adaugă utilizator
                                                </button>
                                            )
                                        }
                                        <select
                                            className='font-body px-[16px] py-[10px] rounded-[5px] outline-none border-[1px] border-gray-300 text-[17px] min-w-[250px]'
                                            onChange={(e) => setOrdering(e.target.value)}
                                            value={ordering}
                                        >
                                            <option value="last_name">Nume (A-Z)</option>
                                            <option value="-last_name">Nume (Z-A)</option>
                                            <option value="first_name">Prenume (A-Z)</option>
                                            <option value="-first_name">Prenume (Z-A)</option>
                                            <option value="last_login">Ultima autentificare</option>
                                        </select>
                                    </div>
                                    {
                                        loading ? (
                                            <div className="flex justify-center items-center w-full mt-[50px]">
                                                <Reordering />
                                            </div>
                                        ) : (
                                            <>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full border rounded-[5px] overflow-hidden min-w-[980px]">
                                                        <thead className="bg-[#0f1115] text-white font-body">
                                                            <tr>
                                                                <th>Nume</th>
                                                                <th>Prenume</th>
                                                                <th>Telefon</th>
                                                                <th className="py-[6px]">Email</th>
                                                                <th>Funcție</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {users.map((row, idx) => {
                                                                const isSelf = user.id === row.id;
                                                                const actingType = user?.user_type?.id;
                                                                const targetType = row?.user_type?.id;

                                                                const canEdit =
                                                                    actingType === 1 ||
                                                                    (actingType === 2 && (isSelf || targetType === 3)) ||
                                                                    (actingType === 3 && isSelf);

                                                                const canDelete =
                                                                    (actingType === 1 && !isSelf) ||
                                                                    (actingType === 2 && targetType === 3 && !isSelf);

                                                                return (
                                                                    <tr
                                                                        key={row.id}
                                                                        className={`font-body ${idx % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300'} ${isSelf ? '!bg-yellow-200 font-semibold' : ''
                                                                            }`}
                                                                    >
                                                                        <td className="py-[10px] text-center">{row.last_name}</td>
                                                                        <td className="text-center">{row.first_name}</td>
                                                                        <td className="text-center">{row.phone}</td>
                                                                        <td className="text-center">{row.email}</td>
                                                                        <td className="text-center">{row.user_type.type}</td>
                                                                        <td className="text-center">
                                                                            {canEdit && (
                                                                                <button
                                                                                    className="bg-blue-500 text-white cursor-pointer rounded-[5px] px-[6px] py-[2px] hover:bg-blue-700 transition-all duration-75 ease-in"
                                                                                    onClick={() => handleEdit(row)}
                                                                                >
                                                                                    Modifică
                                                                                </button>
                                                                            )}
                                                                            {canDelete && (
                                                                                <button
                                                                                    className="bg-red-500 text-white ml-[20px] cursor-pointer rounded-[5px] px-[6px] py-[2px] hover:bg-red-700 transition-all duration-75 ease-in"
                                                                                    onClick={(e) => confirm(e, row)}
                                                                                >
                                                                                    Șterge
                                                                                </button>
                                                                            )}
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
                                    {
                                        showUserModal && <UserModal
                                            visible={showUserModal}
                                            onClose={() => setShowUserModal(false)}
                                            onSaved={() => fetchUsers(pagination.current)}
                                            userToEdit={editingUser}
                                            userTypes={userTypes}
                                        />
                                    }
                                </div>
                            </>
                        ) : (
                            <div className="w-full justify-center items-center flex mt-[50px] xl:mt-0">
                                <Reordering />
                            </div>
                        )
                    }
                </div>
            </section>
        </>
    )
}

export default ControlPanel;
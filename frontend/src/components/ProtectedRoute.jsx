import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { useState, useEffect, useContext } from 'react';
import { useCookies } from 'react-cookie';
import Reordering from "./Reordering";
import loadingContext from '../contexts/loadingContext'

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [cookies, setCookie, removeCookie] = useCookies(['acc', 'ref']);
    const { setLoading } = useContext(loadingContext)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await auth();
            } catch (error) {
                setIsAuthorized(false);
            }
        };

        checkAuth();
    }, [cookies.acc, cookies.ref]);

    useEffect(() => {
        if (isAuthorized === null) {
            setLoading(true);
        }
    }, [isAuthorized]);

    const handleTokenRefresh = async () => {
        try {
            const res = await api.post('/api/v1/token/refresh/', {
                refresh: cookies.ref,
            });

            if (res.status === 200) {
                setCookie('acc', res.data.access, { path: '/' });
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            setIsAuthorized(false);
            removeCookie('acc', { path: '/' });
            removeCookie('ref', { path: '/' });
            return;
        }
    };

    const auth = async () => {
        if (!cookies.acc) {
            setIsAuthorized(false);
            return;
        }

        try {
            const decoded = jwtDecode(cookies.acc);
            const tokenExpiration = decoded.exp;
            const now = Math.floor(Date.now() / 1000);

            const buffer = 60;

            if (tokenExpiration < now + buffer) {
                if (cookies.ref) {
                    await handleTokenRefresh();
                } else {
                    setIsAuthorized(false);
                }
            } else {
                setIsAuthorized(true);
            }
        } catch (error) {
            setIsAuthorized(false);
        }
    };

    return isAuthorized === null ? (
        <div className="flex items-center justify-center h-[100vh]" style={{ backgroundColor: 'hsl(var(--body-color))' }}>
            <Reordering />
        </div>
    ) : isAuthorized ? (
        children
    ) : (
        <Navigate to="/logout" />
    );
}

export default ProtectedRoute;
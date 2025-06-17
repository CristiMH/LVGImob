import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const [, , removeCookie] = useCookies(['acc', 'ref']);
    const navigate = useNavigate();
    const [cookiesRemoved, setCookiesRemoved] = useState(false);

    useEffect(() => {
        removeCookie('acc', { path: '/' });
        removeCookie('ref', { path: '/' });
        setCookiesRemoved(true);
    }, [removeCookie]);

    useEffect(() => {
        if (cookiesRemoved) {
            navigate('/login');
        }
    }, [cookiesRemoved, navigate]);

    return null;
}

export default Logout;
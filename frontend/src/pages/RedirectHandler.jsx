import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const cityMap = {
  chisinau: 1,
  balti: 2,
  ungheni: 3,
};

const saleTypeMap = {
  vanzare: 1,
  chirie: 2,
};

export default function RedirectHandler() {
  const { category, city, type } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const locationId = cityMap[city?.toLowerCase()];
    const saleType = saleTypeMap[type?.toLowerCase()];

    if (category && locationId && saleType) {
      navigate(`/${category}?sale_type=${saleType}&location=${locationId}`, { replace: true });
    } else {
      navigate('/404', { replace: true });
    }
  }, [category, city, type, navigate]);

  return null; // sau un loader/spinner dacă vrei
}

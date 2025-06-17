import { FaHome, FaHandsHelping, FaCouch } from 'react-icons/fa';
import { RiCurrencyFill } from "react-icons/ri";

const Servicii = () => {
  return (
    <section className="py-[60px] sm:py-[80px] px-[12px] flex flex-col gap-[15px] justify-between sm:container sm:mx-auto text-center">
      <p className="text-[14px] font-body font-[500] text-[#d5ab63] uppercase  ">
        Tipuri de servicii
      </p>
      <h2 className="text-[28px] xs:text-[32px] lg:text-[40px] font-heading font-[500] mb-16">
        Hai să găsim împreună <br className="hidden md:block" /> proprietatea potrivită pentru tine
      </h2>

      <div className="grid gap-8 cstmvv:grid-cols-2 cstmvv:grid-rows-2 max-w-6xl mx-auto font-body">
        <div className="bg-[#ececec] rounded-[5px] p-8 text-left hover:shadow-lg transition duration-100 ease-in">
          <div className="bg-[#d5ab63] w-14 h-14 flex items-center justify-center rounded-full mb-4">
            <FaHome className="text-white text-2xl" />
          </div>
          <h4 className="text-lg font-semibold mb-2">Soluții rapide<br />pentru vânzarea ta</h4>
          <p className="text-sm text-gray-600">
            Evaluare corectă, promovare inteligentă și sprijin complet pentru a vinde în siguranță și la cel mai bun preț.
          </p>
        </div>

        <div className="bg-[#ececec] rounded-[5px] p-8 text-left hover:shadow-lg transition duration-100 ease-in">
          <div className="bg-[#d5ab63] w-14 h-14 flex items-center justify-center rounded-full mb-4">
            <FaHandsHelping className="text-white text-2xl" />
          </div>
          <h4 className="text-lg font-semibold mb-2">Ghidare completă<br />la cumpărare</h4>
          <p className="text-sm text-gray-600">
            Te ajutăm să alegi corect: consultanță personalizată, vizionări rapide și sprijin pe tot parcursul procesului.
          </p>
        </div>

        <div className="bg-[#ececec] rounded-[5px] p-8 text-left hover:shadow-lg transition duration-100 ease-in">
          <div className="bg-[#d5ab63] w-14 h-14 flex items-center justify-center rounded-full mb-4">
            <RiCurrencyFill className="text-white text-2xl" />
          </div>
            <h4 className="text-lg font-semibold mb-2">Bonus special<br />la credit ipotecar</h4>
            <p className="text-sm text-gray-600">
              Primești 100 € rambursabili la achiziția locuinței prin credit ipotecar — un avantaj suplimentar pentru o decizie inspirată.
            </p>
        </div>

        <div className="bg-[#ececec] rounded-[5px] p-8 text-left hover:shadow-lg transition duration-100 ease-in">
          <div className="bg-[#d5ab63] w-14 h-14 flex items-center justify-center rounded-full mb-4">
            <FaCouch className="text-white text-2xl" />
          </div>
          <h4 className="text-lg font-semibold mb-2">Găsim locuința<br />perfectă pentru tine</h4>
          <p className="text-sm text-gray-600">
            Apartamente, case sau terenuri – avem opțiuni variate și te ajutăm să o alegi pe cea care ți se potrivește.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Servicii;

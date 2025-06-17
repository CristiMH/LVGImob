import { Link } from 'react-router-dom'

const Error = () => {
    return (
        <section className='py-[60px] sm:py-[80px] px-[12px] items-center justify-center flex flex-col sm:container sm:mx-auto' style={{ minHeight: "calc(100vh - 88px - 561px)" }}>
            <p className='text-[130px] sm:text-[200px] font-[500] text-[#d5ab63]'>404</p>
            <p className='text-[22px] sm:text-[33px] font-[500] font-poppins -mt-[30px] text-center'>Pagina nu a fost găsită</p>
            <Link to={'/'} className='btn-main text-white text-[14px] sm:text-[16px] px-[30px] py-[7px] cursor-pointer rounded-[5px] font-poppins mt-[20px]'>
                Pagina principală
            </Link>
        </section>
    )
}

export default Error

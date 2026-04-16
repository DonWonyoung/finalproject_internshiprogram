import { Link } from 'react-router-dom'
import Facebook from '../../assets/images/facebook.svg'
import Twitter from '../../assets/images/twitter.svg'
import Instagram from '../../assets/images/instagram.svg'

const Footer = () => {
    return (
        <footer className='py-5 text-white'>
            <div className='container'>
                <div className='row mb-5'>
                    <div className='col-lg-4 pb-4'>
                        <div className='pt-3 pe-5'>Superior taste, human kindness, and environmental friendliness.</div>
                    </div>

                    <div className='col-lg-4 pb-4'>
                        <h2 className='mb-3'>Link Cepat</h2>
                        <ul>
                            <li><Link to='/customer/login'>Login</Link></li>
                            <li><Link to='/customer/register'>Register</Link></li>
                        </ul>
                    </div>

                    <div className='col-lg-4'>
                        <h2 className='mb-3'>Kontak Kami</h2>
                        <ul>
                            <li>+62 811-6472-111</li>
                            <li><a href='mailto:cs_lawsonindonesia@lws.co.id'>cs_lawsonindonesia@lws.co.id</a></li>
                        </ul>
                    </div>
                </div>

                <div className='row spotlight py-5'>
                    <div className='col-md-4'>
                        <div className='d-flex justify-content-center'>
                            <Link to='https://www.facebook.com/LawsonStationIndonesia'><img src={Facebook} /></Link>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='d-flex justify-content-center'>
                            <Link to='https://x.com/LawsonIndonesia'><img src={Twitter} /></Link>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='d-flex justify-content-center'>
                            <Link to='https://www.instagram.com/lawson_indonesia/'><img src={Instagram} /></Link>
                        </div>
                    </div>
                </div>
                
                <div>
                    <div className='col-md-12 text-center pt-5'>
                        <p>&copy; 2026 PT. Lancar Wiguna Sejahtera</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
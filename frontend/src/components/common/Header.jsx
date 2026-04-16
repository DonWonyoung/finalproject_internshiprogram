import { useContext, useEffect, useState } from 'react'
import { Nav } from 'react-bootstrap'
import { Navbar } from 'react-bootstrap'
import Logo from '../../assets/images/logo.png'
import { Link } from 'react-router-dom'
import { apiUrl } from './http'
import { CartContext } from '../context/Cart'

const Header = () => {
    const [categories, setCategories] = useState([])
    const {getQuantity} = useContext(CartContext)

    const fetchCategories = () => {
        fetch(`${apiUrl}/get-categories`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(res => res.json()).then(result => {
            if(result.status === 200) setCategories(result.data)
            else console.log('Terjadi kesalahan.')
        })
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    return (
        <header className='shadow'>
            <div className='container'>
                <Navbar expand="lg" className="bg-body-tertiary">
                    <Navbar.Brand href="/">
                        <img src={Logo} width='20%' height='20%' />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <div className='nav-right d-flex'>
                            <Link to='/shop' className='ms-3'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5m3.14 3l1.25 6h8.223l1.2-6z"/><path d="M5.5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2m7 1a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>
                            </Link>

                            <Link to='/customer/profile' className='ms-3'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"></path></svg>
                            </Link>

                            <Link to='/cart' className='ms-3 cart-bucket'>
                                {getQuantity() > 0 && (<span>{getQuantity()}</span>)}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="28" fill="currentColor" className="bi bi-bag" viewBox="0 0 16 16"><path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"></path></svg>
                            </Link>
                        </div>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        </header>
    )
}

export default Header
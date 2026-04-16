import { useEffect, useState } from 'react'
import Layout from '../common/Layout'
import Sidebar from '../common/Sidebar'
import { Link } from 'react-router-dom'
import { adminToken, apiUrl } from '../common/http'

const Dashboard = () => {
    const [counts, setCounts] = useState({
        users: 0,
        orders: 0,
        products: 0,
    })

    const [loader, setLoader] = useState(false)

    const fetchCounts = async () => {
        setLoader(true)
        try {
            const res = await fetch(`${apiUrl}/dashboard`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                }
            })

            const result = await res.json()
            setLoader(false)

            if (result.status === 200) {
                setCounts(result.data)
            } else {
                console.log('Terjadi kesalahan.')
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat mengambil data dasbor:', error)
            setLoader(false)
        }
    }
    
    useEffect(() => {
        fetchCounts()
    }, [])

    return (
        <Layout>
        <div className='container'>
            <div className='row'>
            <div className='d-flex justify-content-between mt-5 pb-3'>
                <h4 className='h4 pb-0 mb-0'>Dasbor</h4>
            </div>
            <div className='col-md-3'>
                <Sidebar />
            </div>
            <div className='col-md-9'>
                <div className='row'>
                <div className='col-md-4'>
                    <div className='card shadow'>
                    <div className='card-body'>
                        <h2 className='text-center'>{counts.users}</h2>
                        <span><center>Pengguna</center></span>
                    </div>
                    <div className="card-footer">
                        <Link to='/admin/users'><center>Lihat List Pengguna</center></Link>
                    </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className='card shadow'>
                    <div className='card-body'>
                        <h2 className='text-center'>{counts.orders}</h2>
                        <span><center>Pesanan</center></span>
                    </div>
                    <div className="card-footer">
                        <Link to='/admin/orders'><center>Lihat List Pesanan</center></Link>
                    </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className='card shadow'>
                    <div className='card-body'>
                        <h2 className='text-center'>{counts.products}</h2>
                        <span><center>Produk</center></span>
                    </div>
                    <div className="card-footer">
                        <Link to='/admin/products'><center>Lihat List Produk</center></Link>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </Layout>
    )
}

export default Dashboard
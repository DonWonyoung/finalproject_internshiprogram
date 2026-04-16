import { useContext, useState } from 'react'
import Layout from './common/Layout'
import { Link, useNavigate } from 'react-router-dom'
import { CartContext } from './context/Cart'
import { useForm } from 'react-hook-form'
import { apiUrl, userToken } from './common/http'
import { toast } from 'react-toastify'

const Checkout = () => {
    const [paymentMethod, setPaymentMethod] = useState('qris')
    const { cartData, total, clearCart } = useContext(CartContext)
    const navigate = useNavigate()

    const handlePaymentMethod = (e) => {
        setPaymentMethod(e.target.value)
    }

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: async () => {
            fetch(`${apiUrl}/get-profile-details`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken()}`
                }
            }).then(res => res.json()).then(result => {
                reset({
                    name: result.data.name,
                    email: result.data.email,
                    address: result.data.address,
                    city: result.data.city,
                    state: result.data.state,
                    zip: result.data.zip,
                    mobile: result.data.mobile
                })
            })
        }
    })

    const processOrder = (data) => {
        if (!window.confirm("Apakah Anda sudah yakin dengan pesanan Anda?")) return

        if(paymentMethod == 'qris') saveOrder(data, 'not_paid')
        else if(paymentMethod == 'cod') saveOrder(data, 'cod_pending')
    }

    const saveOrder = (formData) => {
        const newFormData = {
            ...formData,
            total: total(),
            payment_method: paymentMethod,
            status: 'pending',
            cart: cartData.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
                title: item.title
            }))
        }
        fetch(`${apiUrl}/save-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`
            }, body: JSON.stringify(newFormData)
        }).then(res => res.json()).then(result => {
            if(result.status === 200) {
                clearCart()
                
                if (paymentMethod === 'qris') navigate(`/order/${result.id}/qr-code`)
                else if (paymentMethod === 'cod') navigate(`/order/confirmation/${result.id}`)
            } else toast.error(result.message)
        })
    }

    return (
        <Layout>
            <div className='container pb-5'>
                <div className='row'>
                    <div className='col-md-12'>
                        <nav aria-label="breadcrumb" className='py-4'>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Checkout</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <form onSubmit={handleSubmit(processOrder)}>
                    <div className='row'>
                        <div className='col-md-7'>
                            <h3 className='border-bottom pb-3'><strong>Detail Pembayaran</strong></h3>
                            <div className='row pt-3'>
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input
                                        {
                                            ...register('name', {required: 'Kolom nama wajib diisi.'})
                                        }
                                        type='text' className={`form-control ${errors.name && 'is-invalid'}`} placeholder='Nama' />
                                        {
                                            errors.name && <p className='invalid-feedback'>{errors.name?.message}</p>
                                        }
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input
                                        {
                                            ...register('email', {
                                                required: 'Kolom email wajib diisi.',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Alamat email tidak valid.'
                                                }
                                            })
                                        }
                                        type='text' className={`form-control ${errors.email && 'is-invalid'}`} placeholder='Email' />
                                        {
                                            errors.email && <p className='invalid-feedback'>{errors.email?.message}</p>
                                        }
                                    </div>
                                </div>
                                <div className='mb-3'>
                                    <textarea
                                    {
                                        ...register('address', {required: 'Kolom alamat wajib diisi.'})
                                    }
                                    className={`form-control ${errors.address && 'is-invalid'}`} rows={3} placeholder='Alamat'></textarea>
                                    {
                                        errors.address && <p className='invalid-feedback'>{errors.address?.message}</p>
                                    }
                                </div>
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input
                                        {
                                            ...register('city', {required: 'Kolom kota wajib diisi.'})
                                        }
                                        type='text' className={`form-control ${errors.city && 'is-invalid'}`} placeholder='Kota' />
                                        {
                                            errors.city && <p className='invalid-feedback'>{errors.city?.message}</p>
                                        }
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input
                                        {
                                            ...register('state', {required: 'Kolom provinsi wajib diisi.'})
                                        }
                                        type='text' className={`form-control ${errors.state && 'is-invalid'}`} placeholder='Provinsi' />
                                        {
                                            errors.state && <p className='invalid-feedback'>{errors.state?.message}</p>
                                        }
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input
                                        {
                                            ...register('zip', {required: 'Kolom kode pos wajib diisi.'})
                                        }
                                        type='text' className={`form-control ${errors.zip && 'is-invalid'}`} placeholder='Kode Pos' />
                                        {
                                            errors.zip && <p className='invalid-feedback'>{errors.zip?.message}</p>
                                        }
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input
                                        {
                                            ...register('mobile', {required: 'Kolom nomor telepon wajib diisi.'})
                                        }
                                        type='text' className={`form-control ${errors.mobile && 'is-invalid'}`} placeholder='Nomor Telepon' />
                                        {
                                            errors.mobile && <p className='invalid-feedback'>{errors.mobile?.message}</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-5'>
                            <h3 className='border-bottom pb-3'><strong>List Produk</strong></h3>
                            <table className='table'>
                                <tbody>
                                    {
                                        cartData && cartData.map(item => {
                                            return (
                                                <tr key={`cart-${item.id}`}>
                                                    <td width={100}><img src={item.image_url} height='50%' width='50%' /></td>
                                                    <td width={600}>
                                                        <h4>{item.title}</h4>
                                                        <div className='d-flex align-items-center pt-3'>
                                                            <span>Rp. {item.price}</span>
                                                            <div className='ps-5'>x {item.quantity}</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>

                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='d-flex justify-content-between border-bottom pb-2'>
                                        <div><strong>Total</strong></div>
                                        <div>Rp. {total()}</div>
                                    </div>
                                </div>
                            </div>

                            <h3 className='border-bottom pt-4 pb-3'><strong>Metode Pembayaran</strong></h3>

                            <div>
                                <input type="radio" name="payment_method" value="qris" onChange={handlePaymentMethod} checked={paymentMethod === 'qris'} />
                                <label className="form-label ps-2">QRIS</label>

                                <input type="radio" name="payment_method" value="cod" onChange={handlePaymentMethod} checked={paymentMethod === 'cod'} className="ms-3" />
                                <label className="form-label ps-2">COD</label>
                            </div>


                            <div className='d-flex py-3'>
                                <button className='btn btn-primary'>Bayar Sekarang</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    )
}

export default Checkout
import { useEffect, useState } from 'react'
import { apiUrl } from './http'
import { Link } from 'react-router-dom'

const FeaturedProducts = () => {
    const [products, setProducts] = useState([])
    const featuredProducts = async () => {
        await fetch(apiUrl + '/get-featured-products', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(res => res.json()).then(result => {
            setProducts(result.data)
        })
    }

    useEffect(() => {
        featuredProducts()
    }, [])

    return (
        <section className='section-2 py-5'>
            <div className='container'>
                <h2>Produk Unggulan</h2>
                <div className='row mt-4'>
                    {
                        products && products.map(product => {
                            return(
                                <div className='col-md-3 col-6' key={`product-${product.id}`}>
                                    <div className='product card border-0'>
                                        <div className='card-img'>
                                            <Link to={`/product/${product.id}`}><img src={product.image_url} className='w-100' /></Link>
                                        </div>
                                        <div className='card-body pt-3'>
                                            <Link to={`/product/${product.id}`}>{product.title}</Link>
                                            <div className='price'>
                                                Rp. {product.price} &nbsp;
                                                {
                                                    product.compare_price && <span className='text-decoration-line-through'>Rp. {product.compare_price}</span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default FeaturedProducts
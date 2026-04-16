import LatestProducts from './common/LatestProducts'
import Hero from './common/Hero'
import Layout from './common/Layout'
import FeaturedProducts from './common/FeaturedProducts'

const Home = () => {
    return (
        <>
            <Layout>
                <Hero />
                <LatestProducts />
                <FeaturedProducts />
            </Layout>
        </>
    )
}

export default Home
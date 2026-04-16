import Layout from './common/Layout'
import { Link } from 'react-router-dom'

const EmailVerified = () => {
    return (
        <Layout>
            <div className="container text-center py-5">
                <h3>Email berhasil diverifikasi!</h3>
                <p>Sekarang Anda dapat login ke akun Anda.</p>
                <Link className="btn btn-secondary mt-3" to="/customer/login">Login Sekarang</Link>
            </div>
        </Layout>
    )
}

export default EmailVerified
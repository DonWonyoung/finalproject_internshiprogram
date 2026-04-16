import Layout from './common/Layout'

const VerifyEmail = () => {
    return (
        <Layout>
            <div className="container d-flex justify-content-center py-5">
                <div className="card shadow border-0 p-4">
                    <h4 className="text-center">Verifikasi Email Anda</h4>
                    <p className="text-center mt-3">
                        Kami telah mengirim link verifikasi ke email Anda.
                        Silakan buka email tersebut dan klik link untuk mengaktifkan akun Anda.
                    </p>
                </div>
            </div>
        </Layout>
    )
}

export default VerifyEmail
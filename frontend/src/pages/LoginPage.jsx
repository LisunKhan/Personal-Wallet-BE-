import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { hashMasterPassword } from '../utils/crypto';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const hashedPassword = await hashMasterPassword(password, email);

      await login({
        email: email,
        master_key_hash: hashedPassword,
      });

      setMessage('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/vault');
      }, 1000);
    } catch (error) {
      setMessage(`Login failed: ${error.response?.data?.detail || error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center gradient-bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-5 col-lg-6 col-md-8 col-sm-10">
            <div className="card card-custom shadow-lg border-0 login-card">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-5">
                  <div className="mb-4">
                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center login-icon">
                      <span className="display-4">🔐</span>
                    </div>
                  </div>
                  <h1 className="display-5 fw-bold text-dark-override mb-3">Welcome Back!</h1>
                  <p className="lead text-muted mb-0">
                    Sign in to continue to your Digital Wallet
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="needs-validation" noValidate>
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark-override fs-5" htmlFor="email">
                      📧 Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="form-control form-control-lg form-control-custom"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark-override fs-5" htmlFor="password">
                      🔑 Master Password
                    </label>
                    <div className="input-group input-group-lg">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your master password"
                        required
                        className="form-control form-control-custom"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="btn btn-outline-secondary"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {showPassword ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="alert alert-info d-flex align-items-center mb-4" role="alert">
                    <svg className="me-2" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <div>
                      <small className="mb-0">
                        Your master password is encrypted and never stored on our servers.
                      </small>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary-custom btn-lg w-100 mb-4 login-btn"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing you in...
                      </>
                    ) : (
                      <>
                        <svg className="me-2" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign In to Your Vault
                      </>
                    )}
                  </button>
                </form>

                {/* Message Display */}
                {message && (
                  <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} d-flex align-items-center`} role="alert">
                    <svg className="me-2" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      {message.includes('successful') ? (
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      ) : (
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      )}
                    </svg>
                    <div>{message}</div>
                  </div>
                )}

                {/* Footer */}
                <div className="text-center">
                  <hr className="my-4" />
                  <p className="text-muted mb-0">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary fw-semibold text-decoration-none">
                      Create your account
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-center mt-4">
              <small className="text-muted">
                🔒 Your data is encrypted end-to-end for maximum security
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState } from 'react';
import API from '../services/api';
import { hashMasterPassword } from '../utils/crypto';
import { Link } from 'react-router-dom';
import PasswordStrengthIndicator from '../components/vault/PasswordStrengthIndicator';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validation
    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long!');
      setLoading(false);
      return;
    }

    if (!agreedToTerms) {
      setMessage('Please agree to the Terms of Service and Privacy Policy!');
      setLoading(false);
      return;
    }

    try {
      const hashedPassword = await hashMasterPassword(password, email);

      await API.post('/accounts/signup/', {
        email: email,
        master_key_hash: hashedPassword,
      });

      setMessage('Account created successfully! You can now log in.');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAgreedToTerms(false);
    } catch (error) {
      setMessage(`Signup failed: ${error.response?.data?.detail || error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
    setConfirmPassword(newPassword);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center gradient-bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-7 col-md-9 col-sm-11">
            <div className="card card-custom shadow-lg border-0 signup-card">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-5">
                  <div className="mb-4">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center signup-icon">
                      <span className="display-4">🚀</span>
                    </div>
                  </div>
                  <h1 className="display-5 fw-bold text-dark-override mb-3">Create Your Account</h1>
                  <p className="lead text-muted mb-0">
                    Get started with your secure Digital Wallet
                  </p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSignup} className="needs-validation" noValidate>
                  <div className="row g-4">
                    <div className="col-12">
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

                    <div className="col-12">
                      <label className="form-label fw-semibold text-dark-override fs-5" htmlFor="password">
                        🔑 Master Password
                      </label>
                      <div className="input-group input-group-lg">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a strong master password"
                          required
                          className="form-control form-control-custom"
                        />
                        <button
                          type="button"
                          onClick={generatePassword}
                          className="btn btn-success-custom"
                          title="Generate strong password"
                        >
                          Generate
                        </button>
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
                      {password && (
                        <div className="mt-2">
                          <PasswordStrengthIndicator password={password} />
                        </div>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold text-dark-override fs-5" htmlFor="confirmPassword">
                        🔒 Confirm Password
                      </label>
                      <div className="input-group input-group-lg">
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your master password"
                          required
                          className={`form-control form-control-custom ${
                            confirmPassword && password !== confirmPassword ? 'is-invalid' : 
                            confirmPassword && password === confirmPassword ? 'is-valid' : ''
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="btn btn-outline-secondary"
                          title={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {showConfirmPassword ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            )}
                          </svg>
                        </button>
                      </div>
                      {confirmPassword && password !== confirmPassword && (
                        <div className="invalid-feedback d-block">
                          Passwords do not match
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="alert alert-warning d-flex align-items-start mt-4" role="alert">
                    <svg className="me-2 mt-1" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <div>
                      <strong>Important:</strong> Your master password cannot be recovered if lost. 
                      Make sure to remember it or store it securely.
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="form-check mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="agreeTerms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      required
                    />
                    <label className="form-check-label text-dark-override" htmlFor="agreeTerms">
                      I agree to the{' '}
                      <a href="#" className="text-primary">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-primary">Privacy Policy</a>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !agreedToTerms || password !== confirmPassword}
                    className="btn btn-success-custom btn-lg w-100 mt-4 signup-btn"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating your account...
                      </>
                    ) : (
                      <>
                        <svg className="me-2" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Create My Secure Account
                      </>
                    )}
                  </button>
                </form>

                {/* Message Display */}
                {message && (
                  <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} d-flex align-items-center mt-4`} role="alert">
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
                <div className="text-center mt-4">
                  <hr className="my-4" />
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-center mt-4">
              <small className="text-muted">
                🔒 Your account is protected with end-to-end encryption
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

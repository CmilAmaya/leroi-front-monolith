import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase';
import googleIcon from '../assets/google.png';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotPasswordSubmitting, setIsForgotPasswordSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);

  // Función auxiliar para generar un código de verificación
  const generateVerificationCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Función para enviar el correo de verificación
  const sendVerificationEmail = async (email, code) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          code: code
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al enviar el código de verificación');
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Error al enviar el email:', error);
      throw error; 
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail);
        }

        const data = await response.json();

        // Verificar si se requiere 2FA
        if (data.status === '2fa_required') {
          setUserEmail(formData.email);
          const code = generateVerificationCode(); // Generar el código
          await sendVerificationEmail(formData.email, code); // Enviar el correo
          setVerificationCode(code);
          setShowVerificationModal(true);
          toast.success('Código de verificación enviado a tu correo');
        } else {
          // Si no se requiere 2FA, guardar el token y redirigir
          const token = data.access_token;
          localStorage.setItem('token', token);
          navigate('/roadmap');
          window.location.reload('/roadmap');
        }

      } catch (error) {
        toast.error(error.message);
        console.error('Error al iniciar sesión:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Función para verificar el código de verificación
  const handleVerifyCode = async () => {
    try {
      setIsSubmittingCode(true);
  
      // CAMBIO: Usar endpoint /verify-2fa-code para doble autenticación
      const verifyCodeResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/verify-2fa-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          code: verificationCode,
        }),
      });
  
      console.log('Respuesta de /verify-code:', verifyCodeResponse); 
  
      if (!verifyCodeResponse.ok) {
        const errorData = await verifyCodeResponse.json();
        console.error('Error en /verify-code:', errorData); 
        throw new Error(errorData.detail || 'Código de verificación incorrecto');
      }
  
      const verifyCodeData = await verifyCodeResponse.json();
      console.log('Datos de /verify-code:', verifyCodeData); 
  
      const token = verifyCodeData.access_token;
      localStorage.setItem('token', token);
      console.log('Token guardado:', token);
  
      navigate('/roadmap');
      window.location.reload('/roadmap');
  
    } catch (error) {
      toast.error(error.message);
      console.error('Error al verificar el código:', error);
    } finally {
      setIsSubmittingCode(false);
    }
  };

  // Función para manejar el inicio de sesión con Google
  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const userData = {
        email: result.user.email,      
        name: result.user.displayName,       
        provider: 'google',                    
      };
      
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login-google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Error al iniciar sesión');
        }
        const data = await response.json();
        const token = data.access_token;
        localStorage.setItem('token', token);
        navigate('/roadmap');
        window.location.reload('/roadmap');
  
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
      }

    } catch (error) {
      console.error('Error en la autenticación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para validar el formulario
  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error('Por favor, completa todos los campos');
      return false;
    }

    return true;
  };

  // Función para manejar el "Olvidé mi contraseña"
  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      toast.error('Por favor, ingresa tu correo electrónico');
      return;
    }
    if (!forgotPasswordEmail.includes('@')) {
      toast.error('Por favor, ingresa un correo electrónico válido');
      return;
    }

    setIsForgotPasswordSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }
      setForgotPasswordEmail('');
      setShowForgotPassword(false);
      toast.success('Correo enviado correctamente');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsForgotPasswordSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="light-orb" style={{ '--delay': '0s' }}></div>
      <div className="light-orb" style={{ '--delay': '1s' }}></div>
      <div className="light-orb" style={{ '--delay': '2s' }}></div>
      <div className="light-orb" style={{ '--delay': '3s' }}></div>
      <div className="light-orb" style={{ '--delay': '4s' }}></div>

      <div className="register-box">
        <h1 className="register-title">Inicia sesión</h1>
        <h2 className="register-subtitle">Ingresa tus datos</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ingresa tu correo electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Ingresa tu contraseña</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="have-account" style={{ marginBottom: '1rem' }}>
            <span className="have-account-text">¿No tienes una cuenta?</span>
            <span className="login-link" onClick={() => navigate('/register')}>
              Regístrate
            </span>
          </div>

          <div className="forgot-password">
            <span className="login-link" onClick={() => setShowForgotPassword(true)} style={{ marginTop: '0.5rem' }}>
              ¿Olvidaste tu contraseña?
            </span>
          </div>

          <div className="button-container">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Continuar'}
            </button>

            <button
              type="button"
              className="google-button"
              onClick={handleGoogleSignup}
              disabled={isLoading}
            >
              {isLoading ? 'Cargando...' : (
                <>
                  <img src={googleIcon} alt="Google" className="google-icon" />
                  Inicia sesión con Google
                </>
              )}
            </button>
          </div> 
        </form>

        {showForgotPassword && (
          <div className="verification-modal">
            <div className="modal-content">
              <h2>Ingresa tu correo asociado a tu cuenta</h2>
              <input 
                type="email" 
                name="email" 
                value={forgotPasswordEmail} 
                onChange={(e) => setForgotPasswordEmail(e.target.value)} 
                placeholder="Correo electrónico"
                required
                className="forgot-password-input"
              />
              <div className="modal-buttons">
                <button type="button" className="cancel-button" onClick={() => setShowForgotPassword(false)}>Cancelar</button>
                <button 
                  type="submit" 
                  className="submit-button" 
                  onClick={handleForgotPassword}
                  disabled={isForgotPasswordSubmitting}
                >
                  {isForgotPasswordSubmitting ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showVerificationModal && (
          <div className="verification-modal">
            <div className="modal-content">
              <h2>Verifica tu correo</h2>
              <p>Enviamos un código de verificación a:</p>
              <p className="email">{userEmail}</p>
              <input
                type="text"
                placeholder="* * * * * *"
                maxLength={6}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="verification-input"
                disabled={isSubmittingCode}
              />
              <div className="modal-buttons">
                <button 
                  onClick={() => setShowVerificationModal(false)}
                  className="cancel-button"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleVerifyCode}
                  className="verify-button"
                  disabled={isSubmittingCode}
                >
                  {isSubmittingCode ? 'Verificando...' : 'Verificar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
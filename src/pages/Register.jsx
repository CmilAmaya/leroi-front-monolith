import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase';
import googleIcon from '../assets/google.png';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    contraseña: '',
    confirmarContraseña: '',
    aceptaTerminos: false,
    showConfirmPassword: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const emailCheckResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users_authentication_path/check-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY
          },
          body: JSON.stringify({ email: formData.email }),
        });
  
        if (!emailCheckResponse.ok) {
          const errorData = await emailCheckResponse.json();
          throw new Error(errorData.detail || 'Error al verificar el correo electrónico');
        }
  
        const emailCheckData = await emailCheckResponse.json();
        if (emailCheckData.exists) {
          toast.error('Este correo electrónico ya está registrado');
          return;
        }

        const code = generateVerificationCode();
        setUserEmail(formData.email);

        await sendVerificationEmail(formData.email, code);

        setVerificationCode(code);
        setShowVerificationModal(true);
        
        toast.success('Código de verificación enviado a tu correo');
      } catch (error) {
        toast.error('Error al enviar el código de verificación');
        console.error('Error al enviar el código de verificación:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const generateVerificationCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const sendVerificationEmail = async (email, code) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users_authentication_path/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_API_KEY
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

  const handleVerifyCode = async (email, verificationCode) => {
    try {
      setIsSubmittingCode(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users_authentication_path/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify({ email, code: verificationCode })
      });
  
      if (response.ok) {
        toast.success('Código de verificación correcto');
        setShowVerificationModal(false);
        await handleRegister();
      } else {
        toast.error('Código de verificación incorrecto o expirado');
      }
    } catch (error) {
      toast.error('Error al verificar el código');
      console.error('Error al verificar el código:', error);
    } finally {
      setIsSubmittingCode(false);
    }
  };

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
      console.log('Datos del usuario:', userData);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users_authentication_path/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY
          },
          body: JSON.stringify(userData)
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Error al registrar el usuario');
        }
        navigate('/login');
  
      } catch (error) {
        console.error('Error al registrar el usuario:', error);
        throw error;
      }

    } catch (error) {
      console.error('Error en la autenticación:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const validateForm = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // Validar que todos los campos estén llenos
    if (!formData.nombres || !formData.apellidos || !formData.email || !formData.contraseña || !formData.confirmarContraseña) {
      toast.error('Por favor, completa todos los campos');
      return false;
    }
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Por favor, ingresa un email válido');
      return false;
    }

    // Validar que las contraseñas coincidan
    if (formData.contraseña !== formData.confirmarContraseña) {
      toast.error('Las contraseñas no coinciden');
      return false;
    }
    // Validar longitud mínima de contraseña
    if (!passwordRegex.test(formData.contraseña)) {
      toast.error('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial');
      return false;
    } 
    // Validar términos y condiciones
    if (!formData.aceptaTerminos) {
      toast.error('Debes aceptar los términos y condiciones');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    const userData = {
      name: formData.nombres,
      last_name: formData.apellidos,
      email: formData.email,
      password: formData.contraseña,
      provider: 'email'
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users_authentication_path/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al registrar el usuario');
      }
      navigate('/login');

    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      throw error;
    }
  }

  return (
    <div className="register-container">
        <div className="light-orb" style={{ '--delay': '0s' }}></div>
        <div className="light-orb" style={{ '--delay': '1s' }}></div>
        <div className="light-orb" style={{ '--delay': '2s' }}></div>
        <div className="light-orb" style={{ '--delay': '3s' }}></div>
        <div className="light-orb" style={{ '--delay': '4s' }}></div>

      <div className="register-box">
        <h1 className="register-title">Regístrate</h1>
        <h2 className="register-subtitle">Ingresa tus datos</h2>
        
        <form onSubmit={handleSubmit}>
            <div className="form-row"> 
                <div className="form-group">
                    <label>Ingresa tu nombre</label>
                    <input
                    type="text"
                    name="nombres"
                    placeholder="Nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div className="form-group">
                    <label>Ingresa tus apellidos</label>
                    <input
                    type="text"
                    name="apellidos"
                    placeholder="Apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    required
                    />
                </div>
            </div>

          <div className="form-group">
            <label>Ingresa tu correo electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

        <div className="form-group">
            <label>Ingresa tu contraseña</label>
            <div className="password-input-wrapper">
                <input
                type={showPassword ? "text" : "password"}
                name="contraseña"
                placeholder="Contraseña"
                value={formData.contraseña}
                onChange={handleChange}
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

          <div className="form-group">
            <label>Confirma tu contraseña</label>
            <div className="password-input-wrapper">
                <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmarContraseña"
                placeholder="Repite tu contraseña"
                value={formData.confirmarContraseña}
                onChange={handleChange}
                required
                />
                <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
          </div>
          <div className="terms-group">
            <label className="terms-label">
              <input
                type="checkbox"
                name="aceptaTerminos"
                checked={formData.aceptaTerminos}
                onChange={handleChange}
                required
              />
              <span>Acepto los </span>
              <span className="terms-link" onClick={() => setShowTermsModal(true)}>
                términos y condiciones
              </span>
            </label>

            <div className="have-account">
              <span className="have-account-text" style={{marginTop: '0.5rem'}}>¿Ya tienes una cuenta?</span>
              <span className="login-link" onClick={() => navigate('/login')} style={{marginTop: '0.5rem'}}>
                Iniciar sesión
              </span>
            </div>

          </div>

        <div className="button-container">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registrando...' : 'Continuar'}
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
                Regístrate con Google
              </>
            )}
            </button>
        </div> 
        </form>

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
                onClick={() => handleVerifyCode(userEmail, verificationCode)}
                className="verify-button"
                disabled={isSubmittingCode}
              >
                {isSubmittingCode ? 'Verificando...' : 'Verificar'}
              </button>
            </div>
          </div>
        </div>
      )}
      {showTermsModal && (
        <div className="verification-modal">
          <div className="modal-content">
            <h2>Términos y condiciones</h2>
            <p className="terms-text">
              LEROI es una plataforma web diseñada para generar rutas de aprendizaje personalizadas a partir de documentos cargados por los usuarios, 
              quienes son totalmente responsables del contenido que suben y de su uso, debiendo cumplir con todas las leyes y regulaciones aplicables. LEROI en ningún caso se hace responsable del uso indebido de la plataforma, incluyendo, pero no limitado a, la generación, difusión o acceso a información que incite o facilite actividades ilegales, peligrosas o que atenten contra la seguridad pública.
              La plataforma y sus contenidos son propiedad de LEROI, y su uso indebido está prohibido. 
              LEROI no se hace responsable por daños indirectos derivados del uso de la plataforma. 
              LEROI puede modificar los servicios o los términos en cualquier momento, notificando a los usuarios registrados.</p>
            <button 
              onClick={() => setShowTermsModal(false)}
              className="verify-button"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Register;

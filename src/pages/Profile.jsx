import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import { User, CreditCard, MapPin, Shield, Edit3, Trash2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import ConfirmModal from "../components/Modal";
import EditModal from "../components/EditModal";
import { useNavigate } from 'react-router-dom';
import '../styles/register.css';
import '../styles/profile.css'; 


function Profile() {
  const [userData, setUserData] = useState(null);
  const [userRoadmaps, setUserRoadmaps] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [new2FAStatus, setNew2FAStatus] = useState(false); 
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const authToken = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authToken) {
        window.location.href = "/login";
        return;
      }

      try {
        // Obtener los datos del usuario
        const userResponse = await fetch(`${backendUrl}/users_authentication_path/user-profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            'x-api-key': import.meta.env.VITE_API_KEY
          },
        });

        if (!userResponse.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }

        const userData = await userResponse.json();
        setUserData(userData.data);
        console.log("Datos del usuario:", userData.data);

        // Obtener los roadmaps del usuario
        const roadmapsResponse = await fetch(`${backendUrl}/users_authentication_path/user-roadmaps`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            'x-api-key': import.meta.env.VITE_API_KEY
          },
        });

        if (!roadmapsResponse.ok) {
          throw new Error("Error al obtener los roadmaps del usuario");
        }

        const roadmapsData = await roadmapsResponse.json();
        console.log("Roadmaps del usuario:", roadmapsData.data);
        setUserRoadmaps(roadmapsData.data);

      } catch (error) {
        console.error(error);
        window.location.href = "/login";
      }
    };

    fetchUserData();
  }, [backendUrl, authToken]);

  // Función para manejar el cambio en el checkbox de 2FA
  const handleToggle2FA = (event) => {
    const newStatus = event.target.checked;
    setNew2FAStatus(newStatus); 
    setShow2FAModal(true); 
  };

  // Función para confirmar el cambio de 2FA
  const confirmToggle2FA = async () => {
    try {
      // Enviar la solicitud al backend para actualizar el estado de 2FA
      const response = await fetch(`${backendUrl}/users_authentication_path/update-2fa`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
          'x-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify({ is_2fa_enabled: new2FAStatus }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el estado de 2FA");
      }

      // Actualizar el estado local con el nuevo valor de 2FA
      setUserData({ ...userData, TFA_enabled: new2FAStatus });
      toast.success(`Autenticación de doble factor ${new2FAStatus ? "activada" : "desactivada"} correctamente.`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Hubo un error al actualizar la autenticación de doble factor.");
    } finally {
      setShow2FAModal(false); 
    }
  };

  // Función para cancelar el cambio de 2FA
  const cancelToggle2FA = () => {
    setShow2FAModal(false); 
  };

  const handleDeleteAccount = async () => {
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!authToken) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(
        `${backendUrl}/users_authentication_path/delete-user/${encodeURIComponent(userData.email)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            'x-api-key': import.meta.env.VITE_API_KEY
          },
        }
      );

      if (!response.ok) {
        let errorMsg = "Error al borrar la cuenta";
        try {
          const errorData = await response.json();
          errorMsg = errorData.detail || errorMsg;
        } catch {}
        toast.error(errorMsg);
        return;
      }

      toast.success("Cuenta eliminada correctamente");
      setTimeout(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }, 2000); // Espera 2 segundos antes de redirigir y luego borra el token
    } catch (error) {
      console.error("Error al borrar la cuenta:", error);
      toast.error("Hubo un error al intentar borrar la cuenta.");
    } finally {
      setShowConfirmModal(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
  };

  const handleSave = async (updatedData) => {
    const trimmedData = {
      name: updatedData.firstName.trim(),
      last_name: updatedData.lastName.trim(),
      email: userData.email?.trim(),
      provider: 'default'
    };

    try {
      const response = await fetch(`${backendUrl}/users_authentication_path/update-user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
          'x-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify(trimmedData),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.detail || "Error al actualizar los datos");
        return;
      }

      toast.success("Datos actualizados correctamente");
      setUserData({ ...userData, ...updatedData });
      setShowEditModal(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
  };


  if (!userData) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="register-container">
      <div className="light-orb"></div>
      <div className="light-orb"></div>
      <div className="light-orb"></div>
      <div className="light-orb"></div>
      <div className="light-orb"></div>
      <div className="profile-container">
        {/* Información Personal */}
        <div className="profile-card">
          <div className="profile-header">
            <h1 className="profile-title">Mi perfil</h1>
          </div>
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              <User />
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-info-card">
              <div className="info-card-header">
                <User />
                <span className="info-card-title">Información Personal</span>
              </div>
              <div className="info-field">
                <strong className="info-label">Nombre:</strong>
                <p className="info-value">{userData.firstName}</p>
              </div>
              <div className="info-field">
                <strong className="info-label">Apellido:</strong>
                <p className="info-value">{userData.lastName}</p>
              </div>
              <div className="info-field">
                <strong className="info-label">Correo electrónico:</strong>
                <p className="info-value">{userData.email}</p>
              </div>
            </div>

            <div className="profile-info-card">
              <div className="info-card-header">
                <CreditCard />
                <span className="info-card-title">Saldo de Créditos</span>
              </div>
              <p className="credits-value">
                ${userData.credits}
              </p>
            </div>

            <div className="profile-info-card">
              <div className="roadmaps-header">
                <div className="info-card-header">
                  <MapPin />
                  <span className="info-card-title">Roadmaps Creados</span>
                </div>
                <span className="roadmaps-count">
                  {userData.roadmapsCreated}
                </span>
              </div>
              {userData.roadmapsCreated > 0 && (
                <Button 
                  className="view-roadmaps-btn"
                  size="sm" 
                  onClick={() => navigate("/roadmapsCreados")}
                >
                  Ver Roadmaps
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Configuración de Seguridad */}
        <div className="profile-card">
          <div className="security-header">
            <Shield />
            <h3 className="security-title">Configuración de Seguridad</h3>
          </div>
          
          <div className="security-card">
            <div className="security-toggle">
              <div className="toggle-info">
                <h4>Autenticación de Doble Factor</h4>
                <p>Añade una capa extra de seguridad a tu cuenta</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  className="toggle-input"
                  checked={userData.TFA_enabled || false}
                  onChange={handleToggle2FA}
                />
                <div className={`toggle-slider ${userData.TFA_enabled ? 'active' : 'inactive'}`}>
                  <div className={`toggle-knob ${userData.TFA_enabled ? 'active' : 'inactive'}`}></div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Acciones de Cuenta */}
        <div className="profile-card">
          <h3 className="actions-title">Acciones de Cuenta</h3>
          
          <div className="actions-container">
            <Button
              className="edit-btn"
              onClick={() => setShowEditModal(true)}
            >
              <Edit3 />
              Modificar datos
            </Button>
            
            <Button
              className="delete-btn"
              onClick={handleDeleteAccount}
            >
              <Trash2 />
              Borrar cuenta
            </Button>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <ConfirmModal
          message="¿Estás seguro de que deseas borrar tu cuenta? Esta acción no se puede deshacer, y perderás el saldo de créditos que tengas en la cuenta."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {showEditModal && (
        <EditModal
          userData={userData}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
        />
      )}

      {show2FAModal && (
        <ConfirmModal
          message={`¿Estás seguro de que deseas ${new2FAStatus ? "activar" : "desactivar"} la autenticación de doble factor?`}
          onConfirm={confirmToggle2FA}
          onCancel={cancelToggle2FA}
        />
      )}
    </div>
  );
}

export default Profile;
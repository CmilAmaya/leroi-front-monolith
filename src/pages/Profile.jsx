import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import { User } from "lucide-react";
import { Button } from "../components/ui/Button";
import ConfirmModal from "../components/Modal";
import EditModal from "../components/EditModal";
import "../styles/profile.css";
import "../styles/modal.css";
import "../styles/editmodal.css";
import { useNavigate } from 'react-router-dom'; 


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
        const userResponse = await fetch(`${backendUrl}/user-profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!userResponse.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }

        const userData = await userResponse.json();
        setUserData(userData.data);
        console.log("Datos del usuario:", userData.data);

        // Obtener los roadmaps del usuario
        const roadmapsResponse = await fetch(`${backendUrl}/user-roadmaps`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
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
      const response = await fetch(`${backendUrl}/update-2fa`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ is_2fa_enabled: new2FAStatus }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el estado de 2FA");
      }

      // Actualizar el estado local con el nuevo valor de 2FA
      setUserData({ ...userData, TFA_enabled: new2FAStatus });
      alert(`Autenticación de doble factor ${new2FAStatus ? "activada" : "desactivada"} correctamente.`);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al actualizar la autenticación de doble factor.");
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
        `${backendUrl}/delete-user/${encodeURIComponent(userData.email)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
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
      const response = await fetch(`${backendUrl}/update-user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
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
    <div className="profile-container">
      <div className="light-orb"></div>
      <div className="light-orb"></div>
      <div className="light-orb"></div>
      <div className="light-orb"></div>
      <div className="light-orb"></div>

      <h2 className="profile-title">Perfil de Usuario</h2>

      <div className="profile-box">
        <div className="profile-image">
          <User />
        </div>

        <div className="profile-fields">
          <div className="profile-field">
            <strong>Nombre:</strong> {userData.firstName}
          </div>
          <div className="profile-field">
            <strong>Apellido:</strong> {userData.lastName}
          </div>
          <div className="profile-field">
            <strong>Email:</strong> {userData.email}
          </div>
          <div className="profile-field">
            <strong>Saldo de Créditos:</strong> ${userData.credits}
          </div>
          <div className="profile-field">
            <strong>Roadmaps Creados:</strong> {userData.roadmapsCreated}
            {userData.roadmapsCreated > 0 && (
              <Button 
                className="roadmap-button" 
                size="sm" 
                onClick={() => navigate("/roadmapsCreados")}
              >
                Ver Roadmaps
              </Button>
            )}
          </div>
          <div className="profile-field">
            <label>
              <input
                type="checkbox"
                checked={userData.TFA_enabled || false}
                onChange={handleToggle2FA}
              />
              Activar Autenticación de Doble Factor
            </label>
          </div>
        </div>

        <div className="profile-footer">
          <Button
            className="edit-button"
            size="sm"
            onClick={() => setShowEditModal(true)}
          >
            Modificar datos
          </Button>
          <Button
            className="delete-button"
            size="sm"
            onClick={handleDeleteAccount}
          >
            Borrar cuenta
          </Button>
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
          message={`¿Estás seguro de que deseas ${
            new2FAStatus ? "activar" : "desactivar"
          } la autenticación de doble factor?`}
          onConfirm={confirmToggle2FA}
          onCancel={cancelToggle2FA}
        />
      )}
    </div>
  );
}

export default Profile;
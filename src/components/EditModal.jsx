import { useState } from "react";
import { Button } from "../components/ui/Button";
import PropTypes from "prop-types";

EditModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
}

function EditModal({ onClose, userData, onSave }) {
  const [formData, setFormData] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); 
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'rgba(30, 31, 38, 0.95)',
        borderRadius: '16px',
        padding: '30px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(131, 91, 252, 0.3)'
      }}>
        <h2 style={{
          color: '#fff',
          fontSize: '22px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>Modificar Datos</h2>
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '15px'
          }}>
            <label style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              marginBottom: '5px'
            }}>Nombre:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(131, 91, 252, 0.3)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                fontFamily: 'Lexend Deca, sans-serif'
              }}
            />
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '20px'
          }}>
            <label style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              marginBottom: '5px'
            }}>Apellido:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(131, 91, 252, 0.3)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                fontFamily: 'Lexend Deca, sans-serif'
              }}
            />
          </div>
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center'
          }}>
            <Button 
              type="submit"
              style={{
                background: '#835bfc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: 'Lexend Deca, sans-serif'
              }}
            >
              Guardar Cambios
            </Button>
            <Button 
              onClick={onClose}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: 'Lexend Deca, sans-serif'
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
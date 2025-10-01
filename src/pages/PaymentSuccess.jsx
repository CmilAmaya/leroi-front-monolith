import React from 'react';
import '../styles/paymentsuccess.css';

function PaymentSuccess() {
    const handleViewProfile = () => {
        window.location.href = '/profile';
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    const handleCreateRoadmap = () => {
        window.location.href = '/roadmap';
    };

    return (
        <div className="payment-success-container">
            <div className="payment-success-card">
                {/* Icono de éxito */}
                <div className="success-icon">
                    <div className="checkmark-circle">
                        <div className="checkmark">✓</div>
                    </div>
                </div>

                {/* Título y mensaje principal */}
                <h1 className="success-title">
                    ¡Pago Exitoso! 🎉
                </h1>
                
                <p className="success-message">
                    Tu compra se procesó correctamente
                </p>
                
                <p className="success-details">
                    Tus créditos han sido añadidos a tu cuenta. ¡Ya puedes crear tus roadmaps personalizados!
                </p>

                {/* Información de créditos */}
                <div className="credits-info-box">
                    <h3>Compra Exitosa</h3>
                    <div className="success-checkmark">
                        ✅
                    </div>
                    <p>Tu compra se ha realizado satisfactoriamente. Los créditos correspondientes han sido añadidos a tu cuenta.</p>
                </div>

                {/* Botones de acción */}
                <div className="action-buttons">
                    <button 
                        onClick={handleCreateRoadmap}
                        className="btn btn-primary"
                    >
                        Crear mi primer roadmap
                    </button>

                    <button 
                        onClick={handleViewProfile}
                        className="btn btn-secondary"
                    >
                        Ver mi perfil
                    </button>

                    <button 
                        onClick={handleGoHome}
                        className="btn btn-outline"
                    >
                        Ir al inicio
                    </button>
                </div>

                {/* Información adicional del pago */}
                
                <div className="info-note">
                    <p>
                        <strong>¡Gracias por confiar en nosotros!</strong> Tu transacción se completó de forma segura. 
                        Recibirás un email de confirmación en los próximos minutos.
                    </p>
                </div>

                {/* Timestamp */}
                <div className="timestamp">
                    <small>
                        Pago procesado: {new Date().toLocaleString('es-ES')}
                    </small>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccess;
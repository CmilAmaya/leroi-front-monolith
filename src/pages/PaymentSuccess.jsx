import { useState, useEffect } from 'react';
import '../styles/pricing.css';

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
        <div className="pricing-container-p">
            <div className="pricing-box-p">
                {/* Icono de éxito */}
                <div className="success-icon">
                    <div className="checkmark-circle">
                        <div className="checkmark">✓</div>
                    </div>
                </div>

                {/* Título y mensaje principal */}
                <h1 className="pricing-title-p">
                    ¡Pago Exitoso! 
                </h1>
                
                <h2 className="success-details">
                    Tus créditos han sido añadidos a tu cuenta.
                    <br></br>
                </h2>

                {/* Botones de acción */}
                <div className="button-container">
                    <button 
                        onClick={handleCreateRoadmap}
                        className="submit-button"
                    >
                        Crear un roadmap
                    </button>
                </div>

                <div className="button-container">
                    <button 
                        onClick={handleViewProfile}
                        className="submit-button"
                    >
                        Ver mi perfil
                    </button>
                </div>

                <div className="button-container">
                    <button 
                        onClick={handleGoHome}
                        className="submit-button"
                    >
                        Ir al inicio
                    </button>
                </div>

                {/* Información adicional */}
                <div className="info-note">
                    <p>
                        <strong>Tu transacción se completó de forma segura. </strong>  
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
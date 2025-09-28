import React from 'react';
import '../styles/paymentfailure.css';

function PaymentFailure() {
    const handleRetryPayment = () => {
        window.location.href = '/pricing';
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    return (
        <div className="payment-failure-container">
            <div className="payment-failure-card">
                {/* Icono de error */}
                <div className="error-icon">
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: '#ff6b6b',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '40px',
                        fontWeight: 'bold'
                    }}>
                        !
                    </div>
                </div>

                {/* Título y mensaje principal */}
                <h1 className="failure-title">
                    ¡Oops! Algo salió mal
                </h1>
                
                <p className="failure-message">
                    Tu pago no pudo ser procesado
                </p>
                
                <p className="failure-details">
                    Hubo un problema al procesar tu transacción. Por favor, intenta nuevamente.
                </p>

                {/* Botones de acción */}
                <div className="action-buttons">
                    <button 
                        onClick={handleRetryPayment}
                        className="btn btn-primary"
                    >
                        Intentar de nuevo
                    </button>

                    <button 
                        onClick={handleGoHome}
                        className="btn btn-outline"
                    >
                        Ir al inicio
                    </button>
                </div>

                {/* Información de seguridad */}
                <div className="security-note">
                    <p>
                        <strong>Tranquilo:</strong> No se realizó ningún cargo a tu cuenta. 
                        Tu información está segura y puedes intentar nuevamente.
                    </p>
                </div>

                {/* Timestamp */}
                <div className="timestamp">
                    <small>
                        Fecha del error: {new Date().toLocaleString('es-ES')}
                    </small>
                </div>
            </div>
        </div>
    );
}

export default PaymentFailure;
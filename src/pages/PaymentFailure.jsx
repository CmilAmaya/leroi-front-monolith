import React from 'react';
import '../styles/pricing.css';

function PaymentFailure() {
    const handleRetryPayment = () => {
        window.location.href = '/pricing';
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    return (
        <div className="pricing-container-p">
            <div className="pricing-box-p">
                {/* Icono de error */}
                <div className="error-icon">
                    <div className="error-circle">
                        !
                    </div>
                </div>

                {/* Título y mensaje principal */}
                <h1 className="pricing-title-p">
                    ¡Oops! Algo salió mal
                </h1>
                
                <h2 className="failure-details">
                    Tu pago no pudo ser procesado.
                    <br></br>
                </h2>

                {/* Botones de acción */}
                <div className="button-container">
                    <button 
                        onClick={handleRetryPayment}
                        className="submit-button"
                    >
                        Intentar de nuevo
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
                        <strong>No se realizó ningún cargo a tu cuenta. </strong><br></br>  
                        Por favor, intenta nuevamente.
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
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import '../styles/pricing.css';


function Pricing() {
    const location = useLocation();
    const [formData, setFormData] = useState({
        credits: '',
        acceptTerms: false,
    });
    const [totalCost, setTotalCost] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const authToken = localStorage.getItem("token");

    const fetchCreditsCost = async (amount) => {
        try {
            const query = `
            query GetPrice($credits: Int!) {
                price(credits: $credits) {
                    credits
                    cost
                    currency
                }
            }`;

            const variables = { credits: parseInt(amount, 10) };

            const response = await fetch("http://127.0.0.1:8000/graphql", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query, variables }),
            });

            const result = await response.json();

            if (result.data?.price) {
                return result.data.price.cost; // 👈 devolvemos solo el costo
            } else {
                console.error('Error al calcular el costo:', result.errors || result);
                return null;
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            return null;
        }
    };

    useEffect(() => {
        const updateCostFromLocation = async () => {
            if (location.state?.credits) {
                const credits = location.state.credits;

                // Actualiza el formulario con los créditos desde el estado
                setFormData((prevData) => ({
                    ...prevData,
                    credits,
                }));

                // Consulta el costo de los créditos y actualiza el estado totalCost
                const totalCost = await fetchCreditsCost(credits);
                if (totalCost !== null) {
                    setTotalCost(totalCost);
                }
            }
        };

        updateCostFromLocation();
    }, [location.state]);

    const handleChange = async (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (name === 'credits') {
            const totalCost = await fetchCreditsCost(value);
            if (totalCost !== null) {
                setTotalCost(totalCost);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            toast.success("Redirigiendo a la plataforma de pago...");

            //Obtener el precio desde GraphQL (usando tu helper fetchCreditsCost)
            const cost = await fetchCreditsCost(formData.credits);

            if (!cost) {
                toast.error("No se pudo obtener el precio de los créditos.");
                setIsSubmitting(false);
                return;
            }

            //Mutación con variables
            const query = `
            mutation CreatePref($input: PreferenceInput!) {
                createPreference(input: $input) {
                    id
                    initPoint
                    sandboxInitPoint
                }
            }`;

            const variables = {
                input: {
                    items: [
                        {
                            title: `${formData.credits} Créditos`,
                            quantity: 1,
                            unitPrice: cost,     // precio dinámico
                            currencyId: "USD",
                        },
                    ],
                    externalReference: `user-${Date.now()}`, // ejemplo dinámico
                },
            };

            // Ejecutar mutación
            const response = await fetch("http://127.0.0.1:8000/graphql", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query, variables }),
            });

            const result = await response.json();

            const payment = result.data?.createPreference;
            if (payment) {
                console.log("Link de pago:", payment.initPoint);
                window.open(payment.initPoint, "_blank"); // abre en nueva pestaña
            } else {
                console.error("Error en GraphQL:", result.errors);
                setError("Ocurrió un error al generar el enlace de pago.");
            }
        } catch (error) {
            console.error("Error en la operación:", error);
            setError("Ocurrió un error al procesar la operación.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateForm = () => {
        if (!formData.credits || isNaN(formData.credits) || formData.credits <= 0) {
            toast.error('Por favor, ingresa una cantidad válida de créditos.');
            return false;
        }
        if (!formData.acceptTerms) {
            toast.error('Debes aceptar los términos y condiciones.');
            return false;
        }
        return true;
    };

    return (
        <div className="pricing-container-p">
            <div className="pricing-box-p">
                <h1 className="pricing-title-p">Comprar Créditos</h1>
                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Cantidad de créditos</label>
                        <div className="credit-options">
                            <select
                                id="credits"
                                name="credits"
                                required
                                value={formData.credits}
                                onChange={handleChange}
                            >
                                <option value="" disabled>Elige una opción</option>
                                <option value="250">250 Créditos</option>
                                <option value="750">750 Créditos</option>
                                <option value="1500">1500 Créditos</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Precio total</label>
                        <input
                            type="text"
                            value={`$${totalCost} USD`}
                            default=""
                            readOnly
                            className="readonly-input"
                        />
                    </div>

                    <div className="form-group terms">
                        <input
                            type="checkbox"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={handleChange}
                        />
                        <span>Acepto los </span>
                        <span className="terms-link" onClick={() => setShowTermsModal(true)}>
                            términos y condiciones
                        </span>
                    </div>

                    <div className="button-container">
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Procesando...' : 'Comprar Créditos'}
                        </button>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                </form>
            {showTermsModal && (
                <div className="verification-modal">
                    <div className="modal-content">
                        <h2>Términos y condiciones</h2>
                        <p className="terms-text">
                        Al realizar un pago por medio de la pasarela de pago de Leroi, el usuario acepta que no se realizarán 
                        devoluciones bajo ninguna circunstancia. Leroi no se hace responsable por el uso que el usuario dé a 
                        los créditos adquiridos ni por cualquier transacción realizada a través de la plataforma. 
                        Toda responsabilidad de pago, incluyendo cargos, montos adeudados y cualquier otro compromiso financiero, 
                        recae exclusivamente en el usuario, quien deberá asegurarse de cumplir con sus obligaciones de pago de 
                        manera adecuada.</p>
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

export default Pricing;

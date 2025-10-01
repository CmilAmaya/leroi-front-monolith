import "../styles/styles.css";
import "../styles/home.css";
import { useState, useEffect } from "react";
import feature1 from "../assets/feature-1.svg";
import feature2 from "../assets/feature-2.svg";
import feature3 from "../assets/feature-3.svg";
import gif from "../assets/gif.gif";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";

function Home() {
  const [activeIndex, setActiveIndex] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const faqData = [
    {
      question: "¿Cómo funciona?",
      answer: "Leroi analiza el contenido de los documentos subidos por los usuarios y genera un roadmap de aprendizaje jerárquico basado en los temas y subtemas identificados. Utiliza procesamiento de lenguaje natural para extraer conceptos clave y organizarlos en una secuencia lógica de aprendizaje."
    },
    {
      question: "¿Qué tipo de documentos puedo subir?",
      answer: "Leroi acepta documentos en formato PDF. Se recomienda que los documentos contengan texto estructurado y contengan pocas imagenes, esto con el fin de obtener una mejor interpretación y generar roadmaps más precisos."
    },
    {
      question: "¿Puedo personalizar los roadmaps generados?",
      answer: "Por ahora no, pero estamos trabajando para que los usuarios puedan ajustar los roadmaps generados por Leroi."
    },
    {
      question: "¿Mi cuenta ha sido suspendida o eliminada?",
      answer: "Si tu cuenta ha sido suspendida o eliminada, puede deberse a una infracción de nuestras políticas. Recuerda que subir archivos con contenido sensible o malicioso puede llevar a la eliminación de la cuenta. Si crees que esto ha ocurrido por error, puedes ponerte en contacto con nuestro equipo de soporte."
    },
    {
      question: "¿Por qué mi cuenta fue suspendida después de varios intentos fallidos de inicio de sesión?",
      answer: "Por razones de seguridad, si introduces varias veces una contraseña incorrecta, tu cuenta puede ser suspendida temporalmente. Te recomendamos esperar unos minutos e intentar nuevamente o restablecer tu contraseña si no la recuerdas. Si el problema persiste, contacta con nuestro equipo de soporte."
    },
    {
      question: "¿Puedo compartir los roadmaps generados?",
      answer: "Sí, puedes compartir los roadmaps generados con otros usuarios al exportarlos en formato PDF, PNG o JSON para su consulta offline."
    },
    {
      question: "¿Qué hago si mi documento no se procesa correctamente?",
      answer: "Si tu documento no se procesa correctamente, verifica que esté en formato PDF y que el texto sea legible. Si el problema persiste, prueba con otro documento o contacta con nuestro equipo de soporte."
    },
    {
      question: "¿Cómo funciona la compra de créditos en la pasarela de pago?",
      answer: "Los usuarios pueden comprar créditos a través de nuestra pasarela de pago segura. Ofrecemos tres paquetes de créditos, cada uno con diferentes cantidades de créditos disponibles. Una vez realizada la compra, los créditos se añaden automáticamente a tu cuenta y puedes utilizarlos para procesar documentos dentro de Leroi."
    },
    {
      question: "¿Cómo se calcula el costo en créditos para procesar un documento?",
      answer: "El costo en créditos para procesar un documento se basa en la cantidad y complejidad del contenido en sus páginas. Si un documento tiene solo texto, el costo será menor, mientras que si contiene imágenes de alta calidad o expresiones matemáticas en LaTeX muy pesadas, el costo aumentará debido a la mayor carga de procesamiento."
    },
    {
      question: "¿Qué elementos pueden aumentar el costo en créditos al procesar un documento?",
      answer: "Elementos como imágenes de alta resolución, gráficos detallados, ecuaciones complejas en LaTeX o documentos extensos pueden incrementar el costo en créditos. Recomendamos cargar documentos con pocas imagenes o expresiones muy complejas para evitar un procesamiento innecesariamente costoso."
    },
    {
      question: "¿Puedo obtener un estimado del costo en créditos antes de procesar un documento?",
      answer: "Sí, antes de confirmar el procesamiento de un documento, Leroi te mostrará un estimado del costo en créditos basado en la cantidad de páginas y la complejidad del contenido. De esta manera, puedes decidir si deseas continuar o ajustar el documento antes de procesarlo."
    },
    {
      question: "¿Los créditos tienen fecha de expiración?",
      answer: "No, los créditos comprados no tienen fecha de expiración. Puedes utilizarlos cuando lo necesites sin preocuparte por perderlos con el tiempo."
    },
    {
      question: "¿Puedo solicitar un reembolso si no utilizo mis créditos?",
      answer: "No ofrecemos reembolsos por créditos no utilizados. Sin embargo, puedes usarlos en cualquier momento, ya que no tienen fecha de expiración."
    }
  ];
  
  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);
  return (
    <>
      {/* Hook*/}
      <section id="tutorial" className="hook">
        <div className="hook-content">
          <img
            src={gif}
            alt="Tutorial Placeholder"
            className="hook-gif"
          />
          <h1>
          <Fade delay={200} cascade damping={0.02}>
            Convierte tus documentos en rutas de aprendizaje personalizadas
          </Fade>
          </h1>
          <Link to={isAuthenticated ? "/roadmap" : "/register"} className="cta-button">
            {isAuthenticated ? "Generar ruta de aprendizaje" : "Sube tu primer documento"}
          </Link>
        </div>
      </section>

      {/* Features*/}
      <section className="features">
        <h2>
          <Fade delay={200} cascade damping={0.02}>
            Conoce lo que es LEROI
          </Fade>
        </h2>
        <p className="definition">
          Leroi es una plataforma de aprendiz diseñada para optimizar la planificación y organización del estudio. 
          Automatiza la creación de planes de estudio, reduciendo el tiempo dedicado a estructurar qué y cómo aprender. 
          Además, identifica y jerarquiza subtemas para proporcionar un camino lógico en el aprendizaje. 
          Su capacidad de personalización permite a los usuarios cargar sus propios documentos generando rutas de estudio 
          adaptadas a su contenido específico.
        </p>
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">
              <img src={feature1} alt="Asistente de aprendizaje" />
            </div>
            <h3>Asistente de aprendizaje</h3>
            <p>
              Leroi automatiza la creación de planes de estudio, reduciendo significativamente el tiempo dedicado a planificar qué y cómo estudiar.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <img src={feature2} alt="Organizador" />
            </div>
            <h3>Organizador</h3>
            <p>
              Leroi identifica y organiza subtemas jerárquicamente, proporcionando un camino lógico y progresivo para el aprendizaje.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <img src={feature3} alt="Personalizador experto" />
            </div>
            <h3>Personalizador experto</h3>
            <p>
              Leroi permite a los usuarios cargar sus documentos (libros, artículos, apuntes) y generar rutas de aprendizaje adaptadas a ese contenido específico.
            </p>
          </div>
        </div>
      </section>
      {/*Pricing*/}
      <section id= "credits" className="pricing">
        <h2>
          <Fade delay={200} cascade damping={0.02}>
            Adquiere créditos
          </Fade>
        </h2>
        <div className="pricing-container">
          <div className="pricing-card">
            <h3>Principiante</h3>
            <p className="price">250 créditos</p>
            <ul>
              <li>Ideal para probar Leroi</li>
              <li>Procesa muchos documentos pequeños </li>
            </ul>
            <Link to="/pricing" state={{ credits: 250 }} className="cta-button">Comprar paquete</Link>
          </div>
          <div className="pricing-card">
            <h3>Intermedio</h3>
            <p className="price">750 créditos</p>
            <ul>
              <li>Ideal para estudiantes</li>
              <li>Suficiente para generar roadmaps con archivos medianamente grandes</li>
            </ul>
            <Link to="/pricing" state={{ credits: 750 }} className="cta-button">Comprar paquete</Link>
          </div>
          <div className="pricing-card">
            <h3>Avanzado</h3>
            <p className="price">1500 créditos</p>
            <ul>
              <li>Perfecto para autodidactas avanzados</li>
              <li>Genera roadmaps con archivos grandes</li>
            </ul>
            <Link to="/pricing" state={{ credits: 1500 }} className="cta-button">Comprar paquete</Link>
          </div>
        </div>
      </section>

      {/* Common Questions */}
      <section id="faq" className="faq">
      <h2>
        <Fade delay={200} cascade damping={0.02}>
          Preguntas frecuentes
        </Fade>
      </h2>
      <div className="faq-container">
        {faqData.map((item, index) => (
          <div key={index} className={`faq-card ${activeIndex === index ? 'active' : ''}`} onClick={() => toggleAnswer(index)} style={{ cursor: 'pointer' }}>
            <h4>
              {item.question}
            </h4>
            {activeIndex === index && <p>{item.answer}</p>}
          </div>
        ))}
      </div>
    </section>

      {/* El footer*/}
      <Footer />
    </>
  );
}

export default Home;

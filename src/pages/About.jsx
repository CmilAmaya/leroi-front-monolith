import { useEffect } from "react";
import "../styles/styles.css";
import "../styles/about.css";
import Footer from "../components/Footer";
import imagotipo from "../assets/imagotipo.png";
import member1 from "../assets/mateo.png"; 
import member2 from "../assets/camila.png";
import member3 from "../assets/anderson.png";
import member4 from "../assets/juan.png";
import { Mail, Github } from "lucide-react"; 

function About() {
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
            <section className="intro">
                <h3>Acerca de Leroi</h3>
                <div className="logo-container">
                    <img src={imagotipo} className="imagotipo" alt="Icono de Leroi" />
                </div>
            </section>

            <section className="vision-mission">
                <div className="vision-wrapper">
                    <h3>Visión</h3>
                    <div className="vision">
                        <p>
                            Para 2030 LEROI aspira a ser la plataforma líder en la creación de caminos de aprendizaje, facilitando el acceso al conocimiento académico. Inspirados por los valores de altruismo, compromiso y responsabilidad para transformar la forma en que las personas organizan su aprendizaje.
                        </p>
                    </div>
                </div>
                <div className="mission-wrapper">
                    <h3>Misión</h3>
                    <div className="mission">
                        <p>
                            LEROI proporciona una herramienta de creación de rutas de aprendizaje que sirven de guía para formarse en temas basados en los documentos proporcionados por cada usuario, facilitando su proceso de aprendizaje.
                        </p>
                    </div>
                </div>
            </section>

            <section className="team" id="team">
                <h3>Conoce al Equipo</h3>
                <div className="team-cards">
                    {/* Tarjeta de miembro 1 */}
                    <div className="team-card">
                        <img src={member1} alt="Sebastián Lopez" className="team-photo" />
                        <div className="team-card-content">
                            <h4>Sebastián Lopez</h4>
                            <div className="team-icons">
                                <a href="mailto:slopezsi@unal.edu.co" target="_blank" rel="noopener noreferrer">
                                    <Mail className="icon h-5 w-5" />
                                </a>
                                <a href="https://github.com/Sebls" target="_blank" rel="noopener noreferrer">
                                    <Github className="icon h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta de miembro 2 */}
                    <div className="team-card">
                        <img src={member2} alt="Camila Amaya" className="team-photo" />
                        <div className="team-card-content">
                            <h4>Camila Amaya</h4>
                            <div className="team-icons">
                                <a href="mailto:mamayaro@unal.edu.co" target="_blank" rel="noopener noreferrer">
                                    <Mail className="icon h-5 w-5" />
                                </a>
                                <a href="https://github.com/CmilAmaya" target="_blank" rel="noopener noreferrer">
                                    <Github className="icon h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta de miembro 3 */}
                    <div className="team-card">
                        <img src={member3} alt="Anderson Mateus" className="team-photo" />
                        <div className="team-card-content">
                            <h4>Anderson Mateus</h4>
                            <div className="team-icons">
                                <a href="mailto:amateusl@unal.edu.co" target="_blank" rel="noopener noreferrer">
                                    <Mail className="icon h-5 w-5" />
                                </a>
                                <a href="https://github.com/amateusl" target="_blank" rel="noopener noreferrer">
                                    <Github className="icon h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta de miembro 4 */}
                    <div className="team-card">
                        <img src={member4} alt="Juan Rodríguez" className="team-photo" />
                        <div className="team-card-content">
                            <h4>Juan Rodríguez</h4>
                            <div className="team-icons">
                                <a href="mailto:juarodriguezgo@unal.edu.co" target="_blank" rel="noopener noreferrer">
                                    <Mail className="icon h-5 w-5" />
                                </a>
                                <a href="https://github.com/juarodriguezg" target="_blank" rel="noopener noreferrer">
                                    <Github className="icon h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default About;
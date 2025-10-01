import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaSearch } from "react-icons/fa"; 
import "../styles/profile.css";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale"; 

function RoadmapsSection() {
  const [userRoadmaps, setUserRoadmaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const authToken = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRoadmaps = async () => {
      if (!authToken) {
        navigate("/login");
        return;
      }

      try {
        const roadmapsResponse = await fetch(`${backendUrl}/user-roadmaps`, {
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
        setUserRoadmaps(roadmapsData.data);
      } catch (error) {
        console.error("Error al obtener los roadmaps:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRoadmaps();
  }, [backendUrl, authToken, navigate]);

  const handleRoadmapClick = (roadmap) => {
    navigate("/generatedRoadmap", { state: { roadmapTopics: JSON.parse(roadmap.prompt), linkButton: false} });
  };

  const handleDeleteImage = async (roadmapId) => {
    const authToken = localStorage.getItem("token");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await fetch(`${backendUrl}/delete-roadmap-image`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          'x-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify({ roadmap_id: roadmapId }),
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar la imagen del roadmap: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result.message);
      setUserRoadmaps((prevRoadmaps) =>
        prevRoadmaps.map((roadmap) =>
          roadmap.id_roadmap === roadmapId
            ? { ...roadmap, image: null }
            : roadmap
        )
      );

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
    }
  };

  const filteredRoadmaps = userRoadmaps.filter((roadmap) => {
    const matchesName = roadmap.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = new Date(Date.parse(roadmap.fecha_creacion)).toLocaleDateString().includes(searchTerm);
    return matchesName || matchesDate;
  });

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-message">Cargando roadmaps...</div>
      </div>
    );
  }

  return (
    <div className="roadmaps-section">
      <h3>Roadmaps Creados</h3>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nombre o fecha..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <FaSearch className="search-icon" />
      </div>
      {filteredRoadmaps.length > 0 ? (
        <div className="roadmaps-grid">
          {filteredRoadmaps.map((roadmap) => (
            <div
              key={roadmap.id_roadmap}
              className="roadmap-card"
              onClick={() => handleRoadmapClick(roadmap)}
            >
              <div className="roadmap-card-header">
                <strong>{roadmap.nombre}</strong>
              </div>
              <div className="roadmap-card-body">
                <img
                  src={roadmap.image || "ruta/a/imagen/por/defecto.png"}
                  alt={`Imagen de ${roadmap.nombre}`}
                  className="roadmap-image"
                />
                <p>
                  Creado el:{" "}
                  {format(parseISO(roadmap.fecha_creacion), "dd 'de' MMMM 'de' yyyy", {
                    locale: es,
                  })}
                </p>
                <div className="delete-icon-container">
                  <FaTrash
                    className="delete-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(roadmap.id_roadmap);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No se encontraron roadmaps que coincidan con la búsqueda.</p>
      )}
    </div>
  );
}

export default RoadmapsSection;
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import archivo from '../assets/archivo.png';
import anim_tutorial from '../assets/Tutorial_CrearRoadmap.mp4';
import tutorial_logo from '../assets/Tutorial_logo.png';
import { toast } from 'react-hot-toast';
import { PDFDocument } from 'pdf-lib';
import '../styles/roadmap.css';

function Roadmap() {
  const location = useLocation();
  const navigate = useNavigate();

  const [fileUploaded, setFileUploaded] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);  
  const [helpModal, setHelpModal] = useState(false);
  const [base64, setBase64] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFileInfo, setShowFileInfo] = useState(false);
  const [userCredits, setUserCredits] = useState(null);
  const [previewCost, setPreviewCost] = useState("Calculando...");
  const [CanUserPay, setCanUserPay] = useState(true);
  const [topicsModal, setTopicsModal] = useState(false);
  const [topics, setTopics] = useState([]);
  const [loadingPage, setLoadingPage] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [roadmapTopics, setRoadmapTopics] = useState({});
  const [roadmapInfo, setRoadmapInfo] = useState({});
  const [relatedTopics, setRelatedTopics] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [userData, setUserData] = useState(null);

  // NUEVO: Estado global para almacenar dataToSend
  const [fileData, setFileData] = useState(null);

  const authToken = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        // Remover el prefijo para obtener base64 puro
        const base64String = reader.result;
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  useEffect(() => {
    if (base64) {
      setPreviewFile(true);
    }
  }, [base64]);

  useEffect(() => {
    if (topics.length > 0) {
      console.log("Topics updated:", topics);
      setTopicsModal(true);
    }
  }, [topics]);

  useEffect(() => {
    const storedModalState = localStorage.getItem('topicsModal');
    if (storedModalState === 'true') {
      console.log("State:", location.state?.topicState); 
      if (location.state?.topicState) {
        setTopics(location.state.topicState.relatedTopics || []); 
      }
      setTopicsModal(true);
      localStorage.removeItem('topicsModal');
    }
  }, [location.state]);
  
  useEffect(() => {
    if (Object.keys(roadmapTopics).length > 0) {
      console.log("Roadmap Topics:", roadmapTopics);
      setLoadingPage(false);
      setLoadingText("");
      navigate('/generatedRoadmap', {state: {roadmapTopics, relatedTopics, roadmapInfo}});
    }
  }, [roadmapTopics, relatedTopics, navigate]);

  useEffect(() => {
    if (relatedTopics.length > 0) {
      console.log("Related Topics :D", relatedTopics);
    }
  }, [relatedTopics]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authToken) {
        window.location.href = "/login";
        return;
      }

      try {
        const userResponse = await fetch(`${backendUrl}/users_authentication_path/user-profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            'x-api-key': import.meta.env.VITE_API_KEY
          },
        });

        if (!userResponse.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }

        const userData = await userResponse.json();
        setUserData(userData.data);
      } catch (error) {
        console.error(error);
        window.location.href = "/login";
      }
    };

    fetchUserData();
  }, [backendUrl, authToken]);

  const handleFileChange = async (e) => {
    
    const file = e.target.files[0];
    const maxSize = 50 * 1024 * 1024; 

    if (file.size > maxSize) {
      toast.error('¡El archivo supera nuestras capacidades de procesamiento! Prueba eliminando algunas páginas o imagenes del archivo...');
      return;
    } else {
      setFileUploaded(file);
      convertToBase64(file);
    }

    setLoadingPage(true);
    setLoadingText("Cargando documento 🧐");
    setFileUploaded(file);
  
    try {
      // Procesar PDF para obtener primera página
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      const newPdfDoc = await PDFDocument.create();
      const [firstPage] = await newPdfDoc.copyPages(pdfDoc, [0]); 
      newPdfDoc.addPage(firstPage);
      const pdfBytes = await newPdfDoc.save();
      const previewBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      // Para preview: mantener formato completo con prefijo
      const base64Preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(previewBlob);
      });
      
      // Para backend: solo base64 puro
      const base64Pure = await convertToBase64(previewBlob);
      
      setBase64(base64Preview); // Para el iframe
      
      // ✅ CREAR Y GUARDAR dataToSend en el estado global
      const dataToSend = {
        fileName: file.name,
        fileType: file.type, 
        fileSize: file.size,
        fileBase64: base64Pure, // Base64 sin prefijo
      };

      setFileData(dataToSend); // Guardar en estado global
      console.log("📦 Datos del archivo guardados:", dataToSend);
  
  
      function getEmailFromToken(token) {
        try {
          if (!token) return null;
          const parts = token.split('.');
          if (parts.length !== 3) return null;
  
          // Convertir base64url -> base64 y agregar padding
          const base64Url = parts[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const padded = base64 + '==='.slice((base64.length + 3) % 4);
  
          const payload = JSON.parse(atob(padded));
          return payload.email || payload.sub || null;
        } catch {
          return null;
        }
      }
  
      const email = getEmailFromToken(authToken);
      if (!email) {
        console.log("entro a buscar el email");
        toast.error('No se pudo obtener el correo del usuario.');
        return;
      }
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("email", email);
  

      const previewPromise = fetch(`${import.meta.env.VITE_BACKEND_URL_PREPROCESSING}/files/cost-estimates`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify(dataToSend),
      });
      console.log("Se esta utilizando la URL:", import.meta.env.VITE_BACKEND_URL_PREPROCESSING, "/files/cost-estimates");


      const previewResponse = await previewPromise;
      if (!previewResponse.ok) {
        throw new Error('Error al obtener la vista previa de costos');
      }

  
      const previewResult = await previewResponse.json();

      const credits_cost = previewResult.credits_cost || 1;
      const user_credits = userData?.credits || 0;

      console.log("COSTO DE CREDITOS:", credits_cost);
  
      const analyzePromise = fetch(`${import.meta.env.VITE_BACKEND_URL_PREPROCESSING}/files/analyses`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend),
      });
      console.log("Se esta utilizando la URL:", import.meta.env.VITE_BACKEND_URL_PREPROCESSING, "/files/analyses");

  
      setPreviewCost("Costo: " + credits_cost.toLocaleString() + " Créditos");
      setUserCredits("Actualmente tienes " + user_credits.toLocaleString() + " créditos");

      setShowFileInfo(true);
  
      setCanUserPay(credits_cost > user_credits);
      if (credits_cost > user_credits) {
        toast.error('Creditos Insuficientes 😔');
      }
      analyzePromise
        .then((analyzeResponse) => {
          return analyzeResponse.json();
          
        })
        .then((analyzeResult) => {
          console.log("Analyze result:", analyzeResult);
          if (analyzeResult.has_virus) {
            toast.error("El archivo contiene virus. El usuario ha sido eliminado.");
          }
        })
        .catch((error) => {
          console.error('Error al analizar el archivo:', error);
        });
  
    } catch (error) {
      console.error('Error al obtener la vista previa de costos:', error);
      toast.error('Error al obtener el costo de procesamiento');
    } finally {
      setLoadingPage(false);
      setLoadingText("");
    }
  };


const handleDragOver = (e) => {
  e.preventDefault();
  setIsDragging(true);
};

const handleDragLeave = () => {
  setIsDragging(false);
};

const handleDrop = (e) => {
  e.preventDefault();
  setIsDragging(false);
  const file = e.dataTransfer.files[0];
  if (file) {
    handleFileChange({ target: { files: [file] } });
  }
};
  const handleReset = () => {
    setFileUploaded(null);
    setPreviewCost("Calculando...");
    setShowFileInfo(false);
  };

  const handleSubmitFile = async () => {
    if (!base64 || !fileUploaded) {
      toast.error("No has subido ningún archivo");
      return;
    }
  
    setLoadingPage(true);
    setLoadingText("Buscando temas relacionados... 📈🧠📚");
    console.log("🚀 URL que está usando:", import.meta.env.VITE_BACKEND_URL);
    console.log("📦 Datos a enviar:", fileData);
  
   
  
    try {

      const processResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL_LEARNING}/learning_path/documents`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          'x-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify(fileData),
      });
  
      if (!processResponse.ok) {
        toast.error("No puedes generar rutas de aprendizaje de temas sensibles");
        const errorData = processResponse.json();
        throw new Error(errorData.detail);
      }
      console.log("ESTO DIJO LA IA", processResponse);
      const result = await processResponse.json();
      console.log("RESULTADO JSON:", result); 
      setTopics(result.themes);
  
    } catch (error) {
      console.error("Error en el proceso de IA:", error);
      toast.error("Error al enviar los datos al backend");
    } finally {
      setIsLoading(false);
      setLoadingPage(false);
      setLoadingText("");
    }
  };

  const updateUserCredits = async (amount) => {
    try {
      const response = await fetch(`${backendUrl}/users_authentication_path/user-credits/${encodeURIComponent(userData.email)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'x-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar los créditos del usuario');
      }

      // Actualizar los datos del usuario localmente
      setUserData(prev => ({ ...prev, credits: prev.credits + amount }));
    } catch (error) {
      console.error('Error al actualizar créditos:', error);
    }
  };

  const handleSelectedTopic = async(topic) => {  
    setTopicsModal(false);
    setLoadingPage(true);
    setLoadingText("Estamos creando tu ruta de aprendizaje 😁");
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL_LEARNING}/learning_path/roadmaps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'x-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify({ topic }),
      });
  
      if (!response.ok) {
        throw new Error('Error al enviar el topic al backend');
      }
         const result = await response.json();
    console.log("Response completa del backend:", result);
    
    // ✅ Función para extraer JSON limpio de strings con markdown o python
    const extractJSON = (str) => {
      if (!str) {
        console.error('String vacío recibido');
        return null;
      }
      
      // Si ya es un objeto, devolverlo
      if (typeof str === 'object') {
        console.log('Ya es un objeto JSON válido');
        return str;
      }
      
      console.log('String original a limpiar:', str.substring(0, 200));
      
      // Remover bloques de código markdown (```json, ```python, etc.)
      let cleaned = str.trim();
      
      // Remover bloques de código markdown al inicio y final
      cleaned = cleaned.replace(/^```(?:json|python|javascript|py)?\s*/i, '');
      cleaned = cleaned.replace(/```\s*$/g, '');
      
      // Buscar el primer { y el último }
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      
      if (firstBrace === -1 || lastBrace === -1) {
        console.error('No se encontraron llaves {} en el string');
        return null;
      }
      
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      console.log('String limpio (primeros 200 chars):', cleaned.substring(0, 200));
      
      try {
        return JSON.parse(cleaned);
      } catch (e) {
        console.error('Error al parsear JSON:', e);
        console.error('String que causó el error:', cleaned.substring(0, 500));
        return null;
      }
    };
    
    // ✅ Parsear roadmap
    console.log("Tipo de result.roadmap:", typeof result.roadmap);
    console.log("Contenido de result.roadmap:", result.roadmap);
    
    const parseResult = extractJSON(result.roadmap);
    if (!parseResult) {
      throw new Error('No se pudo parsear el roadmap');
    }
    console.log("Roadmap parseado correctamente:", parseResult);
    
    // ✅ Parsear extra_info
    console.log("Tipo de result.extra_info:", typeof result.extra_info);
    console.log("Contenido de result.extra_info:", result.extra_info);
    
    const parseSecondResult = extractJSON(result.extra_info);
    if (!parseSecondResult) {
      throw new Error('No se pudo parsear extra_info');
    }
    console.log("Extra info parseado correctamente:", parseSecondResult);

    // Descontar 1 crédito al usuario por roadmap generado exitosamente
    await updateUserCredits(-1);

    setRelatedTopics([
      "Programación en Python",
      "Algoritmos y Estructuras de Datos",
      "Bases de Datos SQL",
      "Redes de Computadores"
    ]);
    
    setRoadmapTopics(parseResult);    
    setRoadmapInfo(parseSecondResult);
    
  } catch (error) {
    console.error('Error detallado al generar la ruta:', error);
    console.error('Stack trace:', error.stack);
    
    if (error instanceof SyntaxError) {
      toast.error('Error al procesar la respuesta del servidor. El formato no es válido.');
    } else {
      toast.error('No pudimos generar tu ruta de aprendizaje 😔');
    }
  } finally {
    setLoadingPage(false);
    setLoadingText("");
  }
};

  return (
    <>
      <div>
        {/* Sección de carga del archivo */}
        {!showFileInfo ? (
          <div className="roadmap-container">
            <h1>Sube un archivo para generar tu ruta de aprendizaje</h1>
            <div className={`file-upload ${isDragging ? 'dragging' : ''}`} onClick={() => document.getElementById('fileInput').click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              >
              <input
                id="fileInput"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <img src={archivo} alt="Icono de carga" className="upload-icon" />
              <p>{isDragging ? 'Suelta tu archivo aquí...' : 'Arrastra y suelta tu archivo PDF aquí o haz clic para subirlo (Máx 50 MB)'}</p>
            </div>
          </div>
        ) : (
          <div className="file-info-container">

            {/* Contenedor derecho: Vista previa del PDF */}
            {previewFile && base64 && (
              <div className="pdf-preview">
                {/* <h3>Vista Previa</h3> */}
                <iframe
                  src={base64 + "#toolbar=0"}
                  title="Vista previa del PDF"
                  width="100%"
                  height="100%"
                />
              </div>
            )}

            {/* Contenedor izquierdo: Detalles del archivo */}
            <div className="file-details">
                <h2>Detalles del Archivo</h2>
                <p>Nombre: {fileUploaded.name}</p>
                <p>Tamaño: {(fileUploaded.size / (1024 * 1024)).toFixed(2)} MB</p>
              <div className="credits-cost">
                <h2>Costo de procesamiento</h2>
                <p className="preview-cost-label">{previewCost}</p>
                <p className="user-credits-label">{userCredits}</p>
              </div>
              

              {/* Contenedor para los botones */}
              <div className="buttons-container">
                <button className="generate-button" onClick={handleSubmitFile} disabled={CanUserPay}>
                  {isLoading ? 'Generando tu ruta de aprendizaje...' : 'Generar ruta de aprendizaje'}
                </button>
                <button className="reset-button" onClick={handleReset}>
                  Subir otro archivo
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      <div className="help-icon" onClick={() => setHelpModal(true)}>
        <img src={tutorial_logo} alt="Ayuda" className="tutorial-icon" />
      </div>

      {/* Modal para el tutorial en video */}
      {helpModal && (
        <div className="preview-modal">
          <div className="preview-content">
            <video width="100%" height="100%" controls autoPlay muted>
              <source src={anim_tutorial} type="video/mp4"/>
              Tu navegador no soporta la reproducción de videos.
            </video>
            <button onClick={() => setHelpModal(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {topicsModal && (
        <div className="topics-modal">
            <h1>Temas detectados en tu archivo</h1>
              <div className="topics-content">
                {topics.map((topic, index) => (
                  <button className="topic-button" key={index} onClick={() => handleSelectedTopic(topic)}>
                    {topic}
                  </button>
                ))}
              </div>
        </div>
      )}
      {loadingPage && (
        <div className="loading-modal">
          <div className="loading-content">
            <h2>{loadingText}</h2>
            <div className="spinner"></div>
          </div>
        </div>
      )}
    </>
  );
}

export default Roadmap;
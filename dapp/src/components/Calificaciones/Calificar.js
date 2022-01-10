import { useState } from "react";
import { drizzleReactHooks } from '@drizzle/react-plugin'
import SoloProfesor from "../Roles/SoloProfesor";
import SoloAbierta from "../Roles/SoloAbierta";

const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const Calificar = () => {
    const { drizzle } = useDrizzle();

    // Obtener el status de la ultima transaccion enviada:
    const { transactionStack, transactions } = useDrizzleState(drizzleState => ({
        transactionStack: drizzleState.transactionStack,
        transactions: drizzleState.transactions
    }));
    const [lastStackID, setLastStackID] = useState(undefined)
    const txObject = transactions[transactionStack[lastStackID] || 'undefined'];
    const status = txObject?.status;

    // Conservar los valores metidos en el formulario
    let [direccionAlumno, setDireccionAlumno] = useState("")
    let [indiceEvaluacion, setIndiceEvaluacion] = useState("")
    let [tipo, setTipo] = useState("")
    let [calificacion, setCalificacion] = useState("")

    return (
        <SoloAbierta>
            <SoloProfesor>
                <article className="AppMisDatos">
                    <h3>Calificar</h3>
                    <form>
                        <p> Dirección del Alumno:  &nbsp; <input key="alumno" type="text" value={direccionAlumno}
                            onChange={ev => setDireccionAlumno(ev.target.value)} />
                        </p>
                        <p> Índice de la Evaluación:  &nbsp; <input key="evaluacion" type="number" value={indiceEvaluacion}
                            onChange={ev => setIndiceEvaluacion(ev.target.value)} />
                        </p>
                        <p> Tipo: (0=NP 1=Nota 2=MH):  &nbsp; <input key="tipo" type="number" value={tipo}
                            onChange={ev => setTipo(ev.target.value)} />
                        </p>
                        <p> Nota (0 - 1000):  &nbsp; <input key="calificacion" type="number" value={calificacion}
                            onChange={ev => setCalificacion(ev.target.value)} />
                        </p>
                        <button key="submit" className="formabrirButton" type="button" onClick={ev => {
                            ev.preventDefault();
                            const stackId = drizzle.contracts.Asignatura.methods.califica.cacheSend(direccionAlumno, indiceEvaluacion, tipo, calificacion);
                            setLastStackID(stackId);
                        }}>
                            Calificar
                        </button>
                        <p className='estado'> Estado = {status} </p>
                    </form>
                </article>
            </SoloProfesor>
        </SoloAbierta>
    );
};

export default Calificar;

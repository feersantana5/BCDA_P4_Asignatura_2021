import { drizzleReactHooks } from '@drizzle/react-plugin'
import { useState } from "react";

const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const NuevaEvaluacion = () => {
    const { drizzle } = useDrizzle();

    // Obtener el status de la ultima transaccion enviada:
    const { transactionStack, transactions } = useDrizzleState(drizzleState => ({
        transactionStack: drizzleState.transactionStack,
        transactions: drizzleState.transactions
    }));
    const [lastStackID, setLastStackID] = useState(undefined)
    const txObject = transactions[transactionStack[lastStackID] || 'undefined'];
    const status = txObject?.status;

    // Conservar los valores del formulario
    let [evaluacion, setEvaluacion] = useState("")
    let [fecha, setFecha] = useState("")
    let [nota, setNota] = useState("")

    return (
        <article className="AppMisDatos">
            <form>
                <p> Nombre de la evaluación:  &nbsp; <input value={evaluacion} key="evaluacion" name="evaluacion"
                    onChange={ev => setEvaluacion(ev.target.value)} />
                </p>
                <p>
                    Fecha de la evaluación:  &nbsp; <input value={fecha} key="fecha" name="fecha" type="number"
                        onChange={ev => setFecha(ev.target.value)} />
                </p>
                <p>
                    Inserte la nota (0 - 1000):  &nbsp; <input value={nota} key="nota" name="nota" 
                        onChange={ev => setNota(ev.target.value)} />
                </p>
                <button className="formabrirButton" key="submit" type="button" onClick={ev => {
                        ev.preventDefault();
                        const stackId = drizzle.contracts.Asignatura.methods.creaEvaluacion.cacheSend(evaluacion, fecha, nota);
                        setLastStackID(stackId);
                    }}>CrearEvaluacion
                </button>
                <p className='estado'> Estado = {status} </p>
            </form>
        </article>
    );
};
export default NuevaEvaluacion;

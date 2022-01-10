import { drizzleReactHooks } from '@drizzle/react-plugin'
import { useState } from "react";

const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const AddProfesor = () => {
    const { drizzle } = useDrizzle();

    // Obtener el estado de las transacciones desde el estado de drizzle
    const { transactionStack, transactions } = useDrizzleState(drizzleState => ({
        transactionStack: drizzleState.transactionStack,
        transactions: drizzleState.transactions
    }));

    const [lastStackID, setLastStackID] = useState(undefined)
    const txObject = transactions[transactionStack[lastStackID] || 'undefined'];
    const status = txObject?.status;

    // Conservar los valores del formulario
    let [nombre, setNombre] = useState("")
    let [direccion, setDireccion] = useState("")

    return (
        <article className="AppMisDatos">
            <h3>Añadir Profesor</h3>
            <form>
                <p> Nombre del profesor:  &nbsp; <input value={nombre} key="nombre"
                    onChange={ev => setNombre(ev.target.value)} />
                </p>
                <p>
                    Dirección del profesor de la evaluación:  &nbsp; <input value={direccion} key="direccion"
                        onChange={ev => setDireccion(ev.target.value)} />
                </p>
                <button className="formabrirButton" key="submit" type="button" onClick={ev => {
                    ev.preventDefault();
                    const stackId = drizzle.contracts.Asignatura.methods.addProfesor.cacheSend(direccion, nombre);
                    setLastStackID(stackId);
                }}>Añadir Profesor
                </button>
                <p className='estado'> Estado = {status} </p>
            </form>
        </article>

    )


}

export default AddProfesor;
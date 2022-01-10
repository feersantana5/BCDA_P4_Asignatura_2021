import { drizzleReactHooks } from '@drizzle/react-plugin'
import { useState } from "react";

const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const ModificarCoordinador = () => {
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
    let [direccionCoordinador, setdireccionCoordinador] = useState("")


    return (
        <article className="AppMisDatos">
            <h3>Modificar Coordinador</h3>
            <form>
                <p> Añade la dirección del nuevo coordinador: &nbsp; <input value={direccionCoordinador} onChange={ev => setdireccionCoordinador(ev.target.value)} /> </p>
                <button className="modificarButton" key="submit" onClick={ev => {
                    ev.preventDefault();
                    const stackId = drizzle.contracts.Asignatura.methods.setCoordinador.cacheSend(direccionCoordinador);
                    setLastStackID(stackId);
                }}>
                    Modificar Coordinador </button>
                <p className='estado'> Estado = {status} </p>
            </form>
        </article>
    )


}

export default ModificarCoordinador;
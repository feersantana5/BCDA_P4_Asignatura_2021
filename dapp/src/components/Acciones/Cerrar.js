import { useState } from "react";
import { drizzleReactHooks } from '@drizzle/react-plugin'

const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const Cerrar = () => {

    //const [lastStackID, setLastStackID] = useState(undefined)
    const { drizzle} = useDrizzle();

    // Obtener el status de la ultima transaccion enviada:
    const { transactionStack, transactions } = useDrizzleState(drizzleState => ({
        transactionStack: drizzleState.transactionStack,
        transactions: drizzleState.transactions
    }));
    const [lastStackID, setLastStackID] = useState(undefined)
    const txObject = transactions[transactionStack[lastStackID] || 'undefined'];
    const status = txObject?.status;

    //estadoBool=false por lo que app abierta y hay que cerrarla
    return (
        <form>
            <button className="cerrarButton" key="submit" type="button" onClick={ev => {
                ev.preventDefault();
                const stackId = drizzle.contracts.Asignatura.methods.cerrar.cacheSend();
                setLastStackID(stackId);
            }}>Cerrar Asignatura </button>
            <p className='estado'> Estado = {status} </p>
        </form>
    )
};

export default Cerrar;
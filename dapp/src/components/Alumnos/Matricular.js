import { drizzleReactHooks } from '@drizzle/react-plugin'
import { useState } from "react";

const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const Matricular = () => {
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
    let [nombre, setNombre] = useState("")
    let [id, setID] = useState("")
    let [email, setEmail] = useState("")

    return (
        <article className="AppMisDatos">
            <form>
                <p> Inserte su nombre:  &nbsp; <input value={nombre} key="nombre" name="nombre" 
                    onChange={ev => setNombre(ev.target.value)} />
                </p>
                <p>
                    Inserte su ID:  &nbsp; <input value={id} key="id" name="id" 
                        onChange={ev => setID(ev.target.value)} />
                </p>
                <p>
                    Inserte su email:  &nbsp; <input value={email} key="email" name="email" type="email"
                        onChange={ev => setEmail(ev.target.value)} />
                </p>
                <button className="abrirButton" key="submit" type="button" onClick={ev => {
                        ev.preventDefault();
                        const stackId = drizzle.contracts.Asignatura.methods.automatricula.cacheSend(nombre, id, email);
                        setLastStackID(stackId);
                    }}>Matricular
                </button>
                <p className='estado'> Estado = {status} </p>
            </form>
        </article>);
};

export default Matricular;
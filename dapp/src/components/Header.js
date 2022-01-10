import { drizzleReactHooks } from '@drizzle/react-plugin'
import Identificador from "./LogIn"

const { useDrizzle } = drizzleReactHooks;

const Header = () => {
    const { useCacheCall } = useDrizzle();

    const nombre = useCacheCall("Asignatura", "nombre");
    const curso = useCacheCall("Asignatura", "curso");
    const estado = useCacheCall("Asignatura", "cerrada") ? "Cerrada" : "Abierta";

    return (
        <header className="AppHeader">
            <h1>
                Asignatura: {nombre}-<em>{curso}</em>
            </h1>
            <h4>
                Estado: {(estado)}
            </h4>

            <Identificador/>

        </header>
    );
};

export default Header;
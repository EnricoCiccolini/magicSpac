import { useParams } from "react-router-dom";
function DettailCard() {

    const { name } = useParams();
    return (
        <>
            <div>DettailCard {name}</div>
        </>
    )
}

export default DettailCard
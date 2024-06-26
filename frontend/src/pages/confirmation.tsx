import { useEffect, useState } from "react"

const Confirmation = () => {
    const [verified, setVerified] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!verified) {
            console.log("nu körs jag")
            const verifySession = async () => {
                console.log("och jag hoppar in i funktionen")
                let sessionId;
                const dataFromLs = localStorage.getItem("sessionId")

                if (dataFromLs) {
                    sessionId = JSON.parse(dataFromLs)
                }
                console.log(sessionId)
                const response = await fetch("http://localhost:3005/payments/verify-session", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ sessionId })
                })

                const data = await response.json()

                if (response.ok) {
                    setVerified(data.verified)
                    setIsLoading(false)
                }
            }

            verifySession()
        }
    }, [verified])


    return (
        <div>
            <h3>{verified && !isLoading ? "TACK FÖR DITT KÖP ✅" : "LOADING..."}</h3>
            {verified && <a href="/">Tillbaka till startsidan</a>}
        </div>
    )
}

export default Confirmation
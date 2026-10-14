// client/src/hooks/useMyReservations.js

import { useEffect, useState } from "react"
import reservationService from "../services/reservationService.js"

export default function useMyReservations(token) {
    const [reservations, setReservations] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        let ignore = false

        async function loadReservations() {
          try {
            setError('')
            const data = await reservationService.getMy(token)
            const items = Array.isArray(data) ? data : data?.items || []

            if (!ignore) {
              setReservations(items)
            }

          } catch (err) {
            if (!ignore) {
              setError(err.message || 'Не удалось загрузить заявки')
            }
          }
        }

        if (token) {
          loadReservations()
        } else {
          setReservations([])
        }

        return () => {
          ignore = true
        }
      }, [token])

    return { reservations, setReservations, error }
}
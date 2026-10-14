// client/src/hooks/useAdminReservations.js

import { useEffect, useState } from "react"
import adminService from "../services/adminService.js"

export default function useAdminReservations(token, statusFilter) {
    const [reservations, setReservations] = useState([])
    const [draftStatuses, setDraftStatuses] = useState([])
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        let ignore = false

        async function loadReservations() {
          try {
            setError('')
            setMessage('')
            
            const data = await adminService.getReservations(statusFilter, token)
            const items = Array.isArray(data) ? data : data?.items || []

            if (!ignore) {
              setReservations(items)
              setDraftStatuses({})
            }

          } catch (err) {
            if (!ignore) {
              setError(err.message || 'Ошибка получения заявок')
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
      }, [token, statusFilter])

      const updateDraftStatus = (id, value) => {
        setDraftStatuses((prev) => ({
          ...prev,
          [id]: value
        }))
      }

      const saveStatus = async (id, currentStatus) => {
        const nextStatus = draftStatuses[id]

        if (!nextStatus || nextStatus === currentStatus) {
          setError('Выберите новый допустимый статус')
          return
        }

        try {
          setError('')
          setMessage('')
          
          const data = await adminService.updateStatus(id, nextStatus, token)

          setReservations((prev) => prev.map((item) => item.id === id ? { ...item, status: data.reservation.status } : item))

          setDraftStatuses((prev) => {
            const copy = { ...prev }
            delete copy[id]
            return copy
          })
          
          setMessage(data.message || 'Статус заявки обновлён')
        } catch (err) {
          setError(err.message || 'Ошибка обновления статуса')
        }
      }

    return { reservations, setReservations, draftStatuses, updateDraftStatus, saveStatus, error, message }
}
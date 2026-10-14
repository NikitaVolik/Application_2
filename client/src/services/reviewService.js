// client/src/services/reviewService.js

import { apiFetch } from "./api.js";

const reviewService = {
    create(payload, token) {
        return apiFetch(
            '/api/reviews',
            {
                method: 'POST',
                body: JSON.stringify(payload)
            },
            token
        )
    },

    getByReservations(reservationId, token) {
        return apiFetch(
            `/api/reviews/reservation/${reservationId}`,
            { method: 'GET' },
            token
        )
    }
}

export default reviewService
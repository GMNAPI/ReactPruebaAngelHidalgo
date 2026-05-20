import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/range', () => {
    return HttpResponse.json({ min: 1, max: 100 })
  }),
  http.get('/api/range-fixed', () => {
    return HttpResponse.json({ rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] })
  }),
]

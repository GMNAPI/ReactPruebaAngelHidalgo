import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/exercise1" replace />} />
        <Route path="/exercise1" element={<div>Exercise 1 — coming soon</div>} />
        <Route path="/exercise2" element={<div>Exercise 2 — coming soon</div>} />
      </Routes>
    </BrowserRouter>
  )
}

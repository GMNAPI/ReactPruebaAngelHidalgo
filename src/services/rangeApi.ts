export interface NormalRangeResponse {
  min: number
  max: number
}

export interface FixedRangeResponse {
  rangeValues: number[]
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`Server error: ${res.status}`)
  try {
    return await res.json()
  } catch {
    throw new Error('Invalid response from server')
  }
}

export async function fetchNormalRange(): Promise<NormalRangeResponse> {
  return parseJson(await fetch('/api/range'))
}

export async function fetchFixedRange(): Promise<FixedRangeResponse> {
  return parseJson(await fetch('/api/range-fixed'))
}

export interface Duration {
  onset: string
  comeup: string
  peak: string
  offset: string
  total: string
}

export interface DoseLog {
  id: string
  substanceId?: string
  substanceName: string
  categories: string[]
  amount: number
  unit: string
  route: string
  timestamp: string
  duration: Duration | null
  durationIsEstimated?: boolean
  durationSourceRoute?: string
  notes: string | null
  mood: string | null
  setting: string | null
  intensity?: number | null
  createdAt: string
  updatedAt?: string
}

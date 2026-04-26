// import axios from "axios";

// export interface PredictRequest {
//   crop_type: string;
//   state: string;
//   season: string;
//   area: number;
// }

// export interface PredictResponse {
//   predicted_yield: number;
//   model_used: string;
//   unit: string;
// }

// export interface HistoryEntry {
//   id: string;
//   crop_type: string;
//   state: string;
//   season: string;
//   area: number;
//   predicted_yield: number;
//   unit: string;
//   model_used: string;
//   date: string;
// }

// const API_BASE_URL = "http://localhost:8000";
// const HISTORY_KEY = "crop_yield_history";

// export async function predictYield(data: PredictRequest): Promise<PredictResponse> {
//   const response = await axios.post<PredictResponse>(`${API_BASE_URL}/predict`, data);
//   return response.data;
// }

// export async function fetchHistory(): Promise<HistoryEntry[]> {
//   try {
//     const response = await axios.get<HistoryEntry[]>(`${API_BASE_URL}/history`);
//     return response.data;
//   } catch {
//     return getLocalHistory();
//   }
// }

// export function saveToLocalHistory(entry: Omit<HistoryEntry, "id" | "date">): void {
//   const existing = getLocalHistory();
//   const newEntry: HistoryEntry = {
//     ...entry,
//     id: crypto.randomUUID(),
//     date: new Date().toISOString(),
//   };
//   const updated = [newEntry, ...existing].slice(0, 50);
//   localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
// }

// export function getLocalHistory(): HistoryEntry[] {
//   try {
//     const raw = localStorage.getItem(HISTORY_KEY);
//     return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
//   } catch {
//     return [];
//   }
// }

// export function clearLocalHistory(): void {
//   localStorage.removeItem(HISTORY_KEY);
// }



import axios from "axios";

export interface PredictRequest {
  crop: string;
  state: string;
  district: string;
  season: string;
  area: number;
}

export interface PredictResponse {
  predicted_yield: number;
  estimated_production: number;
  unit: string;

  crop: string;
  state: string;
  district: string;
  season: string;
  area: number;

  used_district?: string;
  prediction_mode?: string;
}

export interface HistoryEntry {
  id: string;

  crop: string;
  state: string;
  district: string;
  season: string;
  area: number;

  predicted_yield: number;
  estimated_production: number;
  unit: string;

  used_district?: string;
  prediction_mode?: string;

  date: string;
}

const API_BASE_URL = "http://localhost:8000";
const HISTORY_KEY = "crop_yield_history";

/* -------------------- */
/* Predict API Call */
/* -------------------- */
export async function predictYield(
  data: PredictRequest
): Promise<PredictResponse> {
  const response = await axios.post<PredictResponse>(
    `${API_BASE_URL}/predict`,
    data
  );

  return response.data;
}

/* -------------------- */
/* Optional History API */
/* -------------------- */
export async function fetchHistory(): Promise<HistoryEntry[]> {
  try {
    const response = await axios.get<HistoryEntry[]>(
      `${API_BASE_URL}/history`
    );

    return response.data;
  } catch {
    return getLocalHistory();
  }
}

/* -------------------- */
/* Local Storage Save */
/* -------------------- */
export function saveToLocalHistory(
  entry: Omit<HistoryEntry, "id" | "date">
): void {
  const existing = getLocalHistory();

  const newEntry: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };

  const updated = [newEntry, ...existing].slice(0, 50);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

/* -------------------- */
/* Get Local History */
/* -------------------- */
export function getLocalHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);

    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

/* -------------------- */
/* Clear History */
/* -------------------- */
export function clearLocalHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
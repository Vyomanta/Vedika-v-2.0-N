import syllabusesData from '@/data/syllabuses.json';


export const darkT = {
  bg: "#07080F", s1: "#0C0F1C", s2: "#111827", s3: "#182033",
  border: "rgba(255,255,255,0.07)", accent: "#5B8CF8", green: "#22C5A0",
  purple: "#9B6EF8", amber: "#F5A95B", red: "#F55B6B",
  text: "#DDE3F2", muted: "#647298", dim: "#3A4560",
};

export const lightT = {
  bg: "#F0F4F8", s1: "#FAFCFF", s2: "#E1EBF5", s3: "#D4E2F0",
  border: "rgba(37, 99, 235, 0.09)", accent: "#2563EB", green: "#0D9488",
  purple: "#7C3AED", amber: "#0891B2", red: "#DB2777",
  text: "#0F1D30", muted: "#4B5E7D", dim: "#8CA2C0",
};

export const currentTheme = (typeof window !== 'undefined' ? localStorage.getItem('theme') : null) || 'dark';

export const activeT = currentTheme === 'light' ? lightT : darkT;

export const T = activeT;

export function getTheme() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme') || 'dark';
  }
  return 'dark';
}

export function setTheme(theme) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    window.location.reload();
  }
}

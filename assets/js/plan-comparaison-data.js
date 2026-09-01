/* Comparaison de charge — plan actuel (v5) vs préparation 2024 réellement effectuée.
   Aligné sur les 14 semaines du plan (S1 → S14, soit S-13 → S0).
   Course finale EXCLUE des deux séries, course à pied uniquement (le vélo est compté à part).
   Source 2024 : export GDPR Garmin (summarizedActivities), 13 semaines avant le 30/11/2024,
   course de Soucieu-en-Jarrest (24,2 km / 414 m D+ / 3h02) exclue des cumuls.
   Le plan initial v4 n'est volontairement plus affiché : il est remplacé par le v5.
   S3 mise à jour : la sortie longue est maintenue et courue pendant l'assistance
   au Vercors (2h40 de course à pied, 20 km, 650 m D+ sur la semaine). */
window.PLAN_COMPARAISON = {
  labels: ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S11", "S12", "S13", "S14"],
  labels_course: ["S-13", "S-12", "S-11", "S-10", "S-9", "S-8", "S-7", "S-6", "S-5", "S-4", "S-3", "S-2", "S-1", "S0"],
  v5: {
    h: [3.25, 3.42, 2.67, 1.83, 3.0, 3.5, 3.75, 2.5, 3.83, 4.08, 3.25, 2.58, 1.92, 1.08],
    km: [24.8, 25.8, 20.0, 13.8, 23.1, 26.5, 28, 18.9, 28.3, 30.3, 24.8, 19.6, 15.3, 8.6],
    dp: [450, 500, 650, 280, 460, 670, 680, 350, 700, 800, 500, 350, 100, 30]
  },
  p24: {
    h: [2.82, 1.4, 2.66, 3.16, 3.0, 0.0, 2.04, 2.72, 1.37, 2.36, 4.54, 3.36, 2.89, 1.05],
    km: [21.0, 10.8, 22.1, 22.2, 23.0, 0.0, 17.0, 22.3, 11.4, 19.7, 30.4, 28.4, 24.6, 8.8],
    dp: [433, 32, 225, 658, 503, 0, 101, 32, 26, 124, 1094, 584, 391, 27],
    bike: [0.0, 0.96, 0.0, 0.84, 0.93, 1.42, 1.36, 0.0, 0.0, 0.0, 1.02, 0.51, 0.0, 0.0]
  }
};

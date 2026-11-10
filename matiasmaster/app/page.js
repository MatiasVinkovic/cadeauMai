"use client";

import { useState } from "react";

const BADGES = {
  green: "bg-emerald-100 text-emerald-700",
  orange: "bg-orange-100 text-orange-700",
  blue: "bg-sky-100 text-sky-700",
};

const EVENTS = [
  { id: "puydufou", name: "Puy du Fou", emoji: "🐎", subtitle: "Le grand parc & ses spectacles", status: "Beaucoup de places restantes", color: "green" },
  { id: "moto", name: "Salon de la Moto 2026", emoji: "🏍️", subtitle: "Exposition internationale", status: "Quelques places restantes", color: "orange" },
  { id: "pgw", name: "Paris Games Week", emoji: "🎮", subtitle: "Le salon du jeu vidéo", status: "Places disponibles", color: "blue" },
  { id: "bosnjaci", name: "Bosnjaci à la maison de campagne perdue en Croatie", emoji: "🏡", subtitle: "Ambiance garantie, réseau non garanti", status: "Très disponible", color: "green" },
  { id: "disney", name: "Disneyland Paris - 2 places", emoji: "🏰", subtitle: "Le parc le plus magique d'Europe", status: "Disponible", color: "blue" },
];

export default function Home() {
  // null | { type: "error" } | { type: "loading" | "success", event }
  const [modal, setModal] = useState(null);

const sendReveal = async (eventName) => {
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: eventName }),
      });
      // Plus de localStorage ici, le mail partira à chaque clic !
    } catch (err) {
      console.error("Envoi email échoué", err); 
    }
  };

  const handleBuy = (event) => {
    if (event.id === "disney") {
      setModal({ type: "error" });
      return;
    }
    setModal({ type: "loading", event });
    sendReveal(event.name); // en arrière-plan
    setTimeout(() => setModal({ type: "success", event }), 2200);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-extrabold tracking-tight">
            🎟️ Matias<span className="text-amber-300">Master</span>
          </h1>
          <span className="rounded-full bg-white/15 px-3 py-1 text-sm">Billetterie officielle</span>
        </div>
        <div className="mx-auto max-w-5xl px-6 pb-10 pt-4">
          <h2 className="text-3xl font-bold sm:text-4xl">Vos prochains événements</h2>
          <p className="mt-2 text-indigo-100">Réservez en un clic, paiement 100 % sécurisé.</p>
        </div>
      </header>

      <section className="mx-auto grid max-w-5xl gap-5 px-6 py-10 sm:grid-cols-2">
        {EVENTS.map((ev) => (
          <article key={ev.id} className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
            <div>
              <div className="text-5xl">{ev.emoji}</div>
              <h3 className="mt-4 text-lg font-bold leading-snug">{ev.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{ev.subtitle}</p>
              <span className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-semibold ${BADGES[ev.color]}`}>
                ● {ev.status}
              </span>
            </div>
            <button
              onClick={() => handleBuy(ev)}
              className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
            >
              Acheter
            </button>
          </article>
        ))}
      </section>

      <footer className="pb-10 text-center text-xs text-slate-400">© 2026 MatiasMaster - Tous droits réservés</footer>

      {/* MODALES */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
            {modal.type === "error" && (
              <>
                <h3 className="mt-4 text-xl font-bold text-red-600">Oups…</h3>
                <p className="mt-2 text-slate-600">Désolé, quelqu&apos;un d&apos;autre vient juste de prendre ces places !</p>
                <button onClick={() => setModal(null)} className="mt-6 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white">
                  Retour
                </button>
              </>
            )}

            {modal.type === "loading" && (
              <>
                <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                <h3 className="mt-6 text-lg font-bold">Paiement en cours…</h3>
                <p className="mt-1 text-sm text-slate-500">Ne fermez pas cette page</p>
              </>
            )}

            {modal.type === "success" && (
              <>
                <div className="text-6xl">✅</div>
                <h3 className="mt-4 text-xl font-bold text-emerald-600">Paiement accepté !</h3>
                <p className="mt-2 font-medium text-slate-700">Paiement accepté avec la carte bleue de Matias !</p>
                <p className="mt-1 text-sm text-slate-500">📬 Un récapitulatif vient de t&apos;être envoyé par email.</p>
                <button onClick={() => setModal(null)} className="mt-6 w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white">
                  Super !
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
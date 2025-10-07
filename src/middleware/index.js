import pb from "../utils/pb.js";

/**
 * Middleware d'authentification global
 * Vérifie si un utilisateur est connecté via le cookie pb_auth
 * et protège les routes privées.
 */
export const onRequest = async (context, next) => {
  // 1️⃣ Récupère le cookie d'authentification
  const cookie = context.cookies.get("pb_auth")?.value;

  if (cookie) {
    pb.authStore.loadFromCookie(cookie); // charge les infos d'auth depuis le cookie

    // Vérifie si le token est valide
    if (pb.authStore.isValid) {
      context.locals.user = pb.authStore.record; // rend l'utilisateur dispo dans Astro.locals
    }
  }

  // 2️⃣ Protection des routes API (sauf login/signup)
  if (context.url.pathname.startsWith("/api/")) {
    const apiPublicRoutes = ["/api/login", "/api/signup"];
    if (!context.locals.user && !apiPublicRoutes.includes(context.url.pathname)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    return next(); // on continue le traitement normal
  }

  // 3️⃣ Liste des routes publiques accessibles sans connexion
  const publicRoutes = ["/", "/login", "/signup"];

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page privée → redirection
  if (!context.locals.user) {
    if (!publicRoutes.includes(context.url.pathname)) {
      return Response.redirect(new URL("/login", context.url), 303);
    }
  }

  // 4️⃣ Si l'utilisateur est déjà connecté, empêche l’accès à /login ou /signup
  if (context.locals.user) {
    if (["/login", "/signup"].includes(context.url.pathname)) {
      return Response.redirect(new URL("/", context.url), 303);
    }
  }

  // 5️⃣ Si tout est bon, on continue le traitement normal
  return next();
};

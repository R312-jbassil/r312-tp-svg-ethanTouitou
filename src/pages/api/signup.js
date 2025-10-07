import pb from "../../utils/pb";
import { Collections } from "../../utils/pocketbase-types";

export const POST = async ({ request }) => {
  try {
    const { email, password, passwordConfirm, username } = await request.json();

    // Création du nouvel utilisateur
    const newUser = await pb.collection(Collections.Users).create({
      email,
      password,
      passwordConfirm,
      username,
    });

    // On renvoie un message de succès
    return new Response(JSON.stringify({ user: newUser }), { status: 200 });
  } catch (err) {
    console.error("Erreur d'inscription :", err);
    return new Response(JSON.stringify({ error: "Erreur lors de la création du compte" }), {
      status: 400,
    });
  }
};

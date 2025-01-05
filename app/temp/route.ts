import "@env";

export const GET = async () => {
  return new Response(process.env.KC_URL);
};

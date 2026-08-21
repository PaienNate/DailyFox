import { IMAGES } from './_images.js';

const CORS = {
  'access-control-allow-origin': '*',
  'content-type': 'application/json',
  'cache-control': 'no-store',
};

export function onRequestGet({ request }) {
  const url = new URL(request.url);
  const list = IMAGES.map((name) => `${url.origin}/foxpic/${name}`);

  return new Response(JSON.stringify({ count: list.length, images: list }), {
    status: 200,
    headers: CORS,
  });
}

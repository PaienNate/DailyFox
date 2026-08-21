import { IMAGES } from './_images.js';

const CORS = {
  'access-control-allow-origin': '*',
  'content-type': 'application/json',
  'cache-control': 'no-store',
};

function foxUrl(request, name) {
  const url = new URL(request.url);
  return `${url.origin}/foxpic/${name}`;
}

export function onRequestGet({ request }) {
  const img = IMAGES[Math.floor(Math.random() * IMAGES.length)];
  if (!img) {
    return new Response(JSON.stringify({ error: '图库为空' }), {
      status: 404,
      headers: CORS,
    });
  }

  const url = foxUrl(request, img);
  const redirect = new URL(request.url).searchParams.get('redirect');

  if (redirect === '1') {
    return Response.redirect(url, 302);
  }

  return new Response(JSON.stringify({ url, file: img }), {
    status: 200,
    headers: CORS,
  });
}

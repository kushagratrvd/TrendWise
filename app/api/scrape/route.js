import { fetchGoogleTrends} from '../../../lib/fetchTrends';

export async function GET(request) {
  const googleTrends = await fetchGoogleTrends();
  return new Response(JSON.stringify({
    googleTrends,
  }), { status: 200 });
}
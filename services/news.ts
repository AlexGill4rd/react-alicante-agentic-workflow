export interface NewsStory {
  id: string;
  title: string;
  url: string;
  author: string;
  points: number;
  commentCount: number;
  createdAt: string;
}

interface HackerNewsHit {
  objectID: string;
  title: string | null;
  url: string | null;
  author: string;
  points: number | null;
  num_comments: number | null;
  created_at: string;
}

const HACKER_NEWS_ITEM_URL = "https://news.ycombinator.com/item?id=";

function toNewsStory(hit: HackerNewsHit): NewsStory {
  return {
    id: hit.objectID,
    title: hit.title ?? "Untitled",
    // Text-only posts (Ask HN etc.) have no external url.
    url: hit.url ?? `${HACKER_NEWS_ITEM_URL}${hit.objectID}`,
    author: hit.author,
    points: hit.points ?? 0,
    commentCount: hit.num_comments ?? 0,
    createdAt: hit.created_at,
  };
}

export async function fetchFrontPageNews(): Promise<NewsStory[]> {
  const baseUrl = process.env.NEWS_API_URL;
  if (!baseUrl) {
    throw new Error("NEWS_API_URL is not set");
  }

  const response = await fetch(`${baseUrl}/search?tags=front_page&hitsPerPage=20`);
  if (!response.ok) {
    throw new Error(`News request failed with status ${response.status}`);
  }

  const data: { hits: HackerNewsHit[] } = await response.json();
  return data.hits.map(toNewsStory);
}

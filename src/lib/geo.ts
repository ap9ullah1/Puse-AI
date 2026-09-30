export type GeoInfo = {
  ip: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
};

const geoCache = new Map<string, { at: number; value: Omit<GeoInfo, "ip"> }>();
const GEO_TTL_MS = 1000 * 60 * 60 * 24;

export function getClientIp(request: Request): string | null {
  const headers = request.headers;
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || headers.get("cf-connecting-ip")?.trim() || null;
}

function isPrivateIp(ip: string): boolean {
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}

export async function lookupGeo(ip: string | null): Promise<GeoInfo> {
  if (!ip) {
    return { ip: null, country: null, region: null, city: null };
  }

  if (isPrivateIp(ip)) {
    return { ip, country: "Local", region: null, city: null };
  }

  const cached = geoCache.get(ip);
  if (cached && Date.now() - cached.at < GEO_TTL_MS) {
    return { ip, ...cached.value };
  }

  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city`,
      { signal: AbortSignal.timeout(2500) }
    );
    if (!res.ok) throw new Error(`geo ${res.status}`);
    const data = (await res.json()) as {
      status?: string;
      country?: string;
      regionName?: string;
      city?: string;
    };
    const value =
      data.status === "success"
        ? {
            country: data.country ?? null,
            region: data.regionName ?? null,
            city: data.city ?? null,
          }
        : { country: null, region: null, city: null };
    geoCache.set(ip, { at: Date.now(), value });
    return { ip, ...value };
  } catch {
    return { ip, country: null, region: null, city: null };
  }
}

export function locationLabel(geo: Pick<GeoInfo, "city" | "region" | "country">): string {
  const parts = [geo.city, geo.region, geo.country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Unknown";
}

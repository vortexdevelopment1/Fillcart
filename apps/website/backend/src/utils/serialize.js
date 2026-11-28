/**
 * Recursively converts Prisma Decimal and Date objects into standard JavaScript
 * numbers and ISO date strings, preserving camelCase fields.
 */
export function serialize(val) {
  if (val === null || val === undefined) {
    return val;
  }
  if (typeof val === "object" && typeof val.toNumber === "function") {
    return val.toNumber();
  }
  if (val instanceof Date) {
    return val.toISOString();
  }
  if (Array.isArray(val)) {
    return val.map(serialize);
  }
  if (typeof val === "object") {
    const res = {};
    for (const [k, v] of Object.entries(val)) {
      res[k] = serialize(v);
    }
    return res;
  }
  return val;
}

/**
 * Standardizes product objects so both database fields and frontend conventions
 * (e.g. image, oldPrice) are cleanly populated.
 */
export function formatProduct(p) {
  if (!p) return null;
  const s = serialize(p);
  return {
    ...s,
    image: s.primaryImageUrl || s.image || "",
    oldPrice: s.mrp ?? s.oldPrice ?? s.price,
  };
}

/**
 * Standardizes store objects with cover and logo fallback fields.
 */
export function formatStore(st) {
  if (!st) return null;
  const s = serialize(st);
  return {
    ...s,
    cover: s.coverImageUrl || s.cover || "",
    logo: s.logoImageUrl || s.logo || "",
  };
}

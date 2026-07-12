import rankings from "../../prisma/qs_rankings.json";
export type QsTier = "top10" | "top20" | "top50" | "top100" | "top200" | "unranked";
export function getQsTier(university: string): QsTier { return (rankings[university as keyof typeof rankings] as QsTier | undefined) ?? "unranked"; }
export { rankings };

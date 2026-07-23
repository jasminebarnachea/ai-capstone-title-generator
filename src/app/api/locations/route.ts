import { NextResponse } from "next/server";
import tree from "psgc2/tree.json";

interface LocationNode { [key: string]: LocationNode | string | number }
const data = tree as LocationNode;
const meta = new Set(["population", "notes", "class", "cityClass"]);
const children = (node: LocationNode | undefined) => node ? Object.entries(node).filter(([name, value]) => !meta.has(name) && typeof value === "object").map(([name]) => name).sort((a, b) => a.localeCompare(b)) : [];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const level = url.searchParams.get("level") || "regions";
  const region = url.searchParams.get("region") || "";
  const province = url.searchParams.get("province") || "";
  const city = url.searchParams.get("city") || "";
  const regionNode = data[region] as LocationNode | undefined;

  if (level === "regions") return NextResponse.json(children(data));
  if (!regionNode) return NextResponse.json([]);
  const provinceNames = children(regionNode);
  const hasProvinceLayer = provinceNames.some(name => {
    const item = regionNode[name] as LocationNode;
    return item && !item.class;
  });
  if (level === "provinces") return NextResponse.json(hasProvinceLayer ? provinceNames.filter(name => !(regionNode[name] as LocationNode).class) : ["No province / NCR"]);
  const provinceNode = province === "No province / NCR" ? regionNode : regionNode[province] as LocationNode | undefined;
  if (level === "cities-municipalities") return NextResponse.json(children(provinceNode));
  if (level === "barangays") {
    const cityNode = provinceNode?.[city] as LocationNode | undefined;
    return NextResponse.json(children(cityNode));
  }
  return NextResponse.json({ error: "Invalid location level." }, { status: 400 });
}

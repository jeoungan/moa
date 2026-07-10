import type { Metadata } from "next";
import { SummerCityApp } from "./SummerCityApp";

export const metadata: Metadata = {
  title: "오늘여름",
  description:
    "멀리 가지 않아도 도시 안에서 여름을 즐기고, 근처 사람들의 소소한 여름 일상을 발견하는 미니앱",
};

export default function Home() {
  return <SummerCityApp />;
}

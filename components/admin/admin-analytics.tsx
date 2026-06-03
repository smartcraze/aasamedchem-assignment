"use client";

import { AnalyticsLineChart } from "./analytics-line-chart";
import { AnalyticsDonutChart } from "./analytics-donut-chart";
import { AnalyticsBarChart } from "./analytics-bar-chart";

interface AdminAnalyticsProps {
  orders: any[];
}

export function AdminAnalytics({ orders }: AdminAnalyticsProps) {
  // 1. Trend (Last 5 days)
  const last5Days = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (4 - i));
    const dateStr = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    const key = d.toDateString();
    return { label: dateStr, dateKey: key, value: 0 };
  });

  orders.forEach((o) => {
    const key = new Date(o.createdAt).toDateString();
    const match = last5Days.find((day) => day.dateKey === key);
    if (match) {
      match.value += Number(o.totalAmount);
    }
  });

  const lineChartData = last5Days.map((d) => ({
    label: d.label,
    value: d.value,
  }));

  // 2. Status segments
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const approvedCount = orders.filter((o) => o.status === "APPROVED").length;
  const completedCount = orders.filter((o) => o.status === "COMPLETED").length;
  const rejectedCount = orders.filter((o) => o.status === "REJECTED").length;

  const donutSegments = [
    { name: "Pending", count: pendingCount, color: "var(--accent)" },
    { name: "Approved", count: approvedCount, color: "var(--chart-3)" },
    { name: "Completed", count: completedCount, color: "var(--primary)" },
    { name: "Rejected", count: rejectedCount, color: "var(--destructive)" },
  ];

  // 3. Top Products (Approved/Completed orders revenue)
  const productSalesMap: Record<string, number> = {};
  orders.forEach((o) => {
    if (o.status !== "APPROVED" && o.status !== "COMPLETED") return;

    o.items?.forEach((item: any) => {
      const name = item.product?.name || "Unknown Product";
      productSalesMap[name] = (productSalesMap[name] || 0) + Number(item.totalPrice);
    });
  });

  const sortedBarData = Object.entries(productSalesMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <AnalyticsLineChart data={lineChartData} title="Quotation Trend (Last 5 Days)" />
      <AnalyticsDonutChart segments={donutSegments} title="Quotation Status Ratio" />
      <AnalyticsBarChart data={sortedBarData} title="Top Compounds by Revenue" />
    </div>
  );
}

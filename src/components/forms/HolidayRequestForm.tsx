"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { InquiryForm } from "./InquiryForm";
import { world } from "@/data/world";

type Props = { context: string; title: string; intro?: string; email?: string };

// The holidays request with the destination preselected from ?region=.
// useSearchParams needs a Suspense boundary so the page stays static.
export function HolidayRequestForm(props: Props) {
  return (
    <Suspense fallback={<Inner {...props} region={null} />}>
      <FromQuery {...props} />
    </Suspense>
  );
}

function FromQuery(props: Props) {
  const params = useSearchParams();
  return <Inner {...props} region={params.get("region")} />;
}

function Inner({ region, ...props }: Props & { region: string | null }) {
  const t = useTranslations("World");
  const booking = useTranslations("Booking");
  const known = world.some((w) => w.key === region);
  const options = [
    ...world.map((w) => ({ value: w.key, label: t(`items.${w.key}.name`) })),
    { value: "other", label: t("regionOther") },
  ];
  return (
    <InquiryForm
      {...props}
      messageOptional
      initialValues={known && region ? { region } : undefined}
      fields={[
        { name: "region", label: booking("fields.region"), type: "select", options, required: true },
        { name: "month", label: booking("fields.month"), type: "month" },
        { name: "travellers", label: booking("fields.travellers"), type: "number" },
      ]}
    />
  );
}

import { redirect } from "next/navigation";

import { DesignInput } from "@/components/design/input";
import { requireCurrentUser } from "@/features/auth/server/session";
import { createApplication } from "@/features/applications/server/create-application";
import { getCreateApplicationInitialState } from "@/features/applications/create-application-form";

export default async function OnboardingPage() {
  await requireCurrentUser();

  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(formData: FormData) {
    "use server";

    // Provide required defaults for fields not in this form
    if (!formData.get("location")) formData.set("location", "");
    if (!formData.get("source")) formData.set("source", "OTHER");
    if (!formData.get("salaryMin")) formData.set("salaryMin", "");
    if (!formData.get("salaryMax")) formData.set("salaryMax", "");
    if (!formData.get("currency")) formData.set("currency", "USD");
    if (!formData.get("jobUrl")) formData.set("jobUrl", "");
    if (!formData.get("notes")) formData.set("notes", "");

    const result = await createApplication(
      getCreateApplicationInitialState(),
      formData,
    );

    if (result.status === "success") {
      redirect("/pipeline");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-1 px-4">
      <div className="w-full max-w-sm rounded-card border border-border bg-canvas p-6 shadow-sm">
        <h1 className="mb-1 text-lg font-semibold text-text">
          Track your first application
        </h1>
        <p className="mb-5 text-sm text-text-2">
          Add a job you&apos;ve applied to — or one you&apos;re eyeing.
        </p>

        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="company" className="text-sm font-medium text-text">
              Company
            </label>
            <DesignInput
              id="company"
              name="company"
              type="text"
              placeholder="e.g. Stripe"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="role" className="text-sm font-medium text-text">
              Role
            </label>
            <DesignInput
              id="role"
              name="role"
              type="text"
              placeholder="e.g. Senior Frontend Engineer"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="status" className="text-sm font-medium text-text">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue="APPLIED"
              className="h-8 w-full rounded-input border border-border bg-surface-1 px-3 text-sm text-text focus-visible:outline-2 focus-visible:outline-primary focus-visible:ring-[3px] focus-visible:ring-primary/20"
            >
              <option value="WISHLIST">Wishlist</option>
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="appliedDate"
              className="text-sm font-medium text-text"
            >
              Applied date
            </label>
            <DesignInput
              id="appliedDate"
              name="appliedDate"
              type="date"
              defaultValue={today}
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex h-8 w-full items-center justify-center rounded-button bg-text px-4 text-sm font-medium text-canvas transition-colors hover:bg-text/90 focus-visible:outline-2 focus-visible:outline-primary"
          >
            Start tracking
          </button>
        </form>
      </div>
    </div>
  );
}

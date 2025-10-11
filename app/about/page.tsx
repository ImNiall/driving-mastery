"use client";

import Link from "next/link";

const team = [
  {
    name: "Theo (AI Mentor)",
    role: "Always-on driving theory coach",
    bio: "Guides learners through adaptive quizzes, highlights weak areas, and celebrates every win.",
  },
  {
    name: "Niall Cullen",
    role: "Founder & Product Lead",
    bio: "Obsessed with building focused learning experiences that help UK learners pass first time.",
  },
  {
    name: "Driving Mastery Community",
    role: "Learners & advocates",
    bio: "Thousands of drivers-in-training who share feedback, tips, and encouragement inside the platform.",
  },
];

const values = [
  {
    title: "Learner-first design",
    description:
      "Every feature starts with a real learner problem. We remove friction, surface progress, and celebrate milestones.",
  },
  {
    title: "Accountability & support",
    description:
      "Theo keeps you on track with reminders and tailored recommendations, while our team monitors success metrics daily.",
  },
  {
    title: "Data-driven iteration",
    description:
      "We analyse anonymised performance data to refine question banks, difficulty levels, and learning paths week over week.",
  },
];

const milestones = [
  {
    headline: "Founded in 2024",
    subhead: "Launched the first AI-guided mock test engine for UK learners.",
  },
  {
    headline: "10k mock tests completed",
    subhead:
      "Learners repeatedly come back to fine-tune their knowledge before the DVSA exam.",
  },
  {
    headline: "87% first-time pass rate",
    subhead:
      "Members who follow Theo's personalised plan pass on their next booking with confidence.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-brand-blue-light px-4 py-1 text-sm font-semibold text-brand-blue">
            About Driving Mastery
          </span>
          <h1 className="mt-6 text-4xl font-bold text-gray-900 md:text-5xl">
            Helping every learner driver pass with confidence
          </h1>
          <p className="mt-4 text-base text-gray-600 md:text-lg">
            Driving Mastery blends adaptive AI coaching, up-to-date DVSA
            content, and a supportive community so you can master the theory
            test faster.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/memberships"
              className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-2px] hover:bg-brand-blue/90"
            >
              Explore Memberships
            </Link>
            <Link
              href="/modules"
              className="rounded-full border border-brand-blue px-6 py-3 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue/5"
            >
              View Learning Modules
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl px-4">
        <div className="grid gap-6 rounded-3xl bg-white p-8 shadow-lg md:grid-cols-3">
          {milestones.map((item) => (
            <div
              key={item.headline}
              className="rounded-2xl border border-gray-100 bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold text-gray-900">
                {item.headline}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{item.subhead}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-5xl px-4 md:flex md:flex-row md:items-center md:gap-12">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Why we built Driving Mastery
          </h2>
          <p className="mt-5 text-base text-gray-600 md:text-lg">
            Preparing for the theory test used to mean juggling outdated PDFs,
            unstructured question banks, and zero personalised guidance. We
            wanted a calmer, clearer path. Driving Mastery pairs expert-created
            content with Theo, an AI mentor that keeps you accountable,
            encourages consistency, and adapts every session to your
            performance.
          </p>
          <p className="mt-4 text-base text-gray-600 md:text-lg">
            Whether you&apos;re balancing studies, work, or family commitments,
            our goal is to help you reclaim focus. Bite-sized lessons, mock
            tests built on DVSA updates, and meaningful analytics mean you
            always know the next best action.
          </p>
        </div>
        <div className="mt-10 grid flex-1 gap-6 md:mt-0">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {value.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-5xl px-4">
        <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">
          The people behind the platform
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-gray-600 md:text-base">
          We combine human expertise with AI mentorship. Meet the faces (and
          friendly bot) guiding every learner through their journey.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {team.map((member) => (
            <article
              key={member.name}
              className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {member.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-brand-blue">
                {member.role}
              </p>
              <p className="mt-3 text-sm text-gray-600">{member.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-4xl px-4">
        <div className="rounded-3xl bg-gradient-to-r from-brand-blue to-brand-purple p-[1px]">
          <div className="rounded-3xl bg-white px-6 py-10 text-center md:px-10">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Ready to become our next success story?
            </h2>
            <p className="mt-3 text-base text-gray-600 md:text-lg">
              Join today, pair up with Theo, and follow a tailored plan crafted
              around your strengths, weaknesses, and schedule.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/auth?mode=signup"
                className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-2px] hover:bg-brand-blue/90"
              >
                Create a Free Account
              </Link>
              <Link
                href="/mock-test"
                className="rounded-full border border-brand-blue px-6 py-3 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue/5"
              >
                Try a Mock Test
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

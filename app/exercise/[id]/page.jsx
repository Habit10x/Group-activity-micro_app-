"use client";
import { use } from "react";
import { App } from "@/app/page";

export default function ExercisePage({ params }) {
  const { id } = use(params);
  return <App forceExerciseId={id} />;
}

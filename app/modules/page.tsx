import ModulesIndexClient from "./ModulesIndexClient";
import { LEARNING_MODULES } from "@/constants";

export default function ModulesPage() {
  return <ModulesIndexClient modules={LEARNING_MODULES} />;
}

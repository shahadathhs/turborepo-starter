import type { Route } from "./+types/home";
import { Button } from "@workspace/ui/components/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <Button>Button</Button>
    </div>
  );
}

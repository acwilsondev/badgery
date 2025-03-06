import { Link } from "@remix-run/react";

import type { MetaFunction } from "@remix-run/node";


export const meta: MetaFunction = () => {
  return [
    { title: "Badgery | Home" },
    { name: "description", content: "Welcome to Badgery!" },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to Badgery</h1>
      <p className="text-lg mb-4">
        This is the homepage of the Badgery application. Here you&apos;ll find everything you need to manage your badges.
      </p>
      <div className="mt-8">
        <Link 
          to="/about"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}


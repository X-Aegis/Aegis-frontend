export default function Footer() {
  return (
    <footer className="w-full p-4 text-center border-t border-gray-200 mt-auto">
      <p className="text-sm text-gray-500">© 2026 X-Aegis. All rights reserved.</p>
      <div className="flex justify-center gap-4 mt-2">
        <a href="/privacy" className="text-sm text-blue-500 hover:underline">Privacy Policy</a>
        <a href="/terms" className="text-sm text-blue-500 hover:underline">Terms of Service</a>
      </div>
    </footer>
  );
}

const Gigs = ({ title }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 text-center p-6">
    <h1 className="text-4xl font-bold text-brand-blue mb-4">{title}</h1>
    <p className="text-gray-600">This page is under construction.</p>
    <Link to="/" className="mt-6 text-brand-accent hover:underline font-bold">
      Back to Home
    </Link>
  </div>
);
export default Gigs;

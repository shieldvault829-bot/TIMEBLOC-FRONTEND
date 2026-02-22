import Logo from '@/components/Logo';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-dark-900 flex items-center justify-center z-50">
      <div className="text-center">
        <Logo size={120} className="mx-auto mb-6" />
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
          TimeBloc
        </div>
        <p className="text-gray-400 mt-4">Loading secure platform...</p>
      </div>
    </div>
  );
}
import Logo from '@/components/Logo';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-dark-900 flex items-center justify-center z-50">
      <div className="text-center">
        <Logo size={100} className="mx-auto mb-6" />
        <div className="text-xl font-semibold">Loading TimeBloc...</div>
        <div className="text-gray-400 mt-2">Secure platform initializing</div>
      </div>
    </div>
  );
}
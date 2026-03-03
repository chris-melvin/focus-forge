import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">⚔️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Focus Forge</h1>
          <p className="text-gray-400">Create an account to start your journey</p>
        </div>
        
        <SignUp 
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-gray-900 border border-gray-800',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-400',
              socialButtonsBlockButton: 'bg-gray-800 border-gray-700',
              socialButtonsBlockButtonText: 'text-white',
              dividerLine: 'bg-gray-700',
              dividerText: 'text-gray-400',
              formFieldLabel: 'text-gray-300',
              formFieldInput: 'bg-gray-800 border-gray-700 text-white',
              footerActionText: 'text-gray-400',
              footerActionLink: 'text-blue-400',
            }
          }}
        />
      </div>
    </div>
  );
}

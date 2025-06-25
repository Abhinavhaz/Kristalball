const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-gray-900 overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 animate-gradient-x"
      />
      
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, #fff 1px, transparent 0), 
            radial-gradient(circle at 10px 10px, #fff 1px, transparent 0)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout; 